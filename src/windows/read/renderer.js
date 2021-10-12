const axios = require('axios')
const { ipcRenderer, remote } = require('electron')
const io = require("socket.io-client");

/*
    *** Setup Variables ***
*/
const stepTitleElement = document.getElementById('step-title')
// Step 1/4 and associated elements
const stepOneElement = document.getElementById('step-one')
// Step 2/4 and associated elements
const stepTwoElement = document.getElementById('step-two')
// Step 3/4 and associated elements
const stepThreeElement = document.getElementById('step-three')
// Step 4/4 and associated elements
const stepFourElement = document.getElementById('step-four')
// Step Prompt and associated elements
const metadataPromptElement = document.getElementById('read-prompt')

const cancelButtonElement = document.getElementById('cancel-button')
const backButtonElement = document.getElementById('back-button')
const nextButtonElement = document.getElementById('next-button')

let stepOneValid = false
let stepTwoValid = false
let stepThreeValid = false
let stepFourValid = false
let currentStep = null

/*
    *** Utilities ***
*/
const backButtonEnable = () => backButtonElement.removeAttribute('disabled')
const backButtonDisable = () => backButtonElement.setAttribute('disabled', 'disabled')
const nextButtonEnable = () => nextButtonElement.removeAttribute('disabled')
const nextButtonDisable = () => nextButtonElement.setAttribute('disabled', 'disabled')

const closeWindow = () => {
    const currentWindow = remote.getCurrentWindow()
    currentWindow.close()
}

const stepOneSegmentLoad = () => {
    currentStep = 1
    stepTitleElement.textContent = 'Step 1/4 -- Encoded File Select'
    backButtonDisable()
    stepOneElement.classList.remove('no-display')
    if (stepOneValid) {
        nextButtonEnable()
    } else {
        nextButtonDisable()
    }
}

const stepTwoSegmentLoad = () => {
    currentStep = 2
    stepTitleElement.textContent = 'Step 2/4 -- Read Configuration'
}

const stepThreeSegmentLoad = () => {
    currentStep = 3
    stepTitleElement.textContent = 'Step 3/4 -- Decryption'
}

const stepFourSegmentLoad = () => {
    currentStep = 4
    stepTitleElement.textContent = 'Step 4/4 -- Reading...'
}

const metadataPromptSegmentLoad = () => {
    stepTitleElement.textContent = 'Stream Metadata'
}






backButtonElement.addEventListener('click', () => backButtonHandler())
nextButtonElement.addEventListener('click', () => nextButtonHandler())
cancelButtonElement.addEventListener('click', () => closeWindow())


// TODO: add failure signal, copy from write