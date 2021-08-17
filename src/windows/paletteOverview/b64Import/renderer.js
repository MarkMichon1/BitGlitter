const axios = require('axios')
const { ipcRenderer, remote } = require('electron')

const textInput = document.getElementById('input-box')
const importButton = document.getElementById('import-button')
const statusText = document.getElementById('status-text')

document.getElementById("close-button").addEventListener("click", () => {
    let window = remote.getCurrentWindow();
    window.close();
})

let validString = false
textInput.addEventListener('input', () => {
    statusText.classList.remove('text-success')
    let inputValue = textInput.value
    if (textInput.value === '') {
        validString = false
        textInput.classList.remove('is-invalid')
        importButton.setAttribute('disabled', 'disabled')
        statusText.textContent = ''
    } else {
        axios.post('http://localhost:7218/palettes/base64/validate', {'b64_string': inputValue}).then((response) =>
            {
                message = response.data
                if ('error' in message) {
                    importButton.setAttribute('disabled', 'disabled')
                    validString = false
                    textInput.classList.add('is-invalid')
                    statusText.classList.add('text-danger')
                    if (message['error'] === 'invalid') {
                        statusText.textContent = 'Corrupt or incomplete string'
                    } else if (message['error'] === 'invalid2') { // Someone deliberately tampering with string
                        statusText.textContent = 'Nice try :)'
                    } else if (message['error'] === 'exists') {
                        statusText.textContent = 'This palette already exists on your machine'
                    } else if (message['error'] === 'name') {
                        statusText.textContent = 'Palette with this name on your machine already exists'
                    }
                } else {
                    validString = true
                    importButton.removeAttribute('disabled')
                    textInput.classList.remove('is-invalid')
                    statusText.classList.remove('text-danger')
                    statusText.textContent = 'Valid code, press import to add'
                }
            }
        )
    }
})

importButton.addEventListener('click', () => {
    if (validString) {
        axios.post('http://localhost:7218/palettes/base64/import', {'b64_string': textInput.value}).then((response) =>
            {
                ipcRenderer.send('importPalette', response.data)
                textInput.value = ''
                importButton.setAttribute('disabled', 'disabled')
                statusText.classList.add('text-success')
                statusText.textContent = 'Success!'
            }
        )
    }
})