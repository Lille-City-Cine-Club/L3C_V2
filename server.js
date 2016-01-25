// L3C_V2 server code
// Version: 1.0.0
// Author : Sufiane 'DonDiego' Souissi
//			Benjamin 'BennyP' Parant

/* jshint node: true */                     // to disable warning with node

var express = require('express');			// main FW
var bodyParser = require('body-parser');	// to parse req
var fs = require('fs');						// to read Files
var mongoose = require('mongoose');			// for DB
var session = require('express-session');	// to handle session storage
var chalk = require('chalk');               // to be able to style log info in the console
var path = require('path');                 // to create paths
var app = express();

// for the session
app.use(session({secret:'Hercules Project'}));

////for post request
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended : true}));

// to render statics files (i.e: img, html etc...)
app.use(express.static(path.join(__dirname,'/public')));

app.set('port', (process.env.PORT || 7777));


// log styles colors for console styling
var errorLog = chalk.bold.bgRed;
var successLog = chalk.bold.bgGreen;


/* ---------------------------------------------- Routes ---------------------------------------- */

require('./app/routes')(app);

/* ---------------------------------------------- Start ----------------------------------------- */

console.log("L3C web server starting . . .\n");

/* ----------- Database connection ---------------- */
var db = require('./config/db');

mongoose.connect(db.url);

var dbConnection = mongoose.connection;

dbConnection.on('error',function(err){
    console.log(errorLog("Error connecting to DB ! Check your network and restart the server."));
    console.info(err);
    throw err;
});

dbConnection.once('connected', function(){
    console.log(successLog('Successfully connected to DataBase'));
    /* ----------- Starting --------------------------- */
    app.listen(app.get('port'), function() {
        console.log(successLog("\nCity Ciné Club, a.k.a CCC, Web Server!\nListening on : "+ app.get('port')+" \n"));
    });

});

// exposing the app
exports = module.exports = app;