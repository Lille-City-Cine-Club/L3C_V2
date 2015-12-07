angular.module('L3C_V2')
    .directive('myNavbar',function(){

    return{
        restrict:'E',
        scope:{},
        templateUrl: 'myNavbar.html',
        controller: 'NavbarController'
        
    };

});