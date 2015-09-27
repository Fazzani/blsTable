/**
 * @ngdoc directive
 * @name bls_components.directive:blsCols
 * @requires bls_components.directive:blsTable
 * @requires bls_components.directive:blsCols 
 * @priority 0
 * @restrict E
 * @description
 * Collect all columns
 *
 * **Note:** This is internal directive
 */
angular.module("bls_components").directive('blsCols', ['$log', function ($log) {
    var link = {
        post: function (scope, element, attrs, ctrls) {
            var blsTableCtrl = ctrls[0];
            var blsColsCtrl = ctrls[1];
            //$log.debug('    Link => blsCols');
            blsTableCtrl.setCols(blsColsCtrl.getCols());
        }
    };
    var controller = ['$scope', '$log',
        function ($scope, $log ) {
            //$log.debug('    controller => blsCols');
            var cols = [];
            this.addCol = function (col) {
                cols.push(col);
            };
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
