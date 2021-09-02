const { BrowserWindow } = require('electron')

function createBase64ImportWindow (isDev, parentWindow) {
    let base64ImportWindow = new BrowserWindow({
        backgroundColor: '#25282C',
        title: 'Import Palette',
        width: 585,
        height: 200,
        resizable: isDev,
        icon: '',
        parent: parentWindow,
        modal: true,
        webPreferences: {
            contextIsolation: false,
            enableRemoteModule: true,
            nodeIntegration: true
        }
    })

    if (isDev) {
        base64ImportWindow.webContents.openDevTools()
    } else {
        base64ImportWindow.setMenu(null)
    }

    base64ImportWindow.loadFile(`${__dirname}/b64Import.html`)

    return base64ImportWindow
}

module.exports = createBase64ImportWindow