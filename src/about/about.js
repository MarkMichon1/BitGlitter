const { BrowserWindow } = require('electron')

function createAboutWindow () {
    let aboutWindow = new BrowserWindow({
        backgroundColor: '#25282C',
        title: 'About BitGlitter',
        width: 800,
        height: 625,
        icon: './assets/icons/icon.png'
    })


    aboutWindow.loadFile(`${__dirname}/about.html`)

    // External links open in browser rather than in app
    aboutWindow.webContents.on('new-window', function(e, url) {
        e.preventDefault();
        require('electron').shell.openExternal(url);
    })

    aboutWindow.on('ready', () => {
        aboutWindow = null
    })
}

module.exports = createAboutWindow