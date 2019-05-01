var colors = require('colors');
var config = require('../config/config');

exports.info = (str, where) => {
    if (config.app.logger_show_info) {           
        var name = "["+config.app.name+"]";
        console.log(name.bold.gray+" INFO: ".bold.yellow + "[".gray+where.gray+"] ".gray + str.yellow);
    }
}

exports.error = (str, where) => {
    var name = "["+config.app.name+"] ";
    console.log(name.bold.gray+'ERROR:'.bold.bgRed.white + "[".gray+where.gray+"] ".gray + str.red);
}

exports.separator = () => {
    console.log("====================== ".gray+config.app.name.white+" ======================".gray);
}