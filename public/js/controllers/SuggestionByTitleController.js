angular.module('L3C_V2')
    .controller('SuggestionByTitleController', function($scope, $routeParams, SuggestionService){
   
    
    console.warn($routeParams.title);
    SuggestionService.getSuggestionByTitle($routeParams.title).then(function(response){
        console.log(response);
        console.log($routeParams.title);
    }); 
    
});