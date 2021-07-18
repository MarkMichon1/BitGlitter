const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min)
}

// Logo randomize
let lastInt = 0
for (let i=0; i<50; i++) { // change to for in loop
    let newInt = getRandomInt()
    while (newInt === lastInt) {
        newInt = getRandomInt()

    // Do replacement stuff here


    }
    lastInt = newInt
}

// Background randomize
lastInt = 0

// alert('asd')
console.log('yeet')