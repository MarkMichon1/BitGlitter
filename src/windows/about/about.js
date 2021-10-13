const { BrowserWindow, ipcMain} = require('electron')
const {appVersion, operatingSystem, productionMode} = require('../../../config')

function createAboutWindow (parentWindow) {
    let aboutWindow = new BrowserWindow({
        backgroundColor: '#25282C',
        title: 'About BitGlitter',
        useContentSize: true,
        width: 650,
        height: 380,
        resizable: !productionMode,
        icon: './assets/icons/icon.png',
        parent: parentWindow,
        modal: true,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true
        }
    })

    if (productionMode) {
        aboutWindow.setMenu(null)
    } else {
        aboutWindow.webContents.openDevTools()
    }

    aboutWindow.loadFile(`${__dirname}/about.html`)

    // External links open in browser rather than in app
    aboutWindow.webContents.on('new-window', function(e, url) {
        e.preventDefault();
        require('electron').shell.openExternal(url);
    })

    return aboutWindow
}

module.exports = createAboutWindow