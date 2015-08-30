angular.module("bls_components").directive('blsToolBar', [function () {
    // Runs during compile
    return {
        priority: 2,
        scope: true, // {} = isolate, true = child, false/undefined = no change
        restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
        templateUrl: 'templates/blsToolBar.html',
        replace: true,
        controller: ['$scope', '$element', '$document', '$log', function ($scope, $element, $document, $log) {
            $scope.btnClass = "btn btn-default";
            $scope.searchPlaceHolder = "search...";
            $scope.selectedAll = false;
            $scope.titleExportButton = "Export";
            $scope.clearUserData = function () {
                $scope.$emit('flushEvent');
            }
            $scope.refresh = function () {
                $scope.$emit('refreshEvent');
            }
            $scope.toggleSelectAll = function () {
                $scope.selectedAll = !$scope.selectedAll;
                $scope.$emit('toggleSelectAllEvent', $scope.selectedAll);
            }
            $scope.export = function (type) {
                $log.debug('    export type => ', type)
                $scope.$emit('exportEvent', type);
            }
            $scope.links = ['excel', 'xml', 'csv', 'sql', 'json', 'doc', 'powerpoint'];
        }]
    };
}]);