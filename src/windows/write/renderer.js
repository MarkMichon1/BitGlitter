const axios = require('axios')
const { ipcRenderer, remote } = require('electron')
const {log} = require("nodemon/lib/utils");

/*
    *** Setup Variables ***
*/

const stepTitle = document.getElementById('step-title')

// Step 1/5 and associated elements
const stepOneSegment = document.getElementById('step-one')
// Step 2/5 and associated elements
const stepTwoSegment = document.getElementById('step-two')
// Step 3/5 and associated elements
const stepThreeSegment = document.getElementById('step-three')
// Step 4/5 and associated elements
const stepFourSegment = document.getElementById('step-four')
// Step 4/5 and associated elements
const stepFiveSegment = document.getElementById('step-five')

const cancelButton = document.getElementById('cancel-button')
const backButton = document.getElementById('back-button')
const nextButton = document.getElementById('next-button')

let stepOneValid = true  //TODO change to false
let stepTwoValid = true
let stepThreeValid = true
let stepFourValid = true
let stepFiveValid = true // Rendering complete
let currentStep = null

const validStringCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890._-'


/*
    *** Utilities ***
*/


const backButtonEnable = () => backButton.removeAttribute('disabled')
const backButtonDisable = () => backButton.setAttribute('disabled', 'disabled')
const nextButtonEnable = () => nextButton.removeAttribute('disabled')
const nextButtonDisable = () => nextButton.setAttribute('disabled', 'disabled')

const closeWindow = () => {
    const currentWindow = remote.getCurrentWindow()
    currentWindow.close()
}

const stepOneSegmentLoad = () => {
    currentStep = 1
    stepTitle.textContent = 'Step 1/5 -- Basic Setup'
    stepOneSegment.classList.remove('no-display')
    backButtonDisable()
    if (stepOneValid) {
        nextButtonEnable()
    } else {
        nextButtonDisable()
    }
}
const stepTwoSegmentLoad = () => {
    currentStep = 2
    stepTitle.textContent = 'Step 2/5 -- Stream Configuration'
    stepTwoSegment.classList.remove('no-display')
    backButtonEnable()
    if (stepTwoValid) {
        nextButtonEnable()
    } else {
        nextButtonDisable()
    }
}
const stepThreeSegmentLoad = () => {
    currentStep = 3
    stepTitle.textContent = 'Step 3/5 -- Render Configuration'
    stepThreeSegment.classList.remove('no-display')
    if (stepThreeValid) {
        nextButtonEnable()
    } else {
        nextButtonDisable()
    }
}
const stepFourSegmentLoad = () => {
    currentStep = 4
    stepTitle.textContent = 'Step 4/5 -- Encryption Configuration'
    stepFourSegment.classList.remove('no-display')
}
const stepFiveSegmentLoad = () => {
    currentStep = 5
    stepTitle.textContent = 'Step 5/5 -- Rendering'
    stepFiveSegment.classList.remove('no-display')
    backButtonDisable()
    nextButtonDisable()
    nextButton.textContent = 'Rendering...'
}

const stepOneSegmentHide = () => stepOneSegment.classList.add('no-display')
const stepTwoSegmentHide = () => stepTwoSegment.classList.add('no-display')
const stepThreeSegmentHide = () => stepThreeSegment.classList.add('no-display')
const stepFourSegmentHide = () => stepFourSegment.classList.add('no-display')
const stepFiveSegmentHide = () => stepFiveSegment.classList.add('no-display')


const backButtonHandler = () => {
    if (currentStep === 2) {
        stepTwoSegmentHide()
        stepOneSegmentLoad()
    } else if (currentStep === 3) {
        stepThreeSegmentHide()
        stepTwoSegmentLoad()
    } else if (currentStep === 4) {
        stepFourSegmentHide()
        stepThreeSegmentLoad()
    }
}

const nextButtonHandler = () => {
    if (currentStep === 1 && stepOneValid) {
        stepOneSegmentHide()
        stepTwoSegmentLoad()
        currentStep = 2
    } else if (currentStep === 2 && stepTwoValid) {
        stepTwoSegmentHide()
        stepThreeSegmentLoad()
        currentStep = 3
    } else if (currentStep === 3 && stepThreeValid) {
        stepThreeSegmentHide()
        stepFourSegmentLoad()
        currentStep = 4
    } else if (currentStep === 4 && stepFourValid) {
        stepFourSegmentHide()
        stepFiveSegmentLoad()
        currentStep = 5
        writeStart()
    } else if (currentStep === 5 && stepFiveValid) {
        closeWindow()
    }
}

const stepValidityChecker = (step) => {
    if (step === 1) {
        if (inputValid && nameValid && descriptionValid) {
            nextButtonEnable()
        } else {
            nextButtonDisable()
        }
    } else if (step === 2) {

    } else if (step === 3) {

    } else if (step === 4) {

    } else if (step === 5) {

    }
}


/*
    *** Step 1/5 -- Basic Setup ***
*/
//Stream name validate:  AZ, az, 09, ._-
let inputPath = null
let streamName = null
let streamDescription = null

let inputValid = false
let nameValid = false
let descriptionValid = false


/*
    *** Step 2/5 -- Stream Configuration ***
*/
let writeMode = 'video'
let compressedEnabled = true


/*
    *** Step 3/5 -- Render Configuration ***
*/
let streamPaletteID = '6'
let streamPaletteBitLength = 6
let pixelWidth = 24
let blockHeight = 45
let blockWidth = 80
let framesPerSecond = 30


/*
    *** Step 4/5 -- Encryption Configuration ***
*/
let cryptoKey = ''
let fileMaskEnabled = false
let scryptN = 14
let scryptR = 8
let scryptP = 1


/*
    *** Step 5/5 -- Rendering ***
*/
const writeStart = () => {
    console.log('Placeholder to start write')

    //Write finished
    // nextButtonEnable()
    // nextButton.textContent = 'Finish'
}

backButton.addEventListener('click', () => backButtonHandler())
nextButton.addEventListener('click', () => nextButtonHandler())
cancelButton.addEventListener('click', () => closeWindow())

// Loading first step
stepOneSegmentLoad()