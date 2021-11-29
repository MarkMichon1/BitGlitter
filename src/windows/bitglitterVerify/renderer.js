const axios = require('axios')
const { ipcRenderer, remote } = require('electron')

const { backendLocation } = require('../../../config')


const filePathButtonElement = document.getElementById('file-path-button')
const verificationStatusElement = document.getElementById('verification-status')
let inputPath = null
let isValid = null

filePathButtonElement.addEventListener('click', () => {
    ipcRenderer.send('verifyFileDialog')
})

ipcRenderer.on('verifyFileSelected', (event, data) => {
    inputPath = data.result.filePaths[0]
    verificationStatusElement.classList.remove(...verificationStatusElement.classList)
    verificationStatusElement.textContent = ''
    axios.post(`${backendLocation}/read/stream-verify`, {
        file_path: inputPath
    }).then(response => {
        const data = response.data
        isValid = response.data.results
        if (isValid) {
            verificationStatusElement.classList.add('text-success')
            verificationStatusElement.textContent = 'Verified BitGlitter stream'
        } else {
            verificationStatusElement.classList.add('text-secondary')
            verificationStatusElement.textContent = 'Failed verification test'
        }
    })


})