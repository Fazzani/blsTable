(function(angular) {
    app.directive('blsCols', ['$log', '$compile', '$templateCache', '$timeout', function($log, $compile, $templateCache, $timeout) {
        this.link = {
            post: function(scope, element, attrs, ctrls) {
                var blsTableCtrl = ctrls[0];
                var blsColsCtrl = ctrls[1];
                $log.debug('    Link => blsCols');
                blsTableCtrl.setCols(blsColsCtrl.getCols());
            }
        };
        this.controller = ['$scope', '$filter', '$timeout', '$element', '$log', 'localStorageService', 'dropableservice',
            function($scope, $filter, $timeout, $element, $log, localStorageService, dropableService) {
                $log.debug('    controller => blsCols');
                var cols = [];
                this.addCol = function(col) {
                    cols.push(col);
                }
                this.getCols = function() {
                    return cols;
                };
            }
        ];
        return {
            priority: 0,
            require: ['^blsTable', 'blsCols'],
            restrict: 'E',
            link: this.link,
            controller: this.controller
        };
    }]).directive('blsCol', ['$log', '$compile', '$templateCache', '$timeout', function($log, $compile, $templateCache, $timeout) {
        this.link = {
            pre: function(scope, element, attrs, ctrls) {
                // var blsTableCtrl = ctrls[0];
                var blsColsCtrl = ctrls[1];
                // var blsColCtrl = ctrls[2];
                $log.debug('        Link => blsCol');
                blsColsCtrl.addCol({
                    title: attrs.title || attrs.fieldName,
                    fieldName: attrs.fieldName,
                    resize:angular.isDefined(attrs.resize),
                    tpl: element.html(),
                    sortable: angular.isDefined(attrs.sort),
                    dragable: angular.isDefined(attrs.dragable)
                });
            }
        };
        this.controller = ['$scope', '$filter', '$timeout', '$element', '$log', 'localStorageService', 'dropableservice',
            function($scope, $filter, $timeout, $element, $log, localStorageService, dropableService) {
                $log.debug('        controller => blsCol');
            }
        ];
        return {
            priority: -1,
            require: ['^blsTable', '^blsCols', 'blsCol'],
            restrict: 'E',
            link: this.link,
            controller: this.controller
        };
    }]);
})(window.angular);
(function(angular) {
  'use strict';

app.directive("blsGrid", function() {
    return {
        restrict: "E",
        transclude: true,
        scope: {
            model: '=ngModel',
            getSlaveView:'&',
            gridClass: '@',
            options: '=',
            func: '&' //function to load data (promise). on doit soit le ngModel pour passer les données ou cette promise/ the func return all Data
        },
        templateUrl: 'template/blsGrid/blsGrid.html',
        controller: ['$scope', '$filter', '$timeout', '$element', '$log', 'localStorageService', 'dropableservice',
            function($scope, $filter, $timeout, $element, $log, localStorageService, dropableService) {
                var me = this;
                $scope.source;
                var defaultOptions = {
                    multiSelection: true,
                    //autoSaveReorderColumns: true,
                    search: {
                        searchText: '',
                        searchClass: 'form-control'
                    },
                    pagination: {
                        pageLength: 5,
                        pageIndex: 1,
                        pager: {
                            nextTitle: 'Suivant',
                            perviousTitle: 'Précédent',
                            maxSize: 3
                        },
                        itemsPerPage: {
                            prefixStorage: 'ipp_', //itemsPerPage storage prefix 
                            selected: 10, // default selectet pageLength
                            range: [10, 20] //list pageLength
                        }
                    }
                };
                $scope.colOrderConfig = [];
                $scope.options = angular.extend({}, defaultOptions, $scope.options);
                $scope.columns = [];
                $scope.isLoading = true;
                $scope.dataFilterSearch = $scope.data = [];
                $scope.offset = 0;
                $scope.selectedRows = [];
                $scope.actionsEnabled = $scope.options.actions != null;
                $scope.uniqueId = $scope.options.pagination.itemsPerPage.prefixStorage + $element[0].id;
                $scope.storageIds = {
                    predicateId: 'prd_' + $scope.uniqueId,
                    reverseId: 'rvs_' + $scope.uniqueId,
                    itemsPerPageId: 'ipp_' + $scope.uniqueId,
                    colReorderDataKey: 'crdKey_' + $scope.uniqueId,
                    colResizeDataKey: 'crsKey_' + $scope.uniqueId
                };
                $scope.options.pagination.itemsPerPage.selected = localStorageService.get($scope.storageIds.itemsPerPageId) || $scope.options.pagination.itemsPerPage.selected;
                $scope.$watchCollection('source', function(newVal, oldValue) {
                    $scope.data=[];
                    $scope.isLoading = true;
                    if (newVal != oldValue) {
                        angular.forEach($scope.source, function(value, key) {
                            if ($scope.actionsEnabled) {
                                value.actions = $scope.options.actions;
                            }
                            $scope.data.push(value);
                            //if(key===0)
                            //  $scope.columns=Object.keys(value);
                            if ($scope.columns.length > 0) {
                                // angular.forEach(value,function(v, k){
                                // angular.forEach($scope.columns, function(vTmp, kTmp) {
                                //  console.log(vTmp);
                                //  console.log(k);
                                //          if(!(k in vTmp))
                                //              $scope.columns.push({id:k, displayName:k});
                                //      });
                                // });
                            } else {
                                angular.forEach(value, function(v, k) {
                                    if (k != 'actions' && $scope.actionsEnabled) $scope.columns.push({
                                        id: k,
                                        displayName: $scope.options.colDef[k] ? $scope.options.colDef[k].displayName : k
                                    });
                                });
                                if ($scope.actionsEnabled) $scope.columns.push({
                                    id: 'actions',
                                    displayName: 'Actions'
                                });
                                $scope.initResizableColumns();
                            }
                        });
                        $scope.reverse = localStorageService.get($scope.storageIds.reverseId);
                        $scope.predicate = localStorageService.get($scope.storageIds.predicateId) || ($scope.columns[0] == undefined ? "" : $scope.columns[0].id);
                        if ($scope.options.pagination.itemsPerPage && $scope.options.pagination.itemsPerPage.range && $scope.options.pagination.itemsPerPage.range.indexOf($scope.options.pagination.pageLength) < 1) $scope.options.pagination.pageLength = localStorageService.get($scope.storageIds.itemsPerPageId) || $scope.options.pagination.itemsPerPage.range[0];
                        $scope.colOrderConfig = dropableService.initReorderColumns($scope.columns, $scope.data, $scope.storageIds.colReorderDataKey);
                        $log.debug('init colOrderConfig : ' + $scope.colOrderConfig);
                    }
                    $scope.isLoading = false;
                });
                var init = function() {
                    $scope.columns = [];
                    $scope.data = [];
                    $scope.isLoading = true;
                    $log.debug('initialise BlsGrid');
                   
                    if($scope.func && angular.isDefined($scope.func()))
                    {
                    	if(!angular.isDefined($scope.func().then))
                    		throw "func must a be promise!!";
                    	$scope.func({
                            pageIndex: $scope.options.pagination.pageIndex,
                            pageLength: $scope.options.pagination.itemsPerPage.selected
                        }).then(function(d) {
                            $timeout(function() {
                                $scope.$apply(function() {
                                    $scope.dataFilterSearch = $scope.source = d.data; 
                                    $scope.isLoading = false;
                                });
                            }, 0);
                            return;
                        }, function(error) {
                            $log.error(error);
                            $scope.isLoading = false;
                        });
                    } else {
                        $scope.$watchCollection('model', function(newVal, oldValue) {
                            $log.debug('is model passed => ' + $scope.model);
                            $scope.dataFilterSearch = $scope.source = newVal;
                        });
                    }
                    $scope.isLoading = false;
                }
                $scope.initResizableColumns = function() {
                    $scope.$evalAsync(function() {
                        $($element).find('#'+$scope.storageIds.colResizeDataKey).colResizable({
                            fixed: true,
                            liveDrag: true,
                            postbackSafe: true,
                            partialRefresh: true,
                            // minWidth: 100
                        });
                    });
                }
                $scope.order = function(predicate) {
                    //$log.info('order function was called');
                    $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
                    $scope.predicate = predicate;
                    $scope.saveUserData({
                        key: $scope.storageIds.predicateId,
                        val: $scope.predicate
                    });
                    $scope.saveUserData({
                        key: $scope.storageIds.reverseId,
                        val: $scope.reverse
                    });
                };
                $scope.glyphOrder = function(col) {
                    //$log.info('glyphOrder function was called');
                    if (col != $scope.predicate) return '';
                    $scope.reverse = localStorageService.get($scope.storageIds.reverseId) || $scope.reverse;
                    return $scope.reverse ? 'fa-sort-asc' : 'fa-sort-desc';
                };
                $scope.$watch('options.pagination.pageIndex', function(newValue, oldValue) {
                    $scope.refreshOffset();
                })
                $scope.refreshOffset = function() {
                    $scope.offset = ($scope.options.pagination.pageIndex-1) * $scope.options.pagination.itemsPerPage.selected;
                }
                $scope.updateRecordsCount = function() {
                    $scope.saveUserData({
                        key: $scope.storageIds.itemsPerPageId,
                        val: $scope.options.pagination.itemsPerPage.selected
                    });
                    $scope.options.pagination.pageLength = $scope.options.pagination.itemsPerPage.selected;
                    $scope.dataFilterSearch = $filter('filter')($scope.data, $scope.options.search.searchText);
                }
                $scope.$watch('options.search.searchText', function(newValue, oldValue) {
                    $scope.dataFilterSearch = $filter('filter')($scope.data, newValue);
                    $log.debug('options.search.searchText triggred => ' + $scope.dataFilterSearch.length);
                })
                $scope.saveUserData = function(data) {
                        if (localStorageService.isSupported) localStorageService.set(data.key, data.val);
                    }
                    //Clear User Data from the localStorage //Flush
                $scope.$on('flushEvent', function(data) {
                    $log.debug(localStorageService.keys());
                    $log.debug('clearUserDataEvent intercepted');
                    if (localStorageService.isSupported) {
                        localStorageService.clearAll('^(.)+' + $scope.uniqueId + '$');
                        //localStorageService.remove('dragtable');
                    }
                });
                $scope.$on('toggleSelectAllEvent', function(ev) {
                    $log.debug('toggleSelectAllEvent intercepted');
                    $scope.selectedRows = ev.targetScope.selectedAll ? $scope.data : [];
                });
                $scope.$on('refreshEvent', function(data) {
                    $log.debug('refreshEvent intercepted');
                    init();
                });
                $scope.isActionCol = function(col) {
                    return col.id == 'actions';
                }
                $scope.toggleSelectedRow = function(data) {
                    if (!$scope.options.multiSelection) {
                        $scope.selectedRows = [data];
                    } else {
                        if ($scope.selectedRows.indexOf(data) > -1) $scope.selectedRows.splice($scope.selectedRows.indexOf(data), 1);
                        else $scope.selectedRows.push(data);
                    }
                }
                $scope.handleDrop = function(draggedData, targetElem) {
                    var srcIdx = $filter('getIndexByProperty')('id', draggedData, $scope.columns);
                    var destIdx = $filter('getIndexByProperty')('id', $(targetElem).data('originalTitle'), $scope.columns);
                    dropableService.swapArrayElements($scope.columns, srcIdx, destIdx);
                    dropableService.swapArrayElements($scope.data, srcIdx, destIdx);
                    dropableService.swapArrayElements($scope.colOrderConfig, srcIdx, destIdx);
                };
                $scope.handleDrag = function(columnName) {
                    //$log.debug('handleDrag : ' + columnName);
                    $scope.dragHead = columnName.replace(/["']/g, "");
                };
                $scope.$watchCollection('columns', function(newVal, oldVal) {
                    if (newVal != oldVal && newVal) {
                        dropableService.saveConfig($scope.storageIds.colReorderDataKey, $scope.colOrderConfig);
                    }
                })
                init();
            }
        ]
    }
});

})(window.angular);
(function(angular) {
    'use strict';
    /**
     * BLS grid (sort, search, tree, pagination)
     * @param  {[type]} )            {                                                                return {                                      restrict: "E",        transclude: true,        scope: {            source: ' [description]
     * @param  {[type]} templateUrl: 'template/blsGrid/blsGrid.html' [description]
     * @param  {[type]} controller:  function($scope,                $filter,      $timeout, $element, $log,  localStorageService [description]
     * @return {[type]}              [description]
     */
    app.directive("blsGridAsync", function() {
        return {
            restrict: "E",
            transclude: true,
            require: '^ngModel',
            scope: {
                ngModel: '=',
                gridClass: '@',
                options: '=',
                funcAsync: '&'
            },
            templateUrl: 'template/blsGrid/blsGridAsync.html',
            controller: ['$scope', '$filter', '$timeout', '$element', '$log', 'localStorageService', 'dropableservice',
                function($scope, $filter, $timeout, $element, $log, localStorageService, dropableService) {
                    var me = this;
                    var defaultOptions = {
                        multiSelection: true,
                        //autoSaveReorderColumns: true,
                        search: {
                            searchText: '',
                            searchClass: 'form-control'
                        },
                        pagination: {
                            pageLength: 5,
                            pageIndex: 1,
                            pager: {
                                nextTitle: 'Suivant',
                                perviousTitle: 'Précédent',
                                maxSize: 3
                            },
                            itemsPerPage: {
                                prefixStorage: 'ipp_', //itemsPerPage storage prefix 
                                selected: 10, // default selected pageLength
                                range: [10, 20] //list pageLength
                            }
                        }
                    };
                    $scope.colOrderConfig = [];
                    $scope.options = angular.extend({}, defaultOptions, $scope.options);
                    $scope.columns = [];
                    $scope.isLoading = true;
                    $scope.data = [];
                    $scope.selectedRows = [];
                    $scope.actionsEnabled = $scope.options.actions != null;
                    $scope.uniqueId = $scope.options.pagination.itemsPerPage.prefixStorage + $element[0].id;
                    $scope.storageIds = {
                        predicateId: 'prd_' + $scope.uniqueId,
                        reverseId: 'rvs_' + $scope.uniqueId,
                        itemsPerPageId: 'ipp_' + $scope.uniqueId,
                        colReorderDataKey: 'crdKey_' + $scope.uniqueId,
                        colResizeDataKey: 'crsKey_' + $scope.uniqueId
                    };
                    $scope.options.pagination.itemsPerPage.selected = localStorageService.get($scope.storageIds.itemsPerPageId) || $scope.options.pagination.itemsPerPage.selected;
                    $scope.$watchCollection('ngModel.data', function(newVal, oldValue) {
                        $scope.data = [];
                        $scope.isLoading = true;
                        if (newVal != oldValue) {
                            angular.forEach(newVal, function(value, key) {
                                if ($scope.actionsEnabled) {
                                    value.actions = $scope.options.actions;
                                }
                                $scope.data.push(value);
                                //if(key===0)
                                //  $scope.columns=Object.keys(value);
                                if ($scope.columns.length > 0) {
                                    // angular.forEach(value,function(v, k){
                                    // angular.forEach($scope.columns, function(vTmp, kTmp) {
                                    //  console.log(vTmp);
                                    //  console.log(k);
                                    //          if(!(k in vTmp))
                                    //              $scope.columns.push({id:k, displayName:k});
                                    //      });
                                    // });
                                } else {
                                    angular.forEach(value, function(v, k) {
                                        if (k != 'actions' && $scope.actionsEnabled) $scope.columns.push({
                                            id: k,
                                            displayName: $scope.options.colDef[k] ? $scope.options.colDef[k].displayName : k
                                        });
                                    });
                                    if ($scope.actionsEnabled) $scope.columns.push({
                                        id: 'actions',
                                        displayName: 'Actions'
                                    });
                                    $scope.initResizableColumns();
                                }
                            });
                            if ($scope.options.pagination.itemsPerPage && $scope.options.pagination.itemsPerPage.range && $scope.options.pagination.itemsPerPage.range.indexOf($scope.options.pagination.pageLength) < 1) $scope.options.pagination.pageLength = localStorageService.get($scope.storageIds.itemsPerPageId) || $scope.options.pagination.itemsPerPage.range[0];
                            $scope.colOrderConfig = dropableService.initReorderColumns($scope.columns, $scope.data, $scope.storageIds.colReorderDataKey);
                            $log.debug('init colOrderConfig : ' + $scope.colOrderConfig);
                        }
                        $scope.isLoading = false;
                    });
                    var init = function() {
                        $log.debug('initialise BlsGrid Async');
                        $log.debug($scope.options.pagination.pageLength);
                        $log.debug($scope.options.pagination.pageIndex);
                        $scope.columns = [];
                        $scope.data = [];
                        $scope.isLoading = true;
                        refreshDataGrid();
                    }
                    var refreshDataGrid = function() {
                        if (angular.isDefined($scope.funcAsync)) {
                            $scope.reverse = localStorageService.get($scope.storageIds.reverseId);
                            $scope.predicate = localStorageService.get($scope.storageIds.predicateId) || ($scope.columns[0] == undefined ? "" : $scope.columns[0].id);
                            $scope.funcAsync({
                                pageIndex: $scope.options.pagination.pageIndex,
                                pageLength: $scope.options.pagination.itemsPerPage.selected,
                                searchedText: $scope.options.search.searchText,
                                orderBy: $scope.predicate,
                                order: $scope.reverse
                            });
                        }
                    }
                    $scope.initResizableColumns = function() {
                        $scope.$evalAsync(function() {
                            $($element).find('#' + $scope.storageIds.colResizeDataKey).colResizable({
                                fixed: true,
                                liveDrag: true,
                                postbackSafe: true,
                                partialRefresh: true,
                                // minWidth: 100
                            });
                        });
                    }
                    $scope.order = function(predicate) {
                        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
                        $scope.predicate = predicate;
                        $scope.saveUserData({
                            key: $scope.storageIds.predicateId,
                            val: $scope.predicate
                        });
                        $scope.saveUserData({
                            key: $scope.storageIds.reverseId,
                            val: $scope.reverse
                        });
                        refreshDataGrid();
                    };
                    $scope.glyphOrder = function(col) {
                        //$log.info('glyphOrder function was called');
                        if (col != $scope.predicate) return '';
                        $scope.reverse = localStorageService.get($scope.storageIds.reverseId) || $scope.reverse;
                        return $scope.reverse ? 'fa-sort-asc' : 'fa-sort-desc';
                    };
                    $scope.$watch('options.pagination.pageIndex', function(newValue, oldValue) {
                        if (newValue != oldValue) {
                            $scope.options.pagination.pageIndex = newValue++;
                            refreshDataGrid();
                        }
                    })
                    $scope.updateRecordsCount = function() {
                        $scope.saveUserData({
                            key: $scope.storageIds.itemsPerPageId,
                            val: $scope.options.pagination.itemsPerPage.selected
                        });
                        $scope.options.pagination.pageLength = $scope.options.pagination.itemsPerPage.selected;
                        refreshDataGrid();
                    }
                    $scope.$watch('options.search.searchText', function(newValue, oldValue) {
                        if (newValue != oldValue) {
                            refreshDataGrid();
                        }
                        //$scope.dataFilterSearch = $filter('filter')($scope.data, newValue);
                    })
                    $scope.saveUserData = function(data) {
                            if (localStorageService.isSupported) localStorageService.set(data.key, data.val);
                        }
                        //Clear User Data from the localStorage //Flush
                    $scope.$on('flushEvent', function(data) {
                        $log.debug(localStorageService.keys());
                        $log.debug('clearUserDataEvent intercepted');
                        if (localStorageService.isSupported) {
                            localStorageService.clearAll('^(.)+' + $scope.uniqueId + '$');
                            //localStorageService.remove('dragtable');
                        }
                    });
                    $scope.$on('toggleSelectAllEvent', function(ev) {
                        $log.debug('toggleSelectAllEvent intercepted => ' + ev.targetScope.selectedAll);
                        $scope.selectedRows = ev.targetScope.selectedAll ? $scope.data : [];
                    });
                    $scope.$on('refreshEvent', function(data) {
                        $log.debug('refreshEvent intercepted');
                        init();
                    });
                    $scope.isActionCol = function(col) {
                        return col.id == 'actions';
                    }
                    $scope.toggleSelectedRow = function(data) {
                        if (!$scope.options.multiSelection) {
                            $scope.selectedRows = [data];
                        } else {
                            if ($scope.selectedRows.indexOf(data) > -1) $scope.selectedRows.splice($scope.selectedRows.indexOf(data), 1);
                            else $scope.selectedRows.push(data);
                        }
                    }
                    $scope.handleDrop = function(draggedData, targetElem) {
                        var srcIdx = $filter('getIndexByProperty')('id', draggedData, $scope.columns);
                        var destIdx = $filter('getIndexByProperty')('id', $(targetElem).data('originalTitle'), $scope.columns);
                        dropableService.swapArrayElements($scope.columns, srcIdx, destIdx);
                        dropableService.swapArrayElements($scope.data, srcIdx, destIdx);
                        dropableService.swapArrayElements($scope.colOrderConfig, srcIdx, destIdx);
                    };
                    $scope.handleDrag = function(columnName) {
                        //$log.debug('handleDrag : ' + columnName);
                        $scope.dragHead = columnName.replace(/["']/g, "");
                    };
                    $scope.$watchCollection('columns', function(newVal, oldVal) {
                        if (newVal != oldVal && newVal) {
                            dropableService.saveConfig($scope.storageIds.colReorderDataKey, $scope.colOrderConfig);
                        }
                    })
                    init();
                }
            ]
        }
    });
    angular.module("bls_tpls", []).run(["$templateCache","$templateRequest", function($templateCache,$templateRequest) {
        $templateRequest('templates/blsContainer.html');
        $templateRequest('templates/blsTr.html');
        $templateRequest('templates/blsCompositeGrid.html');

        $templateCache.put('template/blsGrid/blsGridAsync.html', '<pre> itemsCount : {{ngModel.totalItems}}  options.search.searchText : {{options.search.searchText}} pageIndex : {{options.pagination.pageIndex}} Sorting predicate = {{predicate}}; reverse = {{reverse}}</pre>\
         <div class="bls-table-container">\
            <bls-tool-bar></bls-tool-bar>\
            <div ng-class="{\'overlay\':isLoading}"><div ng-show="isLoading"><div class="double-bounce1"></div><div class="double-bounce2"></div></div></div>\
            <div><table class="{{gridClass}} blsGrid" id="{{storageIds.colResizeDataKey}}">\
                    <thead>\
                        <tr>\
                            <th class="colHeader" ng-repeat="col in columns" data-original-title="{{col.id}}" ng-click="order(col.id)" ng-class={draggable:{{!isActionCol(col)}}} droppable="{{!isActionCol(col)}}" draggable="{{!isActionCol(col)}}" dragData="{{col.id}}" drop="handleDrop" drag="handleDrag"  dragImage="5">\
                                            {{col.displayName|uppercase}}\
                                <i class="pull-left fa fa-sort"  ng-class="glyphOrder(col.id)"></i>\
                            </th>\
                        </tr>\
                    </thead>\
                    <tbody>\
                            <tr ng-class="{\'info\':(selectedRows.indexOf(d)>=0)}" ng-click="toggleSelectedRow(d)" ng-repeat="d in data">\
                                <td ng-repeat="a in columns|filter:{ id:\'!actions\'}">{{d[a.id]}}</td>\
                                <td ng-if="actionsEnabled" class="center">\
                                    <a ng-repeat="btn in options.actions" class="btn btn-default {{btn.class}}" ng-click="btn.action(d)" title="{{btn.title}}" ng-class="btn.class"><i class="{{btn.glyphicon}}"></i></a>\
                                </td>\
                            </tr>\
                        </tbody>\
                    </table>\
                        <div class="footer">\
                            <pagination class="col-md-10 col-xs-8" total-items="data.length" ng-model="options.pagination.pageIndex" max-size="options.pagination.pager.maxSize" items-per-page="options.pagination.itemsPerPage.selected" class="pagination-sm" boundary-links="true" rotate="false"></pagination>\
                            <div class="pagerList col-md-2 col-xs-4">\
                                    <select class="form-control" id="sel1" ng-model="options.pagination.itemsPerPage.selected" ng-change="updateRecordsCount()" ng-options="c as c for c in options.pagination.itemsPerPage.range" ng-selected="options.pagination.itemsPerPage.selected == c"></select>\
                            </div>\
                         </div>\
            </div>\
        </div>');
        $templateCache.put('template/blsGrid/blsGrid.html', '<pre> itemsCount : {{data.length}}  options.search.searchText : {{options.search.searchText}} pageIndex : {{options.pagination.pageIndex}} offset = {{offset}} Sorting predicate = {{predicate}}; reverse = {{reverse}}</pre>\
         <div class="bls-table-container">\
            <bls-tool-bar></bls-tool-bar>\
            <div ng-class="{\'overlay\':isLoading}"><div ng-show="isLoading"><div class="double-bounce1"></div><div class="double-bounce2"></div></div></div>\
            <div><table class="{{gridClass}} blsGrid" id="{{storageIds.colResizeDataKey}}">\
                <thead>\
                    <tr>\
                        <th class="colHeader" ng-repeat="col in columns" data-original-title="{{col.id}}" ng-click="order(col.id)" ng-class={draggable:{{!isActionCol(col)}}} droppable="{{!isActionCol(col)}}" draggable="{{!isActionCol(col)}}" dragData="{{col.id}}" drop="handleDrop" drag="handleDrag"  dragImage="5">\
                               {{col.displayName|uppercase}}\
                            <i class="pull-left fa fa-sort"  ng-class="glyphOrder(col.id)"></i>\
                        </th>\
                    </tr>\
                </thead>\
                <tbody>\
                    <tr ng-class="{\'info\':(selectedRows.indexOf(d)>=0)}" bls-slave-view ng-click="toggleSelectedRow(d)" ng-repeat="d in filteredData = (data | filter:options.search.searchText| orderBy:predicate:reverse| limitTo:options.pagination.itemsPerPage.selected:offset)">\
                        <td ng-repeat="a in columns|filter:{ id:\'!actions\'}">{{d[a.id]}}</td>\
                        <td ng-if="actionsEnabled" class="center">\
                            <a ng-repeat="btn in options.actions" class="btn btn-default {{btn.class}}" ng-click="btn.action(d)" title="{{btn.title}}" ng-class="btn.class"><i class="{{btn.glyphicon}}"></i></a>\
                        </td>\
                    </tr>\
                </tbody>\
            </table>\
            <div class="footer">\
                <pagination class="col-md-10 col-xs-8" total-items="data.length" ng-model="options.pagination.pageIndex" max-size="options.pagination.pager.maxSize" items-per-page="options.pagination.itemsPerPage.selected" class="pagination-sm" boundary-links="true" rotate="false"></pagination>\
                <div class="pagerList col-md-2 col-xs-4">\
                    <select class="form-control" id="sel1" ng-model="options.pagination.itemsPerPage.selected" ng-change="updateRecordsCount()" ng-options="c as c for c in options.pagination.itemsPerPage.range" ng-selected="options.pagination.itemsPerPage.selected == c"></select>\
                </div>\
             </div>\
            </div>\
        </div>');
$templateCache.put('template/blsGrid/blsGridMasterSlave.html', '<pre> itemsCount : {{data.length}}  options.search.searchText : {{options.search.searchText}} pageIndex : {{options.pagination.pageIndex}} offset = {{offset}} Sorting predicate = {{predicate}}; reverse = {{reverse}}</pre>\
 <div class="bls-table-container">\
    <bls-tool-bar></bls-tool-bar>\
    <div ng-class="{\'overlay\':isLoading}"><div ng-show="isLoading"><div class="double-bounce1"></div><div class="double-bounce2"></div></div></div>\
    <div><table class="{{gridClass}} blsGrid" id="{{storageIds.colResizeDataKey}}">\
        <thead>\
            <tr>\
            <th>&nbsp;</th>\
                <th class="colHeader" ng-repeat="col in columns" data-original-title="{{col.id}}" ng-click="order(col.id)" ng-class={draggable:{{!isActionCol(col)}}} droppable="{{!isActionCol(col)}}" draggable="{{!isActionCol(col)}}" dragData="{{col.id}}" drop="handleDrop" drag="handleDrag"  dragImage="5">\
                       {{col.displayName|uppercase}}\
                    <i class="pull-left fa fa-sort"  ng-class="glyphOrder(col.id)"></i>\
                </th>\
            </tr>\
        </thead>\
        <tbody>\
            <tr ng-class="{\'info\':(selectedRows.indexOf(d)>=0)}" ng-click="toggleSelectedRow(d)" ng-repeat="d in filteredData = (data | filter:options.search.searchText| orderBy:predicate:reverse| limitTo:options.pagination.itemsPerPage.selected:offset)">\
                <td class="expand"><button class="btn btn-default btn-xs" ng-click="ShowSlaveView(d)"><span class="glyphicon glyphicon-eye-open"></span></button></td>\
                <td ng-repeat="a in columns|filter:{ id:\'!actions\'}">{{d[a.id]}}</td>\
                <td ng-if="actionsEnabled" class="center">\
                    <a ng-repeat="btn in options.actions" class="btn btn-default {{btn.class}}" ng-click="btn.action(d)" title="{{btn.title}}" ng-class="btn.class"><i class="{{btn.glyphicon}}"></i></a>\
                </td>\
            </tr>\
        </tbody>\
    </table>\
    <div class="footer">\
        <pagination class="col-md-10 col-xs-8" total-items="data.length" ng-model="options.pagination.pageIndex" max-size="options.pagination.pager.maxSize" items-per-page="options.pagination.itemsPerPage.selected" class="pagination-sm" boundary-links="true" rotate="false"></pagination>\
        <div class="pagerList col-md-2 col-xs-4">\
            <select class="form-control" id="sel1" ng-model="options.pagination.itemsPerPage.selected" ng-change="updateRecordsCount()" ng-options="c as c for c in options.pagination.itemsPerPage.range" ng-selected="options.pagination.itemsPerPage.selected == c"></select>\
        </div>\
     </div>\
    </div>\
</div>');
        $templateCache.put('Views/Partials/slavePostTemplate.html','<table class="table table-hover table-striped"><tr ng-repeat="c in listData"><td>{{c.id}}</td><td>{{c.name}}</td><td>{{c.email}}</td><td>{{c.body}}</td></tr></table>');
    }]);
})(window.angular);

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
                    var blsTableCtrl = ctrls[0];
                    var blsHeaderCtrl = ctrls[1];
                    scope.setPredicate(localStorageService.get(scope.storageIds.predicateId) || (scope.cols[0] == undefined ? "" : scope.cols[0].id));
                    scope.refreshDataGrid = blsTableCtrl.refreshDataGrid;
                    $log.debug('    Link => blsHeader');
                    var eleTpl = angular.element(tpl);
                    scope.getColWidth = function(index) {
                        if (blsTableCtrl.tableConfig.cols[index].width > 0) return blsTableCtrl.tableConfig.cols[index].width + 'px';
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
            require: ['^?blsTable', 'blsHeader'],
            restrict: 'E',
            link: this.link,
            controller: controller
        };
    }]);
})(window.angular);
(function(angular) {
    app.directive('blsRows', ['$log', '$compile', '$templateCache', '$timeout', function($log, $compile, $templateCache, $timeout) {
        var rowTpl = '<tr ng-repeat="d in data" ><td ng-repeat="c in cols" dynamic="getTdTpl(c)">{{d[c.fieldName]}}</td></tr>';
        this.link = function(scope, element, attrs, ctrls) {
            // var blsTableCtrl = ctrls[0];
            // debugger;
            
            var eleTpl = angular.element(rowTpl);
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
    }]).directive('blsRowChild', ['$log', '$compile', '$templateCache', '$timeout', function($log, $compile, $templateCache, $timeout) {
        var templateRow = '<tr ng-repeat="d in data" data-bls-id="{{$id}}" parentId="{{parentId}}" bls-row-child func="getChildren" data-level="{{level}}"><td ng-repeat="c in cols" dynamic="getTdTpl(c)">{{d[c.fieldName]}}</td></tr>';
        var tplCaret = '<i id="{{$id}}" class="fa {{expand?\'fa-caret-down\':\'fa-caret-right\'}}" style="padding:0 4px 0 {{5+(15*level)}}px"></i>';
        this.link = function(scope, element, attrs, ctrls, transclude) {
            $log.debug('    Link => blsRows');
            var me = this;
            this.childs = [];
            var elemTplCaret = angular.element(tplCaret);
            scope.expand = false;
            scope.firstExpand = true;
            this.getRowsChilds = function(id, target) {
                var siblings = target.siblings('tr[parentId="' + id + '"]').toArray();
                me.childs = me.childs.concat(siblings);
                for (var i = 0; i < siblings.length; i++) {
                    me.childs.concat(getRowsChilds(angular.element(siblings[i]).data('blsId'), $(siblings[i])));
                };
                return me.childs;
            };
            scope.getTdTpl = function(col, d) {
                if (col.tpl != '') {
                    col.tpl = col.tpl.replace('::data', 'd');
                    return col.tpl.replace('::field', "d[c.fieldName]");
                }
            }
            var elemTplRow = angular.element(templateRow);
            if (!angular.isDefined(attrs.level)) {
                scope.level = 0;
                element.data('dataLevel', scope.level);
            }
            $timeout(function() {
                this.toggle = function(id, target, expand) {
                    me.childs = me.getRowsChilds(id, target);
                    me.childs.forEach(function(child) {
                        expand ? $(child).show() : $(child).hide();
                    });
                }
                elemTplCaret.on('click', function(e) {
                    $log.debug('    toggle row');
                    var $this = $(this);
                    if (scope.firstExpand) {
                        elemTplCaret.addClass('fa-spinner');
                        scope.firstExpand = false;
                        var childScope = scope.$new();
                        scope.getChildren()(scope.d).then(function(response) {
                            elemTplCaret.removeClass('fa-spinner');
                            if (response.data.length > 0) {
                                childScope.data = response.data;
                                childScope.level = scope.level + 1;
                                childScope.parentId = scope.$id;
                                $compile(elemTplRow)(childScope);
                                scope.expand = !scope.expand;
                                me.toggle(scope.$id, $this.closest('tr'), scope.expand);
                                elemTplRow.insertAfter(element);
                            } else elemTplCaret.removeClass('fa').removeClass('fa-caret-down').removeClass('fa-caret-right').off('click');
                        });
                    } else scope.$apply(function() {
                        scope.expand = !scope.expand;
                        me.toggle(scope.$id, $this.closest('tr'), scope.expand);
                    });
                });
                //insert caret
                $compile(elemTplCaret)(scope);
                angular.element(element.find('td')[0]).prepend(elemTplCaret);
            }, 0);
        };
        return {
            require: ['^blsTable'],
            priority: -16,
            restrict: 'A',
            link: this.link,
            scope: true
        };
    }]).directive('dynamic', ['$log', '$compile', function($log, $compile) { //compile dynamic html
        return {
            restrict: 'A',
            replace: true,
            link: function(scope, ele, attrs) {
                scope.$watch(attrs.dynamic, function(html) {
                    $log.debug('       in dynamic html');
                    ele.html(html);
                    $compile(ele.contents())(scope);
                });
            }
        };
    }]);
})(window.angular);
(function (angular) {
    app.directive('blsTable', ['$log', '$compile', '$templateCache', '$timeout', 'dropableservice', function ($log, $compile, $templateCache, $timeout, dropableservice) {
        var me = this;
        this.tpl = $templateCache.get('templates/blsTable.html');
        this.controller = ['$scope', '$attrs', '$filter', '$timeout', '$element', '$log', 'localStorageService', 'dropableservice',
            function ($scope, $attrs, $filter, $timeout, $element, $log, localStorageService, dropableService) {
                var me = this;
                me.initialLoad = $scope.isLoading = true;
                this.tableConfig = {};
                $scope.uniqueId = "blsContainer_" + $scope.$id; //$scope.options.pagination.itemsPerPage.prefixStorage + $element[0].id;
                $scope.storageIds = {
                    predicateId: 'prd_' + $scope.uniqueId,
                    reverseId: 'rvs_' + $scope.uniqueId,
                    itemsPerPageId: 'ipp_' + $scope.uniqueId,
                    tableConfig: 'tblConfig_' + $scope.uniqueId,
                    colReorderDataKey: 'crdKey_' + $scope.uniqueId,
                    colResizeDataKey: 'crsKey_' + $scope.uniqueId
                };
                var defaultOptions = {
                    multiSelection: true,
                    //autoSaveReorderColumns: true,
                    search: {
                        searchText: '',
                        searchClass: 'form-control'
                    },
                    pagination: {
                        pageLength: 5,
                        pageIndex: 1,
                        pager: {
                            nextTitle: 'Suivant',
                            perviousTitle: 'Précédent',
                            maxSize: 3
                        },
                        itemsPerPage: {
                            prefixStorage: 'ipp_', //itemsPerPage storage prefix 
                            selected: 10, // default selected pageLength
                            range: [10, 20] //list pageLength
                        }
                    }
                };
                $scope.options = angular.extend({}, defaultOptions, $scope.options);
                if ($scope.options.pagination.itemsPerPage && $scope.options.pagination.itemsPerPage.range && $scope.options.pagination.itemsPerPage.range.indexOf($scope.options.pagination.pageLength) < 1) $scope.options.pagination.pageLength = localStorageService.get($scope.storageIds.itemsPerPageId) || $scope.options.pagination.itemsPerPage.range[0];
                $scope.$watch('options.pagination.pageIndex', function (newValue, oldValue) {
                    if (newValue != oldValue) {
                        $scope.options.pagination.pageIndex = newValue++;
                        me.refreshDataGrid();
                    }
                });
                $scope.updateRecordsCount = function () {
                    $scope.saveUserData({
                        key: $scope.storageIds.itemsPerPageId,
                        val: $scope.options.pagination.itemsPerPage.selected
                    });
                    $scope.options.pagination.pageLength = $scope.options.pagination.itemsPerPage.selected;
                    me.refreshDataGrid();
                }
                //Reload ngModel by the Func
                this.refreshDataGrid = function () {
                    if (angular.isDefined($scope.funcAsync)) {
                        me.initColConfig();
                        $scope.isLoading = true;
                        $scope.reverse = localStorageService.get($scope.storageIds.reverseId);
                        $scope.predicate = localStorageService.get($scope.storageIds.predicateId) || ($scope.cols[0] == undefined ? "" : $scope.cols[0].id);
                        $scope.funcAsync({
                            pageIndex: $scope.options.pagination.pageIndex,
                            pageLength: $scope.options.pagination.itemsPerPage.selected,
                            searchedText: $scope.options.search.searchText,
                            orderBy: $scope.predicate,
                            order: $scope.reverse
                        });
                    }
                }
                this.setCols = function (cols) {
                    $scope.cols = cols;
                    $scope.$emit('blsDataGrid_initedEvent');
                    $log.debug('cols =>', $scope.cols);
                    me.initColConfig();
                    me.refreshDataGrid();
                }
                this.changeColumnsOrder = function (from, to) {
                    $scope.$applyAsync(function () {
                        $scope.data.swap(from, to);
                        $scope.cols.swap(from, to);
                        me.tableConfig.cols.swap(from, to);
                        $scope.saveUserData({
                            key: $scope.storageIds.tableConfig,
                            val: me.tableConfig
                        });
                    });
                }
                $scope.setColWidth = function (index, width) {
                    $log.debug('setColWidth => ', index, ' width = ', width);
                    me.tableConfig.cols[index].width = width;
                    $scope.saveUserData({
                        key: $scope.storageIds.tableConfig,
                        val: me.tableConfig
                    });
                };
                $scope.$watch('options.search.searchText', function (newValue, oldValue) {
                    if (me.timerSearch) $timeout.cancel(me.timerSearch);
                    if (newValue != oldValue) {
                        me.timerSearch = $timeout(function () {
                            me.refreshDataGrid();
                        }, 500);
                    }
                });
                $scope.$watch('data', function (newValue, oldValue) {
                    if (newValue != oldValue) {
                        if ($scope.cols.length > 0) {
                            $log.debug('init Table config');
                            me.initTableConfig();
                        }
                    }
                });
                //init columns disposition from the localStorage if exists else create new Object
                this.initColConfig = function () {
                    if (localStorageService.isSupported) me.tableConfig = localStorageService.get($scope.storageIds.tableConfig);
                    if (me.tableConfig == null) {
                        me.tableConfig = {
                            id: $scope.uniqueId,
                            cols: []
                        };
                        for (var i = 0; i <= $scope.cols.length - 1; i++) {
                            me.tableConfig.cols.push({
                                index: i,
                                width: -1
                            });
                        };
                        $scope.saveUserData({
                            key: $scope.storageIds.tableConfig,
                            val: me.tableConfig
                        });
                    }
                }
                //Swap data columns according to tableConfig 
                this.initTableConfig = function () {
                    if (me.initialLoad) {
                        for (var i = 0; i <= me.tableConfig.cols.length - 1; i++) {
                            if (i != me.tableConfig.cols[i].index) {
                                if (i > me.tableConfig.cols[i].index) continue;
                                $log.debug('swap form ', i, ' to => ', me.tableConfig.cols[i].index);
                                $scope.data.swap(i, me.tableConfig.cols[i].index);
                                $scope.cols.swap(i, me.tableConfig.cols[i].index);
                            }
                        }
                        me.initialLoad = false;
                    }
                    $scope.isLoading = false;
                }
                $scope.saveUserData = function (data) {
                    if (localStorageService.isSupported) localStorageService.set(data.key, data.val);
                }
                $scope.$on('flushEvent', function (data) {
                    $log.debug(localStorageService.keys());
                    $log.debug('clearUserDataEvent intercepted => $scope.uniqueId : ', $scope.uniqueId);
                    if (localStorageService.isSupported) {
                        localStorageService.clearAll('^(.)+' + $scope.uniqueId + '$');
                    }
                });
                $scope.$on('refreshEvent', function (data) {
                    $log.debug('refreshEvent intercepted');
                    me.refreshDataGrid();
                });
                $scope.$on('exportEvent', function (e, format) {
                    $log.debug('exportEvent intercepted to type : ', format);
                    $element.find('table').tableExport({
                        type: format
                    });
                });

                $scope.$on(
                        "$destroy",
                        function (event) {
                            $timeout.cancel(me.timerSearch);
                        }
                    );
                $scope.isHierarchical = function () {

                    return angular.isDefined($attrs.getChildren);
                };
            }
        ];
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            template: this.tpl,
            controller: this.controller,
            scope: {
                data: '=ngModel',
                funcAsync: '&',
                getChildren: '&',
                options: '=',
                totalItems: '='
            }
        };
    }])
})(window.angular);
app.directive('blsDropDown', ['$log', function($log) {
    var tpl = '<div class="dropdown">\
                  <button class="btn btn-default btn-sm dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">\
                    {{title}}\
                    <span class="caret"></span>\
                  </button>\
                  <ul class="dropdown-menu" aria-labelledby="dropdownMenu1" >\
                    <li ng-repeat="link in links"><a ng-click="func()(link)">{{link}}</a></li>\
                  </ul>\
             </div>';
    return {
        template: tpl,
        replace: true,
        scope: {
            links: '=',
            title: '=',
            func: '&'
        },
        link: function(scope, element, attrs) {}
    }
}]);
app.directive('blsToolBar', [function() {
    // Runs during compile
    return {
        priority: 2,
        scope: true, // {} = isolate, true = child, false/undefined = no change
        restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
        template: '<div class="row">\
                       <div class="btn-toolbar pull-right col-xs-12" role="toolbar">\
                            <div class="btn-group btn-group-sm pull-right ">\
                                <bls-drop-down links="links" func="export" title="titleExportButton" ></bls-drop-down>\
                                <button type="button" class="{{btnClass}}" tooltip="Settings" aria-label="Right Align"><span class="fa fa-cog" aria-hidden="true"></span></button>\
                                <button type="button" ng-click="clearUserData()" class="{{btnClass}}" tooltip="Reset" aria-label="Right Align"><span class="fa fa-recycle" aria-hidden="true"></span></button>\
                                <button type="button" ng-click="refresh()" class="{{btnClass}}" tooltip="Refresh" aria-label="Right Align"><span class="fa fa-refresh" aria-hidden="true"></span></button>\
                                <button type="button" ng-click="toggleSelectAll()" class="{{btnClass}}" tooltip="{{selectedAll?\'Deselect all\':\'Select all\'}}" aria-label="Right Align"><span class="glyphicon " ng-class="selectedAll?\'glyphicon-unchecked\':\'glyphicon-check\'" aria-hidden="true"></span></button>\
                            </div>\
                            <form action="" class="search-form pull-right col-md-2 col-xs-12">\
                                <div class="form-group has-feedback">\
                                    <label for="search" class="sr-only">Search</label>\
                                    <input type="text" class="{{options.search.searchClass}}" name="search" id="search" placeholder="{{searchPlaceHolder}}" ng-model="options.search.searchText">\
                                    <span class="glyphicon glyphicon-search form-control-feedback"></span>\
                                </div>\
                            </form>\
                        </div>\
                 </div>',
        replace: true,
        //transclude: true,
        controller: function($scope, $element, $document, $log) {
            $scope.btnClass = "btn btn-default";
            $scope.searchPlaceHolder = "search...";
            $scope.selectedAll = false;
            $scope.titleExportButton = "Export";
            $scope.clearUserData = function() {
                $scope.$emit('flushEvent');
            }
            $scope.refresh = function() {
                $scope.$emit('refreshEvent');
            }
            $scope.toggleSelectAll = function() {
                $scope.selectedAll = !$scope.selectedAll;
                $scope.$emit('toggleSelectAllEvent', $scope.selectedAll);
            }
            $scope.export = function(type) {
                $log.debug('    export type => ', type)
                $scope.$emit('exportEvent', type);
            }
            $scope.links = ['excel', 'xml', 'csv','sql', 'json','doc', 'powerpoint' ];
        }
    };
}]);
(function(angular) {
    'use strict';
    app.directive("blsTr", function($compile, $templateRequest, $templateCache, $log) {
        var link = {
            post: function(scope, element, attrs, ctrls) {
                var blsTrCtrl = ctrls[1];
                var blsNestedGridCtrl = ctrls[0];
                if (!angular.isDefined(scope.row)) scope.row = scope.$eval(attrs.blsTr);
                if (!angular.isDefined(scope.columns)) scope.columns = scope.$parent.$parent.columns;
                if (!angular.isDefined(scope.config)) scope.config = scope.$eval(attrs.config);
                if (!angular.isDefined(scope.nestedDataFunc)) scope.nestedDataFunc = scope.$eval(attrs.nestedDataFunc);
                if (!angular.isDefined(scope.index)) scope.index = scope.$eval(attrs.index);
                if (!scope.config) {
                    scope.config = {
                        level: 0,
                        collapsed: true,
                        loaded: false
                    };
                } else {
                    scope.config.level++;
                    scope.childConfig = {
                        level: scope.config.level + 1,
                        collapsed: true,
                        loaded: false
                    };
                }
                $log.debug('config  ===== ', scope.config);
                // scope.nestedDataFunc = scope.$parent.$parent.nestedDataFunc;
                // scope.row.childs=[];
                $log.debug('**************************  start compile blsTr');
                scope.tpl = angular.element($templateCache.get('templates/blsTr.html'));
                element.replaceWith(scope.tpl);
                $compile(scope.tpl)(scope);
            }
        };
        return {
            restrict: "A",
            require: ['^?blsNestedGrid', 'blsTr'],
            link: link,
            scope:{},
            // templateUrl:'templates/blsTr.html',
            // replace:true,
            controller: ['$scope', '$element', '$attrs', '$log', '$compile', '$templateCache', function($scope, $element, $attrs, $log, $compile, $templateCache) {
                $log.debug('row = ', $scope.row);
                $scope.expand = function() {
                    $log.debug('expanding data');
                    $scope.config.collapsed = !$scope.config.collapsed;
                    if (!$scope.config.loaded) {
                        $scope.config.loaded = true;
                        $scope.nestedDataFunc()($scope.row).then(function(res) {
                            if (!angular.isArray(res.data)) res.data = [res.data];
                            angular.forEach(res.data, function(value, key) {
                                var childScope = $scope.$new(true);
                                childScope.nestedDataFunc = $scope.nestedDataFunc();
                                childScope.columns = $scope.columns;
                                childScope.row = value;
                                childScope.index = $scope.index + 1;
                                childScope.config = {
                                    level: $scope.config.level + 1,
                                    collapsed: true,
                                    loaded: false
                                };
                                $compile($scope.tpl)(childScope);
                                $scope.tpl.insertAfter($element);
                                $log.debug('childs length : ', res.data);
                            });
                            $scope.$parent.data.splice($scope.index + 1, 0, res.data);;
                        });
                    }
                }
                $scope.collpaseState = function(config) {
                    //$log.debug('in collpaseState ', config);
                    if (angular.isDefined(config)) {
                        return config.collapsed ? 'fa-caret-right' : 'fa-caret-down';
                    }
                }
            }]
        };
    });
})(window.angular);
app.directive("allowDrag", function() {
    return {
        restrict: "A",
        require: ['^blsTable'],
        controller: function() {},
        compile: function(el, attr) {
            function removeDragClass(element, className) {
                var elm = element[0].parentNode.querySelector('.' + className);
                if (!!elm) elm.classList.remove(className);
            }
            return function pre(scope, element, attrs, ctrl) {
                var blsTableCtrl = ctrl[0];
                element.attr('draggable', true);
                element.bind("dragstart", function(e) {
                    blsTableCtrl.target = this;
                    this.classList.add("dragged");
                    e.originalEvent.dataTransfer.setData("text", blsTableCtrl.target.cellIndex);
                });
                element.bind("dragover", function(e) {
                    e.preventDefault();
                });
                element.bind("dragenter", function(e) {
                    blsTableCtrl.toTarget = this;
                    if (!this.classList.contains("draggedOver") && !this.classList.contains("dragged")) this.classList.add("draggedOver");
                    e.preventDefault();
                    e.stopPropagation();
                });
                element.bind("dragend", function(e) {
                    if (this.classList.contains("dragged")) this.classList.remove("dragged");
                    e.preventDefault();
                });
                element.bind("dragleave", function(e) {
                    this.classList.remove("draggedOver");
                });
                element.bind("drop", function(e) {
                    var currentIndex = blsTableCtrl.toTarget.cellIndex,
                        draggedIndex = parseInt(e.originalEvent.dataTransfer.getData("text"), 10);
                    removeDragClass(element, 'dragged');
                    removeDragClass(element, 'draggedOver');
                    blsTableCtrl.changeColumnsOrder(currentIndex, draggedIndex);
                    e.preventDefault();
                });
            };
        }
    };
});
//
// http://litutech.blogspot.fr/2014/02/an-angular-table-directive-having.html
//
//---------------------------------------------------------------------------
app.directive('droppable', ['$parse',
    function($parse) {
        return {
            link: function(scope, element, attr) {
                function onDragOver(e) {
                    console.log('drag over');
                    if (e.preventDefault) {
                        e.preventDefault();
                    }
                    if (e.stopPropagation) {
                        e.stopPropagation();
                    }
                    e.originalEvent.dataTransfer.dropEffect = 'move';
                    return false;
                }

                function onDrop(e) {
                    console.log('onDrop');
                    if (e.preventDefault) {
                        e.preventDefault();
                    }
                    if (e.stopPropagation) {
                        e.stopPropagation();
                    }
                    var data = e.originalEvent.dataTransfer.getData("Text");
                    data = angular.fromJson(data);
                    var dropfn = attr.drop;
                    var fn = $parse(attr.drop);
                    scope.$apply(function() {
                        scope[dropfn](data, e.target);
                    });
                }
                element.bind("dragover", onDragOver);
                element.bind("drop", onDrop);
            }
        };
    }
]);
app.directive('draggable', function() {
    return {
        link: function(scope, elem, attr) {
            elem.attr("draggable", true);
            var dragDataVal = '';
            var draggedGhostImgElemId = '';
            attr.$observe('dragdata', function(newVal) {
                dragDataVal = newVal;
            });
            attr.$observe('dragimage', function(newVal) {
                draggedGhostImgElemId = newVal;
            });
            elem.bind("dragstart", function(e) {
                var sendData = angular.toJson(dragDataVal);
                e.originalEvent.dataTransfer.setData("Text", sendData);
                // if (attr.dragimage !== 'undefined') {
                //   e.originalEvent.dataTransfer.setDragImage(
                //     document.getElementById(draggedGhostImgElemId), 0, 0);
                //}
                var dragFn = attr.drag;
                if (dragFn !== 'undefined') {
                    scope.$apply(function() {
                        scope[dragFn](sendData);
                    })
                }
            });
        }
    };
});
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
 'use strict';

 app.directive("panel", function() {
     return {
         link: function(scope, element, attrs) {
             scope.dataSource = "directive";
         },
         restrict: "E",
         scope: true,
         template: function() {
             return angular.element(document.querySelector("#template")).html();
         },
         transclude: true
     }
 })

'use strict';

// app.directive("resizable", function($timeout, $log) {
//     return {
//         link: function($scope, element, attrs) {
//             $log.debug('init resizable..');
//             $log.debug(element);
//             $scope.$evalAsync(function() {
//                 $timeout(function() {
//                     element.colResizable({
//                         fixed: true,
//                         liveDrag: true,
//                         postbackSafe: true,
//                         partialRefresh: false,
//                         gripInnerHtml:"<div class='grip'></div>", 
//                         draggingClass:"dragging", 
//                         // minWidth: 100
//                     });
//                 }, 1000);
//             });
//         },
//         restrict: "CA",
//         require: '^hfGrid'
//     }
// })

'use strict';
app.service('dropableservice', function($log, localStorageService) {
    Array.prototype.swap = function(new_index, old_index) {
            if (new_index >= this.length) {
                var k = new_index - this.length;
                while ((k--) + 1) {
                    this.push(undefined);
                }
            }
            this.splice(new_index, 0, this.splice(old_index, 1)[0]);
            return this;
        };
    this.defaultColConfig = function(length) {
        var array = new Array(length);
        for (var i = array.length - 1; i >= 0; i--) {
            array[i] = i;
        };
        return array;
    };
    this.swapArrayElements = function(array_object, index_a, index_b) {
        var temp = array_object[index_a];
        array_object[index_a] = array_object[index_b];
        array_object[index_b] = temp;
    };
    /**
     * reorder data array from config : arrayConfig[{key:newIndex Column, value: columnTitle}]
     * @param  {array} colArray    [columns array]
     * @param  {array} dataArray    [data array]
     * @param  {string} key    [colum Reorder Data key]
     * @return {[array]}                [array col config]
     */
    this.initReorderColumns = function(colArray, dataArray, key) {
        var arrayConfig = localStorageService.get(key);
        if (arrayConfig == null || arrayConfig.length == 0) arrayConfig = this.defaultColConfig(colArray.length);
        var me = this;
        for (var i = 0; i < arrayConfig.length - 2; i++) {
            if (i != arrayConfig[i]) {
                if (i > arrayConfig[i] && i == arrayConfig[arrayConfig.indexOf(i)]) continue;
                me.swapArrayElements(colArray, i, arrayConfig.indexOf(i));
                me.swapArrayElements(dataArray, i, arrayConfig.indexOf(i));
            }
        };
        return arrayConfig;
    };
    /**
     * save col config array
     * @param  {[type]} colConfigArray [description]
     * @param  {[type]} key            [description]
     */
    this.saveConfig = function(key, colConfigArray) {
        if (localStorageService.isSupported) {
            $log.info('saveConfig  : ' + colConfigArray);
            $log.info('saveConfig key : ' + key);
            localStorageService.set(key, colConfigArray);
        }
    }
});