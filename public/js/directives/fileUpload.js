angular.module('L3C_V2')
    .directive('fileUpload', function($parse){

    return{
        restrict: 'A',
        link: function(scope, element, attrs){
            var model = $parse(attrs.fileUpload);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
               scope.$apply(function(){
                   modelSetter(scope, element[0].files[0]);
               }); 
            });
        }
    };

});