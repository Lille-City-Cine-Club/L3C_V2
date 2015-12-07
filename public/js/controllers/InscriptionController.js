angular.module('L3C_V2')
    .controller('InscriptionController', function($scope, $timeout, $location){
    $scope.title = "Inscription"; 
       
    $scope.formData = {};
       
    $scope.processInscription = function(){
         $.ajax({
            type:'POST',
            url:'/newMember',
            data: $scope.formData,
            async:false,
            success:function(response){
                if(response.codeResponse === "ko"){
                    $scope.error = "true";
                    $scope.success = "";
                    $scope.errorMessage = response.message;
            
                }else{
                    $scope.success = "true";
                    $scope.error = "";
                    $scope.successMessage = response.message;
                    console.info('before redirect');
                    $timeout(function(){
                        console.info('redirect');
                        $location.path('/');
                    }, 2000);
                }
            },
            error:function(){
                console.error('Error adding newMember!! :( ');
            }
        });
    };
});