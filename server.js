const express = require("express");
var app = express();
var passport = require('passport');
var session = require('express-session');
var bodyParser = require('body-parser');
var env = require('dotenv').load();

const routes = require("./routes");

const PORT = process.env.PORT || 3001;

var db = require("./models");
// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}
// Add routes, both API and view
app.use(routes);

// For Passport authentication through Express-Session
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true })); // session secret
// Initialize Passport to use on the app
app.use(passport.initialize());
// Persistent login sessions
app.use(passport.session());
// Load passport strategies
require("./config/passport/passport.js")(passport, db.Auth);


// Syncing our sequelize models and then starting our Express app
db.sequelize.sync({ force: true }).then(function () { // Set to false after Auth table is initially made post deployment
  app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
  });
});