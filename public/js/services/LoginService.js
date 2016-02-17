angular.module('L3C_V2')
    .service('LoginService', function($http){


    var processLogin = function(data){
        var url = "/loginConnection";

        return $http.post(url, data).then(

            function success(response){
                return response.data;

            }, function error(response){
                return response.data.data;
            });
    };

    var processLogout = function(){
        var url = "/logout";

        return $http.get(url).then(

            function success(response){
                return response;

            }, function error(response){

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
