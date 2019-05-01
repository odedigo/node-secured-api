/**
 * Handles all DB operations related to UserModel
 * 
 * By: Oded Cnaan
 * April 2019
 */
const mongoose  = require("mongoose");
const User      = require("../models/UserModel");
const logger    = require('../utils/utils');

/**
 * @desc Creates a new user
 * @param req.body is a json containing username, password and email
 */
exports.createNewUser = (req, res) => {

  if (req.body.email &&
    req.body.username &&
    req.body.password &&
    req.body.passwordConf) {
  
      var userData = {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        passwordConf: req.body.passwordConf,
      }
  
      //use schema.create to insert data into the db    
      let newUser = new User(userData);
      newUser.save((err, user) => {
        if (err) {
          res.status(500).send(err);
          return;
        }
        res.status(201).json("OK");
      });
    }
};

/**
 * @desc gets a specific user
 * @param id - the user id to retrieve
 */
exports.readUser = (id, res) => {
  User.findById(id, (err, user) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    var r = res.status(200).json(user);
  });
};

/**
 * @desc Retrieves a user by its token value
 * @param token - the requested token
 */
exports.readUserByToken = (token, next, callback) => {
  User.findOne({ "token" : token }, '_id, token', (err, user) => {
    callback(user._id, user.token, err, next);
  });
};

/**
 * @desc saves a token to a given user
 * @param userId - the user id in DB
 * @param token - the token to save
 */
exports.saveToken = (userid, token, res, callback) => {
  var condition = { "_id" : userid} ; 
  var newvalues = {"token" : token , last_login : Date.now()} ;
  User.updateOne(condition, newvalues, (err) => {
    if (err) {      
      logger.error("Error saving token to DB","UserController.saveToken");
      callback(res, err);
      return;
    }
    callback(res, err);
    return;
  });
};