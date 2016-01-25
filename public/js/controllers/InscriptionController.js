angular.module('L3C_V2')
    .controller('InscriptionController', function($scope, $timeout, $location, InscriptionService){
    $scope.title = "Inscription"; 

    $scope.formData = {};

    $scope.processInscription = function(){
        
        InscriptionService.processInscription($scope.formData).then(function(response){
            
            if(response.data.codeResponse === "ko"){
                $scope.error = "true";
                $scope.success = "";
                $scope.errorMessage = response.data.message;
            }else{
                $scope.error = "";
                $scope.success = "true";
                $scope.successMessage = response.data.message;
                $timeout(function(){
                    $location.path('/');
                }, 2000);
            }
        });
    };
});