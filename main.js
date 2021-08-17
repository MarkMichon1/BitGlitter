'use strict';

const { app } = require('electron')
const createMainWindow = require('./src/windows/mainWindow/mainWindow')

// Toggles dev only functionality; leave below either 'dev' or 'production'
process.env.NODE_ENV = 'dev'
const isDev = process.env.NODE_ENV === 'dev'

let mainWindow = null

app.on('ready', () => {
    mainWindow = createMainWindow(isDev)
})

// Start Flask backend executable here...