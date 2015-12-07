angular.module('L3C_V2')
    .service('SessionService', function($http){

    //to grab the current session

    var getCurrentSession = function(){
        var session;
        var url = '/whatsMyName';
        
        return $http.get(url)
            .success(function(response){
            
                session = response;
                return session;
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
        getCurrentSession : getCurrentSession
    };
});