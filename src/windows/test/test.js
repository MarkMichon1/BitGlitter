const { BrowserWindow, ipcMain, dialog} = require('electron')
const { productionMode } = require('../../../config')


function createTestWindow (parentWindow) {
    let testWindow = new BrowserWindow({
        backgroundColor: '#25282C',
        title: 'Test Window',
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
        testWindow.setMenu(null)
    } else {
        testWindow.webContents.openDevTools()
    }

    testWindow.loadFile(`${__dirname}/test.html`)

    // External links open in browser rather than in app
    testWindow.webContents.on('new-window', function(event, url) {
        event.preventDefault();
        require('electron').shell.openExternal(url);
    })

    return testWindow
}

module.exports = createTestWindow