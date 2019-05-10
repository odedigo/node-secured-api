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
exports.info = (str) => {
    if (config.app.logger_show_info) {                   
        var name = "["+config.app.name+"]";
        console.log(/*name.bold.gray+*/"INFO: ".bold.yellow + "[".gray+debugLine().gray+"] ".gray + str.yellow);
    }
}

/** 
 * @desc writes ERROR messages to the console
 * @param str - the message
 * @param where - the location in the code from which the call was made
 */
exports.error = (str) => {
    var name = "["+config.app.name+"] ";
    console.log(/*name.bold.gray+*/'ERROR:'.bold.bgRed.white + "[".gray+debugLine().gray+"] ".gray + str.red);
}

/** 
 * @desc writes a seperator to the console
 */
exports.separator = () => {
    console.log("====================== ".gray+config.app.name.white+" ======================".gray);
}

/**
 * Extracts the file and line where the call was made of 
 */
function debugLine() {
    let e = new Error();
    let frame = e.stack.split("\n")[3];
    let lineNumber = frame.split(":")[2];
    let functionName = frame.split(" ")[5];
    return functionName + ":" + lineNumber;
}