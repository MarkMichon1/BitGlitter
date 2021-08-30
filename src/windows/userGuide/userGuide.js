const { BrowserWindow } = require('electron')

function createUserGuideWindow (isDev, parentWindow) {
    let userGuideWindow = new BrowserWindow({
        backgroundColor: '#25282C',
        title: 'User Manual',
        width: 800,
        height: 625,
        icon: './assets/icons/icon.png',
        parent: parentWindow,
        modal: true
    })

    if (isDev) {
        userGuideWindow.webContents.openDevTools()
    }

    userGuideWindow.loadFile(`${__dirname}/userGuide.html`)
    userGuideWindow.setMenu(null)

    // External links open in browser rather than in app
    userGuideWindow.webContents.on('new-window', function(e, url) {
        e.preventDefault();
        require('electron').shell.openExternal(url);
    })

    return userGuideWindow
}

module.exports = createUserGuideWindow