angular.module("bls_components").directive('blsRows', ['$log', '$compile', '$templateCache', '$timeout', function ($log, $compile, $templateCache, $timeout) {
    var link = function (scope, element, attrs, ctrls) {
        // var blsTableCtrl = ctrls[0];
        // debugger;
        scope.getTdTpl = function (col, d) {

            var predicate = "d[c.fieldName] ";
            //
            if (col.tpl && col.tpl !== '') {
                col.tpl = col.tpl.replace('::data', 'd');
                col.tpl = col.tpl.replace('::field', predicate);
                $log.debug('            col.tpl => ', col.tpl);
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
