const { BrowserWindow } = require('electron')

function createUserGuideWindow (isDev) {
    let userGuideWindow = new BrowserWindow({
        backgroundColor: '#25282C',
        title: 'User Manual',
        width: 800,
        height: 625,
        icon: './assets/icons/icon.png'
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

    userGuideWindow.on('ready', () => {
        userGuideWindow = null
    })
}

module.exports = createUserGuideWindow