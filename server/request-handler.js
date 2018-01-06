var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var session = require('express-session');
var cookie = require('cookie-parser');

var database = require('../database-mysql/index.js');

/***** Handles user credentials ******/
var restrict = (req, res, next) => {
  // if user is logged in, serve index
  // else, error message
  if (req.session.user) {
    next();
  } else {
    req.session.error = 'Access denied!';
    res.redirect('/login');
  }
};

/******* Handle GET requests ********/
app.get('/', function (req, res) {
  // Serves up index.html user profile
  // once we handle cookies
  if (err) { return res.sendStatus(400); } 
  else { res.json(); }
});

app.get('/login', function(req, res) {
  // Renders login page
  if (err) { return res.sendStatus(400); } 
  else { res.json(); }
});

app.get('/goals', function(req, res) {
  // Will fetch goals for the specific user
  if (err) { return res.sendStatus(400); } 
  else { res.json(); }
});


/******* Handle POST requests ********/
app.post('/login', function(req, res) {
  // Will cross reference login credentials
  // with db to confirm or deny login
  if (err) { return res.sendStatus(400); } 
  else { res.json(); }
});

app.post('/signup', function(req, res) {
  // Will add user to db, making sure
  // they are not using a taken username
  if (err) { return res.sendStatus(400); } 
  else { res.json(); }
});

app.post('/goals', function(req, res) {
  // Will add goals to user in database
  if (err) { return res.sendStatus(400); } 
  else { res.json(); }
});
