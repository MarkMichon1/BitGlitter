const os = require("os");

// Configurable
const appVersion = '0.9 (Beta)'
const productionMode = false // turn to true when compiling!
const backendLocation = 'http://127.0.0.1:21168'
const expressPort = 8787

// ** Do not touch **
const operatingSystem = os.platform() === 'win32' ? 'windows' : 'linux'

module.exports = {appVersion, backendLocation, expressPort, operatingSystem, productionMode}