const { BrowserWindow, dialog, ipcMain } = require('electron')

function createPathSelectWindow (parentWindow, title) {
    let pathSelectWindow = new BrowserWindow({
        backgroundColor: '#25282C',
        title: title,
        width: 800,
        height: 625,
        icon: './assets/icons/icon.png',
        parent: parentWindow,
        modal: true,
        webPreferences: {
            contextIsolation: false,
            enableRemoteModule: true,
            nodeIntegration: true
        }
    })

    pathSelectWindow.setMenu(null)
    return pathSelectWindow
}

module.exports = createPathSelectWindow