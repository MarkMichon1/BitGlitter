let paletteColorList = [[0, 0, 0], [255, 0, 255]]

function choose(choices) {
    let index = Math.floor(Math.random() * choices.length);
    return choices[index];
}


const blocks = document.getElementsByClassName('block')

const test = async () => {
    while(true) {
        await new Promise(r => setTimeout(r, 2000));
        for (const block of blocks) {
            randomColor = choose(paletteColorList)
            block.style = `background: rgb(${randomColor[0]}, ${randomColor[1]}, ${randomColor[2]})`
        }
    }
}

test()