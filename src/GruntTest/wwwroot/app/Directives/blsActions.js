angular.module("bls_components").directive('blsActions', ['$log', '$compile', '$templateCache', '$timeout', '$q', function ($log, $compile, $templateCache, $timeout, $q) {
    var link = function (scope, element, attrs, ctrls) {
        // var blsTableCtrl = ctrls[0];
        if (scope.c.isActions) {
            var eleTpl = angular.element($templateCache.get('templates/blsActions.html'));
            $timeout(function () {
                element.replaceWith(eleTpl);
                $compile(eleTpl)(scope);
            }, 0);
        }
        scope.action = function (btn, d) {
            $q.when(btn.action(d)).then(function (res) {
                if (btn.isRemoveAction) {
                    scope.data.splice(scope.data.indexOf(d), 1);
                }
            });
        };
    };

    return {
        //require: ['^blsTable'],
        priority: -18,
        restrict: 'A',
        link: link
    };
}]);
