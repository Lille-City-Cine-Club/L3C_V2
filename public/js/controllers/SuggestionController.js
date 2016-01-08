angular.module('L3C_V2')
    .controller('SuggestionController', function($scope, $location, $sce, SuggestionService){


    $scope.showingTrailer = false;

    SuggestionService.getCurrentSuggestion().then(function(response){

        $scope.response = response.data;

        if($scope.response.codeResponse === "ko"){
            $location.path('/');
        }else{
            $scope.suggestion = $scope.response.data;
        }
    });

    $scope.toggleTrailer = function(hide){

        if(!hide){
            $scope.trailerUrl = $sce.trustAsResourceUrl('https://www.youtube.com/embed/'+$scope.suggestion.trailer);
            $scope.showingTrailer = true;
        }else{
            $scope.showingTrailer = false;
        }
    };

});