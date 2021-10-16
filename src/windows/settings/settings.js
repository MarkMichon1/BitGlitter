const { BrowserWindow, dialog, ipcMain } = require('electron')
const { operatingSystem, productionMode } = require('../../../config')

function createSettingsWindow (parentWindow) {
    let settingsWindow = new BrowserWindow({
        backgroundColor: '#25282C',
        title: 'Settings',
        useContentSize: true,
        width: 800,
        height: 560,
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
        settingsWindow.setMenu(null)
    } else {
        settingsWindow.webContents.openDevTools()
    }

    settingsWindow.loadFile(`${__dirname}/settings.html`)

    // External links open in browser rather than in app
    settingsWindow.webContents.on('new-window', function(event, url) {
        event.preventDefault();
        require('electron').shell.openExternal(url);
    })

    const basePathDialogProperties = {
        buttonLabel: 'Select Directory',
        properties: [
            'openDirectory'
        ]
    }

    ipcMain.on('openWritePathWindow', (event, data) => {
        dialog.showOpenDialog({defaultPath:data, ...basePathDialogProperties}).then((result) => {
            if (result.canceled === false) {
                settingsWindow.webContents.send('updateWritePath', result.filePaths[0])
            }
        })
    })

    ipcMain.on('openReadPathWindow', (event, data) => {
        dialog.showOpenDialog({defaultPath:data, ...basePathDialogProperties}).then((result) => {
            if (result.canceled === false) {
                settingsWindow.webContents.send('updateReadPath', result.filePaths[0])
            }
        })
    })


    settingsWindow.on('closed', () => {
        ipcMain.removeAllListeners('openWritePathWindow')
        ipcMain.removeAllListeners('openReadPathWindow')
    })

    return settingsWindow
}

module.exports = createSettingsWindow