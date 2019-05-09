/**
 * Manages DB access and functions
 * 
 * By: Oded Cnaan
 * April 2019
 */
const mongoose  = require("mongoose");
let config      = require("./config/config");
const logger    = require('./utils/utils');

//Configure mongoose's promise to global promise
mongoose.promise = global.Promise;

// DB configuration
const dbConfig = config.db;

/**
 * @desc formats the connection URL to MongoDB on Atlas
 * @return string - connection URL
 */
function getDbUri() {
  return dbConfig.protocol + dbConfig.username + ":" + dbConfig.password + "@" + dbConfig.host + "/" + dbConfig.name + dbConfig.path;
}

/**
 * Defines MongoDB connection options
 */
const options = {
  reconnectTries: Number.MAX_VALUE,
  useNewUrlParser: true,
  useCreateIndex: true,
  poolSize: 10,
  useFindAndModify: false
};

exports.connectToDB = (callback) => {
// Connect to MongoDB 
    var db = mongoose.connect(getDbUri(), options).then(
    () => {
      logger.info("Database connection established!","db.connectToDB");
      callback(true);
    },
    err => {
      logger.info("Error connecting Database instance due to "+err,"db.connectToDB");
      callback(false);
    }
  );
}


