const axios = require('axios')
const { remote } = require('electron')

let blocksRead = document.getElementById('blocks-read')
let blocksWrote = document.getElementById('blocks-wrote')
let dataRead = document.getElementById('data-read')
let dataWrote = document.getElementById('data-wrote')
let frameRead = document.getElementById('frames-read')
let framesWrote = document.getElementById('frames-wrote')
let data = null

axios.get('http://localhost:7218/config/statistics').then((response) => {
    data = response.data
    blocksRead.textContent = data.blocks_read
    blocksWrote.textContent = data.blocks_wrote
    dataRead.textContent = data.data_read
    dataWrote.textContent = data.data_wrote
    frameRead.textContent = data.frames_read
    framesWrote.textContent = data.frames_wrote
})

const clearStats = () => {
    if (data.blocks_read > 0 || data.blocks_wrote > 0) {
        data.blocks_read = 0
        data.blocks_wrote = 0
        axios.get('http://localhost:7218/config/statistics/reset').then(() => {
            blocksRead.textContent = '0'
            blocksWrote.textContent = '0'
            dataRead.textContent = 'None'
            dataWrote.textContent = 'None'
            frameRead.textContent = '0'
            framesWrote.textContent = '0'
        })
    }
}

document.getElementById("close-button").addEventListener("click", function (e) {
    let window = remote.getCurrentWindow();
    window.close();
})

// const closeWindow = () => {
//     let window = remote.getCurrentWindow()
//     console.log('fired')
//     window.close()
// }

