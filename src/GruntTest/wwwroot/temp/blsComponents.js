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
                 </div>');
        $templateCache.put('templates/blsHeader.html', '<tr>\
                        <th class="colHeader" ng-repeat="col in cols" ng-click="order(col)" width="{{getColWidth($index)}}" allow-drag>\
                                        {{col.title|uppercase}}\
                            <i ng-if="col.sortable" class="pull-left fa " ng-class="glyphOrder(col)"></i><i ng-if="col.resize" class="resize"></i>\
                        </th>\
                   </tr>');
        $templateCache.put('templates/blsActions.html', '<td ng-if="c.isActions" class="center">\
                            <a ng-repeat="btn in options.actions" class="btn btn-default {{btn.class}}" ng-click="action(btn,d)" title="{{btn.title}}" ng-class="btn.class"><i class="{{btn.glyphicon}}"></i></a>\
                   </td>');
        $templateCache.put('templates/blsRows.html', '<tr ng-repeat="d in data" ><td ng-repeat="c in cols" bls-actions dynamic="getTdTpl(c)">{{d[c.fieldName]}}</td></tr>');
        $templateCache.put('templates/blsChildRows.html', '<tr ng-repeat="d in data" data-bls-id="{{$id}}" parentId="{{parentId}}" bls-row-child func="getChildren" data-level="{{level}}"><td ng-repeat="c in cols" bls-actions dynamic="getTdTpl(c)">{{d[c.fieldName]}}</td></tr>');
        $templateCache.put('templates/blsChildRowsCaret.html', '<i id="{{$id}}" class="fa {{expand?\'fa-caret-down\':\'fa-caret-right\'}}" style="padding:0 4px 0 {{5+(15*level)}}px"></i>');
    }]);
})(window.angular);

(function (angular) {
    angular.module("bls_components", ['bls_tpls'])
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
                $log.debug('Actions : ',$scope.options.actions);
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
                            //,filters:[{name:'age',value:10}]
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
            templateUrl: 'templates/blsTable.html',
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
angular.module("bls_components").directive('blsActions', ['$log', '$compile', '$templateCache', '$timeout', function ($log, $compile, $templateCache, $timeout) {
    var link = function (scope, element, attrs, ctrls) {
        // var blsTableCtrl = ctrls[0];
        if (scope.c.isActions) {
            var eleTpl = angular.element($templateCache.get('templates/blsActions.html'));
            $timeout(function () {
                element.replaceWith(eleTpl);
                $compile(eleTpl)(scope);
            }, 0);
        }
    };
    return {
        //require: ['^blsTable'],
        priority: -18,
        restrict: 'A',
        link: link,
        controller: ['$scope',function ($scope) {
            $scope.action = function (btn, d) {
                $q.when(btn.action(d)).then(function (res) {
                    if (btn.isRemoveAction) {
                        $scope.data.splice($scope.data.indexOf(d), 1);
                    }
                });;

            }
        }]
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
    var controller = ['$scope', '$filter', '$timeout', '$element', '$log', 'localStorageService', 'blsTableServices',
        function ($scope, $filter, $timeout, $element, $log, localStorageService, blsTableServices) {
            $log.debug('        controller => blsCol');
        }
    ];
    return {
        priority: -1,
        require: ['^blsTable', '^blsCols', 'blsCol'],
        restrict: 'E',
        link: link,
        controller: controller
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
            }
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
    }
}]);
angular.module("bls_components").directive('blsHeader', ['$log', '$compile', '$templateCache', '$timeout', 'localStorageService', function ($log, $compile, $templateCache, $timeout, localStorageService) {
    var link = {
        pre: function (scope, element, attrs, ctrls) {
            scope.$on('blsDataGrid_initedEvent', function (e) {
                $log.debug('    blsDataGrid_initedEvent intercepted');
                var blsTableCtrl = ctrls[0];
                var blsHeaderCtrl = ctrls[1];
                scope.setPredicate(localStorageService.get(scope.storageIds.predicateId) || (scope.cols[0] == undefined ? "" : scope.cols[0].id));
                scope.refreshDataGrid = blsTableCtrl.refreshDataGrid;
                $log.debug('    Link => blsHeader');
                var eleTpl = angular.element($templateCache.get('templates/blsHeader.html'));
                scope.getColWidth = function (index) {
                    if (blsTableCtrl.tableConfig.cols[index].width > 0) return blsTableCtrl.tableConfig.cols[index].width + 'px';
                }
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
            $log.debug('    blsHeader controller: in init...');
            $scope.setPredicate = function (predicate) {
                me.predicate = predicate;
            };
            $scope.glyphOrder = function (col) {
                $log.debug('    glyphOrder function was called');
                if (col.fieldName != $scope.predicate) return 'fa-sort';
                return me.reverse ? 'fa-sort-asc' : 'fa-sort-desc';
            };
            $scope.order = function (col) {
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
            $scope.resizeStart = function (e) {
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
            $scope.resizeEnd = function (e) {
                if (me.resizePressed) {
                    document.removeEventListener('mousemove', drag);
                    document.removeEventListener('mouseup', $scope.resizeEnd);
                    e.stopPropagation();
                    e.preventDefault();
                    setTimeout(function () {
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
            };
            return me.childs;
        };
        scope.getTdTpl = function (col, d) {
            if (col.tpl && col.tpl != '') {
                col.tpl = col.tpl.replace('::data', 'd');
                return col.tpl.replace('::field', "d[c.fieldName]");
            }
        }
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
            }
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
            }
            $scope.refresh = function () {
                $scope.$emit('refreshEvent');
            }
            $scope.toggleSelectAll = function () {
                $scope.selectedAll = !$scope.selectedAll;
                $scope.$emit('toggleSelectAllEvent', $scope.selectedAll);
            }
            $scope.export = function (type) {
                $log.debug('    export type => ', type)
                $scope.$emit('exportEvent', type);
            }
            $scope.links = ['excel', 'xml', 'csv', 'sql', 'json', 'doc', 'powerpoint'];
        }]
    };
}]);
angular.module("bls_components").directive("blsTr", ['$compile', '$templateRequest', '$templateCache', '$log',function ($compile, $templateRequest, $templateCache, $log) {
    var link = {
        post: function (scope, element, attrs, ctrls) {
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
        scope: {},
        // templateUrl:'templates/blsTr.html',
        // replace:true,
        controller: ['$scope', '$element', '$attrs', '$log', '$compile', '$templateCache', function ($scope, $element, $attrs, $log, $compile, $templateCache) {
            $log.debug('row = ', $scope.row);
            $scope.expand = function () {
                $log.debug('expanding data');
                $scope.config.collapsed = !$scope.config.collapsed;
                if (!$scope.config.loaded) {
                    $scope.config.loaded = true;
                    $scope.nestedDataFunc()($scope.row).then(function (res) {
                        if (!angular.isArray(res.data)) res.data = [res.data];
                        angular.forEach(res.data, function (value, key) {
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
            $scope.collpaseState = function (config) {
                //$log.debug('in collpaseState ', config);
                if (angular.isDefined(config)) {
                    return config.collapsed ? 'fa-caret-right' : 'fa-caret-down';
                }
            }
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
                // if (attr.dragimage !== 'undefined') {
                //   e.originalEvent.dataTransfer.setDragImage(
                //     document.getElementById(draggedGhostImgElemId), 0, 0);
                //}
                var dragFn = attr.drag;
                if (dragFn !== 'undefined') {
                    scope.$apply(function () {
                        scope[dragFn](sendData);
                    })
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

angular.module("bls_components").directive('dynamic', ['$compile', function ($compile) { //compile dynamic html
    return {
        restrict: 'A',
        replace: true,
        link: function (scope, ele, attrs) {
            scope.$watch(attrs.dynamic, function (html) {
                ele.html(html);
                $compile(ele.contents())(scope);
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
    }
})

angular.module("bls_components").service('blsTableServices', ['$log','localStorageService',function ($log, localStorageService) {
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
}]);
