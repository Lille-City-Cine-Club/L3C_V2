/* jshint node: true */                     // to disable warning with node

//grabing all the models we need
var userModel = require('../models/UsersModel');
var movieModel = require('../models/MovieModel');


// CheckForm for inscription
var checkFormMember = function(req, cb){
    var response = {
        codeResponse:"",
        message:""
    };

    userModel.findOne({"email": req.body.mail},{},function(err, user){
        if(err){
            console.log('checkMemberForm: error findOne');
            cb( err );
        }
        if(user === null){
            var list =['pseudo', 'mail', 'password', 'genre1'];
            for( var k in  list){
                var key = list[k];

                if ( !checkRequired(req.body, key, cb) ) return;
            }
            if(req.body.password != req.body.confirmPass){
                response.codeResponse = "ko";
                response.message = "Les champs MOT DE PASSE et CONFIRMATION doivent être IDENTIQUES !";
                cb( null, response );
                return ;
            }
            console.log('email non trouvé');
            response.codeResponse = "ok";
            response.message = "New member added! Welcome "+req.body.pseudo+" !";
            cb ( null, response );

        }else{
            console.log('email trouvé!');
            response.codeResponse = "ko";
            response.message = "L'adresse email est deja utilisée.";
            cb( null, response);
        }
    });
};


function checkRequired( arr, key, cb ) {

    var cptLengthRequired = 0;

    if ( arr[ key ] === "" || arr[ key ] === null || typeof(arr[key]) === "undefined" ) {
        cb(null, {
            codeResponse : "ko",
            message : "Le champ "+key+" doit au moins être complété !"
        });
       
        return false;
    }
    var password = arr[key];

    if(key === "password" && password.length<6){
        cb(null, {
            codeResponse : "ko",
            message : "Le mot de passe doit contenir 6 caractères minimum"
        });
        return false;
    }
    return true;
}

module.exports.checkFormMember = checkFormMember;
module.exports.checkRquired = checkRequired;