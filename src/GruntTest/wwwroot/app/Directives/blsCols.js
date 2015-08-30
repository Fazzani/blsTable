angular.module("bls_components").directive('blsCols', ['$log', '$compile', '$templateCache', '$timeout', function ($log, $compile, $templateCache, $timeout) {
    var link = {
        post: function (scope, element, attrs, ctrls) {
            var blsTableCtrl = ctrls[0];
            var blsColsCtrl = ctrls[1];
            $log.debug('    Link => blsCols');
            blsTableCtrl.setCols(blsColsCtrl.getCols());
        }
    };
    var controller = ['$scope', '$filter', '$timeout', '$element', '$log', 'localStorageService', 'blsTableServices',
        function ($scope, $filter, $timeout, $element, $log, localStorageService, blsTableServices) {
            $log.debug('    controller => blsCols');
            var cols = [];
            this.addCol = function (col) {
                cols.push(col);
            }
            this.getCols = function () {
                return cols;
            };
        }
    ];
    return {
        priority: 0,
        require: ['^blsTable', 'blsCols'],
        restrict: 'E',
        link: link,
        controller: controller
    };
}]);
