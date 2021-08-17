const { BrowserWindow } = require('electron')

function createBase64ImportWindow (isDev) {
    let base64ImportWindow = new BrowserWindow({
        backgroundColor: '#25282C',
        title: 'Import Palette',
        width: 585,
        height: 200,
        resizable: isDev,
        icon: '',
        webPreferences: {
            contextIsolation: false,
            enableRemoteModule: true,
            nodeIntegration: true
        }
    })

    if (isDev) {
        base64ImportWindow.webContents.openDevTools()
    }

    base64ImportWindow.loadFile(`${__dirname}/b64Import.html`)
    base64ImportWindow.setMenu(null)

    return base64ImportWindow
}

module.exports = createBase64ImportWindow