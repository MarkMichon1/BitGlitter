const axios = require('axios')
const { ipcRenderer, remote } = require('electron')

const { backendLocation } = require('../../../config')
const display = require('../../utilities/display')

// HTML Elements
// Write output dir path
const writeOutputDirPathButtonElement = document.getElementById('write-output-dir-button')
const writeOutputDirPathOutputElement = document.getElementById('write-output-dir-path')
// Read output dir path
const readOutputDirPathButtonElement = document.getElementById('read-output-dir-button')
const readOutputDirPathOutputElement = document.getElementById('read-output-dir-path')
// Enable bad frame strikes
const badFrameEnableElement = document.getElementById('enable-frame-strikes')
// Bad frame strikes
const frameStrikeCountElement = document.getElementById('frame-strike-count')
// Maximum CPU cores
const cpuCoreSliderElement = document.getElementById('cpu-core-slider')
const cpuCoreCountElement = document.getElementById('cpu-core-count')
// Enable statistics
const statisticsEnableElement = document.getElementById('enable-statistics')
// Output stream name in write
const streamNameEnableElement = document.getElementById('enable-stream-name')
// Buttons
const saveButton = document.getElementById('save-button')
const cancelButton = document.getElementById('cancel-button')

// Variables for sending data when saving settings
let writePath = null
let readPath = null
let strikeEnable = null
let strikeCount = null
let maximumCPUCores = null
let maxSupportedCores = null
let statisticsEnable = null
let readStreamNameEnable = null

cancelButton.addEventListener('click', () => {
    const currentWindow = remote.getCurrentWindow()
    currentWindow.close()
})

saveButton.addEventListener('click',() => {
    axios.post(`${backendLocation}/config/settings`,
        {
            'write_path': writePath,
            'read_path': readPath,
            'enable_bad_frame_strikes': strikeEnable,
            'read_bad_frame_strikes': strikeCount,
            'maximum_cpu_cores': maximumCPUCores,
            'save_statistics': statisticsEnable,
            'output_stream_title': readStreamNameEnable,
        }).then(() => {
        const currentWindow = remote.getCurrentWindow()
        currentWindow.close()
    })
})

// Load current config
axios.get(`${backendLocation}/config/settings`).then((res) => {
    const response = res.data
    writePath = response.write_path
    writeOutputDirPathOutputElement.textContent = display.abridgedPath(writePath)
    readPath = response.decoded_files_output_dir
    readOutputDirPathOutputElement.textContent = display.abridgedPath(readPath)
    strikeEnable = response.enable_bad_frame_strikes
    badFrameEnableElement.checked = strikeEnable
    strikeCount = response.read_bad_frame_strikes
    frameStrikeCountElement.value = strikeCount
    maximumCPUCores = response.maximum_cpu_cores
    maxSupportedCores = response.MAX_SUPPORTED_CPU_CORES
    cpuCoreSliderElement.min = 1
    cpuCoreSliderElement.max = maxSupportedCores
    cpuCoreSliderElement.value = maximumCPUCores
    cpuCoreCountElement.textContent = maximumCPUCores
    statisticsEnable = response.save_statistics
    statisticsEnableElement.checked = statisticsEnable
    readStreamNameEnable = response.output_stream_title
    streamNameEnableElement.checked = readStreamNameEnable
    frameStrikeInputControl()
})

writeOutputDirPathButtonElement.addEventListener('click', () => {
    ipcRenderer.send('openWritePathWindow', writePath)
})

readOutputDirPathButtonElement.addEventListener('click', () => {
    ipcRenderer.send('openReadPathWindow', readPath)
})

ipcRenderer.on('updateWritePath', (event, data) => {
    writePath = data
    writeOutputDirPathOutputElement.textContent = display.abridgedPath(writePath)

})

ipcRenderer.on('updateReadPath', (event, data) => {
    readPath = data
    readOutputDirPathOutputElement.textContent = display.abridgedPath(readPath)
})

badFrameEnableElement.addEventListener('click', () => {
    strikeEnable = badFrameEnableElement.checked
    frameStrikeInputControl()
})

frameStrikeCountElement.addEventListener('input', () => {
    strikeCount = frameStrikeCountElement.value
})

cpuCoreSliderElement.addEventListener('input', () => {
    maximumCPUCores = cpuCoreSliderElement.value
    cpuCoreCountElement.textContent = cpuCoreSliderElement.value
})

statisticsEnableElement.addEventListener('click', () => {
    statisticsEnable = statisticsEnableElement.checked
})

streamNameEnableElement.addEventListener('click', () => {
    readStreamNameEnable = streamNameEnableElement.checked
})

const frameStrikeInputControl = () => {
    if (strikeEnable) {
        frameStrikeCountElement.removeAttribute('disabled')
    } else {
        frameStrikeCountElement.setAttribute('disabled', 'disabled')
    }
}