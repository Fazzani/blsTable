(function(angular) {
    app.directive('blsHeader', ['$log', '$compile', '$templateCache', '$timeout', 'localStorageService', function($log, $compile, $templateCache, $timeout, localStorageService) {
        var tpl = '<tr>\
                        <th class="colHeader" ng-repeat="col in cols" ng-click="order(col)" width="{{getColWidth($index)}}" allow-drag>\
                                        {{col.title|uppercase}}\
                            <i ng-if="col.sortable" class="pull-left fa " ng-class="glyphOrder(col)"></i><i ng-if="col.resize" class="resize"></i>\
                        </th>\
                   </tr>';
        this.link = {
            pre: function(scope, element, attrs, ctrls) {
                scope.$on('blsDataGrid_initedEvent', function(e) {
                    $log.debug('    blsDataGrid_initedEvent intercepted');
                    var blsCompositeGridCtrl = ctrls[0];
                    var blsHeaderCtrl = ctrls[1];
                    scope.setPredicate(localStorageService.get(scope.storageIds.predicateId) || (scope.cols[0] == undefined ? "" : scope.cols[0].id));
                    scope.refreshDataGrid = blsCompositeGridCtrl.refreshDataGrid;
                    $log.debug('    Link => blsHeader');
                    var eleTpl = angular.element(tpl);
                    scope.getColWidth = function(index) {
                        if (blsCompositeGridCtrl.tableConfig.cols[index].width > 0) return blsCompositeGridCtrl.tableConfig.cols[index].width + 'px';
                    }
                    $timeout(function() {
                        element.siblings('table').find('thead').append(eleTpl);
                        $log.debug('    compiling blsHeader');
                        $compile(eleTpl)(scope);
                    }, 0);
                });
            }
        };
        this.controller = ['$scope', '$filter', '$timeout', '$element', '$log', 'localStorageService', 'dropableservice',
            function($scope, $filter, $timeout, $element, $log, localStorageService, dropableService) {
                var me = this;
                me.reverse = localStorageService.get($scope.storageIds.reverseId) || me.reverse;
                me.resizeColData = null;
                me.resizePressed = false;
                $log.debug('    blsHeader controller: in init...');
                $scope.setPredicate= function(predicate){
                    me.predicate = predicate;
                };
                $scope.glyphOrder = function(col) {
                    $log.debug('    glyphOrder function was called');
                    if (col.fieldName != $scope.predicate) return 'fa-sort';
                    return me.reverse ? 'fa-sort-asc' : 'fa-sort-desc';
                };
                $scope.order = function(col) {
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
                $scope.resizeStart = function(e) {
                    var target = e.target ? e.target : e.srcElement;
                    if (target.classList.contains("resize")) {
                        start = target.parentNode;
                        me.resizePressed = true;
                        startX = e.pageX;
                        startWidth = target.parentNode.offsetWidth;
                        document.addEventListener('mousemove', drag);
                        document.addEventListener('mouseup', $scope.resizeEnd);
                        e.stopPropagation();
                        e.preventDefault();
                    }
                };

                function drag(e) {
                    if (me.resizePressed) {
                        start.width = startWidth + (e.pageX - startX);
                        //$log.debug('start.width == ', start.width);
                        me.resizeColData = {
                            index: angular.element(e.target).scope().$index,
                            width: start.width
                        };
                    }
                }
                $scope.resizeEnd = function(e) {
                    if (me.resizePressed) {
                        document.removeEventListener('mousemove', drag);
                        document.removeEventListener('mouseup', $scope.resizeEnd);
                        e.stopPropagation();
                        e.preventDefault();
                        setTimeout(function() {
                            me.resizePressed = false;
                        }, 50);
                        //me.resizePressed = false;
                        $scope.setColWidth(me.resizeColData.index, me.resizeColData.width);
                        me.resizeColData = null;
                        return false;
                    }
                };
            }
        ];
        return {
            priority: -20,
            require: ['^?blsCompositeGrid', 'blsHeader'],
            restrict: 'E',
            link: this.link,
            controller: controller
        };
    }]);
})(window.angular);