(function (angular) {
    'use strict';
    angular.module("bls_tpls", []).run(["$templateCache", "$templateRequest", function ($templateCache, $templateRequest) {
        $templateRequest('templates/blsTr.html');
        $templateRequest('templates/blsTable.html');
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
                                    <input type="text" class="{{options.toolbar.search.searchClass}}" name="search" id="search" placeholder="{{searchPlaceHolder}}" ng-model="options.toolbar.search.searchText">\
                                    <span class="glyphicon glyphicon-search form-control-feedback"></span>\
                                </div>\
                            </form>\
                        </div>\
                 </div>');
        $templateCache.put('templates/blsHeader.html', '<tr>\
                        <th class="colHeader" ng-repeat="col in cols" ng-click="order(col)" style="width:{{getColWidth($index)}}" allow-drag>\
                                        {{col.title|uppercase}}\
                            <i ng-if="col.sortable" class="pull-left fa " ng-class="glyphOrder(col)"></i><i ng-if="col.resize" class="resize"></i>\
                        </th>\
                   </tr>');
        $templateCache.put('templates/blsActions.html', '<td ng-if="c.isActions" class="center">\
                            <a ng-repeat="btn in options.actions" class="btn btn-default {{btn.class}}" ng-click="action(btn,d)" title="{{btn.title}}" ng-class="btn.class"><i class="{{btn.glyphicon}}"></i></a>\
                   </td>');
        $templateCache.put('templates/blsRows.html', '<tr ng-repeat="d in data" ><td ng-repeat="c in cols" bls-actions dynamic="getTdTpl(c)" ng-bind-html="d[c.fieldName]| highlight:options.toolbar.search.searchText:options.toolbar.search.heighLight"></td></tr>');
        $templateCache.put('templates/blsChildRows.html', '<tr ng-repeat="d in data" data-bls-id="{{$id}}" parentId="{{parentId}}" bls-row-child func="getChildren" data-level="{{level}}">\
                            <td ng-repeat="c in cols" bls-actions dynamic="getTdTpl(c)" ng-bind-html="d[c.fieldName]| highlight:options.toolbar.search.searchText:options.toolbar.search.heighLight"></td></tr>');
        $templateCache.put('templates/blsStaticChildRows.html', '<tr ng-repeat="d in data" data-bls-id="{{$id}}" parentId="{{parentId}}" bls-static-child-cells level="{{level}}"></tr>');
        $templateCache.put('templates/blsStaticChildCells.html', '<td ng-repeat="c in cols" dynamic="getTdTpl(c)">\
                                    <i id="{{$id}}" ng-if="isExpandable" class="fa {{expand?\'fa-caret-down\':\'fa-caret-right\'}}" style="padding:0 4px 0 {{5+(15*level)}}px"></i>\
                                    {{ngModel[c.fieldName]}}{{isExpandable}}</td>\
                                <bls-static-childs-rows ng-model="childs" ng-if="isExpandable"  level={{level++}}></bls-static-childs-rows>');
        $templateCache.put('templates/blsChildRowsCaret.html', '<i id="{{$id}}" class="fa {{expand?\'fa-caret-down\':\'fa-caret-right\'}}" style="padding:0 4px 0 {{5+(15*level)}}px"></i>');
    }]);
})(window.angular);




(function (angular) {
    angular.module("bls_components", ['bls_tpls', 'ngSanitize'])
        .directive('blsTable', ['$log', '$compile', '$templateCache', '$timeout', 'blsTableServices', function ($log, $compile, $templateCache, $timeout, blsTableServices) {
            var me = this;
            this.controller = ['$scope', '$attrs', '$filter', '$timeout', '$element', '$log', 'localStorageService', 'blsTableServices',
                function ($scope, $attrs, $filter, $timeout, $element, $log, localStorageService, blsTableServices) {
                    var me = this;
                    me.initialLoad = $scope.isLoading = true;
                    this.tableConfig = {};
                    $scope.uniqueId = "blsContainer_" + $scope.$id;
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
                        toolbar: {
                            hide: false,
                            search: {
                                hide: false,
                                searchText: '',
                                searchClass: 'form-control',
                                heighLight: true
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
                    this.initExportFormatArray = function () {
                        try {
                            if (angular.isDefined($scope.options.toolbar.export.formats))
                                defaultOptions.toolbar.export.formats = $scope.options.toolbar.export.formats;
                        } catch (e) {
                        }
                    };
                    this.initExportFormatArray();
                    $scope.options = angular.merge({}, defaultOptions, $scope.options);
                    $scope.options.toolbar.export.formats = $scope.options.toolbar.export.formats.distinct();

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
                    };
                    
                    //Reload ngModel by the Func
                    this.refreshDataGrid = function () {
                        if (angular.isDefined($scope.funcAsync)) {
                            me.initColConfig();
                            $scope.isLoading = true;
                            $scope.reverse = localStorageService.get($scope.storageIds.reverseId);
                            $scope.predicate = localStorageService.get($scope.storageIds.predicateId) || ($scope.cols[0] === undefined ? "" : $scope.cols[0].id);
                            $scope.funcAsync({
                                pageIndex: $scope.options.pagination.pageIndex,
                                pageLength: $scope.options.pagination.itemsPerPage.selected,
                                searchedText: $scope.options.toolbar.search.searchText,
                                orderBy: $scope.predicate,
                                order: $scope.reverse
                                //,filters:[{name:'age',value:10}]
                            });
                        }
                    };
                    this.setCols = function (cols) {
                        $scope.cols = cols;
                        $scope.$emit('blsDataGrid_initedEvent');
                        $log.debug('cols =>', $scope.cols);
                        me.initColConfig();
                        me.refreshDataGrid();
                    };
                    this.getCols = function () {
                        return $scope.cols;
                    };
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
                        me.refreshDataGrid();//TODO: à virer et corriger le pb du drag and Drop
                    };
                    $scope.setColWidth = function (index, width) {
                        $log.debug('setColWidth => ', index, ' width = ', width);
                        me.tableConfig.cols[index].width = width;
                        $scope.saveUserData({
                            key: $scope.storageIds.tableConfig,
                            val: me.tableConfig
                        });
                    };
                    $scope.$watch('options.toolbar.search.searchText', function (newValue, oldValue) {
                        if (me.timerSearch) $timeout.cancel(me.timerSearch);
                        if (newValue != oldValue) {
                            me.timerSearch = $timeout(function () {
                                me.refreshDataGrid();
                            }, 500);
                        }
                    });
                    $scope.$watch('data', function (newValue, oldValue) {
                        $log.debug('data changed!!!');
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
                        if (me.tableConfig === null) {
                            me.tableConfig = {
                                id: $scope.uniqueId,
                                cols: []
                            };
                            var defaulColWidth = Math.round($element[0].offsetWidth / $scope.cols.length);
                            for (var i = 0; i <= $scope.cols.length - 1; i++) {
                                me.tableConfig.cols.push({
                                    index: i,
                                    width: defaulColWidth
                                });
                            }
                            $scope.saveUserData({
                                key: $scope.storageIds.tableConfig,
                                val: me.tableConfig
                            });
                        }
                    };
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
                    };
                    $scope.saveUserData = function (data) {
                        if (localStorageService.isSupported) localStorageService.set(data.key, data.val);
                    };
                    this.getChildItemsProp = function () {
                        return $scope.childItemsProp;
                    };
                    $scope.isStaticHierarchic = function () {
                        return angular.isDefined($scope.childItemsProp) && $scope.childItemsProp.length > 0;
                    };
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
angular.module("bls_components").directive('blsActions', ['$log', '$compile', '$templateCache', '$timeout', '$q', function ($log, $compile, $templateCache, $timeout, $q) {
    var link = function (scope, element, attrs, ctrls) {
        // var blsTableCtrl = ctrls[0];
        if (scope.c.isActions) {
            var eleTpl = angular.element($templateCache.get('templates/blsActions.html'));
            $timeout(function () {
                element.replaceWith(eleTpl);
                $compile(eleTpl)(scope);
            }, 0);
        }
        scope.action = function (btn, d) {
            $q.when(btn.action(d)).then(function (res) {
                if (btn.isRemoveAction) {
                    scope.data.splice(scope.data.indexOf(d), 1);
                }
            });
        };
    };

    return {
        //require: ['^blsTable'],
        priority: -18,
        restrict: 'A',
        link: link
    };
}]);

angular.module("bls_components").directive('blsCol', ['$log', '$compile', '$templateCache', '$timeout', function ($log, $compile, $templateCache, $timeout) {
    var link = {
        pre: function (scope, element, attrs, ctrls) {
            // var blsTableCtrl = ctrls[0];
            var blsColsCtrl = ctrls[1];
            // var blsColCtrl = ctrls[2];
            $log.debug('        Link => blsCol');
            if (attrs.isActions) {
                blsColsCtrl.addCol({
                    title: attrs.title || 'Actions',
                    isActions: true,
                    resize: angular.isDefined(attrs.resize)
                });
            } else
                blsColsCtrl.addCol({
                    title: attrs.title || attrs.fieldName,
                    fieldName: attrs.fieldName,
                    resize: angular.isDefined(attrs.resize),
                    tpl: element.html(),
                    sortable: angular.isDefined(attrs.sort),
                    dragable: angular.isDefined(attrs.dragable)
                });
        }
    };
    
    return {
        priority: -1,
        require: ['^blsTable', '^blsCols'],
        restrict: 'E',
        link: link
    };
}]);

angular.module("bls_components").directive('blsCols', ['$log', '$compile', '$templateCache', '$timeout', function ($log, $compile, $templateCache, $timeout) {
    var link = {
        post: function (scope, element, attrs, ctrls) {
            var blsTableCtrl = ctrls[0];
            var blsColsCtrl = ctrls[1];
            $log.debug('    Link => blsCols');
            blsTableCtrl.setCols(blsColsCtrl.getCols());
        }
    };
    var controller = ['$scope', '$filter', '$timeout', '$element', '$log', 'localStorageService', 'blsTableServices',
        function ($scope, $filter, $timeout, $element, $log, localStorageService, blsTableServices) {
            $log.debug('    controller => blsCols');
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

angular.module("bls_components").directive('blsRowChild', ['$log', '$compile', '$templateCache', '$timeout', function ($log, $compile, $templateCache, $timeout) {
    var link = function (scope, element, attrs, ctrls, transclude) {
        $log.debug('    Link => blsRows');
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
        scope.getTdTpl = function (col, d) {
            var predicate = "d[c.fieldName] ";
            //
            if (col.tpl && col.tpl !== '') {
                col.tpl = col.tpl.replace('::data', 'd');
                    col.tpl = col.tpl.replace('::field', predicate);
                return col.tpl;
            }
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
                $log.debug('    toggle row');
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
        // debugger;

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
                col.tpl = col.tpl.replace('::data', 'd');
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
        controller: ['$scope', '$element', '$document', '$log', function ($scope, $element, $document, $log) {
            $scope.btnClass = "btn btn-default";
            $scope.searchPlaceHolder = "search...";
            $scope.selectedAll = false;
            $scope.titleExportButton = "Export";
            $scope.clearUserData = function () {
                $scope.$emit('flushEvent');
            };
            $scope.refresh = function () {
                $scope.$emit('refreshEvent');
            };
            $scope.toggleSelectAll = function () {
                $scope.selectedAll = !$scope.selectedAll;
                $scope.$emit('toggleSelectAllEvent', $scope.selectedAll);
            };
            $scope.export = function (type) {
                $log.debug('    export type => ', type);
                $scope.$emit('exportEvent', type);
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
            scope.$eval(attrs.dynamic);
            $timeout(function () {
                if (angular.isDefined(scope.c.tpl)) {
                    if (scope.c.tpl !== '' && !scope.c.tpl.startsWith('{{') && $(scope.c.tpl)[0]) {
                        ele.html(scope.c.tpl);
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
}]).filter('highlight', function ($sce) {
    return function (text, phrase, isActive) {
        if (!angular.isString(text) || !isActive) return text;
        if (phrase) text = text.replace(new RegExp('(' + phrase + ')', 'gi'),
          '<span class="highlighted">$1</span>')

        return $sce.trustAsHtml(text)
    }
});

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
