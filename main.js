'use strict';

const { app } = require('electron')

const createMainWindow = require('./src/mainWindow/mainWindow')

// Toggles dev only functionality; leave below either 'dev' or 'production'
process.env.NODE_ENV = 'dev'
const isDev = process.env.NODE_ENV === 'dev'

app.on('ready', () => {
    createMainWindow(isDev)
})

// Initialize Flask server here...