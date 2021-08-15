const { BrowserWindow, ipcMain} = require('electron')
const createCreatePaletteWindow = require('./createPalette/createPalette')
const createBase64ImportWindow = require('./b64Import/b64Import')

function createPaletteOverviewWindow (isDev) {
    let paletteOverviewWindow = new BrowserWindow({
        backgroundColor: '#25282C',
        title: 'Palettes',
        width: 815,
        height: 625,
        resizable: isDev,
        icon: './assets/icons/icon.png',
        webPreferences: {
            contextIsolation: false,
            enableRemoteModule: true,
            nodeIntegration: true
        }
    })

    if (isDev) {
        paletteOverviewWindow.webContents.openDevTools()
    }

    paletteOverviewWindow.loadFile(`${__dirname}/paletteOverview.html`)
    // paletteOverviewWindow.setMenu(null)


    paletteOverviewWindow.on('ready', () => {
        paletteOverviewWindow = null
    })
}

// Events
ipcMain.on('openCreatePaletteWindow', createCreatePaletteWindow)

ipcMain.on('openImportPaletteWindow', createBase64ImportWindow)

module.exports = createPaletteOverviewWindow