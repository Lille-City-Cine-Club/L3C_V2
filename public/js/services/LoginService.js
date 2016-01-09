angular.module('L3C_V2')
    .service('LoginService', function($http){


    var processLogin = function(data){
        var url = "/loginConnection";

        return $http.post(url, data)
            .success(function(response){
            return response.data;   
        })
            .error(function(response){
            return response.data.data;
        });
    };

    var processLogout = function(){
        var url = "/logout";

        return $http.get(url)
            .success(function(response){
            return response;
        })
            .error(function(response){
            var responseSession = {
                codeResponse: response.status,
                message: response.statusText
            };

            return responseSession;
        });
    };

    return {
        processLogin : processLogin,
        processLogout : processLogout
    };
});
