const axios = require('axios')
const { ipcRenderer, remote } = require('electron')

const { backendLocation } = require('../../../../config')
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

const closeWindow = () => {
    const currentWindow = remote.getCurrentWindow()
    currentWindow.close()
}

let nameValid = false
let descriptionValid = true
let colorSetValid = false

let paletteName = null
let paletteDescription = null
let colorSetString = null // dirty non-parsed
let colorSet = null

const isEverythingValid = () => {
    if (nameValid && descriptionValid && colorSetValid) {
        addButton.removeAttribute('disabled')
    } else {
        addButton.setAttribute('disabled', 'disabled')
    }
}

const resetPaletteData = () => {
    numberOfColorsElement.textContent = '--'
    colorDistanceElement.textContent = '--'
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
        axios.post(`${backendLocation}/palettes/validate/name`, {name: paletteName}).then(response => {
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
    isEverythingValid()
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
        axios.post(`${backendLocation}/palettes/validate/description`, {description: paletteDescription})
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
        colorSetErrors.classList.add('hidden')
        colorSetValid = false
        resetPaletteData()
        isEverythingValid()
    } else {
        parseResults = parseArray(colorSetString)
        if (parseResults.results === false) {
            resetPaletteData()
            colorSetValid = false
            colorSetErrors.textContent = 'Not a valid set of colors.  Please follow the correct format.'
            colorSetErrors.classList.remove('hidden')
        } else {
            colorSet = parseResults.returnedArray
            axios.post(`${backendLocation}/palettes/validate/color-set`, {color_set: colorSet})
                .then(response => {
                    if (response.data.error) {
                        resetPaletteData()
                        colorSetValid = false
                        colorSetErrors.classList.remove('hidden')
                        if (response.data.error === '2^n') {
                            colorSetErrors.textContent = 'Number of colors must be a power of 2 (2, 4, 8, 16, etc), ' +
                                'with a minimum of 2 colors'
                        } else if (response.data.error === 'max_length') {
                            colorSetErrors.textContent = 'Custom palette cannot exceed 256 colors'
                        } else if (response.data.error === 'channels') {
                            colorSetErrors.textContent = 'Each color needs 3 channels, for red green and blue'
                        } else if (response.data.error === 'range') {
                            colorSetErrors.textContent = 'For each RGB value, it must be an integer between 0 and 255'
                        } else if (response.data.error === 'distance') {
                            colorSetErrors.textContent = 'Cannot have two identical colors in a color set'
                        }
                    } else {
                        colorSetValid = true
                        colorSetErrors.classList.add('hidden')
                        numberOfColorsElement.textContent = colorSet.length
                        colorDistanceElement.textContent = response.data.color_distance
                    }
                    isEverythingValid()
            })
        }
    }

})

addButton.addEventListener('click', () => {
    axios.post(`${backendLocation}/palettes/add`, {name: paletteName, description: paletteDescription,
        color_set: colorSet}).then(response => {
        ipcRenderer.send('importPalette', response.data)
        closeWindow()
    })
})

cancelButton.addEventListener('click', () => closeWindow())

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
    max_length: Custom palette cannot exceed 256 colors
    2^n: Number of colors must be a power of 2 (2, 4, 8, 16, etc), with a minimum of 2 colors
    channels: Each color needs 3 channels, for red green and blue
    range: For each RGB value, it must be an integer between 0 and 255
    distance: Cannot have two identical colors in a color set
    invalid: Not a valid set of colors

 */