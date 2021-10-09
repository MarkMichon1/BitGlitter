const sortPaletteList = () => {
    paletteList.sort((first, second) => {
        let firstLowered = first.name.toLowerCase(),
            secondLowered = second.name.toLowerCase();
        if (firstLowered < secondLowered) {
            return -1;
        }
        if (firstLowered > secondLowered) {
            return 1;
        }
        return 0;
    })
}

module.exports = { sortPaletteList }