const axios = require('axios')
const { ipcRenderer, remote } = require('electron')
const io = require("socket.io-client");
const {log} = require("nodemon/lib/utils");

/*
    *** Setup Variables ***
*/
const stepTitleElement = document.getElementById('step-title')
// Step 0/5 and associated elements
const stepZeroElement = document.getElementById('step-zero')
// Step 1/5 and associated elements
const stepOneElement = document.getElementById('step-one')
// Step 2/5 and associated elements
const stepTwoElement = document.getElementById('step-two')
// Step 3/5 and associated elements
const stepThreeElement = document.getElementById('step-three')
// Step 4/5 and associated elements
const stepFourElement = document.getElementById('step-four')
// Step 4/5 and associated elements
const stepFiveElement = document.getElementById('step-five')

const cancelButtonElement = document.getElementById('cancel-button')
const backButtonElement = document.getElementById('back-button')
const nextButtonElement = document.getElementById('next-button')

let stepZeroValid = true
let stepOneValid = true //todo CHANGE
let stepTwoValid = true
let stepThreeValid = false
let stepFourValid = false
let stepFiveValid = false // Signalling rendering complete
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

const stepZeroSegmentLoad = () => {
    currentStep = 0
    stepTitleElement.textContent = 'Before Continuing...'
    backButtonDisable()
    nextButtonEnable()
    stepZeroElement.classList.remove('no-display')
}
const stepOneSegmentLoad = () => {
    currentStep = 1
    stepTitleElement.textContent = 'Step 1/5 -- File/Folder Select'
    stepOneElement.classList.remove('no-display')
    if (stepZeroValid) {
        backButtonEnable()
    } else {
        backButtonDisable()
    }
    if (stepOneValid) {
        nextButtonEnable()
    } else {
        nextButtonDisable()
    }
}
const stepTwoSegmentLoad = () => {
    currentStep = 2
    stepTitleElement.textContent = 'Step 2/5 -- Stream Configuration'
    stepTwoElement.classList.remove('no-display')
    backButtonEnable()
    if (stepTwoValid) {
        nextButtonEnable()
    } else {
        nextButtonDisable()
    }
}
const stepThreeSegmentLoad = () => {
    currentStep = 3
    stepTitleElement.textContent = 'Step 3/5 -- Render Configuration'
    stepThreeElement.classList.remove('no-display')
    if (stepThreeValid) {
        nextButtonEnable()
    } else {
        nextButtonDisable()
    }
}
const stepFourSegmentLoad = () => {
    currentStep = 4
    stepTitleElement.textContent = 'Step 4/5 -- Encryption Configuration'
    stepFourElement.classList.remove('no-display')
}
const stepFiveSegmentLoad = () => {
    currentStep = 5
    stepTitleElement.textContent = 'Step 5/5 -- Rendering...'
    stepFiveElement.classList.remove('no-display')
    backButtonDisable()
    nextButtonDisable()
    nextButtonElement.textContent = 'Rendering...'
}

const stepZeroSegmentHide = () => stepZeroElement.classList.add('no-display')
const stepOneSegmentHide = () => stepOneElement.classList.add('no-display')
const stepTwoSegmentHide = () => stepTwoElement.classList.add('no-display')
const stepThreeSegmentHide = () => stepThreeElement.classList.add('no-display')
const stepFourSegmentHide = () => stepFourElement.classList.add('no-display')


const backButtonHandler = () => {
    if (currentStep === 1 && stepZeroValid) {
        stepOneSegmentHide()
        stepZeroSegmentLoad()
    } else if (currentStep === 2) {
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
    if (currentStep === 0) {
        if (!stepZeroConfirmed) {
            axios.post('http://localhost:7218/write/show-once').then(() => {
                stepZeroConfirmed = true
            })
        }
        stepZeroSegmentHide()
        stepOneSegmentLoad()
    }
    else if (currentStep === 1 && stepOneValid) {
        stepOneSegmentHide()
        stepTwoSegmentLoad()
    } else if (currentStep === 2 && stepTwoValid) {
        stepTwoSegmentHide()
        stepThreeSegmentLoad()
    } else if (currentStep === 3 && stepThreeValid) {
        stepThreeSegmentHide()
        stepFourSegmentLoad()
    } else if (currentStep === 4 && stepFourValid) {
        stepFourSegmentHide()
        stepFiveSegmentLoad()
        writeStart()
    } else if (currentStep === 5 && stepFiveValid) {
        closeWindow()
    }
}

/*
    *** Step 0/5 -- Show Once ***
*/
let stepZeroConfirmed = false

/*
    *** Step 1/5 -- Basic Setup ***
*/
const fileRadioButtonElement = document.getElementById('radio-single-file')
const directoryRadioButtonElement = document.getElementById('radio-directory')
const inputPathButtonElement = document.getElementById('input-path-button')
const inputPathDisplayElement = document.getElementById('input-path-display')
const spinnerElement = document.getElementById('step-1-spinner')
const inputStatusTextElement = document.getElementById('input-path-status-text')
const selectedPathElement = document.getElementById('selected-path')

let inputType = null
let inputPath = null

const resetStepOneState = () => {
    inputPath = null
    inputStatusTextElement.textContent = ''
    selectedPathElement.textContent = ''
    inputPathButtonElement.removeAttribute('disabled')
    inputPathDisplayElement.classList.add('hidden')
    stepOneValidate()
}

fileRadioButtonElement.addEventListener('change', () => {
    inputType = 'file'
    resetStepOneState()
})
directoryRadioButtonElement.addEventListener('change', () => {
    inputType = 'directory'
    resetStepOneState()
})

inputPathButtonElement.addEventListener('click', () => {
    if (inputType) {
        if (inputType === 'file') {
            ipcRenderer.send('openFileSelectDialog')
        } else if (inputType === 'directory') {
            ipcRenderer.send('openDirectorySelectDialog')
        }
    }
})

const abridgedPath = (string) => {
    if (string.length <= 40) {
        return string
    } else {
        firstChunk = string.slice(0, 20).trim()
        lastChunk = string.slice(-20).trim()
        return `${firstChunk} ... ${lastChunk}`
    }
}

ipcRenderer.on('updateWriteInput', (event, data) => {
    nextButtonDisable()
    inputPath = data
    selectedPathElement.textContent = abridgedPath(inputPath)
    inputStatusTextElement.textContent = 'Calculating...'
    spinnerElement.classList.remove('hidden')
    inputPathDisplayElement.classList.remove('hidden')
    inputPathButtonElement.setAttribute('disabled', 'disabled')
    axios.post('http://localhost:7218/write/initial-write-data', {path: data}).then((response) => {
        spinnerElement.classList.add('hidden')
        inputPathButtonElement.removeAttribute('disabled')
        inputStatusTextElement.textContent = `${response.data.total_files} file(s), ${response.data.total_size} total size`
        stepOneValidate()
    })
})

const stepOneValidate = () => {
    if (inputType && inputPath) {
        stepOneValid = true
        nextButtonEnable()
    } else {
        stepOneValid = false
        nextButtonDisable()
    }
}

/*
    *** Step 2/5 -- Stream Configuration ***
*/
const videoRadioButtonElement = document.getElementById('radio-video-mode')
const imageRadioButtonElement = document.getElementById('radio-image-mode')
const compressionEnabledCheckboxElement = document.getElementById('compression-enabled')
const nameInputElement = document.getElementById('stream-name')
const nameLengthElement = document.getElementById('name-length')
const nameErrorsElement = document.getElementById('name-errors')
const descriptionInputElement = document.getElementById('stream-description')
const descriptionErrorsElement = document.getElementById('description-errors')

let writeMode = 'video'
let compressedEnabled = true
let streamName = ''
let streamDescription = ''

let nameLengthValid = false
let nameValid = false
let descriptionValid = true

videoRadioButtonElement.addEventListener('change', () => {
    writeMode = 'video'
})
imageRadioButtonElement.addEventListener('change', () => {
    writeMode = 'image'
})
compressionEnabledCheckboxElement.addEventListener('click', () => {
    compressedEnabled = compressionEnabledCheckboxElement.checked
})

const checkStringASCII = (string_input, extra_chars=false) => {
    validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890._- '
    if (extra_chars) {
        validChars += '!@#$%^&*()[]{};:\'\"<>,/?=+`~'
    }
    for (const char of string_input) {
        if (!validChars.includes(char)) {
            return false
        }
    }
    return true
}

const stepTwoValidate = () => {
    if (nameLengthValid && nameValid && descriptionValid) {
        stepOneValid = true
        nextButtonEnable()
    } else {
        stepOneValid = false
        nextButtonDisable()
    }
}

nameInputElement.addEventListener('input', () => {
    streamName = nameInputElement.value
    nameLengthElement.textContent = `${streamName.length}/150`
    nameLengthValid = streamName.length > 0 && streamName.length <= 150
    if (streamName.length === 0) {
        nameLengthElement.classList.add('hidden')
        nameValid = false
    } else {
        nameLengthElement.classList.remove('hidden')
        if (streamName.length > 0 && streamName.length <= 99) {
            nameLengthElement.className = 'text-success'
        } else if (streamName.length > 99 && streamName.length <= 150) {
            nameLengthElement.className = 'text-secondary'
        } else if (streamName.length > 150) {
            nameLengthElement.className = 'text-danger'
        }
        if (checkStringASCII(streamName)) {
            nameValid = true
            nameErrorsElement.classList.add('hidden')
        } else {
            nameValid = false
            nameErrorsElement.classList.remove('hidden')
        }
    }
    stepTwoValidate()
})

descriptionInputElement.addEventListener('input', () => {
    streamDescription = descriptionInputElement.value
    if (checkStringASCII(streamDescription, extra_chars=true)) {
        descriptionValid = true
        descriptionErrorsElement.classList.add('hidden')
    } else {
        descriptionValid = false
        descriptionErrorsElement.classList.remove('hidden')
    }
    stepTwoValidate()
})


/*
    *** Step 3/5 -- Render Configuration ***
*/
let streamPaletteID = '6'
let streamPaletteBitLength = 6
let pixelWidth = 24
let blockHeight = 45
let blockWidth = 80
let framesPerSecond = 30

const resultCalculate = () => {

}


/*
    *** Step 4/5 -- Encryption Configuration ***
*/
let cryptoKey = ''
let fileMaskEnabled = false
let scryptN = 14
let scryptR = 8
let scryptP = 1
//remove 24 bit from list when vid selected.  when pic -> vid, change palette to 6 bit

/*
    *** Step 5/5 -- Rendering ***
*/
const renderTextInfo = document.getElementById('render-text-info')
const renderProgressBar = document.getElementById('render-progress-bar')

const socket = io('ws://localhost:7218')

let writeSavePath = null

const writeStart = () => {
    // axios.post() feed arguments into this
    console.log('Placeholder to start write')

}

socket.on('write-preprocess', data => {
    // Displays some preprocess data prior to rendering
    renderTextInfo.textContent = data
})

socket.on('write-render', data => {
    // Displays frame render progress and manipulates progress bar
    subdividedMessage = data.split('|')
    renderTextInfo.textContent = `Generating frame ${subdividedMessage[0]}/${subdividedMessage[1]}...`
})

socket.on('write-video-render', data => {
    // Displays frame render progress and manipulates progress bar
    subdividedMessage = data.split('|')
    renderTextInfo.textContent = `Rendering video frame ${subdividedMessage[0]}/${subdividedMessage[1]}...`
})

socket.on('write-save-path', data => {
    writeSavePath = data

})

socket.on('write-done', data => {
    // Signals write is complete
    renderTextInfo.textContent = `Write Complete!  Your ${writeModeVideo ? 'video is' : 'frames are'} available here: ${writeSavePath}`
    nextButtonEnable()
    nextButtonElement.textContent = 'Finish'
})

backButtonElement.addEventListener('click', () => backButtonHandler())
nextButtonElement.addEventListener('click', () => nextButtonHandler())
cancelButtonElement.addEventListener('click', () => closeWindow())

// Loading first step, depending on whether the 'run once screen has previously appeared
axios.get('http://localhost:7218/write/show-once').then((response) =>
    {
        stepZeroValid = !response.data.has_ran
        if (stepZeroValid) {
            stepZeroSegmentLoad()
        } else {
            stepOneSegmentLoad()
        }
    }
)