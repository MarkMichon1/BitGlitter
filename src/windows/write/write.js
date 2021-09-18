const { BrowserWindow, ipcMain, dialog} = require('electron')
const path = require('path')

function createWriteWindow (isDev, parentWindow) {
    let writeWindow = new BrowserWindow({
        backgroundColor: '#25282C',
        title: 'Write Stream',
        width: 800,
        height: 625,
        resizable: isDev,
        icon: './assets/icons/icon.png',
        parent: parentWindow,
        modal: true,
        webPreferences: {
            contextIsolation: false,
            enableRemoteModule: true,
            nodeIntegration: true
        }
    })

    if (isDev) {
        writeWindow.webContents.openDevTools()
    } else {
        writeWindow.setMenu(null)
    }

    writeWindow.loadFile(`${__dirname}/write.html`)

    // External links open in browser rather than in app
    writeWindow.webContents.on('new-window', function(e, url) {
        e.preventDefault();
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
            console.log(result)
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
            console.log(result)
            if (result.canceled === false) {
                writeWindow.webContents.send('updateWriteInput', result.filePaths[0])
            }
        })
    })

    writeWindow.on('closed', () => {
        ipcMain.removeAllListeners('openFileSelectDialog')
        ipcMain.removeAllListeners('openDirectorySelectDialog')
    })

    return writeWindow
}

module.exports = createWriteWindow

//https://www.electronjs.org/docs/api/dialog