angular.module('L3C_V2')
    .controller('SuggestionController', function($scope, $location, $sce, $routeParams, SuggestionService){

    $scope.showingTrailer = false;

    if($routeParams.title){

        SuggestionService.getSuggestionByTitle($routeParams.title).then(function(response){
            $scope.suggestion = response.data;
        }); 

    }else{

        SuggestionService.getCurrentSuggestion().then(function(response){
            var serverResponse = response.data;

            if(serverResponse.codeResponse === "ko"){
                $location.path('/');
            }else{
                $scope.suggestion = serverResponse;
            }
        });
    }

    $scope.toggleTrailer = function(hide){

        if(!hide){
            $scope.trailerUrl = $sce.trustAsResourceUrl('https://www.youtube.com/embed/'+$scope.suggestion.trailer+'?enablejsapi=1&autoplay=1');
            $scope.showingTrailer = true;
        }else{

            // get iframe + enable stop video when hiding player
            var trailer = angular.element(document.getElementById('trailer'));
            trailer[0].contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');

            $scope.showingTrailer = false;
        }
    };

});