/**
 * User router
 * 
 * By: Oded Cnaan
 * April 2019
 */
var express             = require('express');
const taskController   = require("../controllers/UserController");

var router = express.Router()


/**
 * @desc create a new task
 * @param req.body is a json with 
 * 
 */
router.put('/user/create', function (req, res) {
    userController.createNewUser(req, res);
})


module.exports = router