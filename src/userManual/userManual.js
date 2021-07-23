const { BrowserWindow } = require('electron')

function createUserManualWindow () {
    let userManualWindow = new BrowserWindow({
        backgroundColor: '#25282C',
        title: 'User Manual',
        width: 800,
        height: 625,
        icon: './assets/icons/icon.png'
    })

    userManualWindow.loadFile(`${__dirname}/userManual.html`)

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