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

var router = express.Router()

/////////////////////////// UNPROTECTD ROUTES //////////////////////////

router.get('/', function (req, res, next) {
  res.status(403).json({ success: false, message: "Request path not allowed" }).send();
})

/////////////////////////// AUTHENTICATION //////////////////////////

// Authenticate a new user (login)
router.post('/auth', function (req, res, next) {

  // Check if connected to DB. Fail if not.
  if(!req.app.get("db_connected")) {
    return res.status(500).json({success: false, message: 'Operation failed due to server error.'});
  }

  // Validate login params (email and password)
  if (req.body.logemail && req.body.logpassword) {
    // Authenticate the user.
    User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
      if (error || !user) {
        return res.status(401).json({ success: false, message: "Authentication failed" });
      } else {
        // Use JWT to sign and get token
        const payload = {
          user : req.body.logemail   
        };

        var token = jwt.sign(payload, config.auth.secret, {
          expiresIn :config.auth.token_timeout
        });

        // Save token to DB
        userController.saveToken(user._id, token, res, function(res, err) {
          if (err) {
            logger.error("Could not save session token to DB for user "+user._id,"appRouter /auth");
            res.status(500).json({ success: false, token: "Server error [10]" });
            return;
          }
          // return the information including token as JSON
          res.set('x-access-token', token);
          res.json({ success: true, token: token });
          res.status(200).send();
        });
      }
    });
  } else {
    return res.status(400).json({ success: false, message: "Authentication failed. Missing fields" });
  }
})

/////////////////////////// Router Middleware //////////////////////////
router.use(function(req, res, next) {
  // Check if connected to DB. Fail if not.
  if(!req.app.get("db_connected")) {
    return res.status(500).json({success: false, message: 'Operation failed due to server error.'});
  }

  // check header or url parameters or post parameters for token
  // Header "x-access-token" should hold the token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, config.auth.secret, function(err, decoded) {       
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token [1].' });       
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;  
        // Get the user from DB
        userController.readUserByToken(token, next, function (id, db_token, err, next) {
          if (err) {
            logger.error("Cannot retrieve user ID from DB "+err,"appRouter middleware");
            return res.json({ success: false, message: 'Failed to authenticate token [2].' });       
          }
          else if (token != db_token) {            
            logger.error("Tokens do not match","appRouter middleware");
            return res.status(401).json({ success: false, message: 'Unauthorized' });       
          }
          // Set the user ID to be used by the handlers
          req.userId = id;          
          next();
        });
      }
    });
  } else {
    // if there is no token return an error
    return res.status(401).send({ success: false, message: 'No token provided.' });
  }
})

// GET for logout logout
router.get('/logout', function (req, res, next) {
  // Delete token from server
  // Save token to DB
  userController.saveToken(req.userId, "Invalid" , res, function(res, err) {
      if (err) {
        logger.error("Could not save session token to DB for user "+req.userId,"appRouter /logout");
        return res.status(500).send({ success: false, message: 'Server error [10].' });
      }
      res.json({ success: true, message: "You are now logged out" });
      return res.status(200).send();
    });
});

/////////////////////////// USER RELATED //////////////////////////

/*router.get('/user/create', function (req, res) {
    userController.createNewUser(req, res);
})*/

module.exports = router
