const { BrowserWindow } = require('electron')
const { operatingSystem, productionMode } = require('../../../../config')

function createCreatePaletteWindow (parentWindow) {
    let createPaletteWindow = new BrowserWindow({
        backgroundColor: '#25282C',
        title: 'Create Palette',
        width: 585,
        height: 430,
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
        createPaletteWindow.setMenu(null)
    } else {
        createPaletteWindow.webContents.openDevTools()
    }

    createPaletteWindow.loadFile(`${__dirname}/createPalette.html`)

    return createPaletteWindow
}

module.exports = createCreatePaletteWindow