// L3C_V2 server code
// Version: 1.0.0
// Author : Sufiane 'DonDiego' Souissi
//			Benjamin 'BennyP' Parant

/* jshint node: true */                     // to disable warning with node

var express = require('express');			// main FW
var bodyParser = require('body-parser');	// to parse req
var fs = require('fs');						// to read Files
var mongoose = require('mongoose');			// for DB
var moment = require('moment'); 			// for date //date=moment().format('MMMM Do YYYY, h:mm:ss a');
var multer = require('multer');				// for receiving multipart form
var session = require('express-session');	// to handle session storage
var bcrypt = require('bcryptjs');			// to crypt password before puting them into DB
var nodemailer = require('nodemailer');		// to send emails
var chance = require('chance').Chance();	// to generate random number/strings
var crypto = require('crypto');				// to generate random strings
var async = require('async');				// to be able to make async work even easier/better
var chalk = require('chalk');               // to be able to style log info in the console
var app = express();

// for the session
app.use(session({secret:'Hercules Project'}));


//for post request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

// to render statics files (i.e: img, html etc...)
app.use(express.static(__dirname + '/public'));

app.set('port', (process.env.PORT || 7777));


// log styles colors for console styling
var errorLog = chalk.bold.bgRed;
var successLog = chalk.bold.bgGreen;


// to store img in form (i.e poster)
var done = false;
var posterPath;
app.use(multer({dest: './public/ressources/poster',

                rename: function(fieldname, filename, req, res){
                    // return  fieldname.startsWith("film") ? fieldname : moment().format('YYYY_MM_DD')+'_'+filename ;
                    /*
                    console.log('JE SUIS DANS MULTER MOTHERFUCKEEEEERRRRRRRR!!!!');
                    console.log(fieldname.startsWith("film"));
					if( fieldname.startsWith("film")){
                        console.log("poster");
                        console.log(poster);
                        testPoster = poster;
                        console.log("fieldname");
                        console.log(fieldname);
                        testFieldname = fieldname;
						console.log('je suis dans film');
						return fieldname;
					}else{
						console.log('kdjhflkdhfjdhfjdfkjh');
						return moment().format('YYYY_MM_DD')+'_'+filename;
					}
                    */
                    /*
                    // remplacement de startsWith car pas encore actif(waiting for ECMAS 6)
                    if(fieldname.indexOf("film") === 0){
                        testPoster = "changed!";
                        testFieldname = "changed!";
                        return fieldname;
                    }else{
                        // pourque l'upload fonctionne sans le if.
                        return moment().format('YYYY_MM_DD')+"_"+filename;   
                    }
                    */

                    // pourque l'upload fonctionne sans le if.
                    return moment().format('YYYY_MM_DD')+"_"+filename;

                },
                onFileUploadStart: function(file, req, res){
                    console.log(file.name + ' uploading . . .');
                },
                onFileUploadComplete: function(file, req, res){
                    console.log(file.name + ' successfully uploaded to :'+ file.path);
                    posterPath = file.path;
                    done=true;
                },
                onError: function(error, next){
                    console.log('Error! Uploading failed! ');
                    console.log(error);
                    next(error);
                }
               }));

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