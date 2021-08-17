const { BrowserWindow } = require('electron')

function createReadWindow (isDev) {
    let readWindow = new BrowserWindow({
        backgroundColor: '#25282C',
        title: 'Read Stream',
        width: 800,
        height: 625,
        resizable: isDev,
        icon: './assets/icons/icon.png'
    })

    if (isDev) {
        readWindow.webContents.openDevTools()
    }

    readWindow.loadFile(`${__dirname}/read.html`)
    readWindow.setMenu(null)

    // External links open in browser rather than in app
    readWindow.webContents.on('new-window', function(e, url) {
        e.preventDefault();
        require('electron').shell.openExternal(url);
    })

    return readWindow
}

module.exports = createReadWindow