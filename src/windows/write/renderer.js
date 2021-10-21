const axios = require('axios')
const { ipcRenderer, remote } = require('electron')
const io = require("socket.io-client");

const { appVersion } = require('../../../config')
const { abridgedPath, bitorBits, bitsToBytes, checkStringASCII, frameorFrames,
    humanizeFileSize } = require("../../utilities/display");
const { sortPaletteList } = require('../../utilities/palette')

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
// Step 5/5 and associated elements
const stepFiveElement = document.getElementById('step-five')

const cancelButtonElement = document.getElementById('cancel-button')
const backButtonElement = document.getElementById('back-button')
const nextButtonElement = document.getElementById('next-button')

let stepZeroValid = true
let stepOneValid = false
let stepTwoValid = false
let stepThreeValid = true
let stepFourValid = true
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
    stepOneValidate()
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
    nextButtonElement.textContent = 'Next'
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
    nextButtonElement.textContent = 'Start'
}
const stepFiveSegmentLoad = () => {
    currentStep = 5
    stepTitleElement.textContent = 'Step 5/5 -- Rendering...'
    stepFiveElement.classList.remove('no-display')
    backButtonDisable()
    nextButtonDisable()
    nextButtonElement.textContent = 'Rendering...'
    writeStart()
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
    } else if (currentStep === 5 && stepFiveValid) {
        closeWindow()
    }
}

backButtonElement.addEventListener('click', () => backButtonHandler())
nextButtonElement.addEventListener('click', () => nextButtonHandler())
cancelButtonElement.addEventListener('click', () => closeWindow())

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
let sizeInBytes = null

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

ipcRenderer.on('updateWriteInput', (event, data) => {
    nextButtonDisable()
    inputPath = data
    selectedPathElement.textContent = abridgedPath(inputPath)
    inputStatusTextElement.textContent = 'Calculating...'
    spinnerElement.classList.remove('hidden')
    inputPathDisplayElement.classList.remove('hidden')
    inputPathButtonElement.setAttribute('disabled', 'disabled')
    axios.post('http://localhost:7218/write/initial-write-data', {path: data}).then((response) => {
        sizeInBytes = response.data.total_size
        resultRender()
        spinnerElement.classList.add('hidden')
        inputPathButtonElement.removeAttribute('disabled')
        inputStatusTextElement.textContent = `${response.data.total_files.toLocaleString()} file(s),
         ${humanizeFileSize(sizeInBytes)} total size`
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
let compressionEnabled = true
let streamName = ''
let streamDescription = ''

let nameLengthValid = false
let nameValid = false
let descriptionValid = true

videoRadioButtonElement.addEventListener('change', () => {
    writeMode = 'video'
    resultRender()
    stepTwoValidate()
})
imageRadioButtonElement.addEventListener('change', () => {
    writeMode = 'image'
    resultRender()
    stepTwoValidate()
})
compressionEnabledCheckboxElement.addEventListener('click', () => {
    compressionEnabled = compressionEnabledCheckboxElement.checked
})

const stepTwoValidate = () => {
    if (nameLengthValid && nameValid && descriptionValid) {
        stepTwoValid = true
        nextButtonEnable()
    } else {
        stepTwoValid = false
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
    if (checkStringASCII(streamDescription, true)) {
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

const paletteListElement = document.getElementById('palette-list')
const paletteNameDisplayElement = document.getElementById('palette-name')
const paletteBitLengthDisplayElement = document.getElementById('palette-bit-length')
const pixelWidthInputElement = document.getElementById('pixel-width')
const blockHeightInputElement = document.getElementById('block-height')
const blockWidthInputElement = document.getElementById('block-width')
const framesPerSecondInputElement = document.getElementById('frames-per-second')
const frameDimensionsDisplayElement = document.getElementById('frame-dimensions')
const blockDimensionsDisplayElement = document.getElementById('block-dimensions')
const blockErrorsDisplayElement = document.getElementById('block-errors')
const rawDataPerFrameDisplayElement = document.getElementById('raw-data-per-frame')
const netDataPerFrameDisplayElement = document.getElementById('net-data-per-frame')
const rawDataRateDisplayElement = document.getElementById('raw-data-rate')
const netDataRateDisplayElement = document.getElementById('net-data-rate')
const payloadAllocationDisplayElement = document.getElementById('payload-allocation')
const framesNeededDisplayElement = document.getElementById('frames-needed')

let paletteList = []
let activePalette = null
let activePaletteLi = null
let streamPaletteID = '6'
let streamPaletteBitLength = 6
let pixelWidth = 24
let blockHeight = 45
let blockWidth = 80
let framesPerSecond = 30

const resultRender = () => {

    const calibratorBlockOverhead = blockHeight + blockWidth - 1
    const initializerBlockOverhead = 580
    const frameHeaderBitOverhead = 352
    let blocksLeft = blockWidth * blockHeight
    if (blocksLeft < 1500) {
        stepThreeValid = false
        nextButtonDisable()
        blockErrorsDisplayElement.classList.remove('hidden')
    } else {
        blockErrorsDisplayElement.classList.add('hidden')
        stepThreeValid = true
        nextButtonEnable()
    }

    if (writeMode === 'image') {
        blocksLeft -= (calibratorBlockOverhead + initializerBlockOverhead)
    }

    const rawDataPerFrame = bitsToBytes(blocksLeft * streamPaletteBitLength)
    const netDataPerFrame = bitsToBytes((blocksLeft * streamPaletteBitLength) - frameHeaderBitOverhead)
    const payloadAllocation = (netDataPerFrame / rawDataPerFrame) * 100

    axios.post('http://localhost:7218/write/frame-estimator', {block_height: blockHeight, block_width:
        blockWidth, size_in_bytes: sizeInBytes, bit_length: streamPaletteBitLength, output_mode: writeMode})
        .then((response) => {
        framesNeededDisplayElement.textContent = `${response.data.total_frames.toLocaleString()} ${frameorFrames(response.data.total_frames)}`
    })
    frameDimensionsDisplayElement.textContent = `${(blockHeight * pixelWidth).toLocaleString()}px H / ${(blockWidth * pixelWidth).toLocaleString()}px W`
    blockDimensionsDisplayElement.textContent = `${blockHeight.toLocaleString()} blocks H /  ${blockWidth.toLocaleString()} blocks W = ${(blockWidth * blockHeight).toLocaleString()} total blocks`
    rawDataPerFrameDisplayElement.textContent = `${humanizeFileSize(rawDataPerFrame)}`
    netDataPerFrameDisplayElement.textContent = `${humanizeFileSize(netDataPerFrame)}`
    rawDataRateDisplayElement.textContent = `${humanizeFileSize(rawDataPerFrame * framesPerSecond)}/s`
    netDataRateDisplayElement.textContent = `${humanizeFileSize(netDataPerFrame * framesPerSecond)}/s`
    payloadAllocationDisplayElement.textContent = `${payloadAllocation.toFixed(2)}%`
}

pixelWidthInputElement.addEventListener('input', () => {
    pixelWidth = Number.parseInt(pixelWidthInputElement.value, 10)
    resultRender()
})
blockHeightInputElement.addEventListener('input', () => {
    blockHeight = Number.parseInt(blockHeightInputElement.value, 10)
    resultRender()
})
blockWidthInputElement.addEventListener('input', () => {
    blockWidth = Number.parseInt(blockWidthInputElement.value, 10)
    resultRender()
})
framesPerSecondInputElement.addEventListener('input', () => {
    framesPerSecond = Number.parseInt(framesPerSecondInputElement.value, 10)
    resultRender()
})

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
            streamPaletteID = retrieved.palette_id
            streamPaletteBitLength = retrieved.bit_length
            paletteNameDisplayElement.textContent = retrieved.name
            paletteBitLengthDisplayElement.textContent = `${streamPaletteBitLength} ${bitorBits(streamPaletteBitLength)}
             per block`
            resultRender()
        }
    })
    const newContent = document.createTextNode(palette.name)
    newLi.appendChild(newContent)
    paletteListElement.appendChild(newLi)
}

const getPaletteList = () => {
    axios.get('http://localhost:7218/palettes').then((response) => {
        paletteList = response.data
        sortPaletteList()
        paletteList.forEach(palette => {
            generatePaletteLi(palette)
        })

        // Setting to 6 Bit Default palette
        activePaletteLi = document.querySelector('[palette-id="6"]')
        activePaletteLi.classList.add('active')
        streamPaletteID = '6'
        streamPaletteBitLength = 6
        resultRender()

    })
}

getPaletteList()

/*
    *** Step 4/5 -- Encryption Configuration ***
*/

const cryptoKeyInputElement = document.getElementById('encryption-key')
const passwordVisibilityElement = document.getElementById('password-toggle')
const passwordSpanElement = document.getElementById('password-span')
const passwordLengthElement = document.getElementById('password-length')
const cryptoErrorElement = document.getElementById('encryption-errors')
const fileMaskingEnabledElement = document.getElementById('file-masking-enabled')
const scryptNElement = document.getElementById('scrypt-n')
const scryptRElement = document.getElementById('scrypt-r')
const scryptPElement = document.getElementById('scrypt-p')
let showPassword = false

let cryptoKey = ''
let fileMaskEnabled = false
let scryptN = 14
let scryptR = 8
let scryptP = 1

cryptoKeyInputElement.addEventListener('input', () => {
    cryptoKey = cryptoKeyInputElement.value
    if (cryptoKey) {
        passwordSpanElement.classList.remove('hidden')
        passwordLengthElement.textContent = cryptoKey.length
    } else {
        passwordSpanElement.classList.add('hidden')
    }

    if (checkStringASCII(cryptoKey, true)) {
        nextButtonEnable()
        stepFiveValid = true
        cryptoErrorElement.classList.add('hidden')
    } else {
        nextButtonDisable()
        stepFiveValid = false
        cryptoErrorElement.classList.remove('hidden')
    }
})

passwordVisibilityElement.addEventListener('click', () => {
    if (showPassword) {
        cryptoKeyInputElement.type = 'password'
        passwordVisibilityElement.classList.remove('bi-eye')
        passwordVisibilityElement.classList.add('bi-eye-slash')
    } else {
        cryptoKeyInputElement.type = 'text'
        passwordVisibilityElement.classList.remove('bi-eye-slash')
        passwordVisibilityElement.classList.add('bi-eye')
    }
    showPassword = !showPassword
})

fileMaskingEnabledElement.addEventListener('click', () => {
    fileMaskEnabled = fileMaskingEnabledElement.checked
})

scryptNElement.addEventListener('input', () => {
    scryptN = scryptNElement.value
})

scryptRElement.addEventListener('input', () => {
    scryptR = scryptRElement.value
})

scryptPElement.addEventListener('input', () => {
    scryptP = scryptPElement.value
})

/*
    *** Step 5/5 -- Rendering ***
*/

const renderTextInfo = document.getElementById('render-text-info')
const renderProgressBar = document.getElementById('render-progress-bar')
const streamSHAHolderElement = document.getElementById('stream-sha-holder')
const streamSHAValueElement = document.getElementById('stream-sha')
const successSound = new Audio('../../../assets/mp3/success.mp3')
const errorSound = new Audio('../../../assets/mp3/error.mp3')

let writeSavePath = null
let successText = null
let streamSHA256 = null

const socket = io('ws://localhost:7218')

const writeStart = () => {
    axios.post('http://localhost:7218/write/', {
        input_path: inputPath,
        stream_name: streamName,
        stream_description: streamDescription,
        output_mode: writeMode,
        compression_enabled: compressionEnabled,
        file_mask_enabled: fileMaskEnabled,
        encryption_key: cryptoKey,
        scrypt_n: scryptN,
        scrypt_r: scryptR,
        scrypt_p: scryptP,
        stream_palette_id: streamPaletteID,
        pixel_width: pixelWidth,
        block_height: blockHeight,
        block_width: blockWidth,
        frames_per_second: framesPerSecond,
        bg_version: appVersion
    })
}

socket.on('write-preprocess', data => {
    // Displays some preprocess data prior to rendering
    renderTextInfo.textContent = data
})

socket.on('write-render', data => {
    // Displays frame render progress and manipulates progress bar
    renderTextInfo.textContent = `Generating frame ${data[0]}/${data[1]}...`
    renderProgressBar.textContent = `${data[2]} %`
    renderProgressBar.style.width = `${data[2]}%`
})

socket.on('write-video-render', data => {
    // Displays VIDEO render progress and manipulates progress bar
    renderTextInfo.textContent = `Rendering video frame ${data[0]}/${data[1]}...`
    renderProgressBar.textContent = `${data[2]} %`
    renderProgressBar.style.width = `${data[2]}%`
})

socket.on('stream-sha', data => {
    // Displays some preprocess data prior to rendering
    streamSHA256 = data
})

socket.on('write-save-path', data => {
    writeSavePath = data

})

socket.on('write-done', () => {
    // Signals write is complete
    successSound.play()
    if (writeMode === 'video') {
        successText = 'video is'
    } else {
        successText = 'frames are'
    }
    renderTextInfo.classList.add('text-success')
    renderTextInfo.textContent = `Write Complete!  Your ${successText} available here: ${writeSavePath}`
    stepFiveValid = true
    streamSHAValueElement.textContent = streamSHA256
    streamSHAHolderElement.classList.remove('hidden')
    nextButtonEnable()
    nextButtonElement.textContent = 'Finish'
})

socket.on('write-error', data => {
    // Signals backend write() failed
    errorSound.play()
    renderTextInfo.classList.add('text-secondary')
    renderTextInfo.textContent = `Write failure- this can be caused by write parameters, or something else.  An error
    log has been created in your current write path directory.  Please send this to us in Discord along with any other 
     info, and we will investigate and fix this ASAP.`
    stepFiveValid = true
    nextButtonEnable()
    nextButtonElement.textContent = 'Finish'

    // Write state
    const modeState = {stepZeroConfirmed, inputType, inputPath, sizeInBytes, writeMode, compressedEnabled: compressionEnabled, streamName,
    streamDescription, nameLengthValid, nameValid, descriptionValid, streamPaletteID, streamPaletteBitLength,
    pixelWidth, blockHeight, blockWidth, framesPerSecond, cryptoKey, fileMaskEnabled, scryptN, scryptR, scryptP,
    writeSavePath}

    ipcRenderer.send('writeError', {modeState: {...modeState}, path: data.write_path, backendError:
        data.error})
})

/*
    *** Start: ***
*/

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