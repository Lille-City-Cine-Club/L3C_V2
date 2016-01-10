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
            $scope.trailerUrl = $sce.trustAsResourceUrl('https://www.youtube.com/embed/'+$scope.suggestion.trailer+'?enablejsapi=1&autoplay=1');
            $scope.showingTrailer = true;
        }else{
            
            // get iframe + enable stop video when hiding player
            var trailer = angular.element(document.getElementById('trailer'));
            trailer[0].contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
            
            $scope.showingTrailer = false;
        }
    };

});