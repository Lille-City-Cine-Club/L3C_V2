/* jshint node: true */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
	name: String,
	email: String,
	password: String,
	isAdmin:{type: Boolean, default: false},
	description:String,
	genre:[String],
	date:{type:Date, default:Date.now},
	temporaryKey:String
});


var userModel;

module.exports = mongoose.model('Users', userSchema, 'Users');