/**
* @ngdoc directive
* @name bls_components.directive:blsToolBar
* @scope
* @priority 2 
* @restrict E
* @description
* ToolBar for blsTable
* @example
* <pre>      
* <bls-tool-bar ng-hide="options.toolbar.hide"></bls-tool-bar>
* </pre>
*/
angular.module("bls_components").directive('blsToolBar', [function () {
    // Runs during compile
    return {
        priority: 2,
        scope: true, // {} = isolate, true = child, false/undefined = no change
        restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
        templateUrl: 'templates/blsToolBar.html',
        replace: true,
        controller: ['$scope', '$element','$log', function ($scope, $element, $log) {
            $scope.btnClass = "btn btn-default";
            $scope.searchPlaceHolder = "search...";
            $scope.selectedAll = false;
            $scope.titleExportButton = "Export";
            $scope.clearUserData = function () {
                $scope.$emit('blsTable.ResetEvent');
            };
            $scope.refresh = function () {
                $scope.$emit('blsTable.RefreshEvent');
            };
            $scope.toggleSelectAll = function () {
                $scope.selectedAll = !$scope.selectedAll;
                $scope.$emit('blsTable.toggleSelectAllEvent', $scope.selectedAll);
            };
            $scope.export = function (type) {
                $log.debug('    export type => ', type);
                $scope.$emit('blsTable.ExportEvent', type);
            };
        }]
    };
}]);