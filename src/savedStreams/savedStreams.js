const { BrowserWindow } = require('electron')

function createSavedStreamsWindow () {
    let savedStreamsWindow = new BrowserWindow({
        backgroundColor: '#25282C',
        title: 'Saved Streams',
        width: 800,
        height: 625,
        icon: './assets/icons/icon.png'
    })


    savedStreamsWindow.loadFile(`${__dirname}/savedStreams.html`)

    // External links open in browser rather than in app
    savedStreamsWindow.webContents.on('new-window', function(e, url) {
        e.preventDefault();
        require('electron').shell.openExternal(url);
    })

    savedStreamsWindow.on('ready', () => {
        savedStreamsWindow = null
    })
}

module.exports = createSavedStreamsWindow