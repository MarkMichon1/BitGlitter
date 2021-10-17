const { BrowserWindow } = require('electron')
const { operatingSystem, productionMode } = require('../../../config')

function createSavedStreamsWindow (parentWindow) {
    let savedStreamsWindow = new BrowserWindow({
        backgroundColor: '#25282C',
        title: 'Saved Streams',
        width: 800,
        height: 625,
        resizable: !productionMode,
        icon: './assets/icons/icon.png',
        parent: parentWindow,
        modal: true,
        webPreferences: {
            contextIsolation: false,
            enableRemoteModule: true,
            nodeIntegration: true
        }
    })

    if (productionMode) {
        savedStreamsWindow.setMenu(null)
    } else {
        savedStreamsWindow.webContents.openDevTools()
    }

    savedStreamsWindow.loadFile(`${__dirname}/savedStreams.html`)

    // External links open in browser rather than in app
    savedStreamsWindow.webContents.on('new-window', function(event, url) {
        event.preventDefault();
        require('electron').shell.openExternal(url);
    })

    return savedStreamsWindow
}

module.exports = createSavedStreamsWindow