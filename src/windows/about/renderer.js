const { appVersion } = require('../../../config')

const block = document.getElementById('block')
const version = document.getElementById('version')
const easterEgg = new Audio('../../../assets/mp3/secret.mp3')

version.textContent = `v${appVersion}`

block.addEventListener('mousedown', () => easterEgg.cloneNode(true).play())