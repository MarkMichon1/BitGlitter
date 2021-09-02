const { BrowserWindow } = require('electron')

function createAboutWindow (isDev, parentWindow) {
    let aboutWindow = new BrowserWindow({
        backgroundColor: '#25282C',
        title: 'About BitGlitter',
        width: 650,
        height: 285,
        resizable: isDev,
        icon: './assets/icons/icon.png',
        parent: parentWindow,
        modal: true
    })

    if (isDev) {
        aboutWindow.webContents.openDevTools()
    } else {
        aboutWindow.setMenu(null)
    }

    aboutWindow.loadFile(`${__dirname}/about.html`)

    // External links open in browser rather than in app
    aboutWindow.webContents.on('new-window', function(e, url) {
        e.preventDefault();
        require('electron').shell.openExternal(url);
    })

    return aboutWindow
}

module.exports = createAboutWindow