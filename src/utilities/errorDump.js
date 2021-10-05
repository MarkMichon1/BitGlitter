const fs = require('fs')
const { appVersion } = require('../../config')

const errorDump = (readOrWrite, modeState, backendError) => {

    const date = new Date()
    const formattedDateFileSafe = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDay()} ${date.getHours()}.${date.getMinutes()}.${date.getSeconds()}`
    const stream = fs.createWriteStream(`/home/m/Desktop/${readOrWrite} Error State ${formattedDateFileSafe}.txt`) //{flags: 'a'}

    // Intro
    stream.write(`${'*'.repeat(7)} ${readOrWrite} error on ${formattedDateFileSafe} ${'*'.repeat(7)}\n`)
    stream.write('\nSomething has gone wrong which caused this log to be automatically generated.  Please copy ' +
        'and paste contents or attach txt file to our errors channel on Discord, and we will look into this ASAP, ' +
        'and make fixes as necessary.')
    stream.write('\n\nDiscord server invite link: https://discord.gg/t9uv2pZ')
    stream.write(`\n\n${'*'.repeat(40)}`)
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

errorDump('Write', {
    test: 'one',
    test2: 2,
    test3: true
}, 'yee')

module.exports = errorDump