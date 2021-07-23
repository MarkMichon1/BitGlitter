const { BrowserWindow } = require('electron')

function createPresetsWindow () {
    let presetsWindow = new BrowserWindow({
        backgroundColor: '#25282C',
        title: 'Presets',
        width: 800,
        height: 625,
        icon: './assets/icons/icon.png'
    })


    presetsWindow.loadFile(`${__dirname}/presets.html`)

    // External links open in browser rather than in app
    presetsWindow.webContents.on('new-window', function(e, url) {
        e.preventDefault();
        require('electron').shell.openExternal(url);
    })

    presetsWindow.on('ready', () => {
        presetsWindow = null
    })
}

module.exports = createPresetsWindow