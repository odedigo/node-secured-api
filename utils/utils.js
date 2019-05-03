/**
 * @desc Logger functions that provide access to the console
 * 
 * By: Oded Cnaan
 * April 2019
 */
var colors = require('colors');
var config = require('../config/config');

/** 
 * @desc writes INFO messages to the console
 * @param str - the message
 * @param where - the location in the code from which the call was made
 */
exports.info = (str, where) => {
    if (config.app.logger_show_info) {           
        var name = "["+config.app.name+"]";
        console.log(name.bold.gray+" INFO: ".bold.yellow + "[".gray+where.gray+"] ".gray + str.yellow);
    }
}

/** 
 * @desc writes ERROR messages to the console
 * @param str - the message
 * @param where - the location in the code from which the call was made
 */
exports.error = (str, where) => {
    var name = "["+config.app.name+"] ";
    console.log(name.bold.gray+'ERROR:'.bold.bgRed.white + "[".gray+where.gray+"] ".gray + str.red);
}

/** 
 * @desc writes a seperator to the console
 */
exports.separator = () => {
    console.log("====================== ".gray+config.app.name.white+" ======================".gray);
}