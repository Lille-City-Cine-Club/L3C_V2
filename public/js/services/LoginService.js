angular.module('L3C_V2')
    .service('LoginService', function($http){


    var processLogin = function(data){
        var url = "/loginConnection";
        var responseService = {
            error: "",
            errorMessage: ""
        };

        return $http.post(url, data)
            .success(function(response){
                if(response.codeResponse === "ko"){
                    responseService.error = response.codeResponse;
                    responseService.errorMessage = response.message;

                    return responseService;
                }else{
                    return response;
                }
            })
            .error(function(response){
                return response.data.data;
            });
    };
    
    return {
        processLogin : processLogin
    };
});
