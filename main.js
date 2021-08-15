'use strict';

const { app } = require('electron')
const createMainWindow = require('./src/windows/mainWindow/mainWindow')

// Toggles dev only functionality; leave below either 'dev' or 'production'
process.env.NODE_ENV = 'prod'
const isDev = process.env.NODE_ENV === 'dev'

app.on('ready', () => {
    createMainWindow(isDev)
})

// Start Flask backend executable here...