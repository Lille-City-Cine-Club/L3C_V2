/* jshint node: true */

var  mongoose = require('mongoose');

var Schema = mongoose.Schema;

//schema definition
var movieSchema = new Schema({
	title: String,
	director: String,
	actors: [String],
	genre: [String],
	synopsis: String,
	poster: String,
	duration: String,
	why: String,
	date: {type:Date, default:Date.now},
	suggestionDate : Date
});

var movieModel;

module.exports = mongoose.model('Movie', movieSchema,'Movie');