angular.module('L3C_V2')
    .controller('NavBarController', function($scope, $location, SessionService, $route, LoginService){

    SessionService.getCurrentSession().then(function(response){

        $scope.session = response.data;

        if($scope.session.email){
            $scope.connected = true;

            if($scope.session.isAdmin){
                $scope.admin = true;
            }else{
                $scope.admin = false;
            }
        }else{
            $scope.connected = false
        }
    });

    $scope.logout=function(){
        LoginService.processLogout().then(function(){
            $location.path('/');
            $route.reload();
        });
    }

})
    .directive('navBar',function(){

    return{
        controller: "NavBarController",
        templateUrl: 'views/nav-bar.html'
    };

});