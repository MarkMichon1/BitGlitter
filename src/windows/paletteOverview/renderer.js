const axios = require('axios')
const { ipcRenderer, remote } = require('electron')

const { sortPaletteList } = require('../../utilities/palette')

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

    const renderFrame = () => {
        for (const block of sampleBlocks) {

            randomColor = chooseColor(activeCurrentPalette.color_set, activeCurrentPalette.is_24_bit)
            block.style = `background: rgb(${randomColor[0]}, ${randomColor[1]}, ${randomColor[2]})`
        }
    }

    // Instant change when clicked, with new samples every 2 sec
    renderFrame()
    while(true) {
        await new Promise(r => setTimeout(r, 2000));
        if (activeCurrentPalette !== activePalette) {
            break
        }
        renderFrame()
    }
}

const closeWindowButtonHandler = () => {
    let window = remote.getCurrentWindow()
    window.close()
}

const deleteButton = document.getElementById("delete-button")
let deletePaletteAreYouSure = false
const deletePaletteButtonHandler = () => {
    if (activePalette.is_custom) {
        if (!deletePaletteAreYouSure) {
            deleteButton.textContent = 'You sure?'
            deletePaletteAreYouSure = true
        } else {
            axios.post('http://localhost:7218/palettes/remove', {'palette_id': activePalette.palette_id}).then((response) =>
                {
                    paletteList = paletteList.filter(item => item.palette_id !== activePalette.palette_id)
                    activePaletteLi.remove()
                    loadFirstPalette()
                }
            )
        }
    }
}
deleteButton.addEventListener('click', deletePaletteButtonHandler)

const createPaletteButtonHandler = () => {
    ipcRenderer.send('openCreatePaletteWindow')
}

const importPaletteButtonHandler = () => {
    ipcRenderer.send('openImportPaletteWindow')
}

const loadActivePalette = (activePalette) => {
    // Render content
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
    if (activePalette.is_custom) {
        activePaletteB64.setAttribute('data-toggle', 'tooltip')
        if (!activePaletteB64.classList.contains('can-select')) {
            activePaletteB64.classList.add('can-select')
        }
        activePaletteB64.textContent = activePalette.base64_string
    } else {
        activePaletteB64.removeAttribute('data-toggle')
        if (activePaletteB64.classList.contains('can-select')) {
            activePaletteB64.classList.remove('can-select')
        }
        activePaletteB64.textContent = 'No code- everyone already has this palette!'
    }
    noBase64 = 'No code- everyone already has this palette!'
    activePaletteB64.textContent = activePalette.base64_string ? activePalette.base64_string : noBase64

    // Set delete button display state
    deletePaletteAreYouSure = false
    if (activePalette.is_custom) {
        deleteButton.textContent = 'Delete palette'
        deleteButton.removeAttribute('disabled')
    } else {
        deleteButton.textContent = 'Cannot delete default palettes'
        deleteButton.setAttribute('disabled', 'disabled')
    }
}

const generatePaletteLi = (palette) => {
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
    const newContent = document.createTextNode(palette.name)
    newLi.appendChild(newContent)
    paletteListElement.appendChild(newLi)
}

const loadFirstPalette = () => {
    activePalette = paletteList[0]
    loadActivePalette(activePalette)
    generateSampleFrames(activePalette)
    activePaletteLi = document.querySelector('[palette-id="1"]')
    activePaletteLi.classList.add('active')
}


const refreshPaletteList = initial => {
    axios.get('http://localhost:7218/palettes').then((response) => {
        paletteList = response.data
        sortPaletteList()
        paletteList.forEach(palette => {
            generatePaletteLi(palette)
        })

        if (initial) {
            loadFirstPalette()
        }
    })
}

document.getElementById("close-button").addEventListener("click", closeWindowButtonHandler)
document.getElementById("create-palette-button").addEventListener("click", createPaletteButtonHandler)
document.getElementById("import-palette-button").addEventListener("click", importPaletteButtonHandler)

// Palette list load
refreshPaletteList(true)

ipcRenderer.on('createdPalette', (event, options) => {
    paletteList.push(options)
    sortPaletteList()
    while (paletteListElement.firstChild) {
        paletteListElement.removeChild(paletteListElement.firstChild)
    }
    paletteList.forEach(palette => {
        generatePaletteLi(palette)
    })
})