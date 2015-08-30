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
    }]);
})(window.angular);
