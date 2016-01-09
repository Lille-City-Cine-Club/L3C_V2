angular.module('L3C_V2')
    .controller('MemberController', function($scope, $routeParams, $location, MemberService){


    MemberService.getMember($routeParams.pseudo).then(function(response){
        console.log(response);
        if(response.data.codeResponse === "ok"){
            $scope.member = response.data.data;

            if($scope.member.isAdmin){
                $scope.member.role = "admin";
            }else{
                $scope.member.role = "membre";
            }
        }else{
            $location.path('/404');
        }
    });

});