const { BrowserWindow, ipcMain, dialog} = require('electron')
const { operatingSystem, productionMode } = require('../../../config')
const {errorDump} = require("../../utilities/errorDump");

function createReadWindow (parentWindow) {
    let readWindow = new BrowserWindow({
        backgroundColor: '#25282C',
        title: 'Read Stream',
        width: 800,
        height: 625,
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
        readWindow.setMenu(null)
    } else {
        readWindow.webContents.openDevTools()
    }

    readWindow.loadFile(`${__dirname}/read.html`)

    // External links open in browser rather than in app
    readWindow.webContents.on('new-window', function(event, url) {
        event.preventDefault();
        require('electron').shell.openExternal(url);
    })

    ipcMain.on('readPathDialog', (event, data) => {

        if (data === 'video') {

            dialog.showOpenDialog({
                buttonLabel: 'Select Video File',
                defaultPath : require('path').join(require('os').homedir(), 'Desktop'),
                filters: [
                    { name: 'Video', extensions: ['avi', 'flv', 'mov', 'mp4', 'wmv'] },
                ],
                properties: [
                    'openFile'
                ]
            }).then((result) => {
                if (result.canceled === false) {
                    readWindow.webContents.send('updateReadInput', {result: result, type: 'video'})
                }
            })
        } else if (data === 'images') {

            dialog.showOpenDialog({
                buttonLabel: 'Select Image Files',
                defaultPath : require('path').join(require('os').homedir(), 'Desktop'),
                filters: [
                    { name: 'Images', extensions: ['bmp', 'jpg', 'jpeg', 'png', 'webp'] },
                ],
                properties: [
                    'openFile',
                    'multiSelections'
                ]
            }).then((result) => {
                if (result.canceled === false) {
                    readWindow.webContents.send('updateReadInput', {result: result, type: 'images'})
                }
            })
        }
    })

    ipcMain.on('readError', (event, data) => {
        errorDump('Read', data.modeState, data.backendError, data.path)
    })

    readWindow.on('closed', () => {
        ipcMain.removeAllListeners('readPathDialog')
        ipcMain.removeAllListeners('readError')
    })

    return readWindow
}

module.exports = createReadWindow