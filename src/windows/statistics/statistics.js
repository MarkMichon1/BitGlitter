const { BrowserWindow } = require('electron')

function createStatisticsWindow (isDev) {
    let statisticsWindow = new BrowserWindow({
        backgroundColor: '#25282C',
        title: 'Statistics',
        width: 585,
        height: 430,
        resizable: isDev,
        icon: './assets/icons/icon.png',
        webPreferences: {
            contextIsolation: false,
            enableRemoteModule: true,
            nodeIntegration: true
        }
    })

    if (isDev) {
        statisticsWindow.webContents.openDevTools()
    }

    statisticsWindow.loadFile(`${__dirname}/statistics.html`)
    statisticsWindow.setMenu(null)

    // External links open in browser rather than in app
    statisticsWindow.webContents.on('new-window', function(e, url) {
        e.preventDefault();
        require('electron').shell.openExternal(url);
    })

    return statisticsWindow
}

module.exports = createStatisticsWindow