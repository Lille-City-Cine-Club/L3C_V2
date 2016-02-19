/* jshint node: true */  
module.exports = function(app){

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
    var storage = multer.diskStorage({
        destination: function(req, file, cb){
            cb(null, './public/ressources/poster');
        },
        filename: function(req, file, cb){
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

    //for post request
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended : true}));


    /* ---------------------------------- Suggestions routes ---------------------------------------- */
    var suggestions = require('./controllers/suggestions');

    app.get('/suggestion', suggestions.currentSuggestion);
    app.get('/suggestion/:title', suggestions.suggestionByTitle);
    app.get('/allSuggestions', suggestions.allSuggestions);
    app.get('/allSuggestions/:date', suggestions.allSuggestionsDate);

    app.post('/postContent', upload.single('poster'), suggestions.postSuggestion); 

    /* ------------------------------------- Members routes ----------------------------------------- */
    var members = require('./controllers/members');

    app.get('/userInfo', members.userInfo);
    app.get('/member/:pseudo', members.memberByPseudo);
    app.get('/logout', members.logout);

    app.post('/newMember', members.signin);
    app.post('/loginConnection', members.login);


    /*-------------------------------------- Generic routes ----------------------------------------- */
    // whatsMyName, send session info
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
                console.log('ReedfinePass: Utilisateur non trouv&eacute;!');
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
            response.message ="message correctement chang&eacute;.";
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
                response.message = "Adresse mail non trouv&eacute;!";
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
                        subject:"Mot de passe oubli&eacute;",
                        html: htmlContent

                    },function(err,mail){
                        if(err){
                            console.log(errorLog("\nNew member: Error Sending mail!"));
                            throw err;
                        }
                        console.log('\nMessage successfully sent! Message:'+ mail.response);
                        response.codeResponse = "ok";
                        response.message = "Un mail de red&eacute;finition de votre mot de passe vous a &eacute;t&eacute; envoy&eacute;";
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
                response.message = "Membre non trouv&eacute;!";

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
                response.message = "Membre non trouv&eacute;!";

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
};