/**
 * Application router
 * 
 * By: Oded Cnaan
 * April 2019
 */
var express           = require('express');
const User            = require("../models/UserModel");
var jwt               = require('jsonwebtoken');
var config            = require('../config/config');
const logger          = require('../utils/utils');
var userController    = require("../controllers/UserController");
var Strings           = require("../config/strings");
const validator       = require('validator');

var router = express.Router()



/////////////////////////// UNPROTECTD ROUTES //////////////////////////

router.get('/', function (req, res, next) {
  res.status(403).json({ success: false, message: Strings.ErrorCodes.PathNotAllowed }).send();
})

/////////////////////////// REGISTRATION //////////////////////////

router.put('/register', function(req, res, next) {
  userController.createNewUser(req, res);
}) 


/////////////////////////// AUTHENTICATION //////////////////////////

// Authenticate a new user (login)
router.post('/auth', function (req, res, next) {

  // Check if connected to DB. Fail if not.
  if(!req.app.get("db_connected")) {
    return res.status(500).json({success: false, message: Strings.ErrorCodes.FailedServerError });
  }

  const email =req.body.logemail; 
  const password =req.body.logpassword;

  // Validate login params (email and password)
  if (
    !email ||
    !password ||
    !validator.isEmail(email) ||
    !validator.isLength(password, { 
      min: 4,
      max: 16
    })
  ) {
    res.status(400).json({ success: false, message: Strings.ErrorCodes.AuthMissingFields })
    return
  }

  // Authenticate the user.
  User.authenticate(email, password, function (error, user) {
    if (error || !user) {
      return res.status(401).json({ success: false, message: Strings.ErrorCodes.AuthFailed });
    } else {
      // Use JWT to sign and get token
      const payload = {
        user : email   
      };

      var token = jwt.sign(payload, config.auth.secret, {
        expiresIn :config.auth.token_timeout
      });

      // Save token to DB
      userController.saveToken(user._id, token, res, function(res, err) {
        if (err) {
          logger.error("Could not save session token to DB for user "+user._id);
          res.status(500).json({ success: false, token: Strings.ErrorCodes.ServerError10 });
          return;
        }
        // return the information including token as JSON
        res.set('x-access-token', token);
        res.json({ success: true, token: token });
        res.status(200).send();
      });

    }
  });
  
})

/////////////////////////// Router Middleware //////////////////////////
router.use(function(req, res, next) {
  // Check if connected to DB. Fail if not.
  if(!req.app.get("db_connected")) {
    logger.error("No DB connection");
    return res.status(500).json({success: false, message: Strings.ErrorCodes.ServerError11 });
  }

  // check header or url parameters or post parameters for token
  // Header "x-access-token" should hold the token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, config.auth.secret, function(err, decoded) {       
      if (err) {
        logger.info('Failed to authenticate token [1].');
        return res.json({ success: false, message: Strings.ErrorCodes.AuthFailedToken3 });       
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;  
        // Get the user from DB
        userController.readUserByToken(token, next, function (id, db_token, err, next) {
          if (err) {
            logger.error("Cannot retrieve user ID from DB "+err);
            return res.status(401).json({ success: false, message: Strings.ErrorCodes.AuthFailedToken4 });       
          }
          // Set the user ID to be used by the handlers
          req.userId = id;          
          next(); // pass the request to the next routers
        });
      }
    });
  } else {
    // if there is no token return an error
    return res.status(401).send({ success: false, message: Strings.ErrorCodes.AuthFailedToken5 });
  }
})

// GET for logout logout
router.get('/logout', function (req, res, next) {
  // Delete token from server
  // Save token to DB
  userController.saveToken(req.userId, "Invalid" , res, function(res, err) {
      if (err) {
        logger.error("Could not save session token to DB for user "+req.userId);
        return res.status(500).send({ success: false, message: Strings.ErrorCodes.ServerError12 });
      }
      res.json({ success: true, message: Strings.ErrorCodes.Logout });
      return res.status(200).send();
    });
});

module.exports = router
