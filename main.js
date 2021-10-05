'use strict';

const { app } = require('electron')
const createMainWindow = require('./src/windows/mainWindow/mainWindow')
const os = require('os')

const operatingSystem = os.platform() === 'win32' ? 'windows' : 'linux'

let mainWindow = null

app.on('ready', () => {
    mainWindow = createMainWindow(operatingSystem)
})

// Start Flask backend executable here...
