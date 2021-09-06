const { BrowserWindow, ipcMain} = require('electron')
const createCreatePaletteWindow = require('./createPalette/createPalette')
const createBase64ImportWindow = require('./b64Import/b64Import')
const WindowManager = require('../../utilities/windowManager')
const {log} = require("nodemon/lib/utils");

function createPaletteOverviewWindow (isDev, parentWindow, firstRun) {
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

    const createPaletteWindow = new WindowManager(createCreatePaletteWindow, isDev, paletteOverviewWindow)
    const importPaletteWindow = new WindowManager(createBase64ImportWindow, isDev, paletteOverviewWindow)

    if (isDev) {
        paletteOverviewWindow.webContents.openDevTools()
    } else {
        paletteOverviewWindow.setMenu(null)
    }

    paletteOverviewWindow.loadFile(`${__dirname}/paletteOverview.html`)

    // Events
    if (firstRun) {
        ipcMain.on('importPalette', (event, options) => {
            paletteOverviewWindow.webContents.send('createdPalette', options)
        })

        ipcMain.on('openCreatePaletteWindow', () => createPaletteWindow.click())

        ipcMain.on('openImportPaletteWindow', () => importPaletteWindow.click())
    }

    return paletteOverviewWindow
}

module.exports = createPaletteOverviewWindow