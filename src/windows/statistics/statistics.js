const { BrowserWindow } = require('electron')

function createStatisticsWindow (isDev, parentWindow) {
    let statisticsWindow = new BrowserWindow({
        backgroundColor: '#25282C',
        title: 'Statistics',
        width: 585,
        height: 430,
        resizable: isDev,
        icon: './assets/icons/icon.png',
        parent: parentWindow,
        modal: true,
        webPreferences: {
            contextIsolation: false,
            enableRemoteModule: true,
            nodeIntegration: true
        }
    })

    if (isDev) {
        statisticsWindow.webContents.openDevTools()
    } else {
        statisticsWindow.setMenu(null)
    }

    statisticsWindow.loadFile(`${__dirname}/statistics.html`)

    // External links open in browser rather than in app
    statisticsWindow.webContents.on('new-window', function(e, url) {
        e.preventDefault();
        require('electron').shell.openExternal(url);
    })

    return statisticsWindow
}

module.exports = createStatisticsWindow