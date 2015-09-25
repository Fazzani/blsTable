angular.module("bls_components").directive('blsRows', ['$log', '$compile', '$templateCache', '$timeout', function ($log, $compile, $templateCache, $timeout) {
    var link = function (scope, element, attrs, ctrls) {
        // var blsTableCtrl = ctrls[0];
        scope.getTdTpl = function (col, d) {
            if (col.tpl && col.tpl !== '') {

                col.tpl = col.tpl.replace(new RegExp('::row', 'g'), 'd');
                return col.tpl;
            }
        };

        var eleTpl = angular.element($templateCache.get('templates/blsRows.html'));
        if (scope.isHierarchical())
            eleTpl.attr('bls-row-child', '');
        $timeout(function () {
            element.siblings('table').find('tbody').append(eleTpl);
            $compile(eleTpl)(scope);
        }, 0);
    };
    return {
        require: ['^blsTable'],
        priority: -17,
        restrict: 'E',
        link: link,
        scope: true
    };
}]);
