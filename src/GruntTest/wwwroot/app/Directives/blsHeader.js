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
                    if (blsTableCtrl.tableConfig.cols[index].width > 0) return blsTableCtrl.tableConfig.cols[index].width + 'px';
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
            //$log.debug('    blsHeader controller: in init...');
            $scope.setPredicate = function (predicate) {
                me.predicate = predicate;
            };
            $scope.glyphOrder = function (col) {
                //$log.debug('    glyphOrder function was called');
                if (col.fieldName != $scope.predicate) return 'fa-sort';
                return me.reverse ? 'fa-sort-asc' : 'fa-sort-desc';
            };
            $scope.order = function (col) {
                if (!me.resizePressed)
                    if (col.sortable) {
                        //$log.debug('    order function was called');
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
            me.resizeData = {};
            $scope.resizeStart = function (e) {
                var target = e.target ? e.target : e.srcElement;
                if (target.classList.contains("resize")) {
                    me.resizeData.target = target.parentNode;
                    me.resizeData.siblingTarget = target.parentNode.nextElementSibling;
                    var $siblingElm = $(me.resizeData.siblingTarget);
                    var $targetElm = $(me.resizeData.target);

                    me.resizeData.resizePressed = true;
                    me.resizeData.startX = e.pageX;
                    me.resizeData.startWidth = $targetElm.width();
                    me.resizeData.startWidthSibling = $siblingElm.width();
                    me.resizeData.minWidth = 50;
                    me.resizeData.maxWidth = me.resizeData.startWidth + me.resizeData.startWidthSibling - me.resizeData.minWidth;
                    $log.debug(me.resizeData);
                    document.addEventListener('mousemove', drag);
                    document.addEventListener('mouseup', $scope.resizeEnd);
                    e.stopPropagation();
                    e.preventDefault();
                }
            };

            function drag(e) {
                var $siblingElm = $(me.resizeData.siblingTarget);
                var $targetElm = $(me.resizeData.target);
                var offset = e.pageX - me.resizeData.startX;
                var newWidth = me.resizeData.startWidth + offset;
                if (me.resizeData.resizePressed && me.resizeData.maxWidth > newWidth && me.resizeData.minWidth < newWidth) {
                    $targetElm.width(newWidth);
                    $siblingElm.width(me.resizeData.startWidthSibling - offset);
                    me.resizeColData = {
                        index: me.resizeData.target.cellIndex,
                        width: $targetElm.width(),
                        indexSibling: me.resizeData.siblingTarget.cellIndex,
                        widthSibling: $siblingElm.width()
                    };
                }
            }
            $scope.resizeEnd = function (e) {
                if (me.resizeData.resizePressed) {
                    document.removeEventListener('mousemove', drag);
                    document.removeEventListener('mouseup', $scope.resizeEnd);
                    e.stopPropagation();
                    e.preventDefault();
                    if (me.resizeColData !== null) {
                        $scope.setColWidth(me.resizeColData.index, me.resizeColData.width);
                        $scope.setColWidth(me.resizeColData.indexSibling, me.resizeColData.widthSibling);
                        me.resizeColData = null;
                    }
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
