const axios = require('axios')
const { ipcRenderer, remote } = require('electron')

const { parseArray } = require('../../../utilities/parseArray')

const paletteNameElement = document.getElementById('palette-name')
const nameLengthElement = document.getElementById('name-length')
const nameErrorsElement = document.getElementById('name-errors')
const paletteDescriptionElement = document.getElementById('palette-description')
const descriptionLengthElement = document.getElementById('description-length')
const descriptionErrorsElement = document.getElementById('description-errors')
const colorSetElement = document.getElementById('palette-color-set')
const colorSetErrors = document.getElementById('color-set-errors')
const numberOfColorsElement = document.getElementById('number-of-colors')
const colorDistanceElement = document.getElementById('color-distance')

const cancelButton = document.getElementById('cancel-button')
const addButton = document.getElementById('add-button')

let nameValid = false
let descriptionValid = false
let colorSetValid = false

let paletteName = null
let paletteDescription = null
let colorSetString = null // dirty non-parsed
let colorSet = null

//Can only use a-z, A-Z, 0-9, and -_.

const isEverythingValid = () => {
    if (nameValid && descriptionValid && colorSetValid) {
        addButton.removeAttribute('disabled')
    } else {
        addButton.setAttribute('disabled', 'disabled')
    }
}

paletteNameElement.addEventListener('input', () => {
    paletteName = paletteNameElement.value

    if (paletteName.length === 0) {
        nameLengthElement.classList.add('hidden')
        nameErrorsElement.textContent = ''
        nameErrorsElement.classList.add('hidden')
        nameValid = false
    } else {
        nameLengthElement.classList.remove('hidden')
        if (paletteName.length > 0 && paletteName.length < 40) {
            nameLengthElement.className = 'text-success'
        } else if (paletteName.length >= 40 && paletteName.length < 51) {
            nameLengthElement.className = 'text-secondary'
        } else {
            nameLengthElement.className = 'text-danger'
        }
        nameLengthElement.textContent = `${paletteName.length}/50`
    }
    if (paletteName) {
        axios.post('http://localhost:7218/palettes/validate/name', {name: paletteName}).then(response => {
            if (response.data) {
                nameValid = false
                nameErrorsElement.classList.remove('hidden')
                if (response.data === 'max_length') {
                    nameErrorsElement.textContent = 'Palette name cannot exceed 50 characters'
                } else if (response.data === 'ascii') {
                    nameErrorsElement.textContent = 'Palette name can only use standard ASCII characters (a-z, A-Z, ' +
                        '0-9, normal punctuation and symbols)'
                } else if (response.data === 'taken') {
                    nameErrorsElement.textContent = 'This palette name is already taken, please choose another'
                }
            } else { // Everything is good
                nameValid = true
                nameErrorsElement.classList.add('hidden')
            }
            isEverythingValid()
        })
    }

})

paletteDescriptionElement.addEventListener('input', () => {
    paletteDescription = paletteDescriptionElement.value

    if (paletteDescription.length === 0) {
        descriptionLengthElement.classList.add('hidden')
        descriptionErrorsElement.textContent = ''
        descriptionErrorsElement.classList.add('hidden')
    } else {
        descriptionLengthElement.classList.remove('hidden')
        if (paletteDescription.length > 0 && paletteDescription.length < 90) {
            descriptionLengthElement.className = 'text-success'
        } else if (paletteDescription.length >= 90 && paletteDescription.length < 101) {
            descriptionLengthElement.className = 'text-secondary'
        } else {
            descriptionLengthElement.className = 'text-danger'
        }
        descriptionLengthElement.textContent = `${paletteDescription.length}/100`
    }
    if (paletteDescription) {
        axios.post('http://localhost:7218/palettes/validate/description', {description: paletteDescription})
            .then(response => {
                if (response.data) {
                    descriptionValid = false
                    descriptionErrorsElement.classList.remove('hidden')
                    if (response.data === 'ascii') {
                        descriptionErrorsElement.textContent = 'Palette name can only use standard ASCII characters' +
                            ' (a-z, A-Z, 0-9, normal punctuation and symbols)'
                    } else if (response.data === 'max_length') {
                        descriptionErrorsElement.textContent = 'Palette description cannot exceed 100 characters'
                    }
                } else { // Description good
                    descriptionValid = true
                    descriptionErrorsElement.classList.add('hidden')
                }
                isEverythingValid()
        })
    }
})

colorSetElement.addEventListener('input', () => {
    colorSetString = colorSetElement.value
    if (colorSetString.length === 0) {

        colorSetValid = false
        isEverythingValid()
    } else {
        parseResults = parseArray()
        if (parseResults.results === false) {
            colorSetValid = false
        } else {
            axios.post('http://localhost:7218/palettes/validate/color-set', {color_set: colorSet})
                .then(response => {
                    console.log(response.data)
                    isEverythingValid()
            })
        }
    }

})

/*
Returned validation values:
Name
    taken: This palette name is already taken, please choose another
    exists:  This palette is already saved
    ascii: Palette name can only use standard ASCII characters (a-z, A-Z, 0-9, normal punctuation and symbols)
    max_length: Palette name cannot exceed 50 characters
Description
    max_length: Palette description cannot exceed 100 characters
    ascii: Palette name can only use standard ASCII characters (a-z, A-Z, 0-9, normal punctuation and symbols)
Color Set
    max_length: Custom paletteOverview cannot exceed 256 colors
    2^n: Number of colors must be a power of 2 (2, 4, 8, 16, etc), with a minimum of 2 colors
    channels: Each color needs 3 channels, for red green and blue
    range: For each RGB value, it must be an integer between 0 and 255
    distance: Cannot have two identical colors in a color set
    invalid: Not a valid set of colors

 */