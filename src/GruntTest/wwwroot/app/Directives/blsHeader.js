angular.module("bls_components").directive('blsHeader', ['$log', '$compile', '$templateCache', '$timeout', 'localStorageService',
    function ($log, $compile, $templateCache, $timeout, localStorageService) {
        var sortDirectionEnum = { asc: 'asc', desc: 'desc' };
        var link = {
            pre: function (scope, element, attrs, ctrls) {
                scope.$on('blsDataGrid_initedEvent', function (e) {
                    //$log.debug('    blsDataGrid_initedEvent intercepted');
                    var blsTableCtrl = ctrls[0];
                    var blsHeaderCtrl = ctrls[1];
                    scope.refreshDataGrid = blsTableCtrl.refreshDataGrid;
                    //$log.debug('    Link => blsHeader');
                    var eleTpl = angular.element($templateCache.get('templates/blsHeader.html'));
                    scope.getColWidth = function (index) {
                        if (blsTableCtrl.tableConfigManager.get().cols[index].width > 0) return blsTableCtrl.tableConfigManager.get().cols[index].width + 'px';
                    };
                    scope.getColConfig = function (fieldName) {
                        return blsTableCtrl.tableConfigManager.get().cols.filter(function (col, index) {
                            if (col.fieldName === fieldName) return true;
                        })[0];
                    };
                    scope.getColConfigIndex = function (fieldName) {
                        var colConfig = scope.getColConfig(fieldName);
                        return colConfig ? blsTableCtrl.tableConfigManager.get().cols.indexOf(colConfig) : null; // or undefined
                    };
                    scope.glyphOrder = function (col) {
                        //$log.debug('    glyphOrder function was called');
                        if (!col.sortable) return '';
                        var colConfig = scope.getColConfig(col.fieldName);
                        if (colConfig.sortDirection)
                            return 'fa-sort' + (colConfig.sortDirection == 'none' ? '' : ('-' + colConfig.sortDirection));
                        return 'fa-sort';
                    };
                    $timeout(function () {
                        element.siblings('table').find('thead').append(eleTpl);
                        //$log.debug('    compiling blsHeader');
                        $compile(eleTpl)(scope);
                    }, 0);
                });
            }
        };
        var controller = ['$scope', '$filter', '$timeout', '$element', '$log', 'localStorageService', 'blsTableServices',
            function ($scope, $filter, $timeout, $element, $log, localStorageService, blsTableServices) {
                var me = this;
                me.resizeColData = null;
                me.resizePressed = false;

                $scope.getTdTpl = function (col) {
                    if (col.headerTpl && col.headerTpl !== '') {
                        col.headerTpl = col.headerTpl.replace('::field', 'c');
                        return col.headerTpl;
                    }
                };

                $scope.order = function (col) {
                    if (!me.resizePressed)
                        if (col.sortable) {
                            var colConfig = $scope.getColConfig(col.fieldName);
                            colConfig.sortDirection = colConfig.sortDirection == sortDirectionEnum.asc ? sortDirectionEnum.desc : sortDirectionEnum.asc;
                            $scope.setSortDirection($scope.getColConfigIndex(col.fieldName), colConfig.sortDirection);
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
                        //$log.debug(me.resizeData);
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
