/* jshint node : true */

// our movie model
var movieModel = require('../models/MovieModel');

var checkForm = require('../controllers/checkForm'); // form verifications

//grabing all the dependencies we need
var moment = require('moment');
var logger = require('../../config/logger');

// get the current suggestion
exports.currentSuggestion = function(req, res){

    var sess = req.session;
    var response = {
        codeResponse: "",
        message: "",
        data: ""
    };

    if(typeof sess === "undefined"){

        response.codeResponse = "ko";
        response.message = "pas de session detect&eacute;e, retour vers l'accueil";

        res.send(response);            

    }else{
        if(sess.email){

            var currentDate = moment().format('YYYY-MM-DD');

            movieModel.findOne({'suggestionDate':{ $lte : currentDate }},{},{sort:{suggestionDate:-1}},function(err,movie){
                if(err){
                    logger.logError('Error find current suggestion');
                    throw err;
                }
                logger.logInfo('\nSuggestion Loaded! Movie: '+ movie.title +'\n');

                // disable "actors1, undefined ..."
                var actors = "";
                for(var i = 0; i<movie.actors.length ; i++){
                    actors += movie.actors[i]+', ';
                }
                // Disable the 'undefined' genre when a movie have less than 3 genre.
                var genre = "";
                genre += movie.genre[0];
                if (typeof movie.genre[1] !== 'undefined'){
                    genre +=", "+movie.genre[1];
                }
                if(typeof movie.genre[2] !== 'undefined'){
                    genre +=", "+movie.genre[2];
                }

                var duration;
                if( typeof movie.duration === 'undefined'){
                    duration = "Un film sans dur&eacute;e :O !";
                }else{
                    duration = movie.duration;
                }

                var movieResult = {
                    title : movie.title,
                    actors : actors,
                    director : movie.director,
                    genre : genre,
                    duration : duration,
                    synopsis : movie.synopsis,
                    why : movie.why,
                    poster : movie.poster,
                    trailer : movie.trailer,
                    publicationDate : moment(movie.suggestionDate).format("YYYY-MM-DD")
                };

                response.codeResponse = "ok";
                response.message = "suggestion correctly retreived from DB";
                response.data = movieResult;

                res.send(response);
            });

        }else{

            response.codeResponse = "ko";
            response.message = "Seul les membres connect&eacute;s peuvent consulter les suggestions";

            res.send(response);
        }
    }
};


// get a suggestion by its title
exports.suggestionByTitle = function(req, res){

    var response = {
        codeResponse: "",
        message: "",
        data: ""
    };

    var suggestionTitle = req.params.title;

    movieModel.findOne({'title': suggestionTitle},{}, function(err, movie){
        if(err){
            logger.logError('ERROR RETREIVING SUGGESTION BY TITLE');
            throw err;
        }
        if(movie){
            // disable "actors1, undefined ..."
            var actors = "";
            for(var i = 0; i<movie.actors.length ; i++){
                actors += movie.actors[i]+', ';
            }
            // Disable the 'undefined' genre when a movie have less than 3 genre.
            var genre ="";
            genre += movie.genre[0];
            if (typeof movie.genre[1] !== 'undefined'){
                genre +=", "+movie.genre[1];
            }
            if(typeof movie.genre[2] !== 'undefined'){
                genre +=", "+movie.genre[2];
            }

            var duration;
            if( typeof movie.duration === 'undefined'){
                duration = "Un film sans dur&eacute;e :O !";
            }else{
                duration = movie.duration;
            }

            var movieResult = {
                title : movie.title,
                actors : actors,
                director : movie.director,
                genre : genre,
                duration : duration,
                synopsis : movie.synopsis,
                why : movie.why,
                poster : movie.poster,
                trailer : movie.trailer,
                publicationDate : moment(movie.suggestionDate, "YYYY-MM-DD")
            };

            response.codeResponse = "ok";
            response.message = "suggestion correctly retreived from DB";
            response.data = movieResult;

            res.send(response);

        }else{

            response.codeResponse = "ko";
            response.message = "pas de suggestion faite portant ce nom d&eacute;sol&eacute;";

            res.send(response);
        }
    });
};

// get all the suggestion made prior the current date
exports.allSuggestions = function(req, res){

    var response = {
        codeResponse: "",
        message: ""
    };

    var session = req.session;

    if(session.email){
        var currentDate = moment();
        movieModel.find({'suggestionDate':{ $lte : currentDate }},{},{sort:{suggestionDate:1}},function(err, result){
            if(err){
                logger.logError('Error retreiving all the suggestions !!');
                throw err;
            }

            res.send(result);
        });
    }else{
        response.codeResponse = "ko";
        response.message = "Seul les membres connect&eacute;s peuvent acceder aux suggestions pass&eacute;es.";

        res.send(response);
    }
};

// get all the suggestions made prior the date params
exports.allSuggestionsDate = function(req, res){

    var response = {
        codeResponse: "",
        message: ""
    };

    var session = req.session;

    if(session.email){

        var date = req.params.date;
        var currentDate = moment(date);
        movieModel.find({'suggestionDate':{ $lte : currentDate }},{},{sort:{suggestionDate:1}},function(err, result){
            if(err){
                logger.logError('Error retreiving all the suggestions by date !!');
                throw err;
            }
            res.send(result);
        });
    }else{

        response.codeResponse = "ko";
        response.message = "Seul les membres connect&eacute;s peuvent acceder aux suggestions pass&eacute;es.";

        res.send(response);
    }
};

// Adding a new suggestion into DB
exports.postSuggestion = function(req, res){
    logger.logInfo('posting content...\n');

    // to recollect all the data and put them in the body
    req.body = req.body.suggestionData;

    var title,director,actors,genre,duration,synopsis,why,publicationDate,trailer, posterPath;	   

    var response = checkForm.checkFormFilm(req);					          // verification du formulaire
    if(response.codeResponse === "ko"){
        res.send(response);
    }else{

        title = req.body.title;
        director = req.body.director;

        actors = req.body.actors.split(', '); 		// transformation of string to array, parsing to ', '

        genre = []; 								// creating an array of genre
        genre.push(req.body.genre1);

        // Allow a movie to have less than 3 genre
        if(typeof req.body.genre2 !== 'undefined'){
            genre.push(req.body.genre2);
        }
        if(typeof req.body.genre3 !== 'undefined'){
            genre.push(req.body.genre3);
        }
        duration = req.body.duration;
        synopsis = req.body.synopsis;
        why = req.body.why;
        publicationDate = req.body.suggestionDate;
        trailer = req.body.trailer;
        posterPath = req.file.path.substring(7);    // need the substring part to cut off 'public' from the path 

        console.log('title: '+title+'\n genre: '+genre+'\n duration: '+duration+'\n director: '+director+'\n actors: '+actors+'\n synopsis: '+synopsis+'\n poster:'+posterPath+'\n why:'+why+'\n plublication date:'+publicationDate +'\n trailer: '+trailer);

        var movieSchema = {
            "title":title,
            "director":director,
            "actors":actors,
            "genre":genre,
            "synopsis":synopsis,
            "poster":posterPath,
            "duration":duration,
            "why":why,
            "suggestionDate":publicationDate,
            "trailer":trailer
        };

        var movie = new movieModel(movieSchema);

        movie.save(function(err,data){
            if(err){
                logger.logError('Error saving movie!');
                throw err;
            }
            logger.logSuccess('movie added!\n');
            res.send(response);
        });
    }
};