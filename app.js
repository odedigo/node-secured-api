/**
 * The main application
 * 
 * By: Oded Cnaan
 * April 2019
 */
const express     = require("express");
const bodyParser  = require("body-parser");
var config        = require('./config/config').options;
var compression   = require('compression');
var appDb         = require("./db");     
var logger        = require('./utils/utils');
// Routers
var appRouter     = require('./routers/appRouter');
var taskRouter    = require('./routers/taskRouter');
var userRouter    = require('./routers/userRouter');

//Configure isProduction variable
config.app.isProduction = process.env.NODE_ENV === 'production';

logger.separator();
logger.info("Starting "+config.app.name+"...");


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
app.use('/api/user', userRouter);
app.use('/api/task', taskRouter);

// Error handlers 404 if nothing was caught so far in the routers
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

// Connect to MongoDB and start server
appDb.connectToDB(function(status) {
  // Start server (listen)
  app.listen(port, () => {
    logger.info(`Server running at http://localhost:${port}`);
  });
  app.set('db_connected', status);  // mark connected or not
});