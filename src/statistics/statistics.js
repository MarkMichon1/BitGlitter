const { BrowserWindow } = require('electron')

function createStatisticsWindow () {
    let statisticsWindow = new BrowserWindow({
        backgroundColor: '#25282C',
        title: 'Statistics',
        width: 800,
        height: 625,
        icon: './assets/icons/icon.png'
    })


    statisticsWindow.loadFile(`${__dirname}/statistics.html`)

    // External links open in browser rather than in app
    statisticsWindow.webContents.on('new-window', function(e, url) {
        e.preventDefault();
        require('electron').shell.openExternal(url);
    })

    statisticsWindow.on('ready', () => {
        statisticsWindow = null
    })
}

module.exports = createStatisticsWindow