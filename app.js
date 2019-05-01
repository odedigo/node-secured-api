/**
 * The main application
 * 
 * By: Oded Cnaan
 * April 2019
 */
const express     = require("express");
const bodyParser  = require("body-parser");
var config        = require('./config/config');
var compression   = require('compression');
var appDb         = require("./db");     // triggers SB connection
var logger        = require('./utils/utils')
// Routers
var appRouter     = require('./routers/appRouter')
var taskRouter    = require('./routers/taskRouter')

//Configure isProduction variable
config.app.isProduction = process.env.NODE_ENV === 'production';

logger.separator();

// TODO - production hardening

// The Express application
const app = express();

app.set('tokenSecret', config.auth.secret); // secret variable
app.set('db_connected', false);             // initiate to false

/* Define application behavior */
const port = process.env.PORT || 3301;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(compression()); //Compress all routes

// serve static files from template
// Handles queries to the root of the site
app.use(express.static(__dirname + '/pages'));


// Routers
app.use('/api', appRouter);         // This one must be the first as it handles the authentication
app.use('/api/task', taskRouter);

// Error handlers 404 if nothing was caught so far
app.get('*', function(req, res){
  res.status(404).redirect('/');
});
app.put('*', function(req, res){
  res.status(404).redirect('/');
});
app.delete('*', function(req, res){
  res.status(404).redirect('/');
});
app.post('*', function(req, res){
  res.status(404).redirect('/');
});

// Connect to MongoDB. 
appDb.connectToDB(function(status) {
  // Start server (listen)
  app.listen(port, () => {
    logger.info(`Server running at http://localhost:${port}`,"app.js");
  });
  app.set('db_connected', status);  // mark connected or not
});