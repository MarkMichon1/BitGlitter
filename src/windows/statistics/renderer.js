const axios = require('axios')
const { remote } = require('electron')

const clearButton = document.getElementById('clear-button')
let blocksRead = document.getElementById('blocks-read')
let blocksWrote = document.getElementById('blocks-wrote')
let dataRead = document.getElementById('data-read')
let dataWrote = document.getElementById('data-wrote')
let frameRead = document.getElementById('frames-read')
let framesWrote = document.getElementById('frames-wrote')
let data = null
let hasCleared = false

axios.get('http://localhost:7218/config/statistics').then((response) => {
    data = response.data
    blocksRead.textContent = data.blocks_read
    blocksWrote.textContent = data.blocks_wrote
    dataRead.textContent = data.data_read
    dataWrote.textContent = data.data_wrote
    frameRead.textContent = data.frames_read
    framesWrote.textContent = data.frames_wrote
    if (data.blocks_read === 0 && data.blocks_read === 0) {
        clearButton.setAttribute('disabled', 'disabled')
    }
})

clearButton.addEventListener("click", function (e) {
    if (data.blocks_read > 0 || data.blocks_wrote > 0 && !hasCleared) {
        axios.get('http://localhost:7218/config/statistics/reset').then(() => {
            blocksRead.textContent = '0'
            blocksWrote.textContent = '0'
            dataRead.textContent = 'None'
            dataWrote.textContent = 'None'
            frameRead.textContent = '0'
            framesWrote.textContent = '0'
            clearButton.setAttribute('disabled', 'disabled')
        })
    }
})

document.getElementById("close-button").addEventListener("click", function (e) {
    let window = remote.getCurrentWindow();
    window.close();
})

