const axios = require('axios')
const { ipcRenderer, remote } = require('electron')

const nameInputElement = document.getElementById('name-input')
const nameStatusElement = document.getElementById('name-status')
const nameLengthElement = document.getElementById('name-length')
const descriptionInputElement = document.getElementById('description-input')
const descriptionStatusElement = document.getElementById('description-status')
const descriptionLengthElement = document.getElementById('description-length')
const colorSetInputElement = document.getElementById('color-set-input')
const colorSetStatusElement = document.getElementById('color-set-status')
const cancelButton = document.getElementById('cancel-button')
const addButton = document.getElementById('add-button')

let nameFine = false
let descriptionFine = false
let colorSetFine = false
let validPalette = false

let paletteName = null
let paletteDescription = null
let colorSet = null

const areAllValuesFine = () => {
    if (nameFine && descriptionFine && colorSetFine) {
        addButton.removeAttribute('disabled')
        validPalette = true
    } else {
        addButton.setAttribute('disabled', 'disabled')
        validPalette = false
    }
}

const checkValues = () => {
    axios.post('http://localhost:7218/palettes/validate', {name: paletteName, description: paletteDescription,
    color_set: colorSet})
}

nameInputElement.addEventListener('input', () => {
    checkValues()
})
descriptionInputElement.addEventListener('input', () => {
    checkValues()
})
colorSetInputElement.addEventListener('input', () => {
    checkValues()
})

nameInputElement.addEventListener('input', () => {
    paletteName = nameInputElement.value
    nameLengthElement.textContent = paletteName.length
    if (paletteName.length > 0) {
        nameStatusElement.classList.remove('hidden')
        if (paletteName.length <= 50) {

        } else { // Exceeding 50 characters
            nameStatusElement.classList.add('text-danger')
        }

    } else { // Hide error text
        nameStatusElement.classList.add('hidden')
        nameStatusElement.classList.remove('text-danger')
        nameFine = false
    }
    areAllValuesFine()
})


/*
Returned validation values:
Name
    taken: This palette name is already taken, please choose another
    none: Palette name is required
    exists:  This palette is already saved
    ascii: Palette name can only use standard ASCII characters (a-z, A-Z, 0-9, normal punctuation and symbols)
    max_length: Palette name cannot exceed 50 characters
Description
    max_length: Palette description cannot exceed 100 characters
Color Set
    max_length: Custom paletteOverview cannot exceed 256 colors
    2^n: Number of colors must be a power of 2 (2, 4, 8, 16, etc), with a minimum of 2 colors
    channels: Each color needs 3 channels, for red green and blue
    range: For each RGB value, it must be an integer between 0 and 255
    distance: Cannot have two identical colors in a color set
    invalid: Not a valid set of colors

 */