angular.module('L3C_V2')
    .controller('DashboardController', function($scope, $location, SessionService, SuggestionService){


    $scope.admin = false;

    SessionService.getCurrentSession().then(function(response){
        
        $scope.session = response.data;
        
        if($scope.session.isAdmin){
            $scope.connected=true;
            $scope.admin = true;
            $scope.title = "Bienvenue, "+ $scope.session.name;
        }
        $scope.title = "Bienvenue, "+ $scope.session.name;
    });

    SuggestionService.getCurrentSuggestion().then(function(response){

        $scope.suggestion = response.data;
    });

    SuggestionService.getAllSuggestion().then(function(response){
        
        $scope.penultimateSuggestion = response[response.length-2];
        $scope.movies = response.reverse();
    });

    $scope.go = function(path){
        $location.path(path);
    };

    $scope.alert = function(text){
        window.alert(text);
    };

});