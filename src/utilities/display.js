const humanizeFileSize = (sizeInBytes) => {
    if (sizeInBytes < 1000) {
        return `${sizeInBytes} B`
    } else if (1000 <= sizeInBytes && sizeInBytes < 1000 ** 2) {
        return `${(sizeInBytes / 1000).toFixed(2)} KB`
    } else if (1000 ** 2 <= sizeInBytes && sizeInBytes < 1000 ** 3) {
        return `${(sizeInBytes / 1000 ** 2).toFixed(2)} MB`
    } else if (1000 ** 3 <= sizeInBytes && sizeInBytes < 1000 ** 4) {
        return `${(sizeInBytes / 1000 ** 3).toFixed(2)} GB`
    } else if (1000 ** 4 <= sizeInBytes && sizeInBytes < 1000 ** 5) {
        return `${(sizeInBytes / 1000 ** 4).toFixed(2)} TB`
    } else if (1000 ** 5 <= sizeInBytes && sizeInBytes < 1000 ** 6) {
        return `${(sizeInBytes / 1000 ** 5).toFixed(2)} PB`
    }
}

const abridgedPath = (string) => {
    if (string.length <= 40) {
        return string
    } else {
        firstChunk = string.slice(0, 20).trim()
        lastChunk = string.slice(-20).trim()
        return `${firstChunk} ... ${lastChunk}`
    }
}

const checkStringASCII = (string_input, extra_chars=false) => {
    validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890._- '
    if (extra_chars) {
        validChars += '!@#$%^&*()[]{};:\'\"<>,/?=+`~'
    }
    for (const char of string_input) {
        if (!validChars.includes(char)) {
            return false
        }
    }
    return true
}

const bitsToBytes = (bits) => Math.floor(bits / 8)

const bitOrBits = (quantity) => {
    if (quantity === 1) {
        return 'bit'
    }
    return 'bits'
}

const frameorFrames = (quantity) => {
    if (quantity === 1) {
        return 'frame'
    }
    return 'frames'
}

module.exports = { abridgedPath, bitorBits: bitOrBits, bitsToBytes, checkStringASCII, frameorFrames, humanizeFileSize }