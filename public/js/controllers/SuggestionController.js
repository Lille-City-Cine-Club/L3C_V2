angular.module('L3C_V2')
    .controller('SuggestionController', function($scope, $location, SuggestionService){


    SuggestionService.getCurrentSuggestion().then(function(response){
        
        $scope.response = response.data;

        if($scope.response.codeResponse === "ko"){
            $location.path('/');
        }else{
            $scope.suggestion = $scope.response.data;
        }
    });
});