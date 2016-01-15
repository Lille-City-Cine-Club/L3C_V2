angular.module('L3C_V2')
    .controller('ModifSuggestionController', function($scope, SuggestionService){

    $scope.title = "Modifier la suggestion";
    $scope.formData;
    
    SuggestionService.getCurrentSuggestion().then(function(response){
        
        var responseData = angular.copy(response.data.data);
        
        $scope.formData = responseData;
        
        console.info('test');
        console.warn($scope.formData);
    });

});