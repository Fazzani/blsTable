/**
* @ngdoc directive
* @name bls_components.directive:blsStaticChildsRows
* @scope
* @priority -16 
* @restrict E
* @description
* blsStaticChildsRows
*/
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
}]);
/**
* @requires bls_components.directive:blsStaticChildCells
* @scope
* @priority -16 
* @restrict E
* @description
* blsStaticChildCells
*/
angular.module("bls_components").directive('blsStaticChildCells', ['$log', '$compile', '$templateCache', '$timeout', function ($log, $compile, $templateCache, $timeout) {
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
