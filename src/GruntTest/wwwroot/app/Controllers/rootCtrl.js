(function(angular) {
    'use strict';
    app.controller("rootCtrl", ['$scope', '$location', '$log', '$rootScope', function ($scope, $location, $log, $rootScope) {
    
        $scope.refreshTable = function () {
            $rootScope.$broadcast('blsTable.RefreshEvent');
        };
        $scope.resetTable = function () {
            $rootScope.$broadcast('blsTable.ResetEvent');
        };

    }]);
})(window.angular);
