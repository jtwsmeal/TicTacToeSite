const http = require('http');
const fs = require('fs');
const express = require('express');
const engines = require('consolidate');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoClient = require('mongodb').MongoClient;

var app = express();


app.use(session({
    secret: 'keyboard-cat',
    resave: true,
    saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/static'));


app.set('views', __dirname + '/static');
app.engine('html', engines.mustache);
app.set('view engine', 'html');


app.get('/', function(req, res) {
	res.render('index.html');
});

app.post('/', function (req, res) {

	// Connect to the database.
	MongoClient.connect("mongodb://localhost:27017/users", function(err, db) {
		if (!err) {
			console.log("We are connected to the database.");
			var users = db.collection("users");
			var username = req.body.username;
			var password = req.body.password;

			users.findOne({"username": username, "password": password}, function(err, item) {
			    if (item) {
			    	console.log("User " + username + " " + password + " just logged in.");

					req.session.user_id = username + "_" + password;

					res.redirect("/ticTacToe");
				} else {
					console.log("Incorrect username or password!")
					res.redirect("/");
					// Show warning to client.
				}
			});

			db.close();
		} else {
			console.log("We are not connected to the database.");
		}
	});
});

// ******************************

app.get('/signup', function(req, res) {
	res.render('signup/signup.html');
});

app.post('/signup', function(req, res) {
	// Connect to the database.
	MongoClient.connect("mongodb://localhost:27017/users", function(err, db) {
		if (!err) {
			console.log("We are connected to the database.");
			var users = db.collection("users");
			var username = req.body.username;
			var password = req.body.password;

			users.findOne({"username": username}, function(err, item) {
			    if (item) {  // Username is taken already.
			    	// Show warning to user.
			    	res.redirect("/signup");
				} else {  // Username is new to the system.
					console.log("New user:  " + username + ", " + password);
					users.insert({
						username: username,
						password: password
					}, function(result, err) {
						db.close();
					});

					req.session.user_id = username + "_" + password;

					res.redirect("/ticTacToe");
				}
			});
		} else {
			console.log("We are not connected to the database.");
		}
	});
});

// ******************************

app.get("/ticTacToe", checkAuthentication, function(req, res) {
	// res.render("index.html");
	console.log("Going to Tic Tac Toe page.");
	res.render("TicTacToeAngular/index.html");
});

// ******************************

app.post('/goToSignup', function (req, res) {
	console.log("Going to the signup page");
   	res.redirect('/signup');
});

// ******************************

app.get("/logout", function(req, res) {
	delete req.session.user_id;
	res.redirect('/');
});

app.post('/logout', function (req, res) {
	console.log("Logging out.");
   	res.redirect('/logout');
});

// ******************************

function checkAuthentication(req, res, next) {
  if (!req.session.user_id) {
    res.send('You must be logged in to see this page.');
  } else {
  	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
  }
}

// ******************************

app.listen(8080, function() {
	console.log("Listening on port 8080");
});