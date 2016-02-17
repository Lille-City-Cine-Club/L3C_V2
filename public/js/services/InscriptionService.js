angular.module('L3C_V2')
    .service('InscriptionService', function($http){

    var processInscription = function(data){
        var url = "/newMember";
        var responseService = {
            error : "",
            errorMessage : ""
        };

        return $http.post(url, data).then(
            function success(response){
                if(response.codeResponse === "ko"){
                    responseService.error = response.codeResponse;
                    responseService.errorMessage = response.message;

                    return responseService;
                }

                return response.data;

            }, function error(response){

                return response.data.data;
            });
    };

    return {
        processInscription : processInscription
    };  
});
