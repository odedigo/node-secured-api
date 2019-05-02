/**
 * User router
 * 
 * By: Oded Cnaan
 * April 2019
 */
var express            = require('express');
const userController   = require("../controllers/UserController");

var router = express.Router();

/**
 * @desc create a new task
 * @param req.body is a json with 
 * 
 */
router.put('/create', function (req, res) {
    userController.createNewUser(req, res);
})

/**
 * @desc get  a user
 * @param userId is the id
 * 
 */
router.get('/get/:userId', function (req, res) {
    userController.getUser(req, res);
})

module.exports = router