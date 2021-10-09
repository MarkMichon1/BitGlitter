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
        modal: true
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

    ipcMain.on('openFileSelectDialog', (event, data) => {
        console.log(data)
        //todo: toggle between:  single file vid w/ whitelisted exts, or multiple image w/ whitelist exts
        dialog.showOpenDialog({
            buttonLabel: 'Select File',
            defaultPath : require('path').join(require('os').homedir(), 'Desktop'),
            properties: [
                'openFile'
            ]
        }).then((result) => {
            if (result.canceled === false) {
                readWindow.webContents.send('updateReadInput', result.filePaths[0])
            }
        })
    })

    ipcMain.on('readError', (event, data) => {
        errorDump('Read', data.modeState, data.two, data.three )
    })

    readWindow.on('closed', () => {
        // ipcMain.removeAllListeners('openFileSelectDialog')
        // ipcMain.removeAllListeners('openDirectorySelectDialog')
        ipcMain.removeAllListeners('readError')
    })

    return readWindow
}

module.exports = createReadWindow