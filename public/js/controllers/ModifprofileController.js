angular.module('L3C_V2')
    .controller('ModifprofileController', function($scope, SessionService){

    $scope.title = "Modifier son profil";

    $scope.formData = {};

    SessionService.getCurrentSessionUserInfo().then(function(response){

        console.log(response);

        $scope.formData.pseudo = response.data.name;
        $scope.formData.mail = response.data.email;


        /*-------------------- realy ugly, need to be improved ------------------*/
        var g1 = document.getElementById('genre1');
        var g2 = document.getElementById('genre2');
        var g3 = document.getElementById('genre3');

        $scope.formData.genre1 = response.data.genre[0];
        g1.value = $scope.formData.genre1;

        if(response.data.genre[1]){
            $scope.formData.genre2 = response.data.genre[1];
            g2.value = $scope.formData.genre2;
            if(response.data.genre[2]){
                $scope.formData.genre3 = response.data.genre[2];
                g3.value = $scope.formData.genre3;
            }
        }
        /*-----------------------------------------------------------------------*/


        $scope.formData.description = response.data.description;

    });


})