/**
 * @ngdoc directive
 * @name bls_components.directive:blsDropDown
 * @requires blsTable
 * @requires blsCols 
 * @description
 * DropDown from list of links
 * @requires links (Array)
 * @scope
 * @example <bls-drop-down links="['pdf','xml', 'json']" func="export" title="titleExportButton" ng-hide="False"></bls-drop-down>
 */
angular.module("bls_components").directive('blsDropDown', [function () {
    return {
        templateUrl: 'templates/blsDropDown.html',
        replace: true,
        scope: {
            links: '=',
            title: '=',
            func: '&'
        }
    };
}]);