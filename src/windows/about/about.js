const { BrowserWindow } = require('electron')

function createAboutWindow (isDev, parentWindow) {
    let aboutWindow = new BrowserWindow({
        backgroundColor: '#25282C',
        title: 'About BitGlitter',
        width: 800,
        height: 625,
        resizable: isDev,
        icon: './assets/icons/icon.png',
        parent: parentWindow,
        modal: true
    })

    if (isDev) {
        aboutWindow.webContents.openDevTools()
    }

    aboutWindow.loadFile(`${__dirname}/about.html`)
    aboutWindow.setMenu(null)

    // aboutWindow.on('close', () => {
    //     console.log('closed')
    // })

    // External links open in browser rather than in app
    aboutWindow.webContents.on('new-window', function(e, url) {
        e.preventDefault();
        require('electron').shell.openExternal(url);
    })

    return aboutWindow
}

module.exports = createAboutWindow