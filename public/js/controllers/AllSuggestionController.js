angular.module('L3C_V2')
    .controller('AllSuggestionController', function($scope, SuggestionService, $routeParams, $location){

    $scope.title = "Nos anciennes suggestions";
    $scope.message = "getting all the suggestion made prior the current date or the date passed as parametter";


    var processServerResponse = function(response){
        if(response.data.codeResponse === "ko"){
            $location.path('/');
        }else{
            $scope.result = response.data.reverse();

            for(var r = 0; r< $scope.result.length ; r++){

                // disable "actors1, undefined ..."
                $scope.result[r].cast = "";
                for(var i = 0; i<$scope.result[r].actors.length ; i++){
                    $scope.result[r].cast += $scope.result[r].actors[i]+', ';
                }
                // Disable the 'undefined' genre when a movie have less than 3 genre.
                $scope.result[r].genres = $scope.result[r].genre[0];
                for(var j = 1; i< $scope.result[j].genre.length; j++){
                    if (typeof $scope.result[r].genre[j] !== 'undefined'){
                        $scope.result[r].genres +=", "+$scope.result[r].genre[1];
                    }
                }
            }
        }
    };

    if($routeParams.date){
        SuggestionService.getAllSuggestionWithDate($routeParams.date).then(function(response){
            processServerResponse(response);
        });
    }else{
        SuggestionService.getAllSuggestion().then(function(response){
            processServerResponse(response);
        });
    }

    $scope.go = function(path){
        $location.path('/suggestion/'+path);
    };

});