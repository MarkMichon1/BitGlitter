const { BrowserWindow } = require('electron')

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

    // External links open in browser rather than in app
    paletteOverviewWindow.webContents.on('new-window', function(e, url) {
        e.preventDefault();
        require('electron').shell.openExternal(url);
    })

    paletteOverviewWindow.on('ready', () => {
        paletteOverviewWindow = null
    })
}

module.exports = createPaletteOverviewWindow