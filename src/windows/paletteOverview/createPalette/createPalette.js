const { BrowserWindow } = require('electron')

function createCreatePaletteWindow (isDev) {
    let createPaletteWindow = new BrowserWindow({
        backgroundColor: '#25282C',
        title: 'Create Palette',
        width: 585,
        height: 430,
        resizable: isDev,
        icon: '',
        webPreferences: {
            contextIsolation: false,
            enableRemoteModule: true,
            nodeIntegration: true
        }
    })

    if (isDev) {
        createPaletteWindow.webContents.openDevTools()
    }

    createPaletteWindow.loadFile(`${__dirname}/createPalette.html`)
    createPaletteWindow.setMenu(null)

    createPaletteWindow.on('ready', () => {
        createPaletteWindow = null
    })
}

module.exports = createCreatePaletteWindow