(function(angular) {
    'use strict';
    app.directive("blsGridTreeView", function($compile, $templateCache, $templateRequest, $log) {
        var link = {
            post: function(scope, element, attrs, transclude) {
                $templateRequest('templates/blsGridTreeView.html').then(function(tpl) {
                    $log.debug('**************************  start compile blsGridTreeView');
                    // compile the html, then link it to the scope
                    var elem = $compile(tpl)(scope);
                    // append the compiled template inside the element
                    element.append(elem);
                });
            }
        };
        return {
            restrict: "E",
            link: link,
            replace: true,
            //transclude:true,
            //templateUrl:'templates/blsGridTreeView.html',
            scope: {
                model: '=ngModel',
                nestedDataFunc: '&',
                gridClass: '@',
                options: '=',
                func: '&' //function to load data (promise). on doit soit le ngModel pour passer les données ou cette promise/ the func return all Data
            },
            controller: ['$scope', '$filter', '$timeout', '$element', '$log', 'localStorageService', 'dropableservice', '$transclude',
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
                        $scope.data = [];
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
                        if ($scope.func && angular.isDefined($scope.func())) {
                            if (!angular.isDefined($scope.func().then)) throw "func must a be promise!!";
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
                        $scope.offset = ($scope.options.pagination.pageIndex - 1) * $scope.options.pagination.itemsPerPage.selected;
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