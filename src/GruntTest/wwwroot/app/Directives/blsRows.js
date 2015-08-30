(function (angular) {
    app.directive('blsRows', ['$log', '$compile', '$templateCache', '$timeout', function($log, $compile, $templateCache, $timeout) {
        this.link = function(scope, element, attrs, ctrls) {
            // var blsTableCtrl = ctrls[0];
            // debugger;
            
            var eleTpl = angular.element($templateCache.get('templates/blsRows.html'));
            if(scope.isHierarchical())
                eleTpl.attr('bls-row-child','');
            $timeout(function() {
                element.siblings('table').find('tbody').append(eleTpl);
                $compile(eleTpl)(scope);
            }, 0);
        };
        return {
            require: ['^blsTable'],
            priority: -17,
            restrict: 'E',
            link: this.link,
            scope: true
        };
    }]);
})(window.angular);