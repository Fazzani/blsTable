/**
* @ngdoc directive
* @name bls_components.directive:panel
* @scope
* @restrict E
* @description
* create panel
*/
angular.module("bls_components").directive("panel", function () {
    return {
        link: function (scope, element, attrs) {
            scope.dataSource = "directive";
        },
        restrict: "E",
        scope: true,
        template: function () {
            return angular.element(document.querySelector("#template")).html();
        },
        transclude: true
    };
});
