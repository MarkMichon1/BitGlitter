'use strict';

const { app } = require('electron')
const createMainWindow = require('./src/windows/mainWindow/mainWindow')
const os = require('os')

// Toggles dev only functionality; leave below either 'dev' or 'production'
process.env.NODE_ENV = 'dev'
const isDev = process.env.NODE_ENV === 'dev'

const operatingSystem = os.platform() === 'win32' ? 'windows' : 'linux'

let mainWindow = null

app.on('ready', () => {
    mainWindow = createMainWindow(isDev, operatingSystem)
})

// Start Flask backend executable here...