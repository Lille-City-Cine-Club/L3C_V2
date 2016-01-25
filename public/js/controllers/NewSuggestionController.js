angular.module('L3C_V2')
    .controller('NewSuggestionController', function($scope, $timeout, SuggestionService){

    $scope.title = "Ajouter un film";
    $scope.formData = {};

    var reset = angular.copy($scope.formData);

    $scope.processNewSuggestion = function(){

        var poster = $scope.poster;

        SuggestionService.setSuggestion($scope.formData, poster).then(function(response){
            if(response.data.codeResponse === "ko"){
                $scope.error = response.data.message;
                $scope.errorMessage = response.data.message;
            }else{
                $scope.error = '';
                $scope.success = response.data.message;
                $scope.successMessage = response.data.message;
                
                $scope.formData = reset; 
                $scope.formNewSuggestion.$setPristine();
                
                $timeout(function(){
                    $scope.success = '';
                    
                }, 2000);
            }
        });
    };
});