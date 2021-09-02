const { BrowserWindow } = require('electron')

function createWriteWindow (isDev, parentWindow) {
    let writeWindow = new BrowserWindow({
        backgroundColor: '#25282C',
        title: 'Write Stream',
        width: 800,
        height: 625,
        resizable: isDev,
        icon: './assets/icons/icon.png',
        parent: parentWindow,
        modal: true
    })

    if (isDev) {
        writeWindow.webContents.openDevTools()
    } else {
        writeWindow.setMenu(null)
    }

    writeWindow.loadFile(`${__dirname}/write.html`)

    // External links open in browser rather than in app
    writeWindow.webContents.on('new-window', function(e, url) {
        e.preventDefault();
        require('electron').shell.openExternal(url);
    })

    return writeWindow
}

module.exports = createWriteWindow