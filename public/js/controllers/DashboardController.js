angular.module('L3C_V2')
    .controller('DashboardController', function($scope, $location, SessionService, SuggestionService){

    SessionService.getCurrentSession().then(function(response){

        $scope.session = response.data;

        if($scope.session.isAdmin){
            $scope.title = "Bienvenue, "+ $scope.session.name;

        }else{
            $scope.title = "Tu n'es qu'un membre, un petit pion!!! Ahahha!!";
        }
    });

    SuggestionService.getCurrentSuggestion().then(function(response){

        $scope.suggestion = response.data.data;

    });


    SuggestionService.getAllSuggestion().then(function(response){
        
        $scope.penultimateSuggestion = response.data[response.data.length-2];
        $scope.movies = response.data;
     
    });

    $scope.go = function(path){
        $location.path(path);
    };

});