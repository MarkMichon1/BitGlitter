const { BrowserWindow } = require('electron')
const { operatingSystem, productionMode } = require('../../../config')

function createStatisticsWindow (parentWindow) {
    let statisticsWindow = new BrowserWindow({
        backgroundColor: '#25282C',
        title: 'Statistics',
        useContentSize: true,
        width: 585,
        height: 445,
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
        statisticsWindow.setMenu(null)
    } else {
        statisticsWindow.webContents.openDevTools()
    }

    statisticsWindow.loadFile(`${__dirname}/statistics.html`)

    // External links open in browser rather than in app
    statisticsWindow.webContents.on('new-window', function(event, url) {
        event.preventDefault();
        require('electron').shell.openExternal(url);
    })

    return statisticsWindow
}

module.exports = createStatisticsWindow