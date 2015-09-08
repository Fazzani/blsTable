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
            $log.debug('=======> blsSearchBox', $scope.options);
            var defaultOptions = {
                id: $scope.uniqueId,
                placeholder: 'search...',
                searchClass: 'form-control',
                button: {
                    hide: true,
                    title: 'search',
                    btnClass: 'btn btn-default'
                },
                minChars: {
                    enbaled: true,
                    count: 3
                }
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
        }]
    };
}]);