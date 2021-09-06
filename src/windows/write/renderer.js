const axios = require('axios')

const validStringCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890._-'

// Step 1/5 and associated elements
const stepOneWindow = document.getElementById('step-one')
// Step 2/5 and associated elements
const stepTwoWindow = document.getElementById('step-two')
// Step 3/5 and associated elements
const stepThreeWindow = document.getElementById('step-three')
// Step 4/5 and associated elements
const stepFourWindow = document.getElementById('step-four')

const cancelButton = document.getElementById('cancel-button')
const backButton = document.getElementById('back-button')
const nextButton = document.getElementById('next-button')

let stepOneValid = false
let stepTwoValid = false
let stepThreeValid = false
let stepFourValid = false
let stepFiveValid = false // Rendering progress
let currentStep = 1

/*
    *** Utilities ***
*/
const backButtonHandler = () => {

}

const nextButtonHandler = () => {

}

/*
    *** Step 1/5 -- Basic Setup ***
*/
//Stream name validate:  AZ, az, 09, ._-

/*
    *** Step 2/5 -- Basic Setup ***
*/


/*
    *** Step 3/5 -- Basic Setup ***
*/


/*
    *** Step 4/5 -- Basic Setup ***
*/


/*
    *** Step 5/5 -- Basic Setup ***
*/

