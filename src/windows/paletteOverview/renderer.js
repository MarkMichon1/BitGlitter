const axios = require('axios')
const { remote } = require('electron')
const TimeAgo = require('javascript-time-ago')


let paletteList = []
let activePalette = null
let activePaletteLi = null
const activePaletteName = document.getElementById('active-palette-name')
const activePaletteDescription = document.getElementById('active-palette-description')
const activePaletteColorSet = document.getElementById('active-palette-color-set')
const activePaletteColorDistance = document.getElementById('active-palette-color-distance')
const activePaletteNumberOfColors = document.getElementById('active-palette-number-of-colors')
const activePaletteBitLength = document.getElementById('active-palette-bit-length')
const activePaletteTimeCreated = document.getElementById('active-palette-time-created')
const activePaletteIsCustom = document.getElementById('active-palette-is-custom')
const activePaletteIsIncludedWithRepo = document.getElementById('active-palette-is-included-with-repo')
const activePaletteID = document.getElementById('active-palette-id')
const activePaletteB64 = document.getElementById('active-palette-b64')

const paletteListElement = document.getElementById('palette-list')
const sampleBlocks = document.getElementsByClassName('block')

const prettifyColorString = (palette) => {
    if (!palette.is_24_bit) {
        toString = JSON.stringify(palette.color_set)
        trimmed = toString.slice(1, -1)
        replaced = trimmed.replace(/[\[]/g, "(")
        replaced = replaced.replace(/[\]]/g, ")")
        spaced = replaced.replace(/\),/g, '), ')
        return spaced
    } else {
        return 'Probably not the best idea to list all 16M colors.'
    }
}

const generateSampleFrames = async (activeCurrentPalette) => {
    const chooseColor = (choices, is24Bit=false) => {
        if (is24Bit) {
            randomRGB = []
            for (let i = 0; i < 3; i++) {
                randomRGB.push(Math.floor(Math.random() * 256))
            }
            return randomRGB;
        } else {
            let index = Math.floor(Math.random() * choices.length);
            return choices[index];
        }
    }

    const render = () => {
        for (const block of sampleBlocks) {

            randomColor = chooseColor(activeCurrentPalette.color_set, activeCurrentPalette.is_24_bit)
            block.style = `background: rgb(${randomColor[0]}, ${randomColor[1]}, ${randomColor[2]})`
        }
    }

    // Instant change when clicked, with new samples every 2 sec
    render()
    while(true) {
        await new Promise(r => setTimeout(r, 2000));
        if (activeCurrentPalette !== activePalette) {
            break
        }
        render()
    }
}

const loadActivePalette = (activePalette) => {
    activePaletteName.textContent = activePalette.name
    activePaletteDescription.textContent = activePalette.description
    activePaletteColorSet.textContent = prettifyColorString(activePalette)
    activePaletteColorDistance.textContent = activePalette.color_distance
    activePaletteNumberOfColors.textContent = activePalette.number_of_colors
    activePaletteBitLength.textContent = activePalette.bit_length
    let paletteDate = new Date(activePalette.time_created * 1000)
    activePaletteTimeCreated.textContent = paletteDate.toString()
    activePaletteIsCustom.textContent = activePalette.is_custom ? 'Yes' : 'No'
    activePaletteIsIncludedWithRepo.textContent = activePalette.is_included_with_repo ? 'Yes' : 'No'
    activePaletteID.textContent = activePalette.palette_id
    noBase64 = 'No code- everyone already has this palette!'
    activePaletteB64.textContent = activePalette.base64_string ? activePalette.base64_string : noBase64
}


const refreshPaletteList = initial => {
    axios.get('http://localhost:7218/palettes').then((response) => {
        //todo: remove child elements
        paletteList = response.data
        paletteList.sort((first, second) => {
            let firstLowered = first.name.toLowerCase(),
                secondLowered = second.name.toLowerCase();
            if (firstLowered < secondLowered) {
                return -1;
            }
            if (firstLowered > secondLowered) {
                return 1;
            }
            return 0;
        });
        paletteList.forEach(palette => {
            let newLi = document.createElement('li')
            newLi.setAttribute('palette-id', palette.palette_id)
            newLi.addEventListener('click', () => {
                if (activePaletteLi){
                    activePaletteLi.classList.remove('active')
                }
                activePaletteLi = newLi
                newLi.classList.add('active')
                retrieved = paletteList.filter(obj => {
                    return obj.palette_id === palette.palette_id
                })[0]
                if (retrieved !== activePalette) {
                    activePalette = retrieved
                    loadActivePalette(activePalette)
                    generateSampleFrames(activePalette)
                }
            })
            let newContent = document.createTextNode(palette.name)
            newLi.appendChild(newContent)
            paletteListElement.appendChild(newLi)
        })

        if (initial) {
            activePalette = paletteList[0]
            loadActivePalette(activePalette)
            generateSampleFrames(activePalette)
            activePaletteLi = document.querySelector('[palette-id="1"]')
            activePaletteLi.classList.add('active')
        }
    })
}

// Palette list load
refreshPaletteList(true)