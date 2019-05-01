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

/**
 * @desc list all stories
 */
exports.listAllTasks = (req, res) => {
    Task.find({}, (err, tasks) => {
    if (err) {
      res.status(401).json({ success: false, message: "Failed to list all tasks" });     
      return;      
    }
    res.status(200).json(tasks);
  });
};

/**
 * @desc get a task by its id
 */
exports.getTask = (req, res) => {
  Task.findById(req.params.taskId , (err, task) => {
  if (err) {
    res.status(401).json({ success: false, message: "Failed to retrieve task" });     
    return;      
  }
  res.status(200).json(task);
});
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
  if (!req.body.title || !req.body.priority || req.body.priority < 0 || req.body.priority > 3
      || !req.body.contents) {
    return res.status(400)
        .json({ success: false, message: 'API Validation Error: Invalid parameters' });
  }

  var taskJson = { 
    "title" : req.body.title,
    "priority" : req.body.priority,
    "owner" : req.userId,
    "contents" : req.body.contents,
    "created" : Date.now()
  };
  Task.create(taskJson, function(err, newTask) {
    if (err) {
      res.status(401).json({ success: false, message: "Failed to create task" });
      return;
    }
    res.status(201).json(newTask);
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
  if (!req.body.title && !req.body.priority && !req.body.contents) {
    return res.status(400)
        .json({ success: false, message: 'API Validation Error: Invalid parameters' });
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

  Task.findOneAndUpdate({ _id: req.params.taskId }, taskJson, { new: true }, (err, task) => {
      if (err) {
        res.status(401).json({ success: false, message: "Failed to update task" });
        return;
      }
      res.status(200).json(task);
    }
  );  
};

/**
 * @desc delete given task by its id
 */
exports.deleteTask = (req, res) => {
  Task.remove({ _id: req.params.taskId }, (err, task) => {
    if (err) {
      res.status(401).json({ success: false, message: "Failed to delete task" });
      return;
    }
    res.status(200).json({ success: true, message: "Task successfully deleted" });
  });
};