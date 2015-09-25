(function (angular) {
    'use strict';
    angular.module("bls_tpls", []).run(["$templateCache", "$templateRequest", function ($templateCache, $templateRequest) {
        $templateCache.put('templates/blsTable.html','<div class="bls-table-container">\
            <div ng-class="{\'overlay\':isLoading}"><div ng-show="isLoading"><div class="double-bounce1"></div><div class="double-bounce2"></div></div></div>\
            <bls-tool-bar ng-hide="options.toolbar.hide"></bls-tool-bar>\
            <table class="table table-hover table-striped table-bordered blsGrid">\
                <thead ng-mousedown="resizeStart($event)" ng-mouseup="resizeEnd($event)">\
                    <bls-header></bls-header>\
                </thead>\
                <tbody>\
                    <bls-rows></bls-rows>\
                </tbody>\
            </table>\
            <div style="display:none" id="colsConfig" ng-transclude></div>\
            <div class="footer">\
                <pagination class="col-md-10 col-xs-8" total-items="totalItems" ng-model="options.pagination.pageIndex" max-size="options.pagination.pager.maxSize" items-per-page="options.pagination.itemsPerPage.selected" class="pagination-sm" boundary-links="true" rotate="false"></pagination>\
                <div class="pagerList col-md-2 col-xs-4">\
                    <select class="form-control" id="sel1" ng-model="options.pagination.itemsPerPage.selected" ng-change="updateRecordsCount()" ng-options="c as c for c in options.pagination.itemsPerPage.range" ng-selected="options.pagination.itemsPerPage.selected == c"></select>\
                </div>\
            </div>\
        </div>');
        $templateCache.put('templates/blsDropDown.html', '<div class="dropdown">\
                  <button class="btn btn-default btn-sm dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">\
                    {{title}}\
                    <span class="caret"></span>\
                  </button>\
                  <ul class="dropdown-menu" aria-labelledby="dropdownMenu1" >\
                    <li ng-repeat="link in links"><a ng-click="func()(link)">{{link}}</a></li>\
                  </ul>\
             </div>');
        $templateCache.put('templates/blsToolBar.html', '<div class="row">\
                       <div class="btn-toolbar pull-right col-xs-12" role="toolbar">\
                            <div class="btn-group btn-group-sm pull-right ">\
                                <bls-drop-down links="options.toolbar.export.formats" func="export" title="titleExportButton" ng-hide="options.toolbar.export.hide"></bls-drop-down>\
                                <button type="button" ng-click="clearUserData()" ng-hide="options.toolbar.reset.hide" class="{{btnClass}}" tooltip="Reset" aria-label="Right Align"><span class="fa fa-recycle" aria-hidden="true"></span></button>\
                                <button type="button" ng-click="refresh()" ng-hide="options.toolbar.refresh.hide" class="{{btnClass}}" tooltip="Refresh" aria-label="Right Align"><span class="fa fa-refresh" aria-hidden="true"></span></button>\
                            </div>\
                            <form action="" class="search-form pull-right col-md-2 col-xs-12" ng-hide="options.toolbar.search.hide">\
                                <div class="form-group has-feedback">\
                                    <label for="search" class="sr-only">Search</label>\
                                    <input type="text" class="{{options.toolbar.search.searchClass}}" name="search" id="search" placeholder="{{searchPlaceHolder}}" ng-model="options.toolbar.search.searchedText">\
                                    <span class="glyphicon glyphicon-search form-control-feedback"></span>\
                                </div>\
                            </form>\
                        </div>\
                 </div>');
        $templateCache.put('templates/blsSearchBox.html', '<div class="col-xs-6 col-md-3 navbar-btn form-group navbar-form">\
					    <input type="text" class="form-control" placeholder="{{options.placeholder}}" ng-model="model">\
					    <button  ng-show="model==\'\'" type="submit" class="btn btn-search"><i class="fa fa-search"></i></button>\
                        <span ng-show="model" ng-click="model=null" class="glyphicon glyphicon-remove-sign form-control-feedback form-control-clear" aria-hidden="true"></span>\
                        <span class="sr-only">Clear input content</span>\
				   </div>');
        $templateCache.put('templates/blsHeader.html', '<tr>\
                        <th class="colHeader" ng-class="glyphOrder(c)" ng-repeat="c in cols" ng-click="order(c)" style="width:{{getColWidth($index)}}" allow-drag>\
                            <span ng-if="c.headerTpl!==undefined" ng-bind-html="c.headerTpl" ng-init="getTdTpl(c)" dynamic="c.headerTpl"></span>\
                            <span ng-if="c.headerTpl===undefined" ng-bind="c.title|uppercase"></span>\
                            <i ng-if="c.resize" class="resize"></i>\
                        </th>\
                   </tr>');
        $templateCache.put('templates/blsRows.html', '<tr ng-repeat="d in data">\
                 <td ng-repeat="c in cols" ng-init="getTdTpl(c)" dynamic="c.tpl" ng-bind-html="d[c.fieldName]| highlight:options.toolbar.search.searchedText:options.toolbar.search.heighLight"></td>\
            </tr>');
        $templateCache.put('templates/blsChildRows.html', '<tr ng-repeat="d in data" data-bls-id="{{$id}}" parentId="{{parentId}}" bls-row-child func="getChildren" data-level="{{level}}">\
                            <td ng-repeat="c in cols" ng-init="getTdTpl(c)" dynamic="c.tpl" ng-bind-html="d[c.fieldName]| highlight:options.toolbar.search.searchedText:options.toolbar.search.heighLight"></td></tr>');
        $templateCache.put('templates/blsStaticChildRows.html', '<tr ng-repeat="d in data" data-bls-id="{{$id}}" parentId="{{parentId}}" bls-static-child-cells level="{{level}}"></tr>');
        $templateCache.put('templates/blsStaticChildCells.html', '<td ng-repeat="c in cols" ng-init="getTdTpl(c)" dynamic="c.tpl">\
                                    <i id="{{$id}}" ng-if="isExpandable" class="fa {{expand?\'fa-caret-down\':\'fa-caret-right\'}}" style="padding:0 4px 0 {{5+(15*level)}}px"></i>\
                                    {{ngModel[c.fieldName]}}{{isExpandable}}</td>\
                                <bls-static-childs-rows ng-model="childs" ng-if="isExpandable"  level={{level++}}></bls-static-childs-rows>');
        $templateCache.put('templates/blsChildRowsCaret.html', '<i id="{{$id}}" class="fa {{expand?\'fa-caret-down\':\'fa-caret-right\'}}" style="padding:0 4px 0 {{5+(15*level)}}px"></i>');
    }]);
})(window.angular);




(function (angular) {
    angular.module("bls_components", ['bls_tpls', 'ngSanitize'])
        .directive('blsTable', ['$log', '$compile', '$templateCache', '$timeout', '$parse', 'blsTableServices', 
            function ($log, $compile, $templateCache, $timeout, $parse, blsTableServices) {
                var me = this;
                var id = 0;
                this.controller = ['$scope', '$attrs', '$filter', '$timeout', '$element', '$log', 'localStorageService', 'blsTableServices', 'blsTableConfigManager',
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

                return {
                    restrict: 'E',
                    replace: true,
                    transclude: true,
                    templateUrl: 'templates/blsTable.html',
                    controller: this.controller,

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
angular.module("bls_components").directive("allowDrag", function () {
    return {
        restrict: "A",
        require: ['^blsTable'],
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
angular.module("bls_components").directive('blsCol', ['$log', '$timeout', function ($log, $timeout) {
    var tpl = [];
    var link = function (scope, element, attrs, ctrls) {
        //$log.debug('link post => col');
        // var blsTableCtrl = ctrls[0];
        var blsColsCtrl = ctrls[1];
        // var blsColCtrl = ctrls[2];
        //Récupérer les templates du Header et du TD
        this.getTemplates = function () {
            var instanceTpl = tpl[attrs.fieldName];
            //$log.debug('instanceTpl =================> ', instanceTpl, ' for ______  : ', attrs.fieldName);
            if (instanceTpl !== '' && !instanceTpl.startsWith('{{')) {
                var tplHtml = $('<div></div>').wrapInner(instanceTpl)
                var header = tplHtml.find('header');
                return {
                    headerTpl: header.length ? header.html() : undefined,
                    tdTpl: header.length ? tplHtml.find('bls-td').html() : tplHtml.html()
                };
            } else if (instanceTpl.startsWith('{{'))
                return {
                    headerTpl: undefined,
                    tdTpl: instanceTpl
                };
            else
                return {
                    headerTpl: undefined,
                    tdTpl: undefined
                };
        };

        var tpls = this.getTemplates();
        //$log.debug('tpls =>: ', tpls);
        blsColsCtrl.addCol({
            title: attrs.title || attrs.fieldName,
            fieldName: attrs.fieldName,
            resize: angular.isDefined(attrs.resize),
            tpl: tpls.tdTpl,
            headerTpl: tpls.headerTpl,
            sortable: angular.isDefined(attrs.sort),
            dragable: angular.isDefined(attrs.dragable)
        });
    };

    return {
        //transclude:true,
        priority: -1,
        require: ['^blsTable', '^blsCols'],
        restrict: 'E',
        compile: function compile(tElement, tAttrs, transclude) {
            tpl[tAttrs.fieldName] = tElement.html();
            tElement.empty();
            return {
                pre: link
            }
        }
    };
}]);

angular.module("bls_components").directive('blsCols', ['$log', '$compile', '$templateCache', '$timeout', function ($log, $compile, $templateCache, $timeout) {
    var link = {
        post: function (scope, element, attrs, ctrls) {
            var blsTableCtrl = ctrls[0];
            var blsColsCtrl = ctrls[1];
            //$log.debug('    Link => blsCols');
            blsTableCtrl.setCols(blsColsCtrl.getCols());
        }
    };
    var controller = ['$scope', '$filter', '$timeout', '$element', '$log', 'localStorageService', 'blsTableServices',
        function ($scope, $filter, $timeout, $element, $log, localStorageService, blsTableServices) {
            //$log.debug('    controller => blsCols');
            var cols = [];
            this.addCol = function (col) {
                cols.push(col);
            };
            this.getCols = function () {
                return cols;
            };
        }
    ];
    return {
        priority: 0,
        require: ['^blsTable', 'blsCols'],
        restrict: 'E',
        link: link,
        controller: controller
    };
}]);

angular.module("bls_components").directive('blsDropDown', [function () {
    return {
        templateUrl: 'templates/blsDropDown.html',
        replace: true,
        scope: {
            links: '=',
            title: '=',
            func: '&'
        }
    };
}]);
(function (window, angular) {
    'use strict';
    /*jshint globalstrict: true*/
    /*jshint undef:false */


    // Registering Angular.js module.
    angular.module('blsFormModified', [])
        .provider('unsavedWarningsConfig', function () {

            var _this = this;

            // defaults
            var logEnabled = false;
            var useTranslateService = true;
            var routeEvent = ['$locationChangeStart', '$stateChangeStart'];
            var navigateMessage = 'You will lose unsaved changes if you leave this page';
            var reloadMessage = 'You will lose unsaved changes if you reload this page';

            Object.defineProperty(_this, 'navigateMessage', {
                get: function () {
                    return navigateMessage;
                },
                set: function (value) {
                    navigateMessage = value;
                }
            });

            Object.defineProperty(_this, 'reloadMessage', {
                get: function () {
                    return reloadMessage;
                },
                set: function (value) {
                    reloadMessage = value;
                }
            });

            Object.defineProperty(_this, 'useTranslateService', {
                get: function () {
                    return useTranslateService;
                },
                set: function (value) {
                    useTranslateService = !!(value);
                }
            });

            Object.defineProperty(_this, 'routeEvent', {
                get: function () {
                    return routeEvent;
                },
                set: function (value) {
                    if (typeof value === 'string') value = [value];
                    routeEvent = value;
                }
            });
            Object.defineProperty(_this, 'logEnabled', {
                get: function () {
                    return logEnabled;
                },
                set: function (value) {
                    logEnabled = !!(value);
                }
            });

            this.$get = ['$injector',
                function ($injector) {

                    function translateIfAble(message) {
                        if ($injector.has('$translate') && useTranslateService) {
                            return $injector.get('$translate').instant(message);
                        } else {
                            return false;
                        }
                    }

                    var publicInterface = {
                        // log function that accepts any number of arguments
                        // @see http://stackoverflow.com/a/7942355/1738217
                        log: function () {
                            if (console.log && logEnabled && arguments.length) {
                                var newarr = [].slice.call(arguments);
                                if (typeof console.log === 'object') {
                                    log.apply.call(console.log, console, newarr);
                                } else {
                                    console.log.apply(console, newarr);
                                }
                            }
                        }
                    };

                    Object.defineProperty(publicInterface, 'useTranslateService', {
                        get: function () {
                            return useTranslateService;
                        }
                    });

                    Object.defineProperty(publicInterface, 'reloadMessage', {
                        get: function () {
                            return translateIfAble(reloadMessage) || reloadMessage;
                        }
                    });

                    Object.defineProperty(publicInterface, 'navigateMessage', {
                        get: function () {
                            return translateIfAble(navigateMessage) || navigateMessage;
                        }
                    });

                    Object.defineProperty(publicInterface, 'routeEvent', {
                        get: function () {
                            return routeEvent;
                        }
                    });

                    Object.defineProperty(publicInterface, 'logEnabled', {
                        get: function () {
                            return logEnabled;
                        }
                    });

                    return publicInterface;
                }
            ];
        })
        .service('unsavedWarningSharedService', ['$rootScope', 'unsavedWarningsConfig', '$injector', '$window',
    function ($rootScope, unsavedWarningsConfig, $injector, $window) {

        // Controller scopped variables
        var _this = this;
        var allForms = [];
        var areAllFormsClean = true;
        var removeFunctions = [];

        // @note only exposed for testing purposes.
        this.allForms = function () {
            return allForms;
        };

        // Check all registered forms
        // if any one is dirty function will return true

        function allFormsClean() {
            areAllFormsClean = true;
            angular.forEach(allForms, function (item, idx) {

                //debugger;
                unsavedWarningsConfig.log('Form : ' + item.$name + ' dirty : ' + item.$dirty);

                if (item.modified) {
                    areAllFormsClean = false;
                }
            });
            return areAllFormsClean; // no dirty forms were found
        }

        // adds form controller to registered forms array
        // this array will be checked when user navigates away from page
        this.init = function (form) {
            if (allForms.length === 0) setup();
            unsavedWarningsConfig.log("Registering form", form);
            allForms.push(form);
        };

        this.removeForm = function (form) {
            var idx = allForms.indexOf(form);

            // this form is not present array
            // @todo needs test coverage
            if (idx === -1) return;

            allForms.splice(idx, 1);
            unsavedWarningsConfig.log("Removing form from watch list", form);

            if (allForms.length === 0) tearDown();
        };

        function tearDown() {
            unsavedWarningsConfig.log('No more forms, tearing down');
            angular.forEach(removeFunctions, function (fn) {
                fn();
            });
            removeFunctions = [];
            $window.onbeforeunload = null;
        }

        // Function called when user tries to close the window
        this.confirmExit = function () {
            if (!allFormsClean()) return unsavedWarningsConfig.reloadMessage;
            $rootScope.$broadcast('resetResettables');
            tearDown();
        };

        // bind to window close
        // @todo investigate new method for listening as discovered in previous tests

        function setup() {
            unsavedWarningsConfig.log('Setting up');

            $window.onbeforeunload = _this.confirmExit;

            var eventsToWatchFor = unsavedWarningsConfig.routeEvent;

            angular.forEach(eventsToWatchFor, function (aEvent) {
                //calling this function later will unbind this, acting as $off()
                var removeFn = $rootScope.$on(aEvent, function (event, next, current) {
                    unsavedWarningsConfig.log("user is moving with " + aEvent);
                    // @todo this could be written a lot cleaner!
                    if (!allFormsClean()) {
                        unsavedWarningsConfig.log("a form is dirty");
                        if (!confirm(unsavedWarningsConfig.navigateMessage)) {
                            unsavedWarningsConfig.log("user wants to cancel leaving");
                            event.preventDefault(); // user clicks cancel, wants to stay on page
                        } else {
                            unsavedWarningsConfig.log("user doesn't care about loosing stuff");
                            $rootScope.$broadcast('resetResettables');
                        }
                    } else {
                        unsavedWarningsConfig.log("all forms are clean");
                    }

                });
                removeFunctions.push(removeFn);
            });
        }
    }
        ])
        .directive('bsModifiable', ModifiableDirective);

    /**
     * This directive doesn't add any functionality,
     * it serves as a mere marker for ngModel directive.
     *
     * @constructor
     *
     * @returns {object}
     */
    function ModifiableDirective() {
        return {
            restrict: 'A',
            controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
                this.isEnabled = function () {
                    return ('true' == $attrs.bsModifiable);
                };
            }]
        };
    }

    // Extending Angular.js module.
    angular.module('blsFormModified')
      .provider('inputModifiedConfig', configProviderFactory)
    ;

    /**
     * Factory that creates configuration service.
     *
     * @returns {object}
     * @constructor
     */
    function configProviderFactory() {

        // Default config.
        var config = {
            enabledGlobally: true,
            modifiedClassName: 'ng-modified',
            notModifiedClassName: 'ng-not-modified'
        };

        return {
            enableGlobally: function () {
                config.enabledGlobally = true;
                return this;
            },
            disableGlobally: function () {
                config.enabledGlobally = false;
                return this;
            },
            setModifiedClassName: function (modifiedClassName) {
                config.modifiedClassName = String(modifiedClassName);
                return this;
            },
            setNotModifiedClassName: function (notModifiedClassName) {
                config.notModifiedClassName = String(notModifiedClassName);
                return this;
            },
            $get: function () {
                return config;
            }
        };
    }

    // Extending Angular.js module.
    angular.module('blsFormModified')
      .directive('form', ['unsavedWarningSharedService', '$animate', 'inputModifiedConfig', function (unsavedWarningSharedService, $animate, inputModifiedConfig) {

          return formDirectiveFactory(unsavedWarningSharedService, $animate, inputModifiedConfig, false);
      }])
      .directive('ngForm', ['unsavedWarningSharedService', '$animate', 'inputModifiedConfig', function (unsavedWarningSharedService, $animate, inputModifiedConfig) {
          return formDirectiveFactory(unsavedWarningSharedService, $animate, inputModifiedConfig, true);
      }])
    ;

    function formDirectiveFactory(unsavedWarningSharedService, $animate, inputModifiedConfig, isNgForm) {

        // Shortcut.
        var config = inputModifiedConfig;

        return {
            name: 'form',
            restrict: isNgForm ? 'EAC' : 'E',
            require: ['?form'],
            link: function ($scope, $element, attrs, controllers) {

                // Handling controllers.
                var formCtrl = controllers[0];
                var parentFormCtrl = (formCtrl.$$parentForm || $element.parent().controller('form'));

                // Form controller is required for this directive to operate.
                // Parent form is optional.
                if (!formCtrl) {
                    return;
                }
                unsavedWarningSharedService.init(formCtrl);

                formCtrl.modified = false;
                formCtrl.reset = reset;

                // Modified models.
                formCtrl.modifiedCount = 0;
                formCtrl.modifiedModels = [];
                formCtrl.$$notifyModelModifiedStateChanged = function (modelCtrl) {
                    onModifiedStateChanged(modelCtrl, formCtrl.modifiedModels);
                };

                // Modified child forms.
                formCtrl.modifiedChildFormsCount = 0;
                formCtrl.modifiedChildForms = [];
                formCtrl.$$notifyChildFormModifiedStateChanged = function (childFormCtrl) {
                    onModifiedStateChanged(childFormCtrl, formCtrl.modifiedChildForms);
                };


                /**
                 * Resets all form inputs to it's master values.
                 */
                function reset() {

                    // Resetting modified models.
                    angular.forEach(formCtrl.modifiedModels, function (modelCtrl) {
                        modelCtrl.reset();
                    });

                    // Resetting modified child forms.
                    angular.forEach(formCtrl.modifiedChildForms, function (childFormCtrl) {
                        childFormCtrl.reset();
                    });
                }

                /**
                 * This universal function is called when child model or child form is modified
                 * by the modified component itself.
                 * It will update the corresponding tracking list, the number of modified components
                 * and the form itself if required.
                 *
                 * @param ctrl  The modified model or modified form controller
                 * @param list  The tracking list of modified controllers (models or forms)
                 */
                function onModifiedStateChanged(ctrl, list) {

                    var listIndex = list.indexOf(ctrl);
                    var presentInList = (-1 !== listIndex);

                    var updateRequired = true;

                    if (ctrl.modified && !presentInList) {

                        // Adding model to the internal list of modified models.
                        list.push(ctrl);

                    } else if (!ctrl.modified && presentInList) {

                        // Removing model from the internal list of modified models.
                        list.splice(listIndex, 1);

                    } else {
                        // Edge case when update is not required.
                        updateRequired = false;
                    }

                    if (updateRequired) {

                        updateModifiedState();

                        // Notifying the parent form if it presents.
                        if (parentFormCtrl && 'function' === typeof parentFormCtrl.$$notifyChildFormModifiedStateChanged) {
                            parentFormCtrl.$$notifyChildFormModifiedStateChanged(formCtrl);
                        }

                        updateCssClasses();

                    }

                }

                /**
                 * Updates form modified state.
                 *
                 * Form is considered modified when it has at least one
                 * modified element or child form.
                 */
                function updateModifiedState() {

                    formCtrl.modifiedCount = formCtrl.modifiedModels.length;
                    formCtrl.modifiedChildFormsCount = formCtrl.modifiedChildForms.length;

                    formCtrl.modified =
                      (formCtrl.modifiedCount + formCtrl.modifiedChildFormsCount) > 0
                    ;
                }

                /**
                 * Decorates element with proper CSS classes.
                 */
                function updateCssClasses() {
                    $animate.addClass($element, (formCtrl.modified ? config.modifiedClassName : config.notModifiedClassName));
                    $animate.removeClass($element, (formCtrl.modified ? config.notModifiedClassName : config.modifiedClassName));
                }

                $scope.$on('$destroy', function () {
                    unsavedWarningSharedService.removeForm(formCtrl);
                });

            }
        };
    }

    // Extending Angular.js module.
    angular.module('blsFormModified')
      .directive('ngModel', ngModelModifiedFactory)
    ;

    /**
     * This directive extends ng-model with modifiable behavior.
     *
     * @constructor
     * @param {object} $animate
     * @param {object} inputModifiedConfig
     * @param {function} $timeout
     *
     * @returns {object}
     */
    function ngModelModifiedFactory($animate, inputModifiedConfig, $timeout) {

        // Shortcut.
        var config = inputModifiedConfig;

        return {
            priority: 11,
            restrict: 'A',
            require: ['?ngModel', '?^form', '?^bsModifiable'],
            link: function ($scope, $element, attrs, controllers) {

                /**
                 * Path to a model variable inside the scope.
                 * It can be as simple as: "foo" or as complex as "foo.bar[1].baz.qux".
                 */
                var modelPath = attrs.ngModel;

                // Handling controllers.
                var modelCtrl = controllers[0];
                var formCtrl = controllers[1];
                var bsModifiable = controllers[2];

                // Model controller is required for this directive to operate.
                // Parent form controller is optional.
                if (!modelCtrl) {
                    return;
                }

                // This behavior is applied only when form element or
                // one of it's parents has a bsModifiable directive present
                // or when global switch is set.
                var enabled = (bsModifiable ? bsModifiable.isEnabled() : undefined);
                if (
                     (config.enabledGlobally && false == enabled)
                  || (!config.enabledGlobally && true !== enabled)
                ) {
                    return;
                }



                // Flag to indicate that master value was initialized.
                var masterValueIsSet = false;

                // Saving handle to original set-pristine method.
                var originalSetPristine = modelCtrl.$setPristine;

                // Replacing original set-pristine with our own.
                modelCtrl.$setPristine = setPristine;

                modelCtrl.modified = false;

                modelCtrl.masterValue = undefined;

                modelCtrl.reset = reset;

                // Watching for model value changes.
                $scope.$watch(modelPath, onInputValueChanged);


                /**
                 * Sets proper modification state for model controller according to
                 * current/master value.
                 */
                function onInputValueChanged() {

                    if (!masterValueIsSet) {
                        initializeMasterValue();
                    }

                    var modified = !compare(modelCtrl.$modelValue, modelCtrl.masterValue);

                    // If modified flag has changed.
                    if (modelCtrl.modified !== modified) {

                        // Setting new flag.
                        modelCtrl.modified = modified;

                        // Notifying the form.
                        if (formCtrl && 'function' === typeof formCtrl.$$notifyModelModifiedStateChanged) {
                            formCtrl.$$notifyModelModifiedStateChanged(modelCtrl);
                        }

                        // Re-decorating the element.
                        updateCssClasses();
                    }
                }

                /**
                 * Initializes master value if required.
                 */
                function initializeMasterValue() {

                    // Initializing the master value.
                    modelCtrl.masterValue = modelCtrl.$modelValue;

                    // Initially decorating the element.
                    updateCssClasses();

                    masterValueIsSet = true;
                }

                /**
                 * Decorates element with proper CSS classes.
                 */
                function updateCssClasses() {
                    $animate.addClass($element, (modelCtrl.modified ? config.modifiedClassName : config.notModifiedClassName));
                    $animate.removeClass($element, (modelCtrl.modified ? config.notModifiedClassName : config.modifiedClassName));
                }

                /**
                 * Overloading original set-pristine method.
                 */
                function setPristine() {

                    stabilizeValue(function () {

                        // Calling overloaded method.
                        originalSetPristine.apply(this, arguments);

                        // Updating parameters.
                        modelCtrl.masterValue = modelCtrl.$modelValue;
                        modelCtrl.modified = false;

                        // Notifying the form.
                        formCtrl.$$notifyModelModifiedStateChanged(modelCtrl);

                        // Re-decorating the element.
                        updateCssClasses();

                    });

                }

                /**
                 * Replaces current input value with a master value.
                 */
                function reset() {
                    try {
                        eval('$scope.' + modelPath + ' = modelCtrl.masterValue;');
                    } catch (exception) {
                        // Missing specified model. Do nothing.
                    }
                }

                /**
                 * Stabilizes model's value.
                 * This is required for directives such as Angular UI TinyMCE.
                 */
                function stabilizeValue(callback) {
                    var initialValue = modelCtrl.$modelValue;
                    modelCtrl.$modelValue = null;
                    $timeout(function () {
                        modelCtrl.$modelValue = initialValue;
                        $timeout(callback, 0);
                    }, 0);
                }



            }
        };
    }
    ngModelModifiedFactory.$inject = ['$animate', 'inputModifiedConfig', '$timeout'];

    /**
     * Returns true if specified values are equal, false otherwise.
     * Supports dates comparison.
     *
     * @param {*} value1
     * @param {*} value2
     *
     * @returns {boolean}
     */
    function compare(value1, value2) {
        value1 = normalizeValue(value1);
        value2 = normalizeValue(value2);

        if ('object' === typeof value1 && 'object' === typeof value2) {
            if (value1 instanceof Date && value2 instanceof Date) {
                // Comparing two dates.
                return (value1.getTime() === value2.getTime());
            } else {
                // Comparing two objects.
                return angular.equals(value1, value2);
            }
        }

        // In all other cases using weak comparison.
        return (value1 == value2);
    }

    /**
     * Casting all null-like values to actual null for guaranteed comparison.
     *
     * @param {*} value
     *
     * @returns {*}
     */
    function normalizeValue(value) {
        return (undefined === value || '' === value ? null : value);
    }

})(window, angular);

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

angular.module("bls_components").directive('blsRowChild', ['$log', '$compile', '$templateCache', '$timeout', function ($log, $compile, $templateCache, $timeout) {
    var link = function (scope, element, attrs, ctrls, transclude) {
        //$log.debug('    Link => blsRows');
        var me = this;
        this.childs = [];
        var elemTplCaret = angular.element($templateCache.get('templates/blsChildRowsCaret.html'));
        scope.expand = false;
        scope.firstExpand = true;

        this.getRowsChilds = function (id, target) {
            var siblings = target.siblings('tr[parentId="' + id + '"]').toArray();
            me.childs = me.childs.concat(siblings);
            for (var i = 0; i < siblings.length; i++) {
                me.childs.concat(getRowsChilds(angular.element(siblings[i]).data('blsId'), $(siblings[i])));
            }
            return me.childs;
        };
        
        var elemTplRow = angular.element($templateCache.get('templates/blsChildRows.html'));
        if (!angular.isDefined(attrs.level)) {
            scope.level = 0;
            element.data('dataLevel', scope.level);
        }
        $timeout(function () {
            this.toggle = function (id, target, expand) {
                me.childs = me.getRowsChilds(id, target);
                me.childs.forEach(function (child) {
                    expand ? $(child).show() : $(child).hide();
                });
            };
            elemTplCaret.on('click', function (e) {
                //$log.debug('    toggle row');
                var $this = $(this);
                if (scope.firstExpand) {
                    elemTplCaret.addClass('fa-spinner');
                    scope.firstExpand = false;
                    var childScope = scope.$new();
                    scope.getChildren()(scope.d).then(function (response) {
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
                } else scope.$apply(function () {
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
        link: link,
        scope: true
    };
}]);

angular.module("bls_components").directive('blsRows', ['$log', '$compile', '$templateCache', '$timeout', function ($log, $compile, $templateCache, $timeout) {
    var link = function (scope, element, attrs, ctrls) {
        // var blsTableCtrl = ctrls[0];
        scope.getTdTpl = function (col, d) {
            if (col.tpl && col.tpl !== '') {

                col.tpl = col.tpl.replace(new RegExp('::row', 'g'), 'd');
                return col.tpl;
            }
        };

        var eleTpl = angular.element($templateCache.get('templates/blsRows.html'));
        if (scope.isHierarchical())
            eleTpl.attr('bls-row-child', '');
        $timeout(function () {
            element.siblings('table').find('tbody').append(eleTpl);
            $compile(eleTpl)(scope);
        }, 0);
    };
    return {
        require: ['^blsTable'],
        priority: -17,
        restrict: 'E',
        link: link,
        scope: true
    };
}]);

angular.module("bls_components").directive('blsSearchBox', [function () {
    var uniqueId = 1;
    return {
        link: function (scope, element, attrs) {
            scope.uniqueId = 'btn' + uniqueId++;
        },
        scope: {
            ngModel: '=',
            options: '='
        },
        restrict: 'E',
        templateUrl: 'templates/blsSearchBox.html',
        replace: true,
        controller: ['$scope', '$element', '$log', function ($scope, $element, $log) {
            //$log.debug('=======> blsSearchBox', $scope.options);
            var defaultOptions = {
                id: $scope.uniqueId,
                placeholder: 'search...',
                minChars: 3
            };

            this.initOptions = function () {
                var initialOptions = angular.copy($scope.options);
                angular.merge($scope.options, defaultOptions);
                angular.merge($scope.options, initialOptions);
            };
            $scope.refresh = function () {
                $scope.$emit('blsTable.RefreshEvent');
            };

            this.initOptions();
            $scope.model = $scope.ngModel;
            if ($scope.options.minChars !== 0) {
                $scope.model = angular.copy($scope.ngModel);
                var isActiveSearch = false;
                $scope.$watch('model', function (newVal, oldVal) {
                    if ((newVal != oldVal && newVal.length >= $scope.options.minChars) || isActiveSearch) {
                        isActiveSearch = newVal.length !== 0;
                        $scope.ngModel = newVal;
                    }
                });
            }
        }]
    };
}]);
angular.module("bls_components")
.directive('blsSplitter', ['$log', 'localStorageService', function ($log, localStorageService) {
    /*--- Jquery UI is required ---*/
    var controller = ['$scope', '$log', function ($scope, $log) {

        $scope.regions = [];
        this.addRegion = function (region) {
            var $region = $(region);
            $scope.regions.push($region);
            $log.debug($scope.regions);
            $region.resizable({
                handles: 'e',
                minWidth: $scope.minWidth,
                maxWidth: $scope.maxWidth,
                create: function (event, ui) {
                    var initSize = { height: $region.parent().height(), width: localStorageService.get('splitPageWitdh') || 100 };
                    var ele = $(this);
                    ele.width(initSize.width);
                    ele.css('height', '100%');
                    var factor = $(this).parent().width() - initSize.width;
                    var f2 = $(this).parent().width() * .06;
                    $.each($scope.regions, function (idx, item) {
                        if ($region !== $scope.regions[idx])
                            $scope.regions[idx].width((factor - f2) + 'px').css('height', '100%');
                    });
                },
                resize: function (event, ui) {
                    var x = ui.element.outerWidth();
                    localStorageService.set('splitPageWitdh', x);
                    var ele = ui.element;
                    var factor = $(this).parent().width() - x;
                    var f2 = $(this).parent().width() * .02999;
                    $.each($scope.regions, function (idx, item) {
                        $scope.regions[idx].width((factor - f2) + 'px');
                    });
                }
            });
        };
    }];
    var link = function (scope, element, attrs) {

        var me = this;
        var $element = $(element);
        $(window).resize(function () {

        });
        $(window).trigger('resize');
    };

    return {
        transclude: true,
        restrict: "E",
        link: link,
        controller: controller,
        scope: {
            minWidth: "=",
            maxWidth: "="
        },
        template: '<div ng-transclude><div ng-repeat="r in regions"></div><div>'
    };
}]).directive('blsSplitterRegion', ['$log', 'localStorageService', function ($log, localStorageService) {
    /*--- Jquery UI is required ---*/
    var link = function (scope, element, attrs, ctrls) {
        var me = this;
        var blsSplitterCtrl = ctrls[0];
        $log.debug('add new region');
        blsSplitterCtrl.addRegion(element);
    };

    return {
        transclude: true,
        require: ['^blsSplitter'],
        restrict: "E",
        link: link,
        replace: true,
        template: '<div style="width:49%;height:500px;background-color:aliceblue;float:left;overflow-x:hidden;overflow-y:hidden" ng-transclude><div>'
    };
}]);
angular.module("bls_components").directive('blsStaticChildsRows', ['$log', '$compile', '$templateCache', '$timeout', function ($log, $compile, $templateCache, $timeout) {
    var link = function (scope, element, attrs, ctrls, transclude) {
        $log.debug('    Link => blsStaticChildsRows');
        var me = this;
        scope.childs = [];
        var elemTplCaret = angular.element($templateCache.get('templates/blsChildRowsCaret.html'));
        scope.expand = false;
        scope.firstExpand = true;
        scope.isExpandable = false;

        var childItemsProp = ctrls[0].getChildItemsProp();
        scope.setChilds = function (d) {
            scope.childs = d[childItemsProp];
            scope.isExpandable = angular.isDefined(scope.childs) && scope.childs.length;
            $log.debug('scope.childs', scope.childs);
        };
        scope.cols = ctrls[0].getCols();
        //this.getRowsChilds = function (id, target) {
        //    var siblings = target.siblings('tr[parentId="' + id + '"]').toArray();
        //    me.childs = me.childs.concat(siblings);
        //    for (var i = 0; i < siblings.length; i++) {
        //        me.childs.concat(getRowsChilds(angular.element(siblings[i]).data('blsId'), $(siblings[i])));
        //    }
        //    return me.childs;
        //};
        scope.getTdTpl = function (col, d) {
            if (col.tpl && col.tpl !== '') {
                col.tpl = col.tpl.replace('::row', 'd');
                return col.tpl.replace('::field', "d[c.fieldName]");
            }
        };
        var elemTplRow = angular.element($templateCache.get('templates/blsStaticChildRows.html'));
        if (!angular.isDefined(attrs.level)) {
            scope.level = 0;
            element.data('dataLevel', scope.level);
        }
        $timeout(function () {
            $compile(elemTplRow)(scope);
            element.siblings('table').find('tbody').append(elemTplRow);
        });
        this.toggle = function (id, target, expand) {
            me.childs = me.getRowsChilds(id, target);
            me.childs.forEach(function (child) {
                expand ? $(child).show() : $(child).hide();
            });
        };
        //$timeout(function () {
        //    this.toggle = function (id, target, expand) {
        //        me.childs = me.getRowsChilds(id, target);
        //        me.childs.forEach(function (child) {
        //            expand ? $(child).show() : $(child).hide();
        //        });
        //    };
        //    elemTplCaret.on('click', function (e) {
        //        $log.debug('    toggle row');
        //        var $this = $(this);
        //        if (scope.firstExpand) {
        //            elemTplCaret.addClass('fa-spinner');
        //            scope.firstExpand = false;
        //            var childScope = scope.$new();
        //            if (me.childs && me.childs.length && me.childs.length > 0) {
        //                childScope.data = me.childs;
        //                childScope.level = scope.level + 1;
        //                childScope.parentId = scope.$id;
        //                $compile(elemTplRow)(childScope);
        //                scope.expand = !scope.expand;
        //                me.toggle(scope.$id, $this.closest('tr'), scope.expand);
        //                elemTplRow.insertAfter(element);
        //            } else
        //                scope.getChildren()(scope.d).then(function (response) {
        //                    elemTplCaret.removeClass('fa-spinner');
        //                    if (response.data.length > 0) {
        //                        childScope.data = response.data;
        //                        childScope.level = scope.level + 1;
        //                        childScope.parentId = scope.$id;
        //                        $compile(elemTplRow)(childScope);
        //                        scope.expand = !scope.expand;
        //                        me.toggle(scope.$id, $this.closest('tr'), scope.expand);
        //                        elemTplRow.insertAfter(element);
        //                    } else elemTplCaret.removeClass('fa').removeClass('fa-caret-down').removeClass('fa-caret-right').off('click');
        //                });
        //        } else scope.$apply(function () {
        //            scope.expand = !scope.expand;
        //            me.toggle(scope.$id, $this.closest('tr'), scope.expand);
        //        });
        //    });
        //    //insert caret
        //    $compile(elemTplCaret)(scope);
        //    angular.element(element.find('td')[0]).prepend(elemTplCaret);
        //}, 0);
    };
    return {
        require: ['^blsTable'],
        priority: -16,
        restrict: 'E',
        link: link,
        scope: {
            data: '=ngModel',
            level: '='
        }
    };
}]).directive('blsStaticChildCells', ['$log', '$compile', '$templateCache', '$timeout', function ($log, $compile, $templateCache, $timeout) {
    var link = function (scope, element, attrs, ctrls) {
        $log.debug('        Link => blsStaticChildData');
        scope.expand = false;
        var elemTplRow = angular.element($templateCache.get('templates/blsStaticChildData.html'));
        scope.childs = ngModel[childItemsProp];
        scope.isExpandable = angular.isDefined(scope.childs) && scope.childs.length;
        $log.debug('scope.childs', scope.childs);
        $timeout(function () {
            $compile(elemTplRow)(scope);
            elemTplRow.insertAfter(element);
        });
    }
    return {
        //require: ['^blsStaticChildsRows'],
        priority: -16,
        restrict: 'E',
        link: link,
        scope: {
            ngModel: '=',
            level: '=',
            cols: '='
        }
    };
}]);

angular.module("bls_components").directive('blsToolBar', [function () {
    // Runs during compile
    return {
        priority: 2,
        scope: true, // {} = isolate, true = child, false/undefined = no change
        restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
        templateUrl: 'templates/blsToolBar.html',
        replace: true,
        controller: ['$scope', '$element','$log', function ($scope, $element, $log) {
            $scope.btnClass = "btn btn-default";
            $scope.searchPlaceHolder = "search...";
            $scope.selectedAll = false;
            $scope.titleExportButton = "Export";
            $scope.clearUserData = function () {
                $scope.$emit('blsTable.ResetEvent');
            };
            $scope.refresh = function () {
                $scope.$emit('blsTable.RefreshEvent');
            };
            $scope.toggleSelectAll = function () {
                $scope.selectedAll = !$scope.selectedAll;
                $scope.$emit('blsTable.toggleSelectAllEvent', $scope.selectedAll);
            };
            $scope.export = function (type) {
                $log.debug('    export type => ', type);
                $scope.$emit('blsTable.ExportEvent', type);
            };
        }]
    };
}]);
//
// http://litutech.blogspot.fr/2014/02/an-angular-table-directive-having.html
//
//---------------------------------------------------------------------------
angular.module("bls_components").directive('draggable', function () {
    return {
        link: function (scope, elem, attr) {
            elem.attr("draggable", true);
            var dragDataVal = '';
            var draggedGhostImgElemId = '';
            attr.$observe('dragdata', function (newVal) {
                dragDataVal = newVal;
            });
            attr.$observe('dragimage', function (newVal) {
                draggedGhostImgElemId = newVal;
            });
            elem.bind("dragstart", function (e) {
                var sendData = angular.toJson(dragDataVal);
                e.originalEvent.dataTransfer.setData("Text", sendData);
                var dragFn = attr.drag;
                if (dragFn !== 'undefined') {
                    scope.$apply(function () {
                        scope[dragFn](sendData);
                    });
                }
            });
        }
    };
});
//
// http://litutech.blogspot.fr/2014/02/an-angular-table-directive-having.html
//
//---------------------------------------------------------------------------
angular.module("bls_components").directive('droppable', ['$parse',
    function($parse) {
        return {
            link: function(scope, element, attr) {
                function onDragOver(e) {
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

angular.module("bls_components").directive('dynamic', ['$compile', '$log', '$timeout', function ($compile, $log, $timeout) {
    return {
        restrict: 'A',
        replace: true,
        priority: -20,
        link: function (scope, ele, attrs) {
            $timeout(function () {
                if (angular.isDefined(attrs.dynamic)) {
                    //$log.debug('in dynamic');
                    var value = scope.$eval(attrs.dynamic);
                    //$log.debug('value => ', value);
                    if (value && value !== '') {
                        value = value.trim();
                        if (!value.startsWith('{{') && $(value)[0])
                        {
                            ele.html(value);
                            //$log.debug('ele => ', ele.html());
                        }
                        else
                            ele.text(value);
                        $compile(ele.contents())(scope);
                    }
                }
            });
        }
    };
}]);

angular.module("bls_components").directive("panel", function () {
    return {
        link: function (scope, element, attrs) {
            scope.dataSource = "directive";
        },
        restrict: "E",
        scope: true,
        template: function () {
            return angular.element(document.querySelector("#template")).html();
        },
        transclude: true
    };
});

angular.module("bls_components").factory('blsTableConfigManager', ['$log', 'localStorageService', function ($log, localStorageService) {
    
    function blsTableConfigManager(storageKey) {
        this.storageKey = storageKey;
        this.tableConfig = {};
    }
    
    blsTableConfigManager.prototype = {
        get: function () { return this.tableConfig; },
        //init columns disposition from the localStorage if exists else create new Object
        init: function (columns, elementOffsetWidth) {
            if (localStorageService.isSupported) this.tableConfig = localStorageService.get(this.storageKey);
            if (this.tableConfig !== null && angular.isDefined(this.tableConfig.cols) && this.tableConfig.cols.length != columns.length)
                this.tableConfig = null;
            if (this.tableConfig === null) {
                this.tableConfig = {
                    id: this.storageKey,
                    cols: []
                };
                var defaulColWidth = Math.round(elementOffsetWidth / columns.length);
                for (var i = 0; i <= columns.length - 1; i++) {
                    this.tableConfig.cols.push({
                        index: i,
                        fieldName: columns[i].fieldName,
                        width: defaulColWidth,
                        sortDirection: 'none'//Enum: none, asc, desc
                    });
                }
                this.save(this.tableConfig);
            }
            return this.tableConfig;
        },
        saveItemsByPage: function (itemsByPage) {
            this.tableConfig.itemsByPage = itemsByPage;
            this.save(this.tableConfig);
        },
        swapCol: function (from, to) {
            this.tableConfig.cols.swap(from, to);
            this.save(this.tableConfig);
        },
        setSortDirection: function (index, sortDirection) {
            this.tableConfig.cols[index].sortDirection = sortDirection;
            this.save(this.tableConfig);
        },
        setColWidth: function (index, width) {
            //$log.debug('setColWidth => ', index, ' width = ', width);
            this.tableConfig.cols[index].width = width;
            this.save(this.tableConfig);
            return this.tableConfig;
        },
        listSortedCols: function () {
            var sortTable = [];
            this.tableConfig.cols.forEach(function (col) {
                if (col.sortDirection !== 'none' && angular.isDefined(col.fieldName))
                    sortTable.push(col);
            });
            return sortTable;
        },
        save: function (val) {
            if (localStorageService.isSupported) localStorageService.set(this.storageKey, val);
        },
        destroy: function () {
            if (localStorageService.isSupported) {
                $log.debug('clear all regex => ', '^(.)+' + this.storageKey + '$');
                localStorageService.clearAll(this.storageKey + '$');
            }
        }
    };
    return (blsTableConfigManager);

}]);



angular.module("bls_components").service('blsTableServices', ['$log', 'localStorageService', function ($log, localStorageService) {
    Array.prototype.swap = function (new_index, old_index) {
        if (new_index >= this.length) {
            var k = new_index - this.length;
            while ((k--) + 1) {
                this.push(undefined);
            }
        }
        this.splice(new_index, 0, this.splice(old_index, 1)[0]);
        return this;
    };
    Array.prototype.distinct = function () {
        var u = {}, a = [];
        for (var i = 0, l = this.length; i < l; ++i) {
            if (u.hasOwnProperty(this[i])) {
                continue;
            }
            a.push(this[i]);
            u[this[i]] = 1;
        }
        return a;
    };

    if (!String.prototype.startsWith) {
        String.prototype.startsWith = function (searchString, position) {
            position = position || 0;
            return this.indexOf(searchString, position) === position;
        };
    }

    this.defaultColConfig = function (length) {
        var array = new Array(length);
        for (var i = array.length - 1; i >= 0; i--) {
            array[i] = i;
        }
        return array;
    };
    this.swapArrayElements = function (array_object, index_a, index_b) {
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
    this.initReorderColumns = function (colArray, dataArray, key) {
        var arrayConfig = localStorageService.get(key);
        if (arrayConfig === null || arrayConfig.length === 0) arrayConfig = this.defaultColConfig(colArray.length);
        var me = this;
        for (var i = 0; i < arrayConfig.length - 2; i++) {
            if (i != arrayConfig[i]) {
                if (i > arrayConfig[i] && i == arrayConfig[arrayConfig.indexOf(i)]) continue;
                me.swapArrayElements(colArray, i, arrayConfig.indexOf(i));
                me.swapArrayElements(dataArray, i, arrayConfig.indexOf(i));
            }
        }
        return arrayConfig;
    };
    /**
     * save col config array
     * @param  {[type]} colConfigArray [description]
     * @param  {[type]} key            [description]
     */
    this.saveConfig = function (key, colConfigArray) {
        if (localStorageService.isSupported) {
            $log.info('saveConfig  : ' + colConfigArray);
            $log.info('saveConfig key : ' + key);
            localStorageService.set(key, colConfigArray);
        }
    };
}]).filter('highlight', ['$sce', function ($sce) {
    return function (text, phrase, isActive) {
        if (!angular.isString(text) || !isActive) return text;
        if (phrase) text = text.replace(new RegExp('(' + phrase + ')', 'gi'),
          '<span class="highlighted">$1</span>')

        return $sce.trustAsHtml(text)
    }
}]);

/*The MIT License (MIT)

Copyright (c) 2014 https://github.com/kayalshri/

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.*/
(function($) {
    $.fn.extend({
        tableExport: function(options) {
            var defaults = {
                separator: ',',
                ignoreColumn: [],
                tableName: 'yourTableName',
                type: 'csv',
                pdfFontSize: 14,
                pdfLeftMargin: 20,
                escape: 'true',
                htmlContent: 'false',
                consoleLog: 'false'
            };
            var options = $.extend(defaults, options);
            var el = this;
            if (defaults.type == 'csv' || defaults.type == 'txt') {
                // Header
                var tdData = "";
                $(el).find('thead').find('tr').each(function() {
                    tdData += "\n";
                    $(this).filter(':visible').find('th').each(function(index, data) {
                        if ($(this).css('display') != 'none') {
                            if (defaults.ignoreColumn.indexOf(index) == -1) {
                                tdData += '"' + parseString($(this)) + '"' + defaults.separator;
                            }
                        }
                    });
                    tdData = $.trim(tdData);
                    tdData = $.trim(tdData).substring(0, tdData.length - 1);
                });
                // Row vs Column
                $(el).find('tbody').find('tr').each(function() {
                    tdData += "\n";
                    $(this).filter(':visible').find('td').each(function(index, data) {
                        if ($(this).css('display') != 'none') {
                            if (defaults.ignoreColumn.indexOf(index) == -1) {
                                tdData += '"' + parseString($(this)) + '"' + defaults.separator;
                            }
                        }
                    });
                    //tdData = $.trim(tdData);
                    tdData = $.trim(tdData).substring(0, tdData.length - 1);
                });
                //output
                if (defaults.consoleLog == 'true') {
                    console.log(tdData);
                }
                var base64data = "base64," + $.base64.encode(tdData);
                window.open('data:application/' + defaults.type + ';filename=exportData;' + base64data);
            } else if (defaults.type == 'sql') {
                // Header
                var tdData = "INSERT INTO `" + defaults.tableName + "` (";
                $(el).find('thead').find('tr').each(function() {
                    $(this).filter(':visible').find('th').each(function(index, data) {
                        if ($(this).css('display') != 'none') {
                            if (defaults.ignoreColumn.indexOf(index) == -1) {
                                tdData += '`' + parseString($(this)) + '`,';
                            }
                        }
                    });
                    tdData = $.trim(tdData);
                    tdData = $.trim(tdData).substring(0, tdData.length - 1);
                });
                tdData += ") VALUES ";
                // Row vs Column
                $(el).find('tbody').find('tr').each(function() {
                    tdData += "(";
                    $(this).filter(':visible').find('td').each(function(index, data) {
                        if ($(this).css('display') != 'none') {
                            if (defaults.ignoreColumn.indexOf(index) == -1) {
                                tdData += '"' + parseString($(this)) + '",';
                            }
                        }
                    });
                    tdData = $.trim(tdData).substring(0, tdData.length - 1);
                    tdData += "),";
                });
                tdData = $.trim(tdData).substring(0, tdData.length - 1);
                tdData += ";";
                //output
                //console.log(tdData);
                if (defaults.consoleLog == 'true') {
                    console.log(tdData);
                }
                var base64data = "base64," + $.base64.encode(tdData);
                window.open('data:application/sql;filename=exportData;' + base64data);
            } else if (defaults.type == 'json') {
                var jsonHeaderArray = [];
                $(el).find('thead').find('tr').each(function() {
                    var tdData = "";
                    var jsonArrayTd = [];
                    $(this).filter(':visible').find('th').each(function(index, data) {
                        if ($(this).css('display') != 'none') {
                            if (defaults.ignoreColumn.indexOf(index) == -1) {
                                jsonArrayTd.push(parseString($(this)));
                            }
                        }
                    });
                    jsonHeaderArray.push(jsonArrayTd);
                });
                var jsonArray = [];
                $(el).find('tbody').find('tr').each(function() {
                    var tdData = "";
                    var jsonArrayTd = [];
                    $(this).filter(':visible').find('td').each(function(index, data) {
                        if ($(this).css('display') != 'none') {
                            if (defaults.ignoreColumn.indexOf(index) == -1) {
                                jsonArrayTd.push(parseString($(this)));
                            }
                        }
                    });
                    jsonArray.push(jsonArrayTd);
                });
                var jsonExportArray = [];
                jsonExportArray.push({
                    header: jsonHeaderArray,
                    data: jsonArray
                });
                //Return as JSON
                //console.log(JSON.stringify(jsonExportArray));
                //Return as Array
                //console.log(jsonExportArray);
                if (defaults.consoleLog == 'true') {
                    console.log(JSON.stringify(jsonExportArray));
                }
                var base64data = "base64," + $.base64.encode(JSON.stringify(jsonExportArray));
                window.open('data:application/json;filename=exportData;' + base64data);
            } else if (defaults.type == 'xml') {
                var xml = '<?xml version="1.0" encoding="utf-8"?>';
                xml += '<tabledata><fields>';
                // Header
                $(el).find('thead').find('tr').each(function() {
                    $(this).filter(':visible').find('th').each(function(index, data) {
                        if ($(this).css('display') != 'none') {
                            if (defaults.ignoreColumn.indexOf(index) == -1) {
                                xml += "<field>" + parseString($(this)) + "</field>";
                            }
                        }
                    });
                });
                xml += '</fields><data>';
                // Row Vs Column
                var rowCount = 1;
                $(el).find('tbody').find('tr').each(function() {
                    xml += '<row id="' + rowCount + '">';
                    var colCount = 0;
                    $(this).filter(':visible').find('td').each(function(index, data) {
                        if ($(this).css('display') != 'none') {
                            if (defaults.ignoreColumn.indexOf(index) == -1) {
                                xml += "<column-" + colCount + ">" + parseString($(this)) + "</column-" + colCount + ">";
                            }
                        }
                        colCount++;
                    });
                    rowCount++;
                    xml += '</row>';
                });
                xml += '</data></tabledata>'
                if (defaults.consoleLog == 'true') {
                    console.log(xml);
                }
                var base64data = "base64," + $.base64.encode(xml);
                window.open('data:application/xml;filename=exportData;' + base64data);
            } else if (defaults.type == 'excel' || defaults.type == 'doc' || defaults.type == 'powerpoint') {
                //console.log($(this).html());
                var excel = "<table>";
                // Header
                $(el).find('thead').find('tr').each(function() {
                    excel += "<tr>";
                    $(this).filter(':visible').find('th').each(function(index, data) {
                        if ($(this).css('display') != 'none') {
                            if (defaults.ignoreColumn.indexOf(index) == -1) {
                                excel += "<td>" + parseString($(this)) + "</td>";
                            }
                        }
                    });
                    excel += '</tr>';
                });
                // Row Vs Column
                var rowCount = 1;
                $(el).find('tbody').find('tr').each(function() {
                    excel += "<tr>";
                    var colCount = 0;
                    $(this).filter(':visible').find('td').each(function(index, data) {
                        if ($(this).css('display') != 'none') {
                            if (defaults.ignoreColumn.indexOf(index) == -1) {
                                excel += "<td>" + parseString($(this)) + "</td>";
                            }
                        }
                        colCount++;
                    });
                    rowCount++;
                    excel += '</tr>';
                });
                excel += '</table>'
                if (defaults.consoleLog == 'true') {
                    console.log(excel);
                }
                var excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:" + defaults.type + "' xmlns='http://www.w3.org/TR/REC-html40'>";
                excelFile += "<head>";
                excelFile += "<!--[if gte mso 9]>";
                excelFile += "<xml>";
                excelFile += "<x:ExcelWorkbook>";
                excelFile += "<x:ExcelWorksheets>";
                excelFile += "<x:ExcelWorksheet>";
                excelFile += "<x:Name>";
                excelFile += "{worksheet}";
                excelFile += "</x:Name>";
                excelFile += "<x:WorksheetOptions>";
                excelFile += "<x:DisplayGridlines/>";
                excelFile += "</x:WorksheetOptions>";
                excelFile += "</x:ExcelWorksheet>";
                excelFile += "</x:ExcelWorksheets>";
                excelFile += "</x:ExcelWorkbook>";
                excelFile += "</xml>";
                excelFile += "<![endif]-->";
                excelFile += "</head>";
                excelFile += "<body>";
                excelFile += excel;
                excelFile += "</body>";
                excelFile += "</html>";
                var base64data = "base64," + $.base64.encode(excelFile);
                window.open('data:application/vnd.ms-' + defaults.type + ';filename=exportData.doc;' + base64data);
            } else if (defaults.type == 'png') {
                html2canvas($(el), {
                    onrendered: function(canvas) {
                        var img = canvas.toDataURL("image/png");
                        window.open(img);
                    }
                });
            } else if (defaults.type == 'pdf') {
                var doc = new jsPDF('p', 'pt', 'a4', true);
                doc.setFontSize(defaults.pdfFontSize);
                // Header
                var startColPosition = defaults.pdfLeftMargin;
                $(el).find('thead').find('tr').each(function() {
                    $(this).filter(':visible').find('th').each(function(index, data) {
                        if ($(this).css('display') != 'none') {
                            if (defaults.ignoreColumn.indexOf(index) == -1) {
                                var colPosition = startColPosition + (index * 50);
                                doc.text(colPosition, 20, parseString($(this)));
                            }
                        }
                    });
                });
                // Row Vs Column
                var startRowPosition = 20;
                var page = 1;
                var rowPosition = 0;
                $(el).find('tbody').find('tr').each(function(index, data) {
                    rowCalc = index + 1;
                    if (rowCalc % 26 == 0) {
                        doc.addPage();
                        page++;
                        startRowPosition = startRowPosition + 10;
                    }
                    rowPosition = (startRowPosition + (rowCalc * 10)) - ((page - 1) * 280);
                    $(this).filter(':visible').find('td').each(function(index, data) {
                        if ($(this).css('display') != 'none') {
                            if (defaults.ignoreColumn.indexOf(index) == -1) {
                                var colPosition = startColPosition + (index * 50);
                                doc.text(colPosition, rowPosition, parseString($(this)));
                            }
                        }
                    });
                });
                // Output as Data URI
                doc.output('datauri');
            }

            function parseString(data) {
                if (defaults.htmlContent == 'true') {
                    content_data = data.html().trim();
                } else {
                    content_data = data.text().trim();
                }
                if (defaults.escape == 'true') {
                    content_data = escape(content_data);
                }
                return content_data;
            }
        }
    });
})(jQuery);

/*jslint adsafe: false, bitwise: true, browser: true, cap: false, css: false,
  debug: false, devel: true, eqeqeq: true, es5: false, evil: false,
  forin: false, fragment: false, immed: true, laxbreak: false, newcap: true,
  nomen: false, on: false, onevar: true, passfail: false, plusplus: true,
  regexp: false, rhino: true, safe: false, strict: false, sub: false,
  undef: true, white: false, widget: false, windows: false */
/*global jQuery: false, window: false */
//"use strict";

/*
 * Original code (c) 2010 Nick Galbreath
 * http://code.google.com/p/stringencoders/source/browse/#svn/trunk/javascript
 *
 * jQuery port (c) 2010 Carlo Zottmann
 * http://github.com/carlo/jquery-base64
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
*/

/* base64 encode/decode compatible with window.btoa/atob
 *
 * window.atob/btoa is a Firefox extension to convert binary data (the "b")
 * to base64 (ascii, the "a").
 *
 * It is also found in Safari and Chrome.  It is not available in IE.
 *
 * if (!window.btoa) window.btoa = $.base64.encode
 * if (!window.atob) window.atob = $.base64.decode
 *
 * The original spec's for atob/btoa are a bit lacking
 * https://developer.mozilla.org/en/DOM/window.atob
 * https://developer.mozilla.org/en/DOM/window.btoa
 *
 * window.btoa and $.base64.encode takes a string where charCodeAt is [0,255]
 * If any character is not [0,255], then an exception is thrown.
 *
 * window.atob and $.base64.decode take a base64-encoded string
 * If the input length is not a multiple of 4, or contains invalid characters
 *   then an exception is thrown.
 */
 
jQuery.base64 = ( function( $ ) {
  
  var _PADCHAR = "=",
    _ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
    _VERSION = "1.0";


  function _getbyte64( s, i ) {
    // This is oddly fast, except on Chrome/V8.
    // Minimal or no improvement in performance by using a
    // object with properties mapping chars to value (eg. 'A': 0)

    var idx = _ALPHA.indexOf( s.charAt( i ) );

    if ( idx === -1 ) {
      throw "Cannot decode base64";
    }

    return idx;
  }
  
  
  function _decode( s ) {
    var pads = 0,
      i,
      b10,
      imax = s.length,
      x = [];

    s = String( s );
    
    if ( imax === 0 ) {
      return s;
    }

    if ( imax % 4 !== 0 ) {
      throw "Cannot decode base64";
    }

    if ( s.charAt( imax - 1 ) === _PADCHAR ) {
      pads = 1;

      if ( s.charAt( imax - 2 ) === _PADCHAR ) {
        pads = 2;
      }

      // either way, we want to ignore this last block
      imax -= 4;
    }

    for ( i = 0; i < imax; i += 4 ) {
      b10 = ( _getbyte64( s, i ) << 18 ) | ( _getbyte64( s, i + 1 ) << 12 ) | ( _getbyte64( s, i + 2 ) << 6 ) | _getbyte64( s, i + 3 );
      x.push( String.fromCharCode( b10 >> 16, ( b10 >> 8 ) & 0xff, b10 & 0xff ) );
    }

    switch ( pads ) {
      case 1:
        b10 = ( _getbyte64( s, i ) << 18 ) | ( _getbyte64( s, i + 1 ) << 12 ) | ( _getbyte64( s, i + 2 ) << 6 );
        x.push( String.fromCharCode( b10 >> 16, ( b10 >> 8 ) & 0xff ) );
        break;

      case 2:
        b10 = ( _getbyte64( s, i ) << 18) | ( _getbyte64( s, i + 1 ) << 12 );
        x.push( String.fromCharCode( b10 >> 16 ) );
        break;
    }

    return x.join( "" );
  }
  
  
  function _getbyte( s, i ) {
    var x = s.charCodeAt( i );

    if ( x > 255 ) {
      throw "INVALID_CHARACTER_ERR: DOM Exception 5";
    }
    
    return x;
  }


  function _encode( s ) {
    if ( arguments.length !== 1 ) {
      throw "SyntaxError: exactly one argument required";
    }

    s = String( s );

    var i,
      b10,
      x = [],
      imax = s.length - s.length % 3;

    if ( s.length === 0 ) {
      return s;
    }

    for ( i = 0; i < imax; i += 3 ) {
      b10 = ( _getbyte( s, i ) << 16 ) | ( _getbyte( s, i + 1 ) << 8 ) | _getbyte( s, i + 2 );
      x.push( _ALPHA.charAt( b10 >> 18 ) );
      x.push( _ALPHA.charAt( ( b10 >> 12 ) & 0x3F ) );
      x.push( _ALPHA.charAt( ( b10 >> 6 ) & 0x3f ) );
      x.push( _ALPHA.charAt( b10 & 0x3f ) );
    }

    switch ( s.length - imax ) {
      case 1:
        b10 = _getbyte( s, i ) << 16;
        x.push( _ALPHA.charAt( b10 >> 18 ) + _ALPHA.charAt( ( b10 >> 12 ) & 0x3F ) + _PADCHAR + _PADCHAR );
        break;

      case 2:
        b10 = ( _getbyte( s, i ) << 16 ) | ( _getbyte( s, i + 1 ) << 8 );
        x.push( _ALPHA.charAt( b10 >> 18 ) + _ALPHA.charAt( ( b10 >> 12 ) & 0x3F ) + _ALPHA.charAt( ( b10 >> 6 ) & 0x3f ) + _PADCHAR );
        break;
    }

    return x.join( "" );
  }


  return {
    decode: _decode,
    encode: _encode,
    VERSION: _VERSION
  };
      
}( jQuery ) );

//# sourceMappingURL=blsComponents.js.map