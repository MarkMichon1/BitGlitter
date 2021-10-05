const { BrowserWindow } = require('electron')
const { operatingSystem, productionMode } = require('../../../../config')

function createBase64ImportWindow (parentWindow) {
    let base64ImportWindow = new BrowserWindow({
        backgroundColor: '#25282C',
        title: 'Import Palette',
        width: 585,
        height: 200,
        resizable: !productionMode,
        icon: '',
        parent: parentWindow,
        modal: true,
        webPreferences: {
            contextIsolation: false,
            enableRemoteModule: true,
            nodeIntegration: true
        }
    })

    if (productionMode) {
        base64ImportWindow.setMenu(null)
    } else {
        base64ImportWindow.webContents.openDevTools()
    }

    base64ImportWindow.loadFile(`${__dirname}/b64Import.html`)

    return base64ImportWindow
}

module.exports = createBase64ImportWindow