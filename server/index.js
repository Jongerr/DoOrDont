var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookie = require('cookie-parser');
var path = require('path');
var jwt = require('jsonwebtoken');
var jobs = require('./cronJob.js');

var database = require('../database-mysql');
var db = require('../database-mysql/helpers/models.js');
//var requestHandler = require('./request-handler.js');

const PORT = process.env.PORT || 3000;
const TOKEN_SECRET = process.env.TOKEN_SECRET || 'superSecret';

var app = express();

app.use(express.static(__dirname + '/../react-client/dist'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

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
  res.json();
});

app.get('/goals/:username', function(req, res) {
  // Will fetch goals for the specific user
  db.getGoalsForUser(req.params.username, (results) => {
    res.json(results);
  });
});

app.get('/users/:username', function (req, res) {
  // Will fetch goals for the specific user
  db.getTwitterHandle(req.params.username, (results) => {
    res.json({twitter: results});
  });
});


/******* Handle POST requests ********/
app.post('/login', function(req, res) {
  // Will cross reference login credentials
  // with db to confirm or deny login
  db.getAndVerifyUser(req.body, function(results) {
    if ( results === true ) {
      req.session.user = req.body.username;
      res.status(200);

      //todo: function that checks for twitter token
      const payload = {
            username: req.body.username,
            twitterTokenPresent: false
      };
      
      var token = jwt.sign(payload, 'superSecret');

      // return the information including token as JSON
      res.json({
        token: token
      });
      

    } else {
      res.sendStatus(403);
    }
  }); 
});

app.post('/signup', function(req, res) {
  db.insertUserIntoDB(req.body, function(results) {
    if(!results) {
      res.sendStatus(409);
    } else {
      res.sendStatus(200);
    }
  });
});

app.post('/goals', function(req, res) {
  // Will add goals to user in database
  db.insertGoalsIntoDB(req.body, (results) => {
    console.log('SERVER', req.body);
    res.json({goalId: results.insertId});
  });
});

app.put('/goals', function(req, res) {
  if(req.body.action === 'increment') {
    db.incrementGoalCounter(req.body.goalId, (results) => {
      res.json(results);
    });
  } else if(req.body.action === 'delete') {
    db.deleteGoal(req.body.goalId, (results) => {
      res.json(results);
    });
  }
});

app.post('/jobs', function(req, res) {
  jobs.scheduleNotification(req.body);
  jobs.scheduleReminder(req.body.email);
  res.sendStatus(201);
});

app.post('/twitter/:username', function (req, res) {
  db.addTwitterHandle(req.body.twitter, req.params.username, (results) => {
    res.json(results);
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/../react-client/dist/index.html'));
});

app.listen(PORT, function() {
  console.log('listening on port PORT!');
});

