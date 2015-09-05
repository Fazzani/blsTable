angular.module("bls_components").directive('dynamic', ['$compile', '$log', '$timeout', function ($compile, $log, $timeout) {
    return {
        restrict: 'A',
        replace: true,
        priority: -20,
        link: function (scope, ele, attrs) {
            scope.$eval(attrs.dynamic);
            $timeout(function () {
                if (angular.isDefined(scope.c.tpl)) {
                    if (scope.c.tpl !== '' && !scope.c.tpl.startsWith('{{') && $(scope.c.tpl)[0]) {
                        ele.html(scope.c.tpl);
                        $compile(ele.contents())(scope);
                    }
                }
            });
        }
    };
}]);
