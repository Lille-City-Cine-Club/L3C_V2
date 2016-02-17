angular.module('L3C_V2')
    .service("MemberService", function($http){

    var getMember = function(pseudo){

        var member;
        var url = '/member/'+pseudo;

        return $http.get(url).then(

            function success(response){

                member = response.data;
                return member;

            }, function error(response){
                var memberError = {
                    codeResponse: response.status,
                    message: response.statusText
                };

                return memberError;
            });   
    };

    return {
        getMember : getMember    
    };
});