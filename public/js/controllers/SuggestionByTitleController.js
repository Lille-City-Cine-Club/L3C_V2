angular.module('L3C_V2')
    .controller('SuggestionByTitleController', function($scope, $routeParams, SuggestionService){
   
    SuggestionService.getSuggestionByTitle($routeParams.title).then(function(response){
        $scope.suggestion = response.data.data;
    }); 
});