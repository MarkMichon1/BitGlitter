const axios = require('axios')
const { ipcRenderer, remote } = require('electron')
const io = require("socket.io-client");

const { backendLocation } = require('../../../config')
const { abridgedPath, checkStringASCII, frameorFrames, humanizeFileSize } = require("../../utilities/display");
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

let stepOneValid = true //todo temp, change
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
    inputMode = 'images'
    resetStepOneState()
})

inputPathButtonElement.addEventListener('click', () => {
    if (inputMode === 'video') {
        ipcRenderer.send('readPathDialog', inputMode)
    } else if (inputMode === 'images') {
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

let readSavePath = null
let successText = null
let streamSHA256 = null
let extractedFileCount = 0

const socket = io('ws://localhost:7218')

const readStart = ()=> {
    axios.post(`${backendLocation}/read/`, {
        file_path: 0,
        stop_at_metadata_load: stopAtMetadata,
        unpackage_files: unpackageFiles,
        auto_delete_finished_stream: autoDelete,
        decryption_key: decryptionKey,
        scrypt_n: scryptN,
        scrypt_r: scryptR,
        scrypt_p: scryptP
    })
}

socket.on('frame-process', data => {
    readTextInfo.textContent = `Reading frame ${data[0]}/${data[1]}...`
    readProgressBar.textContent = `${data[2]} %`
    readProgressBar.style.width = `${data[2]}%`
})

socket.on('stream-sha256-receive', data => {
    streamSHA256 = data
    streamSHAValueElement.textContent = streamSHA256
    streamSHAHolderElement.classList.remove('hidden')
})

socket.on('read-save-path', data => {
    readSavePath = data
})

socket.on('read-done', () => {
    successSound.play()
    readTextInfo.classList.add('text-success')
    readTextInfo.textContent = `Read complete! ${extractedFileCount} file(s) were extracted during this operation to
    ${readSavePath}.  See the Saved Streams window for more information on this stream.`
    stepFourValid = true
    nextButtonEnable()
    nextButtonElement.textContent = 'Finish'
})

socket.on('read-error', data => {
    // Signals backend read() failed
    errorSound.play()
    readTextInfo.classList.add('text-secondary')
    readTextInfo.textContent = `Read failure.  An error log has been created in your current read path directory.
                                Please send this to use in Discord along with any other info, and we will investigate
                                and fix this ASAP.`
    stepFourValid = true
    nextButtonEnable()

    // Read state
    const modeState = { inputMode, inputPath, stopAtMetadata, unpackageFiles, autoDelete, decryptionKey, scryptN,
        scryptR, scryptP, readSavePath, streamSHA256 }

    ipcRenderer.send('readError', {modeState: {...modeState}, path: data.read_path, backendError:
        data.error})
})

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
const blockHeightElement = document.getElementById('block-height')
const blockWidthElement = document.getElementById('block-width')
const bgVersionUsedElement = document.getElementById('bg-version-used')
const protocolVersionUsedElement = document.getElementById('protocol-version')
const manifestTitleElement = document.getElementById('manifest-title')
const manifestAnchorElement = document.getElementById('manifest-anchor')
const promptSound = new Audio('../../../assets/mp3/prompt.mp3')

socket.on('metadata-receive', data => {
    // data populate
    streamSHAMetaElement.textContent = data.stream_sha256
    streamNameElement.textContent = data.stream_name
    streamDescriptionElement.textContent = data.stream_description
    payloadSizeElement.textContent = humanizeFileSize(data.payload_size)
    totalFramesElement.textContent = `${data.total_frames} ${frameorFrames(data.total_frames)}`
    timeCreatedElement.textContent = data.time_created
    isCompressedElement.textContent = data.is_compressed
    isEncryptedElement.textContent = data.is_encrypted
    isUsingFileMaskElement.textContent = data.file_mask_enabled
    streamPaletteUsedElement.textContent = data.stream_palette_name
    blockHeightElement.textContent = data.block_height
    blockWidthElement.textContent = data.block_width
    bgVersionUsedElement.textContent = data.bg_version
    protocolVersionUsedElement.textContent = data.protocol

    fileManifest = data.manifest
    manifestDecryptSuccess = data.manifest_decrypt_success

    if (manifestDecryptSuccess || !data.file_mask_enabled) {
        manifestTitleElement.textContent = 'File Manifest:'
        manifestRender(manifestAnchorElement, fileManifest)
    } else {
        manifestTitleElement.textContent = 'Incorrect decryption key, cannot display manifest'
    }

    // step switch
    promptSound.play()
    stepFourSegmentHide()
    metadataPromptSegmentLoad()
})


/*
    *** Start ***
*/

stepOneSegmentLoad()