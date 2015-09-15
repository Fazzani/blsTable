angular.module("bls_components").directive('dynamic', ['$compile', '$log', '$timeout', function ($compile, $log, $timeout) {
    return {
        restrict: 'A',
        replace: true,
        priority: -20,
        link: function (scope, ele, attrs) {
            $timeout(function () {
                if (angular.isDefined(attrs.dynamic)) {
                    //$log.debug('in dynamic');
                    var value = scope.$eval(attrs.dynamic);
                    //$log.debug('value => ', value);
                    if (value && value !== '') {
                        value = value.trim();
                        if (!value.startsWith('{{') && $(value)[0])
                        {
                            ele.html(value);
                            //$log.debug('ele => ', ele.html());
                        }
                        else
                            ele.text(value);
                        $compile(ele.contents())(scope);
                    }
                }
            });
        }
    };
}]);
