angular.module("bls_components").directive('blsHeader', ['$log', '$compile', '$templateCache', '$timeout', 'localStorageService', function ($log, $compile, $templateCache, $timeout, localStorageService) {
    var link = {
        pre: function (scope, element, attrs, ctrls) {
            scope.$on('blsDataGrid_initedEvent', function (e) {
                $log.debug('    blsDataGrid_initedEvent intercepted');
                var blsTableCtrl = ctrls[0];
                var blsHeaderCtrl = ctrls[1];
                scope.setPredicate(localStorageService.get(scope.storageIds.predicateId) || (scope.cols[0] === undefined ? "" : scope.cols[0].id));
                scope.refreshDataGrid = blsTableCtrl.refreshDataGrid;
                $log.debug('    Link => blsHeader');
                var eleTpl = angular.element($templateCache.get('templates/blsHeader.html'));
                scope.getColWidth = function (index) {
                    if (blsTableCtrl.tableConfig.cols[index].width > 0) return blsTableCtrl.tableConfig.cols[index].width;
                };
                $timeout(function () {
                    element.siblings('table').find('thead').append(eleTpl);
                    $log.debug('    compiling blsHeader');
                    $compile(eleTpl)(scope);
                }, 0);
            });
        }
    };
    var controller = ['$scope', '$filter', '$timeout', '$element', '$log', 'localStorageService', 'blsTableServices',
        function ($scope, $filter, $timeout, $element, $log, localStorageService, blsTableServices) {
            var me = this;
            me.reverse = localStorageService.get($scope.storageIds.reverseId) || me.reverse;
            me.resizeColData = null;
            me.resizePressed = false;
            $log.debug('    blsHeader controller: in init...');
            $scope.setPredicate = function (predicate) {
                me.predicate = predicate;
            };
            $scope.glyphOrder = function (col) {
                $log.debug('    glyphOrder function was called');
                if (col.fieldName != $scope.predicate) return 'fa-sort';
                return me.reverse ? 'fa-sort-asc' : 'fa-sort-desc';
            };
            $scope.order = function (col) {
                if (!me.resizePressed)
                    if (col.sortable) {
                        $log.debug('    order function was called');
                        me.reverse = ($scope.predicate === col.fieldName) ? !me.reverse : false;
                        me.predicate = col.fieldName;
                        $scope.saveUserData({
                            key: $scope.storageIds.predicateId,
                            val: me.predicate
                        });
                        $scope.saveUserData({
                            key: $scope.storageIds.reverseId,
                            val: me.reverse
                        });
                        $scope.refreshDataGrid();
                    }
            };
            me.resizeData = {

            };
            $scope.resizeStart = function (e) {
                $log.debug('     resizeStart');
                var target = e.target ? e.target : e.srcElement;
                if (target.classList.contains("resize")) {
                    me.resizeData.target = target.parentNode;
                    me.resizeData.siblingTarget = target.parentNode.nextElementSibling;
                    me.resizeData.resizePressed = true;
                    me.resizeData.startX = e.pageX;
                    me.resizeData.startWidth = target.parentNode.offsetWidth;
                    me.resizeData.minWidth = 50;
                    me.resizeData.maxWidth = me.resizeData.startWidth + me.resizeData.siblingTarget.offsetWidth - me.resizeData.minWidth;
                    $log.debug(me.resizeData);
                    document.addEventListener('mousemove', drag);
                    document.addEventListener('mouseup', $scope.resizeEnd);
                    e.stopPropagation();
                    e.preventDefault();
                }
            };

            function drag(e) {
                var newWidth = me.resizeData.startWidth + (e.pageX - me.resizeData.startX);
                $log.debug(newWidth);
                if (me.resizeData.resizePressed && me.resizeData.maxWidth > newWidth && me.resizeData.minWidth < newWidth) {
                    me.resizeData.target.width = newWidth;
                    me.resizeData.siblingTarget.width = me.resizeData.siblingTarget.offsetWidth + (me.resizeData.startWidth - newWidth);
                    $log.debug('e', e);
                    $log.debug('start.width == ', me.resizeData.target.width);
                    $log.debug('startX == ', me.resizeData.startX);
                    $log.debug('e.pageX == ', e.pageX);
                    me.resizeColData = {
                        index: me.resizeData.target.cellIndex,
                        width: me.resizeData.target.width
                    };
                }
            }
            $scope.resizeEnd = function (e) {
                if (me.resizeData.resizePressed) {
                    document.removeEventListener('mousemove', drag);
                    document.removeEventListener('mouseup', $scope.resizeEnd);
                    e.stopPropagation();
                    e.preventDefault();
                    //setTimeout(function () {
                    //    me.resizeData.resizePressed = false;
                    //}, 50);
                    $scope.setColWidth(me.resizeColData.index, me.resizeColData.width);
                    me.resizeColData = null;
                    me.resizeData = {};
                    return false;
                }
            };
        }
    ];
    return {
        priority: -20,
        require: ['^?blsTable', 'blsHeader'],
        restrict: 'E',
        link: link,
        controller: controller
    };
}]);
