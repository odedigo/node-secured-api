/**
 * Handles all DB operations related to UserModel
 * 
 * By: Oded Cnaan
 * April 2019
 */
const mongoose  = require("mongoose");
const User      = require("../models/UserModel");
const logger    = require('../utils/utils');
const validator = require('validator')

/**
 * @desc Creates a new user
 * @param req.body is a json containing username, password and email
 */
exports.createNewUser = (req, res) => {

  var email = req.body.email
  var password = req.body.password

  if (!email ||
      !password ||
      !validator.isEmail(email) ||
      !validator.isLength(password,{min: 4, max: 16})){

    return res.status(401).json({ success: false, message:  'API Validation Error: Invalid parameters' });         

  }
      
  var userData = {
    email: email,
    password: password,
  }
  //use schema.create to insert data into the db    
  let newUser = new User(userData);
  User.findOne( {
      email : userData.email
  })
  .then(user => {
    if (user) {
      res.status(409).json({success: false, message: "User already exists"});
      return;
    }

    newUser
      .save()
      .then(() => {
        return res.status(201).json({ success: true, message: "User created" });
      })
      .catch((err) => {
        console.error(err);
      })
  })
  .catch((err) => {
    console.error(err)
  })  
};

/**
 * @desc get a user by its id
 */
exports.getUser = (req, res) => {
  if (!req.params.userId) {
    return res.status(401).json({ success: false, message: "Failed to retrieve user" });     
  }
  User.findById(
    req.params.userId
  )
  .then(user => {
    return res.status(200).json(user);
  })
  .catch(() => {
    return res.status(401).json({ success: false, message: "Failed to retrieve user" });     
  })
};

/**
 * @desc Retrieves a user by its token value
 * @param token - the requested token
 */
exports.readUserByToken = (token, next, callback) => {
  User.findOne( 
    { "token" : token },
    '_id, token'
  )
  .then(user => {
    callback(user._id, user.token, null, next);
    return;
  })
  .catch(() => {
    callback(user._id, user.token, new Error("Cannot get user"), next);
  })
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