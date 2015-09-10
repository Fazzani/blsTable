angular.module("bls_components").directive('blsSearchBox', [function () {
    var uniqueId = 1;
    return {
        link: function (scope, element, attrs) {
            scope.uniqueId = 'btn' + uniqueId++;
        },
        scope: {
            ngModel: '=',
            options: '='
        },
        restrict: 'E',
        templateUrl: 'templates/blsSearchBox.html',
        replace: true,
        controller: ['$scope', '$element', '$log', function ($scope, $element, $log) {
            //$log.debug('=======> blsSearchBox', $scope.options);
            var defaultOptions = {
                id: $scope.uniqueId,
                placeholder: 'search...',
                minChars: 3
            };

            this.initOptions = function () {
                var initialOptions = angular.copy($scope.options);
                angular.merge($scope.options, defaultOptions);
                angular.merge($scope.options, initialOptions);
            };
            $scope.refresh = function () {
                $scope.$emit('blsTable.RefreshEvent');
            };

            this.initOptions();
            $scope.model = $scope.ngModel;
            if ($scope.options.minChars !== 0) {
                $scope.model = angular.copy($scope.ngModel);
                var isActiveSearch = false;
                $scope.$watch('model', function (newVal, oldVal) {
                    if ((newVal != oldVal && newVal.length >= $scope.options.minChars) || isActiveSearch) {
                        isActiveSearch = newVal.length !== 0;
                        $scope.ngModel = newVal;
                    }
                });
            }
        }]
    };
}]);