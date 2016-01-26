/* jshint node: true */  

// grabing the dependencies we need
var path = require('path');                // to create paths

//grabing all the models we need
var userModel = require('./models/UsersModel');
var movieModel = require('./models/MovieModel');

//grabbing all of our controllers
var checkForm = require('./controllers/checkForm');

// grabing the middleware we need
var fs = require('fs');						// to read Files
var bodyParser = require('body-parser');	// to parse req
var moment = require('moment');             // for date //date=moment().format('MMMM Do YYYY, h:mm:ss a');
var bcrypt = require('bcryptjs');			// to crypt password before puting them into DB
var nodemailer = require('nodemailer');		// to send emails
var crypto = require('crypto');				// to generate random strings
var chalk = require('chalk');               // to be able to style log info in the console
var multer = require('multer');				// for receiving multipart form
//var upload = multer({ dest: './public/ressources/poster'});

// to storage imgs
var posterPath;
var done = false;
var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './public/ressources/poster');
    },
    filename: function(req, file, cb){
        //        posterPath = file.path.substring(7);
        //        done = true;
        cb(null, moment().format('YYYY_MM_DD')+"_"+file.originalname);
    }
});

var upload = multer({storage: storage});


// for sending mails
var mailer = nodemailer.createTransport({
    service: "Gmail",
    auth:{
        user: "bennyp.dondiego@gmail.com",
        pass: "adminl3c"
    }
});

// log styles colors for console styling
var errorLog = chalk.bold.bgRed;
var successLog = chalk.bold.bgGreen;
var infoLog = chalk.bold.bgBlue.white;

module.exports = function(app){

    //for post request
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended : true}));

    // to store img in form (i.e poster)
    //    var done = false;
    //    var posterPath;
    //    app.use(multer({dest: './public/ressources/poster',
    //
    //                    rename: function(fieldname, filename, req, res){
    //                        return moment().format('YYYY_MM_DD')+"_"+filename;
    //                    },
    //                    onFileUploadStart: function(file, req, res){
    //                        console.log(infoLog(file.name + ' uploading . . .'));
    //                    },
    //                    onFileUploadComplete: function(file, req, res){
    //                        console.log(infoLog(file.name + ' successfully uploaded to :'+ file.path));
    //                        // to cut off the './public/' part
    //                        posterPath = file.path.substring(7);
    //                        done = true;
    //                    },
    //                    onError: function(error, next){
    //                        console.log(errorLog('Error! Uploading failed!'));
    //                        console.log(error);
    //
    //                        // poster par defaut s'il n'yen a pas
    //                        posterPath = "/ressources/poster/Poster404.jpg";
    //                        next(error);
    //                    }
    //                   }));

    //Suggestion page
    app.get('/suggestion', function(req,res){

        var sess = req.session;
        var response = {
            codeResponse: "",
            message: "",
            data: ""
        };

        if(typeof sess === "undefined"){

            response.codeResponse = "ko";
            response.message = "pas de session detectée, retour vers l'accueil";

            res.send(response);            

        }else{
            if(sess.email){

                var currentDate = moment().format('YYYY-MM-DD');

                movieModel.findOne({'suggestionDate':{ $lte : currentDate }},{},{sort:{suggestionDate:-1}},function(err,movie){
                    if(err){
                        console.log(errorLog('Error find!'));
                        throw err;
                    }
                    console.log(infoLog('\nSuggestion Loaded! Movie: '+ movie.title +'\n'));

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
                        duration = "Un film sans durée :O !";
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
                response.message = "Seul les membres connectés peuvent consulter les suggestions";

                res.send(response);
            }
        }
    });

    //get an older suggestion by its title
    app.get('/suggestion/:title', function(req, res){

        var response = {
            codeResponse: "",
            message: "",
            data: ""
        };

        var suggestionTitle = req.params.title;

        movieModel.findOne({'title': suggestionTitle},{}, function(err, movie){
            if(err){
                console.log(errorLog('ERROR RETREIVING SUGGESTION BY TITLE'));
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
                    duration = "Un film sans durée :O !";
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
                response.message = "pas de suggestion faite portant ce nom désolé";

                res.send(response);
            }
        });
    });


    //all the suggestions that were published prior the current date.
    app.get('/allSuggestions', function(req, res){

        var response = {
            codeResponse: "",
            message: ""
        };

        var session = req.session;

        if(session.email){
            var currentDate = moment();
            movieModel.find({'suggestionDate':{ $lte : currentDate }},{},{sort:{suggestionDate:1}},function(err, result){
                if(err){
                    console.log(errorLog('Error retreiving all the suggestions !!'));
                    throw err;
                }

                res.send(result);
            });
        }else{
            response.codeResponse = "ko";
            response.message = "Seul les membres connectés peuvent acceder aux suggestions passées.";

            res.send(response);
        }
    });


    //all the suggestions that were published prior the date passad as parameters
    app.get('/allSuggestions/:date', function(req, res){

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
                    console.log(errorLog('Error retreiving all the suggestions !!'));
                    throw err;
                }
                res.send(result);
            });
        }else{

            response.codeResponse = "ko";
            response.message = "Seul les membres connectés peuvent acceder aux suggestions passées.";

            res.send(response);
        }
    });

    app.get('/userInfo', function(req, res){

        var response = {
            codeResponse: "",
            message: ""
        };

        var session = req.session; 

        if(session.email){

            userModel.findOne({'email': session.email},{},{}, function(err, result){
                if(err){
                    console.log(errorLog('Error retreiving user info!!'));
                    throw err;
                }

                res.send(result);
            });

        }else{

            response.codeResponse = "ko";
            response.message = "Seul les membres connectés peuvent acceder à leurs informations";

            res.send(response);
        }
    });


    app.get('/member/:pseudo', function(req, res){

        var response = {
            codeResponse: "",
            message: ""
        };

        var pseudoMember = req.params.pseudo;
        userModel.findOne({'name': pseudoMember}, {}, function(err, member){

            if(err){
                console.error(errorLog('ERROR RETREIVING MEMBER'+ pseudoMember));
                throw err;
            }

            if(member === null){
                response.codeResponse = "ko";
                response.message = "Aucun membre du nom "+pseudoMember+" présent dans la base de données";

                res.send(response);
            }else{

                response.codeResponse = "ok";
                response.message = "";
                response.data = member;

                res.send(response);
            }
        });

    });

    /*
    // redefinePass
    app.get('/redefinePass:passKey',function(req,res){
        var tmp = req.params.passKey;
        var passKey = tmp.substring(1,tmp.length);
        var sess = req.session;

        userModel.findOne({"temporaryKey":passKey},{},function(err,user){
            if(err){
                console.log(errorLog('redefinePass : Error findOne!'));
                throw err;
            }
            if(user === null){
                console.log('ReedfinePass: Utilisateur non trouvé!');
            }

            sess.email = user.email;

            var html;
            fs.readFile(__dirname+"/html/redefinePass.html","utf8",function(err,data){
                if(err){
                    console.log(errorLog('redefinePass: error readfile'));
                    throw err;
                }
                html = data;

                res.charset='utf-8';
                res.setHeader("Access-Control-Allows-Origin","*");
                res.send(html);

            });
        });
    });
    */

    // logout
    app.get('/logout', function(req,res){
        req.session.destroy(function(err){
            if(err){
                console.log(errorLog('Error logging out!'));
                console.log(err);
                throw err;
            }
            res.send("ok");
        });
        /*
        req.logout();
        res.redirect('/');
        */
    });


    //posting content to DB
    app.post('/postContent', upload.single('poster'), function(req,res){
        console.log(infoLog('posting content...\n'));


        console.log('req.body');
        console.log(req.body);
//        console.log('req.title');
//        console.log(req.title);
//        console.log('files');
//        console.log(req.file);
//        console.log('req.suggestionData');
//        console.log(req.suggestionData);
//        console.log('req.data');
//        console.log(req.data);
//        console.log('req');
//        console.log(req);

        // to recollect all the data and put them in the body
        req.body = req.body.suggestionData;

        var title,director,actors,genre,duration,synopsis,why,publicationDate,trailer;	   // le poster est géré par multer. On rajoute juste le chemin du poster à la base(cf posterPath)

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

            if(done){										//used with multer to notify the upload success
                console.log(successLog("uploading files complete!"));
            }

            var movie = new movieModel(movieSchema);

            movie.save(function(err,data){
                if(err){
                    console.log(errorLog('Error saving movie!'));
                    throw err;
                }
                console.log(successLog('movie added!\n'));
                res.send(response);
            });
        }
    });

    // Adding new member into DB
    app.post('/newMember', function(req,res){
        console.log(infoLog('Adding new member...'));

        var pseudo,mail,password,genre,description,response;

        checkForm.checkFormMember(req, function(err, response) {

            if(err){
                console.log(errorLog('ERROR CHECKING FORM MEMBER!!!!'));
                throw err;
            }

            if(response.codeResponse === "ko"){
                console.log(errorLog("Adding newMember failed! form wasn't valid."));
                res.send(response);
            }else{
                pseudo = req.body.pseudo;
                mail = req.body.mail;
                var salt = bcrypt.genSaltSync(10);
                password = bcrypt.hashSync(req.body.password,salt);

                genre =[];
                genre.push(req.body.genre1);

                if(req.body.genre2 !== undefined){
                    genre.push(req.body.genre2);
                }
                if(req.body.genre3 !== undefined){
                    genre.push(req.body.genre3);
                }

                if(req.body.description !== undefined){
                    description = req.body.description;
                }else{
                    description = pseudo +" est encore un peu timide.. Souhaitez lui la bienvenue ! ";
                }

                var user = {
                    "name":pseudo,
                    "email":mail,
                    "password":password,
                    "isAdmin":false,
                    "description":description,
                    "genre":genre
                };

                user = new userModel(user);
                user.save(function(err,member){
                    if(err){
                        console.log(errorLog('Error saving new member!!'));
                        throw err;
                    }
                    console.log(successLog('New member '+user.name+' added!!'));
                    console.log(user);

                    //                    fs.readFile(__dirname+'../../public/views/mail/welcome.html','utf8',function(err,data){
                    fs.readFile(path.join(__dirname, '../../public/views/mail/welcome.html'),'utf8',function(err,data){
                        if(err){
                            console.log(errorLog('Welcome mail not found!'));
                            throw err;
                        }

                        mailer.sendMail({
                            from:"Admin L3C <bennyp.dondiego@gmail.com>",
                            to:mail,
                            subject:"Bienvenue au sein du L3C!",
                            html: data

                        },function(err,mail){
                            if(err){
                                console.log(errorLog("\nNew member: Error Sending mail!"));
                                throw err;
                            }
                            console.log(successLog('\nMessage successfully sent! Message:'+ mail.response));
                        });
                    });

                    res.send(response);
                });
            }
        });
    });

    /*
    // Adding new poster for the carousel
    app.post('/postCarousel', function(req,res){
        console.log('\nAdding new movie poster to the carousel');
        console.log(req.headers['content-type']);
        console.log(testPoster);
        console.log(testFieldname);
        /*
    console.log("reqbody*************");
	console.log(req.body);
	console.log("req ****************");
	console.log(req);
    */
    /*
	console.log(req.files);
	console.log(req.body.form_id);
	console.log('film1'+req.body.film1);
	*/

    /*var response = checkFormCarousel(req);
	if(response.codeResponse =="ko"){
		console.log('Error! Invalid form.');
		res.send(response.message);
	}else{
		console.log("\nSuccess! All movies correctly added into Server.");
		res.send("Success! All movies correctly added into Server.");
	};
        //console.log("\nSuccess! All movies correctly added into Server.");
        //res.send("Success! All movies correctly added into Server.");
        res.send('Still testing... poster: '+testPoster+', fieldname: ' +testFieldname);

    });
    */

    // Post loggin page
    app.post('/loginConnection', function(req,res){

        var response = {
            codeResponse:"",
            message:"",
            isAdmin:""
        };

        userModel.findOne({"email":req.body.email},{},function(err,user){
            if(err){
                console.log(errorLog('Error login! User not found!'));
                throw err;
            }

            if(user === null || !bcrypt.compareSync(req.body.password, user.password)){

                response.codeResponse = "ko";
                response.message="Email ou Mot de Passe incorrect!";
                response.isAdmin = "";

                res.send(response);
            }else{
                var sess = req.session;
                console.log(user);

                /*if(user.isAdmin !== true){
                    sess.email = user.email;
                    sess.name = user.name;
                    sess.isAdmin = user.isAdmin;
                    //rajout dans la sessions des autres attributs d'un membre possible ici.

                    response.codeResponse = "ok";
                    response.message = "Bienvenue "+user.name+" !";
                    res.send(response);
                }else{

                    sess.email = user.email;
                    sess.name = user.name;
                    sess.isAdmin = user.isAdmin;

                    response.codeResponse = "ok";
                    response.isAdmin = user.isAdmin;

                    res.send(response);
                }*/

                sess.email = user.email;
                sess.name = user.name;
                sess.isAdmin = user.isAdmin;

                req.session = sess;

                response.codeResponse = "ok";
                response.message = "Bienvenue "+user.name+" !";
                response.isAdmin = sess.isAdmin;
                res.send(response);

            }
        });
    });
    /*
    //updateMdp
    app.post('/updatePass', function(req,res){
        var email,response, salt;
        var sess = req.session;

        email = sess.email;
        salt = bcrypt.genSaltSync(10);

        response = {
            codeResponse: "",
            message: ""
        };

        if(req.body.pass != req.body.confirmation){
            response.codeResponse = "ko";
            response.message="Le mot de passe et la confirmation doivent être identiques!";
            res.send(response);
        }
        if(req.body.pass.length < 6){
            response.codeResponse = "ko";
            response.message="Le mot de passe doit faire plus de 6 caracteres!";
            res.send(response);
        }
        // crypt pass
        userModel.findOneAndUpdate({"email":email},{"temporaryKey":null, "password":bcrypt.hashSync(req.body.pass,salt)},{},function(err, user){
            if(err){
                console.log(errorLog('UpdateMdp : Error findOne'));
                throw err;
            }
            response.codeResponse = "ok";
            response.message ="message correctement changé.";
            res.send(response);
        });
    });

    // ChangeMDP
    app.post('/changeMdp', function(req,res){
        var response = checkFormMdp(req);
        var sess = req.session;

        if(response.codeResponse === "ok"){
            userModel.findOne({"email":sess.email},{},function(err,user){
                if(err){
                    console.log(errorLog('Error login! User not found!'));
                    throw err;
                }
                if(user === null || !bcrypt.compareSync(req.body.oldMdp, user.password)){

                    response.codeResponse = "ko";
                    response.message="L'ANCIEN Mot de Passe n'est pas correct!";
                    response.isAdmin = "";

                    console.log('old mdp invalid');
                    res.send(response);
                }else{
                    var salt = bcrypt.genSaltSync(10);
                    userModel.findOneAndUpdate({email: sess.email},{password: bcrypt.hashSync(req.body.password,salt)},{}, function(err,user){
                        if(err){
                            console.log(errorLog('ChangeMdp: Error modify password!'));
                            throw err;
                        }
                        console.log('\nChangePass: Password successfully changed!');
                        res.send(response);
                    });
                }
            });
        }else{
            console.log('\nChangePass: new & confirm not equals');
            res.send(response);
        }
    });

    // forgottenPass
    app.post('/forgottenPass', function(req,res){
        var tmpPass, userEmail, response, mail, salt;

        try {
            tmpPass = crypto.randomBytes(15).toString('hex');

        }catch(ex){
            console.log(errorLog('forgottenPass : Error generating random string'));
            throw ex;
        }
        console.log(tmpPass);

        userEmail = req.body.email;
        salt = bcrypt.genSaltSync(10);

        response = {
            codeResponse :"",
            message :""
        };

        // userModel.findOneAndUpdate({email: userEmail},{password: bcrypt.hashSync(tmpPass,salt)},{}, function(err,user){
        userModel.findOneAndUpdate({email: userEmail},{temporaryKey: tmpPass},{}, function(err,user){
            if(err){
                console.log(errorLog('ForgottenPass : error searching user.'));
                throw err;
            }
            if(user === null){
                console.log('ForgottenPass : no user found');
                response.codeResponse = "ko";
                response.message = "Adresse mail non trouvé!";
                res.send(response);
            }else{
                mail = user.email;

                fs.readFile(__dirname+'/html/mail/redefinePass.html','utf8',function(err,data){
                    if(err){
                        console.log(errorLog('Pasword mail not found!'));
                        throw err;
                    }

                    var htmlContent = data.replace('%%MDPRandom%%', '<a href="http://localhost:7777/redefinePass:'+tmpPass+'">http://localhost:7777/redefinePass:'+tmpPass+'</a>');

                    mailer.sendMail({
                        from:"Admin L3C <bennyp.dondiego@gmail.com>",
                        to:mail,
                        subject:"Mot de passe oublié",
                        html: htmlContent

                    },function(err,mail){
                        if(err){
                            console.log(errorLog("\nNew member: Error Sending mail!"));
                            throw err;
                        }
                        console.log('\nMessage successfully sent! Message:'+ mail.response);
                        response.codeResponse = "ok";
                        response.message = "Un mail de redéfinition de votre mot de passe vous a été envoyé";
                        res.send(response);
                    });
                });
            }
        });
    });

    // adminManagement
    app.post('/adminManagement', function(req,res){

        userModel.findOne({"name":req.body.pseudo},{}, function(err, user){
            if(err){
                console.log(errorLog('adminManagement : error finding membre'));
                throw err;
            }

            var response = {
                codeResponse :"",
                message :""
            };

            if(user === null){
                response.codeResponse = "ko";
                response.message = "Membre non trouvé!";

                res.send(response);
            }else{

                response.pseudo = user.name;
                response.email = user.email;
                response.date = moment(user.date).format('DD-MM-YYYY');
                response.genre = "";
                for(var i = 0; i < user.genre.length ; i++){
                    response.genre += user.genre[i]+", ";
                }
                response.description = user.description;

                res.send(response);
            }
        });
    });

    // electAdmin
    app.post('/electAdmin', function(req,res){
        userModel.findOneAndUpdate({name:req.body.pseudo},{isAdmin:true},{}, function(err, user){
            if(err){
                console.log(errorLog('adminManagement : error finding membre'));
                throw err;
            }

            var response = {
                codeResponse :"",
                message :""
            };
            console.log(req.body);

            if(user === null){
                response.codeResponse = "ko";
                response.message = "Membre non trouvé!";

                res.send(response);
            }else{
                console.log('\nElectAdmin : '+req.body.pseudo+'is now an admin!');
                response.codeResponse = "ok";
                response.message = req.body.pseudo+' is now an admin!';

                res.send(response);
            }
        });
    });
    */
    // whatsMyName
    app.get('/whatsMyName', function(req,res){
        var sess = req.session;
        console.log('Session asked : ');
        console.log(sess);
        res.send(sess);
    });



    // for frontend routes, to handle all angular routes
    app.get('*', function(req, res){
        console.log('* loaded');
        res.sendFile(path.join(__dirname, '../public/views', 'index.html'));
    });

};