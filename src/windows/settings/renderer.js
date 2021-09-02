const axios = require('axios')
const { remote } = require('electron')

// Write output dir path
const writeOutputDirPathButton = document.getElementById('write-output-dir-button')
const writeOutputDirPathOutput = document.getElementById('write-output-dir-path')
// Read output dir path
const readOutputDirPath = document.getElementById('read-output-dir-button')
const readOutputDirPathOutput = document.getElementById('read-output-dir-path')
// Enable bad frame strikes
const badFrameEnable = document.getElementById('enable-frame-strikes')
// Bad frame strikes
const frameStrikeCount = document.getElementById('frame-strike-count')
// Maximum CPU cores
const cpuCoreSlider = document.getElementById('cpu-core-slider')
const cpuCoreCount = document.getElementById('cpu-core-count')
// Enable statistics
const statisticsEnable = document.getElementById('enable-statistics')
// Output stream name in write
const streamNameEnable = document.getElementById('enable-stream-name')

const saveButton = document.getElementById('save-button')
const cancelButton = document.getElementById('cancel-button')

let decodedFilesOutputDir = null
let disableBadFrameStrikes = null
let maximumCPUCores = null
let maxSupportedCores = null
let outputStreamTitle = null
let readBadFrameStrikes = null
let saveStatistics = null
let writePath = null

cancelButton.addEventListener(() => {
    const currentWindow = remote.getCurrentWindow()
    currentWindow.close()
})

saveButton.addEventListener(() => {
    axios.post('http://localhost:7218/palettes/remove').then(() => {
        const currentWindow = remote.getCurrentWindow()
        currentWindow.close()
    })
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

axios.get('http://localhost:7218/config/settings').then((res) => {
    writeOutputDirPathOutput.textContent = 3
    readOutputDirPathOutput.textContent = 3

    console.log(res.data)
})