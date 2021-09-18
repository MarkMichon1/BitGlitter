const { app, BrowserWindow, dialog, ipcMain } = require('electron')
const WindowManager = require('../../utilities/windowManager')

function createSettingsWindow (isDev, parentWindow, firstRun) {
    let settingsWindow = new BrowserWindow({
        backgroundColor: '#25282C',
        title: 'Settings',
        width: 800,
        height: 540,
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
        settingsWindow.webContents.openDevTools()
    } else {
        settingsWindow.setMenu(null)
    }

    settingsWindow.loadFile(`${__dirname}/settings.html`)

    // External links open in browser rather than in app
    settingsWindow.webContents.on('new-window', function(e, url) {
        e.preventDefault();
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