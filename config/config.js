/**
 * Config file
 * 
 * By: Oded Cnaan
 * April 2019
 */

//Configure isProduction variable
const isProduction = process.env.NODE_ENV === 'production';
if (isProduction) {
    module.exports = { // PRODUCTION config
        "app" : {
            "name" : "Node-API",
            "isProduction" : true,
            "logger_show_info" : true
        },
        "auth" : {
            "secret" : "G8Ut0VWh6o=djj+@gC&o7<!|D[~LHljjyN?4q*3ILF^DZlR%y",
            "token_timeout": 60*60*24
        },
        "db" : {
            "protocol": "mongodb+srv://",
            "host": "<account>.mongodb.net",
            "name" : "<db name>",
            "username": "<username>",
            "password": "<password>",
            "path": "?retryWrites=true"    
        }
    }
}
else { 
    module.exports = {  // DEV config
        "app" : {
            "name" : "Node-API",
            "isProduction" : false,
            "logger_show_info" : true
        },
        "auth" : {
            "secret" : "G8Ut0VWh6o=djj+@gC&o7<!|D[~LHljjyN?4q*3ILF^DZlR%y",
            "token_timeout": 60*60*24
        },
        "db" : {
            "protocol": "mongodb+srv://",
            "host": "<account>.mongodb.net",
            "name" : "<db name>",
            "username": "<username>",
            "password": "<password>",
            "path": "?retryWrites=true"    
        }

    }
}