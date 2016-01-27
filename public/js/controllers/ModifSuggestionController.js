angular.module('L3C_V2')
    .controller('ModifSuggestionController', function($scope, SuggestionService){

    $scope.title = "Modifier la suggestion";
    $scope.formData = {};

    SuggestionService.getCurrentSuggestion().then(function(response){

        //        var responseData = angular.copy(response.data.data);
        //        $scope.formData = responseData;

        // setting all fields value
        $scope.formData.title = response.data.data.title;
        $scope.formData.director = response.data.data.director;

        // this one cause pb /!\
        //        $scope.formData.actors = response.data.data.actors;


        /*-------------------- realy ugly, need to be improved ------------------*/
        var g1 = document.getElementById('genre1');
        var g2 = document.getElementById('genre2');
        var g3 = document.getElementById('genre3');

        var genre = response.data.data.genre.split(', ');

        $scope.formData.genre1 = genre[0];
        g1.value = $scope.formData.genre1;

        if(genre[1]){
            $scope.formData.genre2 = genre[1];
            g2.value = $scope.formData.genre2;
            if(genre[2]){
                $scope.formData.genre3 = genre[3];
                g3.value = $scope.formData.genre3;
            }
        }
        /*-----------------------------------------------------------------------*/
        $scope.formData.duration = response.data.data.duration;
        $scope.formData.synopsis = response.data.data.synopsis;
        $scope.formData.why = response.data.data.why;
        $scope.formData.suggestionDate = response.data.data.publicationDate;
        $scope.formData.trailer = response.data.data.trailer;

        var modif = function(){
            return true;
        };
        $scope.processNewSuggestion = function(){
            window.alert('salut');
        };

    });

});

