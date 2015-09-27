/**
     * @ngdoc overview
     * @name bls_components
     */
(function (angular) {

    var blsTableController = ['$scope', '$attrs', '$filter', '$timeout', '$element', '$log', 'localStorageService', 'blsTableServices', 'blsTableConfigManager',
                    function ($scope, $attrs, $filter, $timeout, $element, $log, localStorageService, blsTableServices, blsTableConfigManager) {
                        var me = this;
                        me.initialLoad = $scope.isLoading = true;
                        $scope.uniqueId = "blsContainer_" + (angular.isDefined($attrs.id) ? $attrs.id : id++);

                        this.tableConfigManager = new blsTableConfigManager($scope.uniqueId);

                        var defaultOptions = {
                            multiSelection: true,
                            callbacks: [],
                            toolbar: {
                                hide: false,
                                search: {
                                    hide: false,
                                    searchedText: '',
                                    searchClass: 'form-control',
                                    heighLight: true,
                                    minChars: {//a minimum number of characters to enable filter 
                                        enabled: true, //default Enabled after 3 characters typed
                                        count: 3
                                    }
                                },
                                export: {
                                    hide: false,
                                    formats: ['excel', 'xml', 'csv', 'sql', 'json']
                                }, reset: {
                                    hide: false
                                }, refresh: {
                                    hide: false
                                }
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
                        //Init option's array before merging with defaultOptions

                        this.initOptions = function () {
                            me.initOptionsArray = function () {
                                try {
                                    if (angular.isDefined($scope.options.toolbar.export.formats))
                                        defaultOptions.toolbar.export.formats = $scope.options.toolbar.export.formats;
                                } catch (e) {
                                }
                                try {
                                    if (angular.isDefined($scope.options.pagination.itemsPerPage.range))
                                        defaultOptions.pagination.itemsPerPage.range = $scope.options.pagination.itemsPerPage.range;
                                } catch (e) {
                                }

                            };
                            me.initOptionsArray();
                            var initialOptions = angular.copy($scope.options);
                            angular.merge($scope.options, defaultOptions);
                            angular.merge($scope.options, initialOptions);

                            $scope.options.toolbar.export.formats = $scope.options.toolbar.export.formats.distinct();
                            $scope.options.pagination.itemsPerPage.range = $scope.options.pagination.itemsPerPage.range.distinct();

                        };

                        $scope.$watch('options.pagination.pageIndex', function (newValue, oldValue) {
                            if (newValue != oldValue) {
                                $scope.options.pagination.pageIndex = newValue++;
                                me.refreshDataGrid();
                            }
                        });

                        $scope.updateRecordsCount = function () {
                            me.tableConfigManager.saveItemsByPage($scope.options.pagination.itemsPerPage.selected);
                            $scope.options.pagination.pageLength = $scope.options.pagination.itemsPerPage.selected;
                            me.refreshDataGrid();
                        };

                        //Reload ngModel by the Func
                        this.refreshDataGrid = function () {
                            if (angular.isDefined($scope.funcAsync)) {
                                me.tableConfigManager.init($scope.cols, $element[0].offsetWidth);
                                $scope.options.pagination.itemsPerPage.selected = me.tableConfigManager.get().itemsByPage
                                || $scope.options.pagination.itemsPerPage.range[0];
                                //me.initColConfig();
                                $scope.isLoading = true;
                                $scope.funcAsync({
                                    pageIndex: $scope.options.pagination.pageIndex,
                                    pageLength: $scope.options.pagination.itemsPerPage.selected,
                                    searchedText: $scope.options.toolbar.search.searchedText,
                                    sortTable: me.tableConfigManager.listSortedCols()
                                    //,filters:[{name:'age',value:10}]
                                });
                            }
                        };

                        this.setCols = function (cols) {
                            $scope.cols = cols;
                            $scope.$emit('blsDataGrid_initedEvent');
                            //$log.debug('cols =>', $scope.cols);
                            me.tableConfigManager.init($scope.cols, $element[0].offsetWidth);
                            me.refreshDataGrid();
                        };
                        this.getCols = function () {
                            return $scope.cols;
                        };
                        $scope.setSortDirection = function (index, sortDirection) {
                            me.tableConfigManager.setSortDirection(index, sortDirection);
                        };
                        this.changeColumnsOrder = function (from, to) {
                            $scope.$applyAsync(function () {
                                $scope.data.swap(from, to);
                                $scope.cols.swap(from, to);
                                me.tableConfigManager.swapCol(from, to);
                            });
                            me.refreshDataGrid();//TODO: à virer et corriger le pb du drag and Drop
                        };

                        $scope.setColWidth = function (index, width) {
                            me.tableConfigManager.setColWidth(index, width);
                        };

                        $scope.$watch('options.toolbar.search.searchedText', function (newValue, oldValue) {
                            //$log.debug('searchedText changed => ', newValue);
                            if (me.timerSearch) $timeout.cancel(me.timerSearch);
                            if (newValue != oldValue) {
                                me.timerSearch = $timeout(function () {
                                    me.refreshDataGrid();
                                }, 500);
                            }
                        });
                        $scope.$watch('data', function (newValue, oldValue) {
                            //$log.debug('data changed!!!');
                            if (newValue != oldValue) {
                                if ($scope.cols.length > 0) {
                                    //$log.debug('init Table config');
                                    me.initFromTableConfig();
                                }
                            }
                        });

                        //Swap data columns according to tableConfig 
                        this.initFromTableConfig = function () {
                            if (me.initialLoad) {
                                for (var i = 0; i <= me.tableConfigManager.get().cols.length - 1; i++) {
                                    if (i != me.tableConfigManager.get().cols[i].index) {
                                        if (i > me.tableConfigManager.get().cols[i].index) continue;
                                        //$log.debug('swap form ', i, ' to => ', me.tableConfigManager.get().cols[i].index);
                                        $scope.data.swap(i, me.tableConfigManager.get().cols[i].index);
                                        $scope.cols.swap(i, me.tableConfigManager.get().cols[i].index);
                                    }
                                }
                                me.initialLoad = false;
                            }
                            $scope.isLoading = false;
                        };
                        this.getChildItemsProp = function () {
                            return $scope.childItemsProp;
                        };
                        $scope.isStaticHierarchic = function () {
                            return angular.isDefined($scope.childItemsProp) && $scope.childItemsProp.length > 0;
                        };
                        $scope.$on('blsTable.ResetEvent', function (data) {
                            //$log.debug(localStorageService.keys());
                            $log.debug('clearUserDataEvent intercepted => $scope.uniqueId : ', $scope.uniqueId);
                            me.tableConfigManager.destroy();
                        });
                        $scope.$on('blsTable.RefreshEvent', function (data) {
                            //$log.debug('refreshEvent intercepted');
                            me.refreshDataGrid();
                        });
                        $scope.$on('blsTable.ExportEvent', function (e, format) {
                            //$log.debug('exportEvent intercepted to type : ', format);
                            $element.find('table').tableExport({
                                type: format
                            });
                        });

                        $scope.$on("$destroy", function (event) {
                            $timeout.cancel(me.timerSearch);
                        });
                        $scope.isHierarchical = function () {
                            return angular.isDefined($attrs.getChildren);
                        };
                        this.initOptions();
                    }
    ];
    /**
    * @ngdoc directive
    * @name bls_components.directive:blsTable
    * @property {string} data The value in the model that the control is bound to.
    * @property {*} $modelValue The value in the model that the control is bound to.
    * 
    * data: '=ngModel',
                            funcAsync: '&',
                            getChildren: '&',
                            options: '=',
                            totalItems: '=',
                            childItemsProp: '@'

    * @requires $log 
    * @requires $timeout
    * @scope
    * @restrict E
    * @description
    * blsTable directive
    * **Note:** Id must be specified
    *  @example
   *    
   * <pre>
   *   <bls-table ng-model="model.data"
   *        func-async="query(pageIndex, pageLength, searchedText, sortTable, filters)"
   *        options="options"
   *        total-items="model.totalItems"
   *        id="btbSampleExample">
    *   <bls-cols>
    *    <bls-col resize dragable sort field-name="id"></bls-col>
    *    <bls-col resize dragable title="Le nom" sort field-name="name"></bls-col>
    *    <bls-col resize dragable field-name="company">
    *        <a title="company!" href="javascript: void(0)" ng-click="options.callbacks[0](::row)">
    *            {{::row.company}}
    *        </a>
    *    </bls-col>
    *    <bls-col resize dragable sort title="Mailing de Monsieur" field-name="email">{{::row.email|uppercase}}</bls-col>
    *    <bls-col resize title="Photo de Profile" field-name="picture">
    *        <header><i class="fa fa-exclamation-triangle" style="color: #333" title="{{::row.picture}}"></i></header>
    *        <bls-td><img style="height:18px;margin: 0 auto;" class="img-responsive" src="{{::row.picture}}" alt="" /></bls-td>
    *    </bls-col>
    *    <bls-col resize field-name="isActive" title="Active">
    *        <i ng-if="::row.isActive" class="fa fa-check" style="color: #333"></i>
    *    </bls-col>
    *    <bls-col resize title="Actions">
    *        <span data-placement="top" data-toggle="tooltip" title="Modifier">
    *            <a class="btn btn-primary btn-icon btn-circle btn-sm" ui-sref=".detail({id: ::row.id})"><span class="glyphicon glyphicon-pencil"></span></a>
    *        </span>
    *        <span data-placement="top" data-toggle="tooltip" title="Supprimer">
    *            <a class="btn btn-danger btn-icon btn-circle btn-sm" href="javascript: void(0)" ng-click="options.callbacks[1](::row)"><span class="glyphicon glyphicon-trash"></span></a>
    *        </span>
    *    </bls-col>
    * </bls-cols>
    * </bls-table>
    * </pre>
    *
    *
    * **Note:** problem with save localStorage settings on ie
    */
    angular.module("bls_components", ['bls_tpls', 'ngSanitize'])
        .directive('blsTable', ['$log', '$compile', '$templateCache', '$timeout', '$parse', 'blsTableServices',
            function ($log, $compile, $templateCache, $timeout, $parse, blsTableServices) {
                var me = this;
                var id = 0;


                return {
                    restrict: 'E',
                    replace: true,
                    transclude: true,
                    templateUrl: 'templates/blsTable.html',
                    controller: blsTableController,

                    scope: {
                        data: '=ngModel',
                        funcAsync: '&',
                        getChildren: '&',
                        options: '=',
                        totalItems: '=',
                        childItemsProp: '@'
                    }
                };
            }]);
})(window.angular);