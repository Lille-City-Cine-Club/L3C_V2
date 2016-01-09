angular.module('L3C_V2')
    .service("SuggestionService", function($http, Upload){

    // to grab the current team suggestion
    var getCurrentSuggestion = function(){

        var suggestion;
        var url = '/suggestion';

        return $http.get(url)
            .success(function(response){

            suggestion = response.data;
            return suggestion;
        })
            .error(function(response){
            var responseSuggestion = {
                codeResponse : response.status,
                message : response.statusText
            };

            return responseSuggestion;
        });
    };

    var getAllSuggestion = function(){

        var allSuggestion;
        var url = '/allSuggestions';

        return $http.get(url)
            .success(function(response){

            allSuggestion = response.data;                    
            return allSuggestion;                
        })
            .error(function(response){
            var responseSuggestion = {
                codeResponse : response.status,
                message : response.statusText
            };

            return responseSuggestion;            
        });
    };

    var getAllSuggestionWithDate = function(date){

        var allSuggestion;
        var url = '/allSuggestions/'+date;

        return $http.get(url)
            .success(function(response){

            allSuggestion = response.data;                    
            return allSuggestion;    
        })
            .error(function(response){
            var responseSuggestion = {
                codeResponse : response.status,
                message : response.statusText
            }

            allSuggestion = responseSuggestion;            
            return allSuggestion;
        });
    };


    var getSuggestionByTitle = function(title){

        var suggestion;
        var url = '/suggestion/'+title;

        return $http.get(url)
            .success(function(response){
            suggestion = response.data;
            return suggestion;
        })
            .error(function(response){
            var response = {
                codeResponse: "ko",
                message: "error retreiving data from web services"
            }

            return response;
        })
    };

    var setSuggestion = function(suggestion, file){

        var url = "/postContent";
        var data = new FormData();

        angular.copy(suggestion , data);

        return Upload.upload({
            url: url,
            data: {file: file, data}
        }).then(function (response) {
            return response;
            //            console.log('Success ' + response.config.data.file.name + 'uploaded. Response: ' + response.data);
        }, function (response) {
            return response;
            //            console.log('Error status: ' + response.status);
        });

    };

    return {
        getCurrentSuggestion : getCurrentSuggestion,
        getSuggestionByTitle: getSuggestionByTitle,
        getAllSuggestion : getAllSuggestion,
        getAllSuggestionWithDate : getAllSuggestionWithDate,
        setSuggestion : setSuggestion
    };

});
