 'use strict';

 app.directive("panel", function() {
     return {
         link: function(scope, element, attrs) {
             scope.dataSource = "directive";
         },
         restrict: "E",
         scope: true,
         template: function() {
             return angular.element(document.querySelector("#template")).html();
         },
         transclude: true
     }
 })
