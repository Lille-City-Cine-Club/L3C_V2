angular.module('L3C_V2')
    .service("MemberService", function($http){
   
    var getMember = function(pseudo){
        
        var member;
        var url = '/member/'+pseudo;
        
        return $http.get(url)
            .success(function(response){
                member = response.data;
            
                return member;
            })
            .error(function(response){
                var memberError = {
                    codeResponse: response.status,
                    message: response.statusText
                };
            
                return memberError;
            })
    };
    
    return {
        getMember : getMember    
    };
});