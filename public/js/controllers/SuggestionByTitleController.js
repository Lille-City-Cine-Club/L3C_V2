angular.module('L3C_V2')
    .controller('SuggestionByTitle', function($scope, $routeParams, SuggestionService){
   
    SuggestionService.getSuggestionByTitle($routeParams.title).then(function(response){
        console.log(response);
        console.log($routeParams.title);
    }); 
    
});