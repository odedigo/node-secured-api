/**
 * Handles all DB operations related to TaskModel
 * 
 * By: Oded Cnaan
 * April 2019
 */
const mongoose  = require("mongoose");
const Task      = require("../models/TaskModel");
const config    = require("../config/config");
const logger    = require("../utils/utils");
const validator = require('validator')

/**
 * @desc list all stories
 */
exports.listAllTasks = (req, res) => {
  Task.find(
    {}
  )
  .then(tasks => {
    return res.status(200).json(tasks);
  })
  .catch(err => {
    return res.status(401).json({ success: false, message: Strings.Tasks.ErrorList });         
  })
};

/**
 * @desc get a task by its id
 */
exports.getTask = (req, res) => {

  if (!req.params.taskId || !validator.isLength(req.params.taskId,{min:3}))
    return res.status(401).json({ success: false, message: Strings.ErrorCodes.InvalidParams });   

  Task.findById(
    req.params.taskId
  )
  .then(task => {
    return res.status(200).json(task);
  })
  .catch(() => {
    return res.status(401).json({ success: false, message: Strings.Tasks.ErrorRetrieve });     
  })
};

/**
 * @desc create a new task
 * @param req.body is a json with 
 * {
 *   "title" : "title",
 *   "priority" : 1,
 *   "contents" : "contents"
 * }
 */
exports.createTask = (req, res) => {
  if (!req.body.title || !req.body.priority || !req.body.contents || 
      !validator.isInt(req.body.priority,{min:0, max:3})) {
    return res.status(400)
        .json({ success: false, message: Strings.ErrorCodes.InvalidParams });
  }

  Task.create(
    { 
      "title" : req.body.title,
      "priority" : req.body.priority,
      "owner" : req.userId,
      "contents" : req.body.contents,
      "created" : Date.now()
    }
  )
  .then(newTask => {
    return res.status(201).json(newTask);
  })
  .catch(err => {
    return res.status(401).json({ success: false, message: Strings.Tasks.ErrorCreate });
  })
};

/**
 * @desc updates an existing task by its id
 * @params a json file in req.body with the following fields
 *    title - optional
 *    priority - optional
 *    contents - optional
 * Only the given fields will be updated. If none is provided, the request
 * is rejected
 */
exports.updateTask = (req, res) => {

  // if none exist, issue an error
  if ((!req.body.title && !req.body.priority && !req.body.contents) || !req.params.taskId) {
    return res.status(400)
        .json({ success: false, message: Strings.ErrorCodes.InvalidParams });
  }
  
  var taskJson = { 
    "modified" : Date.now()
  };
  
  if (req.body.title)
    taskJson['title'] = req.body.title;
  if (req.body.priority)
    taskJson['priority'] = req.body.priority;
  if (req.body.contents)
    taskJson['contents'] = req.body.contents;
  
  var query = { _id: req.params.taskId  };
  Task.findOneAndUpdate(
      query,
      taskJson, 
      { 
        new: true 
      }
    )
    .then(task => {
      return res.status(200).json(task);
    }) 
    .catch(() => {
      return res.status(401).json({ success: false, message: Strings.Tasks.ErrorUpdate });
    })
};

/**
 * @desc delete given task by its id
 */
exports.deleteTask = (req, res) => {
  if (!req.params.taskId) {
    return res.status(400)
        .json({ success: false, message: Strings.ErrorCodes.InvalidParams });
  }

  Task.deleteOne({
     _id: req.params.taskId 
  })
  .then(() => {
    return res.status(200).json({ success: true, message: Strings.Tasks.OkDeleted });
  })
  .catch(() => {
    return res.status(401).json({ success: false, message: Strings.Tasks.ErrorDelete });
  })

};