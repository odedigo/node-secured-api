/**
 * Task Model
 * 
 * By: Oded Cnaan
 * April 2019
 */

var mongoose    = require('mongoose');
const Entities  = require('html-entities').XmlEntities;
const config    = require('../config/config').options;
const entities  = new Entities();

//Define a schema
var Schema = mongoose.Schema;

var TaskSchema = new Schema({
    title: { 
      type: String, 
    },
    priority: { 
        type: Number, 
        min: 1, 
        max: 3, 
        default: 2
    },
    created: { 
        type: Date 
    },
    modified: { 
        type: Date, 
        default: Date.now         
    },
    contents: {
        type: String,
        get: v => entities.decode(v),
        set: v => entities.encode(v)
    },
    owner: {
        type: Schema.Types.ObjectId,
    }
});
TaskSchema.set('collection', 'tasks');

// Compile model from schema
module.exports = mongoose.model('taskModel', TaskSchema );
