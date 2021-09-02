const { BrowserWindow } = require('electron')

function createCreatePaletteWindow (isDev, parentWindow) {
    let createPaletteWindow = new BrowserWindow({
        backgroundColor: '#25282C',
        title: 'Create Palette',
        width: 585,
        height: 430,
        resizable: isDev,
        icon: '',
        parent: parentWindow,
        modal: true,
        webPreferences: {
            contextIsolation: false,
            enableRemoteModule: true,
            nodeIntegration: true
        }
    })

    if (isDev) {
        createPaletteWindow.webContents.openDevTools()
    } else {
        createPaletteWindow.setMenu(null)
    }

    createPaletteWindow.loadFile(`${__dirname}/createPalette.html`)

    return createPaletteWindow
}

module.exports = createCreatePaletteWindow