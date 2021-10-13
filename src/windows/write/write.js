const { BrowserWindow, ipcMain, dialog} = require('electron')
const { operatingSystem, productionMode } = require('../../../config')
const {errorDump} = require('../../utilities/errorDump')

function createWriteWindow (parentWindow) {
    let writeWindow = new BrowserWindow({
        backgroundColor: '#25282C',
        title: 'Write Stream',
        useContentSize: true,
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
        writeWindow.setMenu(null)
    } else {
        writeWindow.webContents.openDevTools()
    }

    writeWindow.loadFile(`${__dirname}/write.html`)

    // External links open in browser rather than in app
    writeWindow.webContents.on('new-window', function(event, url) {
        event.preventDefault();
        require('electron').shell.openExternal(url);
    })

    ipcMain.on('openFileSelectDialog', (event) => {
        dialog.showOpenDialog({
            buttonLabel: 'Select File',
            defaultPath : require('path').join(require('os').homedir(), 'Desktop'),
            properties: [
                'openFile'
            ]
        }).then((result) => {
            if (result.canceled === false) {
                writeWindow.webContents.send('updateWriteInput', result.filePaths[0])
            }
        })
    })

    ipcMain.on('openDirectorySelectDialog', (event) => {
        dialog.showOpenDialog({
            buttonLabel: 'Select Directory',
            defaultPath : require('path').join(require('os').homedir(), 'Desktop'),
            properties: [
                'openDirectory'
            ]}).then((result) => {
            if (result.canceled === false) {
                writeWindow.webContents.send('updateWriteInput', result.filePaths[0])
            }
        })
    })

    ipcMain.on('writeError', (event, data) => {
        errorDump('Write', data.modeState, data.backendError, data.path,)
    })

    writeWindow.on('closed', () => {
        ipcMain.removeAllListeners('openFileSelectDialog')
        ipcMain.removeAllListeners('openDirectorySelectDialog')
        ipcMain.removeAllListeners('writeError')
    })

    return writeWindow
}

module.exports = createWriteWindow