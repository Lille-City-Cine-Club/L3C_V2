angular.module('L3C_V2')
    .service('InscriptionService', function($http){

    var processInscription = function(data){
        var url = "/newMember";
        var responseService = {
            error : "",
            errorMessage : "",
            test: ""
        };

        return $http.post(url, data)
            .success(function(response){
                if(response.codeResponse === "ko"){
                    responseService.error = response.codeResponse;
                    responseService.errorMessage = response.message;
                    
                    return responseService;
                }else{
                    return response.data.data;
                }
            })
            .error(function(response){
                return response.data.data;
            });
    };

    return {
        processInscription : processInscription
    };  
});
