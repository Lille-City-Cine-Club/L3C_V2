angular.module('L3C_V2')
    .controller('LoginController', function($scope,$location, LoginService){
    $scope.title = "Login"; 
    
    $scope.formData = {};
    
    $scope.processLogin = function(){
        LoginService.processLogin($scope.formData).then(function(response){
            if(response.codeResponse === "ko"){
                $scope.error = "true";
                $scope.errorMessage = response.message;
            }else{
                $location.path('/dashboard');
            }
        });
    };
});