angular.module('L3C_V2')
    .controller('MemberController', function($scope, $routeParams, $location, MemberService){


    MemberService.getMember($routeParams.pseudo).then(function(response){

        if(response.codeResponse === "ok"){
            $scope.member = response.data;

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