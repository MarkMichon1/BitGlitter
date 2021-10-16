const { BrowserWindow, ipcMain} = require('electron')
const createCreatePaletteWindow = require('./createPalette/createPalette')
const createBase64ImportWindow = require('./b64Import/b64Import')
const WindowManager = require('../../utilities/windowManager')
const { operatingSystem, productionMode } = require('../../../config')

function createPaletteOverviewWindow (parentWindow) {
    let paletteOverviewWindow = new BrowserWindow({
        backgroundColor: '#25282C',
        title: 'Palettes',
        useContentSize: true,
        width: 815,
        height: 645,
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

    const createPaletteWindow = new WindowManager(createCreatePaletteWindow, paletteOverviewWindow)
    const importPaletteWindow = new WindowManager(createBase64ImportWindow, paletteOverviewWindow)

    if (productionMode) {
        paletteOverviewWindow.setMenu(null)
    } else {
        paletteOverviewWindow.webContents.openDevTools()
    }

    paletteOverviewWindow.loadFile(`${__dirname}/paletteOverview.html`)

    // Events
    ipcMain.on('importPalette', (event, options) => {
        paletteOverviewWindow.webContents.send('createdPalette', options)
    })
    ipcMain.on('openCreatePaletteWindow', () => createPaletteWindow.click())
    ipcMain.on('openImportPaletteWindow', () => importPaletteWindow.click())

    paletteOverviewWindow.on('closed', () => {
        ipcMain.removeAllListeners('importPalette')
        ipcMain.removeAllListeners('openCreatePaletteWindow')
        ipcMain.removeAllListeners('openImportPaletteWindow')
    })

    return paletteOverviewWindow
}

module.exports = createPaletteOverviewWindow