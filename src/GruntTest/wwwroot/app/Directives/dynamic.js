angular.module("bls_components").directive('dynamic', ['$compile', '$log', '$timeout', function ($compile, $log, $timeout) {
    return {
        restrict: 'A',
        replace: true,
        priority: -20,
        link: function (scope, ele, attrs) {
            $timeout(function () {
                if (angular.isDefined(attrs.dynamic)) {
                    var value = eval("scope." + attrs.dynamic);
                    if (value && value !== '' && !value.startsWith('{{') && $(value)[0]) {
                        ele.html(value);
                        $compile(ele.contents())(scope);
                    }
                }
            });
        }
    };
}]);
