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
                $log.debug('            col.tpl => ',col.tpl);
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
