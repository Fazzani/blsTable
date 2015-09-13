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
            function ($log, $compile, $templateCache, $timeout, $parse, blsTableServices ) {
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
                            $scope.options.pagination.itemsPerPage.selected = this.tableConfigManager.get().itemsByPage
                                || $scope.options.pagination.itemsPerPage.range[0];
                        };

                        $scope.$watch('options.pagination.pageIndex', function (newValue, oldValue) {
                            if (newValue != oldValue) {
                                $scope.options.pagination.pageIndex = newValue++;
                                me.refreshDataGrid();
                            }
                        });
                        $scope.updateRecordsCount = function () {
                            this.tableConfigManager.saveItemsByPage($scope.options.pagination.itemsPerPage.selected);
                            $scope.options.pagination.pageLength = $scope.options.pagination.itemsPerPage.selected;
                            me.refreshDataGrid();
                        };

                        //Reload ngModel by the Func
                        this.refreshDataGrid = function () {
                            if (angular.isDefined($scope.funcAsync)) {
                                me.tableConfigManager.init($scope.cols, $element[0].offsetWidth);
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
                col.tpl = col.tpl.replace('::row', 'd');
                //$log.debug('            col.tpl => ', col.tpl);
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
                    var value = eval("scope." + attrs.dynamic);
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
            if (this.tableConfig !== null && this.tableConfig.cols.length && this.tableConfig.cols.length != columns.length)
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