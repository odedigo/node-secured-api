/**
 * Config file
 * 
 * By: Oded Cnaan
 * April 2019
 */

var options = require('./_options')

//Configure isProduction variable
const isProduction = process.env.NODE_ENV === 'production';
if (isProduction) {
    module.exports = { // PRODUCTION config
        options: {
                ...options,
            app : {
                name : "Node-API",
                isProduction : true,
                logger_show_info : true
            }
        }   
    }
}
else { 
    module.exports = {  // DEV config
        options: {
                ...options,
            app : {
                name : "Node-API",
                isProduction : false,
                logger_show_info : true
            }
        }
    }
}