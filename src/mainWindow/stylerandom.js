const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min)
}

// Background randomize
const darkBackgroundBlocks = document.getElementsByClassName('bg-placeholder')
for (const block of darkBackgroundBlocks) {
    if(getRandomInt(0, 1)) {
        block.classList.add('dark-1')
    }
}

// Logo randomize
const logoBackgroundBlocks = document.getElementsByClassName('logo-bg')
let lastInt = 0
for (const block of logoBackgroundBlocks) {
    let newInt = getRandomInt(1, 30)
    while (newInt === lastInt) {
        newInt = getRandomInt(1, 30)
    }
    block.classList.add(`logo-speed-${newInt}`)
    lastInt = newInt
}