const { BrowserWindow } = require('electron')

/*
include option for outputting stream SHA or stream name
 */

function createSettingsWindow (isDev, parentWindow) {
    let settingsWindow = new BrowserWindow({
        backgroundColor: '#25282C',
        title: 'Settings',
        width: 800,
        height: 625,
        resizable: isDev,
        icon: './assets/icons/icon.png',
        parent: parentWindow,
        modal: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })

    if (isDev) {
        settingsWindow.webContents.openDevTools()
    }

    settingsWindow.loadFile(`${__dirname}/settings.html`)
    // settingsWindow.setMenu(null)

    // External links open in browser rather than in app
    settingsWindow.webContents.on('new-window', function(e, url) {
        e.preventDefault();
        require('electron').shell.openExternal(url);
    })

    return settingsWindow
}

module.exports = createSettingsWindow