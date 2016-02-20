/* jshint node: true */

var chalk = require('chalk');               // to be able to style log info in the console

// log styles colors for console styling
var errorLog = chalk.bold.bgRed;
var successLog = chalk.bold.bgGreen;
var infoLog = chalk.bold.bgBlue.white;

exports.logError = function(message){
    console.log(errorLog(message));
};

exports.logSuccess = function(message){
    console.log(successLog(message));  
};

exports.logInfo = function(message){
    console.log(infoLog(message));  
};