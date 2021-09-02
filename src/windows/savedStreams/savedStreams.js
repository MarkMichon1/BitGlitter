const { BrowserWindow } = require('electron')

function createSavedStreamsWindow (isDev, parentWindow) {
    let savedStreamsWindow = new BrowserWindow({
        backgroundColor: '#25282C',
        title: 'Saved Streams',
        width: 800,
        height: 625,
        resizable: isDev,
        icon: './assets/icons/icon.png',
        parent: parentWindow,
        modal: true
    })

    if (isDev) {
        savedStreamsWindow.webContents.openDevTools()
    } else {
        savedStreamsWindow.setMenu(null)
    }

    savedStreamsWindow.loadFile(`${__dirname}/savedStreams.html`)

    // External links open in browser rather than in app
    savedStreamsWindow.webContents.on('new-window', function(e, url) {
        e.preventDefault();
        require('electron').shell.openExternal(url);
    })

    return savedStreamsWindow
}

module.exports = createSavedStreamsWindow