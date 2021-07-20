'use strict';

const { app } = require('electron')

const createMainWindow = require('./src/mainWindow/mainWindow')

// Toggles dev only functionality; leave below either 'development' or 'production'
process.env.NODE_ENV = 'development'
const isDev = process.env.NODE_ENV !== 'production'

app.on('ready', () => {
    createMainWindow(isDev)
})

// Initialize Flask server here...