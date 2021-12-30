const axios = require('axios')
const bodyParser = require('body-parser')
const express = require('express')
const { ipcRenderer, remote } = require('electron')

const { backendLocation, expressPort} = require('../../../config')
const { abridgedPath, checkStringASCII, convertBoolToEnglish, frameorFrames, humanizeFileSize } = require("../../utilities/display");
const { manifestRender } = require('../../utilities/manifestRender')

const startButton = document.getElementById('start-button')

payload = {"file_path":["C:\\Users\\m\\Desktop\\ez.mp4"],"input_type":"video","stop_at_metadata_load":true,"auto_unpackage_stream":true,"auto_delete_finished_stream":true,"decryption_key":"","scrypt_n":14,"scrypt_r":8,"scrypt_p":1}

startButton.addEventListener('click', () => {

})