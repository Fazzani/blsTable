(function(angular) {
    'use strict';
    app.controller("rootCtrl", ['$scope', '$location', '$log', function($scope, $location, $log, Page) {
        $scope.getActiveMenu = function(path) {
            $scope.Page = 'BlsGrid - Documentation';
            if ($location.path() === path) {
                if (path === '/docs') $scope.Page = 'BlsGrid - Documentation';
                else $scope.Page = 'BlsGrid - Examples';
                return "active"
            } else {
                return ""
            }
        }
    }]);
})(window.angular);