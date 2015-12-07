angular.module('L3C_V2')
    .controller('LoginController', function($scope,$location){
    $scope.title = "Login"; 
    
    $scope.formData = {};
    
    $scope.processLogin = function(){
        alert('faire un service pour gerer la connection!!!!');
        $.ajax({
            type:'POST',
            url:'/loginConnection',
            data: $scope.formData,
            async:false,
            success:function(response){
                
                if(response.codeResponse === "ko"){
                    $scope.error = "true";
                    $scope.errorMessage = response.message;
                    
                }else{
                    alert(response.message);
                    alert('utiliser location vers la suggestion ou panel admin/member');
                    $location.path("/dashboard");
                }
            },
            error:function(){
                console.error('Error adding newMember!! :( ');
            }
        });
    };
});