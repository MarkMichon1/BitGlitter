const axios = require('axios')
const bodyParser = require('body-parser')
const express = require('express')
const { ipcRenderer, remote } = require('electron')

const { backendLocation, expressPort} = require('../../../config')
const { abridgedPath, checkStringASCII, convertBoolToEnglish, frameorFrames, humanizeFileSize } = require("../../utilities/display");
const { manifestRender } = require('../../utilities/manifestRender')

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
const metadataPromptElement = document.getElementById('metadata-prompt')

const cancelButtonElement = document.getElementById('cancel-button')
const backButtonElement = document.getElementById('back-button')
const nextButtonElement = document.getElementById('next-button')

let stepOneValid = false
let stepTwoValid = true
let stepThreeValid = true
let stepFourValid = true
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
    backButtonEnable()
    stepTwoElement.classList.remove('no-display')
    if (stepTwoValid) {
        nextButtonEnable()
    } else {
        nextButtonDisable()
    }
    nextButtonElement.textContent = 'Next'
}

const stepThreeSegmentLoad = () => {
    currentStep = 3
    stepTitleElement.textContent = 'Step 3/4 -- Decryption'
    stepThreeElement.classList.remove('no-display')
    if (stepThreeValid) {
        nextButtonEnable()
    } else {
        nextButtonDisable()
    }
    nextButtonElement.textContent = 'Start'
}

const stepFourSegmentLoad = () => {
    currentStep = 4
    stepTitleElement.textContent = 'Step 4/4 -- Reading...'
    stepFourElement.classList.remove('no-display')
    backButtonDisable()
    nextButtonDisable()
    nextButtonElement.textContent = 'Reading...'
    readStart()
}

const metadataPromptSegmentLoad = () => {
    currentStep = 5
    metadataPromptElement.classList.remove('no-display')
    stepTitleElement.textContent = 'Stream Metadata:'
    nextButtonElement.textContent = 'Continue'
}

const stepOneSegmentHide = () => stepOneElement.classList.add('no-display')
const stepTwoSegmentHide = () => stepTwoElement.classList.add('no-display')
const stepThreeSegmentHide = () => stepThreeElement.classList.add('no-display')
const stepFourSegmentHide = () => stepFourElement.classList.add('no-display')
const metadataSegmentHide = () => metadataPromptElement.classList.add('no-display')

const backButtonHandler = ()=> {
    if (currentStep === 2) {
        stepTwoSegmentHide()
        stepOneSegmentLoad()
    } else if (currentStep === 3) {
        stepThreeSegmentHide()
        stepTwoSegmentLoad()
    }
}

const nextButtonHandler = ()=> {
    if (currentStep === 1 && stepOneValid) {
        stepOneSegmentHide()
        stepTwoSegmentLoad()
    } else if (currentStep === 2 && stepTwoValid) {
        stepTwoSegmentHide()
        stepThreeSegmentLoad()
    } else if (currentStep === 3 && stepThreeValid) {
        stepThreeSegmentHide()
        stepFourSegmentLoad()
    } else if (currentStep === 4 && stepFourValid) {
        closeWindow()
    } else if (currentStep === 5) {
        metadataSegmentHide()
        stepFourSegmentLoad()
    }
}

backButtonElement.addEventListener('click', () => backButtonHandler())
nextButtonElement.addEventListener('click', () => nextButtonHandler())
cancelButtonElement.addEventListener('click', () => closeWindow())

/*
    *** Step 1/4 -- Encoded File Select ***
*/
const videoInputRadioElement = document.getElementById('radio-video-select')
const imagesInputRadioElement = document.getElementById('radio-images-select')
const inputPathButtonElement = document.getElementById('input-path-button')
const filePathDisplayElement = document.getElementById('path-file-count')

let inputMode = 'video'
let inputPath = null

const resetStepOneState = () => {
    inputPath = null
    filePathDisplayElement.classList.add('hidden')
    nextButtonDisable()
}

videoInputRadioElement.addEventListener('change', () => {
    inputMode = 'video'
    resetStepOneState()
})

imagesInputRadioElement.addEventListener('change', () => {
    inputMode = 'image'
    resetStepOneState()
})

inputPathButtonElement.addEventListener('click', () => {
    if (inputMode === 'video') {
        ipcRenderer.send('readPathDialog', inputMode)
    } else if (inputMode === 'image') {
        ipcRenderer.send('readPathDialog', inputMode)
    }
})

ipcRenderer.on('updateReadInput', (event, data) => {
    inputPath = data.result.filePaths
    filePathDisplayElement.classList.remove('hidden')
    if (data.type === 'video' || inputPath.length === 1) {
        filePathDisplayElement.textContent = abridgedPath(inputPath[0])
    } else {
        filePathDisplayElement.textContent = `${inputPath.length} images selected`
    }
    stepOneValid = true
    nextButtonEnable()
})

/*
    *** Step 2/4 -- Read Configuration ***
*/

const stopAtMetadataElement = document.getElementById('stop-at-metadata-check')
const unpackageFilesElement = document.getElementById('unpackage-files-check')
const autoDeleteElement = document.getElementById('auto-delete-check')

let stopAtMetadata = true
let unpackageFiles = true
let autoDelete = true

stopAtMetadataElement.addEventListener('click', () => stopAtMetadata = stopAtMetadataElement.checked)
unpackageFilesElement.addEventListener('click', () => unpackageFiles = unpackageFilesElement.checked)
autoDeleteElement.addEventListener('click', () => autoDelete = autoDeleteElement.checked)

/*
    *** Step 3/4 -- Decryption ***
*/

const decryptionErrorsElement = document.getElementById('decryption-errors')
const decryptionKeyInputElement = document.getElementById('decryption-key')
const passwordToggleElement = document.getElementById('password-toggle')
const scryptNElement = document.getElementById('scrypt-n')
const scryptRElement = document.getElementById('scrypt-r')
const scryptPElement = document.getElementById('scrypt-p')
let showPassword = false

let decryptionKey = ''
let scryptN = 14
let scryptR = 8
let scryptP = 1

decryptionKeyInputElement.addEventListener('input', () => {
    decryptionKey = decryptionKeyInputElement.value
    if (checkStringASCII(decryptionKey, true)) {
        nextButtonEnable()
        stepThreeValid = true
        decryptionErrorsElement.classList.add('hidden')
    } else {
        nextButtonDisable()
        stepThreeValid = false
        decryptionErrorsElement.classList.remove('hidden')
    }
})

passwordToggleElement.addEventListener('click', () => {
    if (showPassword) {
        decryptionKeyInputElement.type = 'password'
        passwordToggleElement.classList.remove('bi-eye')
        passwordToggleElement.classList.add('bi-eye-slash')
    } else {
        decryptionKeyInputElement.type = 'text'
        passwordToggleElement.classList.remove('bi-eye-slash')
        passwordToggleElement.classList.add('bi-eye')
    }
    showPassword = !showPassword
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
    *** Step 4/4 -- Reading ***
*/

const readTextInfo = document.getElementById('read-text-info')
const readProgressBar = document.getElementById('read-progress-bar')
const streamSHAHolderElement = document.getElementById('stream-sha-holder')
const streamSHAValueElement = document.getElementById('stream-sha-read')
const successSound = new Audio('../../../assets/mp3/success.mp3')
const errorSound = new Audio('../../../assets/mp3/error.mp3')

let framesThisSession = null
let readSavePath = null
let extractedFileCount = 0
let singleSHARan = false
let streamSHA256 = null

let currentStrikes = 0
let maxStrikes = 0

let errorLevel = null
let errorOccurred = false

/*
    Express Setup
*/

const expressApp = express()
expressApp.use(bodyParser.json())

expressApp.post('/read/test', (req, res) => {
    console.log(`Test message from backend received: ${req.body.success}`)
    res.send(true)
})

expressApp.post('/read/frame-total', (req, res) => {
    framesThisSession = req.body.total_frames_session
    res.send(true)
})

expressApp.post('/read/frame-position', (req, res) => {
    let frameNumber = req.body.frame_position
    let percentage = ((frameNumber * 100) / framesThisSession).toFixed(3)
    let readText = `Reading frame ${frameNumber}/${framesThisSession} ...`
    if (maxStrikes && currentStrikes) {
        readText = `${readText} (Bad frame strike ${currentStrikes}/${maxStrikes})`
    }
    readTextInfo.textContent = readText
    readProgressBar.textContent = `${percentage} %`
    readProgressBar.style.width = `${percentage}%`
    res.send(true)
})

expressApp.post('/read/stream-sha', (req, res) => {
    if (singleSHARan === false) {
        singleSHARan = true
        streamSHA256 = req.body.sha256
        streamSHAValueElement.textContent = streamSHA256
        streamSHAHolderElement.classList.remove('hidden')
    }   else {
        if (req.body.sha256 !== streamSHA256) {
            streamSHAValueElement.textContent = 'Multiple streams detected'
        }
    }
    res.send(true)
})

expressApp.post('/read/path', (req, res) => {
    readSavePath = req.body.path
    console.log(`Read save path: ${readSavePath}`)
    res.send(true)
})

expressApp.post('/read/total-strikes', (req, res) => {
    maxStrikes = req.body.total_strikes
    res.send(true)
})

expressApp.post('/read/new-strike', (req, res) => {
    currentStrikes = req.body.count
    console.log(`New strike: ${currentStrikes}/${maxStrikes}`)
    res.send(true)
})

expressApp.post('/read/done', (req, res) => {
    console.log('Read complete.')
    if (errorOccurred === false) {
        extractedFileCount = req.body.extracted_file_count
        successSound.play()
        readTextInfo.classList.add('text-success')
        readTextInfo.textContent = `Read complete! ${extractedFileCount} file(s) were extracted during this operation to
        ${readSavePath}.  See the Saved Streams window for more information on this stream.`

        stepFourValid = true
        nextButtonEnable()
        nextButtonElement.textContent = 'Finish'
        res.send(true)
    }
})

expressApp.post('/read/error', (req, res) => {
    errorLevel = req.body.level
    console.log(`Error: ${errorLevel}`)

    // Signals backend read() failed
    errorOccurred = true
    errorSound.play()
    readTextInfo.classList.add('text-secondary')

    if (errorLevel === 'hard') {
        const modeState = { inputMode, inputPath, stopAtMetadata, unpackageFiles, autoDelete, decryptionKey, scryptN,
            scryptR, scryptP, readSavePath, streamSHA256, framesThisSession }
        ipcRenderer.send('readError', {modeState: {...modeState}, path: req.body.read_path, backendError:
            req.body.traceback})
        readTextInfo.textContent = `Read failure (backend).  An error log has been created in your current read path 
                                    directory.  Please send this to use in Discord along with any other info, and we 
                                    will investigate and fix this ASAP.`
    } else if (errorLevel === 'soft') {
        let typeOfError = req.body.type_of_error
        if (typeOfError === 'corruption') {
            readTextInfo.textContent = 'Error: Corrupted stream setup data, can not continue.'
        } else if (typeOfError === 'strike') {
            readTextInfo.textContent = `Error: Reached maximum bad frame strikes (${maxStrikes}).  This can be
                                        configured in settings window.`
        }
    }

    stepFourValid = true
    nextButtonEnable()
    nextButtonElement.textContent = 'Finish'
    res.send(true)
})

expressApp.listen(expressPort, () => {
    console.log(`ExpressJS read running on ${expressPort}`)
})

//  ********** Start Read **********

const readStart = ()=> {
    readParameters = {
        file_path: inputPath,
        input_type: inputMode,
        stop_at_metadata_load: stopAtMetadata,
        auto_unpackage_stream: unpackageFiles,
        auto_delete_finished_stream: autoDelete,
        decryption_key: decryptionKey,
        scrypt_n: scryptN,
        scrypt_r: scryptR,
        scrypt_p: scryptP
    }
    console.log(`Read starting.  Parameters: ${JSON.stringify(readParameters)}`)
    axios.post(`${backendLocation}/read/`, readParameters)
}

/*
    *** Stream Metadata ***
*/

const streamSHAMetaElement = document.getElementById('stream-sha-meta')
const streamNameElement = document.getElementById('stream-name')
const streamDescriptionElement = document.getElementById('stream-description')
const payloadSizeElement = document.getElementById('payload-size')
const totalFramesElement = document.getElementById('total-frames')
const timeCreatedElement = document.getElementById('time-created')
const isCompressedElement = document.getElementById('is-compressed')
const isEncryptedElement = document.getElementById('is-encrypted')
const isUsingFileMaskElement = document.getElementById('is-using-file-mask')
const streamPaletteUsedElement = document.getElementById('stream-palette-used')
const streamPaletteIDElement = document.getElementById('stream-palette-id')
const bgVersionUsedElement = document.getElementById('bg-version-used')
const protocolVersionUsedElement = document.getElementById('protocol-version')
const blockHeightElement = document.getElementById('block-height')
const blockWidthElement = document.getElementById('block-width')
const manifestTitleElement = document.getElementById('manifest-title')
const manifestAnchorElement = document.getElementById('manifest-anchor')
const promptSound = new Audio('../../../assets/mp3/prompt.mp3')

expressApp.post('/read/metadata', (req, res) => {
    console.log(`Metadata received: ${JSON.stringify(req.body)}`)
    encryptedString = 'Encrypted, input correct decryption key to unlock stream!'
    manifestDecryptSuccess = req.body.manifest_decrypt_success
    streamSHAMetaElement.textContent = req.body.stream_sha256
    streamNameElement.textContent = req.body.stream_name ? manifestDecryptSuccess : encryptedString

    if (manifestDecryptSuccess) {
        if (req.body.stream_description) {
            streamDescriptionElement.textContent = req.body.stream_description
        } else {
            streamDescriptionElement.textContent = 'No description provided'
        }
        let timeCreated = new Date(req.body.time_created * 1000)
        timeCreatedElement.textContent = timeCreated.toString()
    } else {
        streamDescriptionElement.textContent = encryptedString
        timeCreatedElement.textContent = encryptedString
    }

    payloadSizeElement.textContent = humanizeFileSize(req.body.size_in_bytes)
    totalFramesElement.textContent = `${req.body.total_frames} ${frameorFrames(req.body.total_frames)}`

    isCompressedElement.textContent = convertBoolToEnglish(req.body.is_compressed)
    isEncryptedElement.textContent = convertBoolToEnglish(req.body.is_encrypted)
    isUsingFileMaskElement.textContent = convertBoolToEnglish(req.body.file_mask_enabled)
    streamPaletteUsedElement.textContent = req.body.palette_name ? req.body.palette_name : 'Not decoded yet'
    streamPaletteIDElement.textContent = req.body.stream_palette_id
    bgVersionUsedElement.textContent = req.body.bg_version ? manifestDecryptSuccess : encryptedString
    protocolVersionUsedElement.textContent = req.body.protocol_version

    blockHeightElement.textContent = req.body.block_height.toLocaleString()
    blockWidthElement.textContent = req.body.block_width.toLocaleString()

    fileManifest = req.body.manifest

    if (manifestDecryptSuccess || !req.body.file_mask_enabled) {
        manifestTitleElement.textContent = 'File Manifest:'
        manifestRender(manifestAnchorElement, fileManifest)
    } else {
        manifestAnchorElement.textContent = encryptedString
    }

    // step switch
    promptSound.play()
    stepFourSegmentHide()
    metadataPromptSegmentLoad()
    res.send(true)
})

/*
    *** Start ***
*/

stepOneSegmentLoad()