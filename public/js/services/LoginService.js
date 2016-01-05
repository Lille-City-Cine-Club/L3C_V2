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
    
    return {
        processLogin : processLogin
    };
});
