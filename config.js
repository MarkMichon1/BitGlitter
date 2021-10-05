const os = require("os");

// Configurable
const appVersion = '1.0'
const productionMode = false // turn to true when compiling!

// ** Do not touch **
const operatingSystem = os.platform() === 'win32' ? 'windows' : 'linux'

module.exports = {appVersion, operatingSystem, productionMode}