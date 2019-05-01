/**
 * Task router
 * 
 * By: Oded Cnaan
 * April 2019
 */
var express             = require('express');
const taskController   = require("../controllers/TaskController");

var router = express.Router()

/**
 * @desc retrieve all tasks
 */
router.get('/all', function (req, res) {
    taskController.listAllTasks(req, res);
})

/**
 * @desc retrievs a task by its id
 */
router.get('/get/:taskId', function (req, res) {
    taskController.getTask(req, res);
})

/**
 * @desc create a new task
 * @param req.body is a json with 
 * {
 *   "title" : "title",
 *   "priority" : 1,
 *   "contents" : "contents"
 * }
 */
router.put('/create', function (req, res) {
    taskController.createTask(req, res);
})
module.exports = router

/**
 * @desc updates an existing task by its id
 * @params a json file in req.body with the following fields
 *    title - optional
 *    priority - optional
 *    contents - optional
 * Only the given fields will be updated. If none is provided, the request
 * is rejected
 */
router.put('/update/:taskId', function (req, res) {
    taskController.updateTask(req, res);
})

/**
 * @desc deletes an existing task by its id
 */
router.delete('/delete/:taskId', function (req, res) {
    taskController.deleteTask(req, res);
})


module.exports = router