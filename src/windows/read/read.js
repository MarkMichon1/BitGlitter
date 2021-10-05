const { BrowserWindow } = require('electron')
const { operatingSystem, productionMode } = require('../../../config')

function createReadWindow (parentWindow) {
    let readWindow = new BrowserWindow({
        backgroundColor: '#25282C',
        title: 'Read Stream',
        width: 800,
        height: 625,
        resizable: !productionMode,
        icon: './assets/icons/icon.png',
        parent: parentWindow,
        modal: true
    })

    if (productionMode) {
        readWindow.setMenu(null)
    } else {
        readWindow.webContents.openDevTools()
    }

    readWindow.loadFile(`${__dirname}/read.html`)

    // External links open in browser rather than in app
    readWindow.webContents.on('new-window', function(event, url) {
        event.preventDefault();
        require('electron').shell.openExternal(url);
    })

    return readWindow
}

module.exports = createReadWindow