const { BrowserWindow } = require('electron')

function createPresetsWindow (isDev) {
    let presetsWindow = new BrowserWindow({
        backgroundColor: '#25282C',
        title: 'Presets',
        width: 800,
        height: 625,
        resizable: isDev,
        icon: './assets/icons/icon.png'
    })

    if (isDev) {
        presetsWindow.webContents.openDevTools()
    } else {
        presetsWindow.setMenu(null)
    }

    presetsWindow.loadFile(`${__dirname}/presets.html`)

    // External links open in browser rather than in app
    presetsWindow.webContents.on('new-window', function(e, url) {
        e.preventDefault();
        require('electron').shell.openExternal(url);
    })

    return presetsWindow
}

module.exports = createPresetsWindow