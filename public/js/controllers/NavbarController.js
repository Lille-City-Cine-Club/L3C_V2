angular.module('L3C_V2')
    .controller('NavbarController',function($scope, SessionService){

    var session = SessionService.getCurrentSession();
        
    if(session.email){
        $scope.connected = true;
        if(session.isAdmin){
            $scope.admin = true;
        }else{
            $scope.admin = false;
        }
    }else{
        $scope.connected = false;
    }
});