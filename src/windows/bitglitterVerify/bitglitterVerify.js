const { BrowserWindow, ipcMain, dialog} = require('electron')
const { operatingSystem, productionMode } = require('../../../config')

function createBitGlitterVerifyWindow (parentWindow) {
    let bitglitterVerifyWindow = new BrowserWindow({
        backgroundColor: '#25282C',
        title: 'BitGlitter Stream Verification',
        useContentSize: true,
        width: 815,
        height: 235,
        resizable: !productionMode,
        icon: './assets/icons/icon.png',
        parent: parentWindow,
        modal: true,
        webPreferences: {
            contextIsolation: false,
            enableRemoteModule: true,
            nodeIntegration: true
        }
    })

    if (productionMode) {
        bitglitterVerifyWindow.setMenu(null)
    } else {
        bitglitterVerifyWindow.webContents.openDevTools()
    }

    bitglitterVerifyWindow.loadFile(`${__dirname}/bitglitterVerify.html`)

    // Events
    ipcMain.on('verifyFileDialog', () => {
        dialog.showOpenDialog({
            buttonLabel: 'Select file to verify',
            defaultPath : require('path').join(require('os').homedir(), 'Desktop'),
            filters: [
                { name: 'Supported Formats',
                    extensions:
                        ['avi', 'bmp', 'flv', 'jpg', 'jpeg', 'mov', 'mp4', 'png', 'wmv', 'wepb']
                },
            ],
            properties: [
                'openFile'
            ]
        }).then(result => {
            if (result.canceled === false) {
                bitglitterVerifyWindow.webContents.send('verifyFileSelected', {result: result})
            }
        })
    })
    bitglitterVerifyWindow.on('closed', () => {
        ipcMain.removeAllListeners('verifyFileDialog')
    })

    return bitglitterVerifyWindow
}

module.exports = createBitGlitterVerifyWindow