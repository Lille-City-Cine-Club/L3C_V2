angular.module('L3C_V2')
    .controller('HomeController', function($scope, $location, SessionService){
    
        $scope.session = SessionService.getCurrentSession();
        
});