const { BrowserWindow, ipcMain} = require('electron')
const createCreatePaletteWindow = require('./createPalette/createPalette')
const createBase64ImportWindow = require('./b64Import/b64Import')

function createPaletteOverviewWindow (isDev, parentWindow) {
    let paletteOverviewWindow = new BrowserWindow({
        backgroundColor: '#25282C',
        title: 'Palettes',
        width: 815,
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

    let createPaletteWindow = null
    let importPaletteWindow = null

    if (isDev) {
        paletteOverviewWindow.webContents.openDevTools()
    }

    paletteOverviewWindow.loadFile(`${__dirname}/paletteOverview.html`)
    // paletteOverviewWindow.setMenu(null)

    ipcMain.on('importPalette', (event, options) => {
        paletteOverviewWindow.webContents.send('createdPalette', options)
    })

    return paletteOverviewWindow
}

// Events
ipcMain.on('openCreatePaletteWindow', createCreatePaletteWindow)

ipcMain.on('openImportPaletteWindow', createBase64ImportWindow)

module.exports = createPaletteOverviewWindow