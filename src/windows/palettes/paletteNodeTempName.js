const { BrowserWindow } = require('electron')

function createPaletteWindow (isDev) {
    let paletteWindow = new BrowserWindow({
        backgroundColor: '#25282C',
        title: 'Palettes',
        width: 800,
        height: 625,
        resizable: isDev,
        icon: './assets/icons/icon.png'
    })

    if (isDev) {
        paletteWindow.webContents.openDevTools()
    }

    paletteWindow.loadFile(`${__dirname}/palettes.html`)
    paletteWindow.setMenu(null)

    // External links open in browser rather than in app
    paletteWindow.webContents.on('new-window', function(e, url) {
        e.preventDefault();
        require('electron').shell.openExternal(url);
    })

    paletteWindow.on('ready', () => {
        paletteWindow = null
    })
}

module.exports = createPaletteWindow