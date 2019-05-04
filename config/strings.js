/**
 * Strings manipulation
 * 
 * By: Oded Cnaan
 * April 2019
 */
'use strict';

const fs = require('fs');

let rawdata = fs.readFileSync('config/ErrorCodes.json');  
var Strings = JSON.parse(rawdata);  

module.exports = Strings;