const { BrowserWindow } = require('electron')
const { operatingSystem, productionMode } = require('../../../config')

function createUserGuideWindow (parentWindow) {
    let userGuideWindow = new BrowserWindow({
        backgroundColor: '#25282C',
        title: 'User Manual',
        width: 900,
        height: 700,
        icon: './assets/icons/icon.png',
        parent: parentWindow,
        modal: true
    })

    if (productionMode) {
        userGuideWindow.setMenu(null)
    } else {
        userGuideWindow.webContents.openDevTools()
    }

    userGuideWindow.loadFile(`${__dirname}/userGuide.html`)

    // External links open in browser rather than in app
    userGuideWindow.webContents.on('new-window', function(event, url) {
        event.preventDefault();
        require('electron').shell.openExternal(url);
    })

    return userGuideWindow
}

module.exports = createUserGuideWindow