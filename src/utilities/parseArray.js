// This is used in palette creation window to attempt to convert the string into a valid array.  Returns false if
// invalid.  Put here to declutter render logic.  This is a work in progress; I'm sure there will be other ways found
// to break this.

const parseArray = (arrayString) => {
    returnedArray = null

    try {
        processing = arrayString.replace(/\(/g, '[')
        processing = processing.replace(/\)/g, ']')
        processing = `[${processing}]`
        processing = JSON.parse(processing)
        return {results: true, returnedArray: processing}
    } catch (error) {
        return {results: false, returnedArray: null}
    }
}

module.exports = { parseArray }