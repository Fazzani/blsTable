app.directive('hfGrid', ['$log', '$templateRequest', '$compile', 'localStorageService', function($log, $templateRequest, $compile, localStorageService) {
    var link = {
        post: function(scope, element, attrs, ctrls) {
            $log.debug('_______in post hfGrid');
            // if (scope.childSource()) {
            //     scope.cols.unshift({title:'child',field:'childCol'});
            //     scope.rows.unshift({childCol:'>'});
            // }
        }
    };
    var ctrl = function($scope, $element, $log, $templateRequest, $compile) {
        $log.debug('in hfGrid');
        var me = this;
        $scope.rows = $scope.cols = [];
        $scope.uniqueId = 'hfGrid_' + $element[0].id;
        $scope.sort = $scope.pagination = {};
        $scope.isSortInited = false;
        $scope.core = {
            isLoading: true,
            isFirstLoad: true
        };
        this.reloadData = function() {
            $scope.core.isLoading = true;
            $scope.source()($scope.pagination.pageIndex, $scope.pagination.itemsPerPage, $scope.pagination.searchedText, $scope.sort.orderBy, $scope.sort.order).then(function(res) { //query: pageIndex, pageLength, searchedText, orderBy, order
                $log.debug('dataSource => ', res);
                $scope.rows = res.data;
                $scope.core.isLoading = false;
                if ($scope.core.isFirstLoad) {
                    $templateRequest('templates/hfGridTpl.html').then(function(response) {
                        $log.debug('**************************  start compile');
                        // compile the html, then link it to the scope
                        elem = $compile(response)($scope);
                        // append the compiled template inside the element
                        $element.html(elem);
                        $scope.core.isFirstLoad = false;
                    });
                }
            });
        }
        $scope.$on('hfGridPaginationChanged', function(e, pagination) {
            $log.debug('on hfGridPaginationChanged intercepted');
            $scope.pagination = pagination;
            //fire refresh data
            me.reloadData();
        });
        $scope.$on('hfGridSortChanged', function(e, sort) {
            $log.debug('on hfGridSortChanged intercepted');
            $scope.sort = sort;
            //fire refresh data
            me.reloadData();
        });
        this.setSort = function(sort) {
            if (sort != $scope.sort) {
                $log.debug('set Sort');
                $scope.sort = sort;
                //fire refresh data
                //me.reloadData();
            }
        }
        this.getSort = function() {
            return $scope.sort;
        }
        this.setCols = function(cols) {
            $scope.cols = cols;
            $log.debug('settings cols => ', $scope.cols)
        };
        this.getIsSortInited = function() {
            return $scope.isSortInited;
        }
        this.setIsSortInited = function(val) {
            $scope.isSortInited = val;
        }
    };
    return {
        controller: ctrl,
        restrict: 'E',
        link: link,
        scope: {
            source: '&',
            childSource: '&'
        },
        //templateUrl: 'templates/hfGridTpl.html'
    };
}]).directive('hfGridColumns', ['$log', function($log) {
    var link = function(scope, element, attrs, controllers) {
        var hfGridCtrl = controllers[0];
        var hfGridColumnsCtrl = controllers[1];
        hfGridCtrl.setCols(hfGridColumnsCtrl.getCols());
        $log.debug('link hfGridColumns');
        //controllers[1].initCols(ctrlhfGrid.sourceFunc);
    };
    var ctrl = function($scope, $element, $log) {
        var cols = [];
        this.addCol = function(col) {
            cols.push(col);
            $log.debug("columns : ", col);
        };
        this.getCols = function() {
            return cols;
        };
    };
    return {
        require: ['^hfGrid', 'hfGridColumns'],
        link: link,
        controller: ctrl
    };
}]).directive('hfGridColumn', ['$log', function($log) {
    var link = function(scope, element, attrs, ctrlHfGridColumns) {
        $log.debug('link hfGridColumn');
        ctrlHfGridColumns.addCol({
            title: attrs.title,
            field: attrs.field,
            sortable: angular.isDefined(attrs.sortable),
            editable: angular.isDefined(attrs.editable),
            filterable: angular.isDefined(attrs.editable)
        });
    };
    var ctrl = function($scope, $element, $log) {};
    return {
        require: '^hfGridColumns',
        link: link,
        restrict: 'E',
        controller: ctrl
    };
}]).directive('hfGridChilren', ['$log', '$compile', function($log, $compile) {
    //<i ng-if="col.sortable" class="pull-left fa fa-sort " ng-class="glyphOrder(col.id)"></i>
    var link = {
        pre: function(scope, element, attrs, ctrls) {
            $log.debug('=> pre link hfGridChilren');
            element.removeAttr('hf-grid-sortable');
        },
        post: function(scope, element, attrs, ctrls) {
            $log.debug('=> post link hfGridChilren');
            var hfGridCtrl = ctrls[0];
            var hfGridSortableCtrl = ctrls[1];
            element.on("click", function() {
                scope.onSort(scope.col);
            });
            //init order user
            if (!hfGridCtrl.getIsSortInited()) {
                $log.debug('Sort is not inited !!!!!');
                hfGridSortableCtrl.init();
                hfGridCtrl.setIsSortInited(true);
                hfGridCtrl.setSort(scope.sort);
            } else {
                scope.sort = hfGridCtrl.getSort();
            }
            // $log.debug('================>> Link hfGridChilren sort =>', scope.sort);
            var sortElement = angular.element('<i ng-if="col.sortable" class="pull-left fa fa-sort " ng-click="onSort(col)" ng-class="glyphOrder(col)"></i>');
            element.append($compile(sortElement)(scope));
        }
    };
    var ctrl = function($scope, $element, $log) {
        var me = this;
        
    };
    return {
        require: ['^hfGrid', 'hfGridSortable'],
        link: link,
        restrict: 'A',
        controller: ctrl,
        priority: -9
    };
}]).directive('hfGridSortable', ['$log', '$compile', function($log, $compile) {
    //<i ng-if="col.sortable" class="pull-left fa fa-sort " ng-class="glyphOrder(col.id)"></i>
    var link = {
        pre: function(scope, element, attrs, ctrls) {
            $log.debug('=> pre link hfGridSortable');
            element.removeAttr('hf-grid-sortable');
        },
        post: function(scope, element, attrs, ctrls) {
            $log.debug('=> post link hfGridSortable');
            var hfGridCtrl = ctrls[0];
            var hfGridSortableCtrl = ctrls[1];
            element.on("click", function() {
                scope.onSort(scope.col);
            });
            //init order user
            if (!hfGridCtrl.getIsSortInited()) {
                $log.debug('Sort is not inited !!!!!');
                hfGridSortableCtrl.init();
                hfGridCtrl.setIsSortInited(true);
                hfGridCtrl.setSort(scope.sort);
            } else {
                scope.sort = hfGridCtrl.getSort();
            }
            // $log.debug('================>> Link hfGridSortable sort =>', scope.sort);
            var sortElement = angular.element('<i ng-if="col.sortable" class="pull-left fa fa-sort " ng-click="onSort(col)" ng-class="glyphOrder(col)"></i>');
            element.append($compile(sortElement)(scope));
        }
    };
    var ctrl = function($scope, $element, $log, localStorageService) {
        var me = this;
        var orderByKey = '_orderBy';
        var orderKey = '_order';
        $scope.sort = {};
        $scope.onSort = function(col) {
            $log.debug('sorting on ', col.field);
            $scope.sort.order = col.field == $scope.sort.orderBy ? !$scope.sort.order : $scope.sort.order;
            $scope.sort.orderBy = col.field;
            me.saveUserData();
            $scope.$emit('hfGridSortChanged', $scope.sort);
        };
        $scope.glyphOrder = function(col) {
            $log.debug('glyphOrder => sort', $scope.sort, col.field);
            if (col.field != $scope.sort.orderBy) return '';
            return $scope.sort.order ? 'fa-sort-asc' : 'fa-sort-desc';
        };
        this.saveUserData = function() {
            if (localStorageService.isSupported) {
                localStorageService.set($scope.uniqueId + orderByKey, $scope.sort.orderBy);
                localStorageService.set($scope.uniqueId + orderKey, $scope.sort.order);
            }
        };
        this.init = function() {
            if (localStorageService.isSupported) {
                $scope.sort.orderBy = localStorageService.get($scope.uniqueId + orderByKey);
                $scope.sort.order = localStorageService.get($scope.uniqueId + orderKey);
            }
            // $log.debug('init sort =>', $scope.sort);
        }
    };
    return {
        require: ['^hfGrid', 'hfGridSortable'],
        link: link,
        restrict: 'A',
        controller: ctrl,
        priority: -10
    };
}]).directive('hfPagination', ['$log', function($log) {
    var link = function(scope, element, attrs, ctrls) {
        $log.debug('in link hfPagination');
        var hfGridCtrl = ctrls[0];
        scope.pagination = {
            pageIndex: 1,
            searchedText: '',
            totalItems: false
        };
        attrs.$observe('totalItems', function(newVal, oldVal) {
            if (newVal != oldVal) {
                scope.pagination.totalItems = newVal;
                scope.pagination.itemsPerPage = scope.$eval(attrs.itemsPerPage);
                scope.pagination.range = scope.$eval(attrs.range);
                scope.pagination.totalItems = scope.$eval(attrs.totalItems);
                scope.pagination.maxSize = scope.$eval(attrs.maxSize);
                $log.debug('pagination.totalItems => ', scope.pagination.totalItems);
                //hfGridCtrl.setPagination(scope.pagination);
            }
        });
    };
    var ctrl = function($scope, $element, $log) {
        $scope.$watch('pagination', function(newVal, oldVal) {
            if (!$scope.pagination.totalItems) return;
            if (newVal.pageIndex == oldVal.pageIndex) $scope.pagination.pageIndex = 1;
            $log.debug('pagination changed fired');
            $scope.$broadcast('hfGridPaginationChanged', $scope.pagination);
        }, true);
    };
    return {
        require: ['^hfGrid'],
        link: link,
        restrict: 'E',
        controller: ctrl
    };
}]);
// .directive('hf-grid-footer', [function() {
//     var link = function(scope, element, attrs, ctrlhfGrid) {};
//     var ctrl = function($scope, $element, $log) {};
//     return {
//         require: '^hfGrid',
//         link: link,
//         restrict:'E',
//         controller: ctrl
//     };
// }])