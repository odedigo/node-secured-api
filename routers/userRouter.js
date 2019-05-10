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
 * @desc get  a user
 * @param userId is the id
 * 
 */
router.get('/get/:userId', function (req, res) {
    userController.getUser(req, res);
})

module.exports = router