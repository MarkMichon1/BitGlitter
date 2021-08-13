const { BrowserWindow } = require('electron')

function createUserManualWindow (isDev) {
    let userManualWindow = new BrowserWindow({
        backgroundColor: '#25282C',
        title: 'User Manual',
        width: 800,
        height: 625,
        icon: './assets/icons/icon.png'
    })

    if (isDev) {
        userManualWindow.webContents.openDevTools()
    }

    userManualWindow.loadFile(`${__dirname}/userManual.html`)
    userManualWindow.setMenu(null)

    // External links open in browser rather than in app
    userManualWindow.webContents.on('new-window', function(e, url) {
        e.preventDefault();
        require('electron').shell.openExternal(url);
    })

    userManualWindow.on('ready', () => {
        userManualWindow = null
    })
}

module.exports = createUserManualWindow