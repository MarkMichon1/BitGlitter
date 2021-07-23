const { BrowserWindow } = require('electron')

function createPaletteWindow () {
    let paletteWindow = new BrowserWindow({
        backgroundColor: '#25282C',
        title: 'Palettes',
        width: 800,
        height: 625,
        icon: './assets/icons/icon.png'
    })


    paletteWindow.loadFile(`${__dirname}/palettes.html`)

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