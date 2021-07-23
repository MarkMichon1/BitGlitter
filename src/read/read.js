const { BrowserWindow } = require('electron')

function createReadWindow () {
    let readWindow = new BrowserWindow({
        backgroundColor: '#25282C',
        title: 'Read Stream',
        width: 800,
        height: 625,
        icon: './assets/icons/icon.png'
    })


    readWindow.loadFile(`${__dirname}/read.html`)

    // External links open in browser rather than in app
    readWindow.webContents.on('new-window', function(e, url) {
        e.preventDefault();
        require('electron').shell.openExternal(url);
    })

    readWindow.on('ready', () => {
        readWindow = null
    })
}

module.exports = createReadWindow