/* jshint node : true */

// our movie model
var userModel = require('../models/UsersModel');

var checkForm = require('../controllers/checkForm'); // form verifications

//grabing all the dependencies we need
var fs = require('fs');                     // to read Files
var path = require('path');                 // to create paths
var moment = require('moment');             // for date //date=moment().format('MMMM Do YYYY, h:mm:ss a');
var chalk = require('chalk');               // to be able to style log info in the console
var bcrypt = require('bcryptjs');			// to crypt password before puting them into DB
var nodemailer = require('nodemailer');		// to send emails


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

//get current user infos
exports.userInfo = function(req, res){

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
        response.message = "Seul les membres connect&eacute;s peuvent acceder à leurs informations";

        res.send(response);
    }
};


// get the infos of the member wanted
exports.memberByPseudo = function(req, res){

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
            response.message = "Aucun membre du nom "+pseudoMember+" pr&eacute;sent dans la base de donn&eacute;es";

            res.send(response);
        }else{

            response.codeResponse = "ok";
            response.message = "";
            response.data = member;

            res.send(response);
        }
    });
};

// signin (i.e: adding new member into DB)
exports.signin = function(req, res){
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
};

//login
exports.login = function(req, res){

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
};

//logout
exports.logout = function(req, res){
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
};