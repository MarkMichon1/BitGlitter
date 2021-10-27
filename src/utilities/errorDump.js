const fs = require('fs')
const path = require('path')
const { appVersion } = require('../../config')

const errorDump = (readOrWrite, modeState, backendError, dirPath) => {
    console.log(backendError)
    const date = new Date()
    const formattedDateFileSafe = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`
    const stream = fs.createWriteStream(`${path.join(dirPath, `${readOrWrite} Error ${formattedDateFileSafe}.txt`)}`)

    // Intro
    stream.write(`${'*'.repeat(7)} ${readOrWrite} error on ${date} ${'*'.repeat(7)}\n`)
    stream.write('\nSomething has gone wrong which caused this log to be automatically generated.  Please copy ' +
        'and paste contents or attach txt file to our errors channel on Discord (or use our issues page on Github), and ' +
        'we will look into this ASAP, and make fixes as needed.  Thank you very much!')
    stream.write('\n\nDiscord server invite link: https://discord.gg/t9uv2pZ')
    stream.write('\nGithub if thats more your thing: https://github.com/MarkMichon1/BitGlitter/issues')
    stream.write(`\n\n${'*'.repeat(40)}`)
    stream.write('\n(If copying and pasting, everything below this)')
    stream.write(`\n\nv${appVersion}`)

    // App state
    stream.write('\n\nApp State')
    for (const [key, value] of Object.entries(modeState)) {
        stream.write(`\n${key}: ${value}`)
    }

    // Backend state
    stream.write('\n\nBackend Error')
    stream.write(`\n${backendError}`)
}

module.exports = { errorDump }