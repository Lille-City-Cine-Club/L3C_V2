var app = angular.module('L3C_V2',["ngRoute", 'ngFileUpload', 'ui.bootstrap']);

app.config(function($routeProvider){

    $routeProvider
        .when('/',{
        templateUrl: "/views/home.html",
        controller: "HomeController"
    })
        .when('/suggestion',{
        templateUrl: "/views/suggestion.html",
        controller: "SuggestionController",
        resolve:{
            "checkSession": function($location, SessionService){
                console.log('vérification depuis suggestion');
                SessionService.getCurrentSession().then(function(session){
                    if(!session.data.email){
                        $location.path('/login');
                    }                           
                });
            }
        }
    })
        .when('/suggestion/:title', {
        templateUrl: "/views/suggestion.html",
        controller: "SuggestionByTitleController",
        resolve:{
            "checkSession": function($location, SessionService){
                SessionService.getCurrentSession().then(function(session){
                    if(!session.data.email){
                        $location.path('/login');
                    }                                     
                });
            }
        }
    })
        .when('/allSuggestion',{
        templateUrl: "views/allSuggestion.html",
        controller: "AllSuggestionController",
        resolve:{
            "checkSession": function($location, SessionService){
                SessionService.getCurrentSession().then(function(session){
                    if(!session.data.email){
                        $location.path('/');
                    }                                     
                });
            }
        }
    })
        .when('/allSuggestion/:date', {
        templateUrl: "/views/allSuggestion.html",
        controller: "AllSuggestionController",
        resolve:{
            "checkSession": function($location, SessionService){
                SessionService.getCurrentSession().then(function(session){
                    if(!session.data.email){
                        $location.path('/');
                    }                                     
                });
            }
        }
    })
        .when('/newSuggestion', {
        templateUrl: "/views/newSuggestion.html",
        controller: "NewSuggestionController",
        resolve:{
            "checkSession":function($location, SessionService){
                SessionService.getCurrentSession().then(function(session){
                    if(!session.data.isAdmin){
                        $location.path('/404');
                    }                                     
                });
            }
        }
    })
        .when('/modifSuggestion', {
        templateUrl: "/views/newSuggestion.html",
        controller: "ModifSuggestionController",
        resolve: {
            "checkSession":function($location, SessionService){
                SessionService.getCurrentSession().then(function(session){
                   if(!session.data.isAdmin){
                       $location.path('/404');
                   } 
                });
            }
        }
    })
        .when('/inscription',{
        templateUrl: "/views/inscription.html",
        controller: "InscriptionController",
        resolve:{
            "checkSession": function($location, SessionService){
                SessionService.getCurrentSession().then(function(session){
                    if(session.data.email){
                        $location.path('/dashboard');
                    }                                     
                });
            }
        }
    })
        .when('/login',{
        templateUrl: "views/login.html",
        controller: "LoginController",
        resolve:{
            "checkSession": function($location, SessionService){
                SessionService.getCurrentSession().then(function(session){
                    if(session.data.email){
                        $location.path('/dashboard');
                    }                                     
                });
            }
        }
    })
        .when('/about',{
        templateUrl: "views/about.html",
        controller: "AboutController"
    })
        .when('/dashboard', {
        templateUrl: "views/dashboard.html",
        controller: "DashboardController",
        resolve:{
            "checkSession": function($location, SessionService){
                SessionService.getCurrentSession().then(function(session){
                    if(!session.data.email){
                        $location.path('/login');
                    }                                     
                });
            }
        }
    })
        .when('/member/:pseudo', {
        templateUrl : "views/member.html",
        controller: "MemberController"
    })

        .when('/404',{
        templateUrl : "views/404.html",
        controller: "404Controller"
    });

    $routeProvider.otherwise({ redirectTo: '/404' });

});