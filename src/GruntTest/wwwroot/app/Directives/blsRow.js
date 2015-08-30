(function (angular) {
    app.directive('blsActions', ['$log', '$compile', '$templateCache', '$timeout', function ($log, $compile, $templateCache, $timeout) {
        var tpl = '<td ng-if="c.isActions" class="center">\
                            <a ng-repeat="btn in options.actions" class="btn btn-default {{btn.class}}" ng-click="action(btn,d)" title="{{btn.title}}" ng-class="btn.class"><i class="{{btn.glyphicon}}"></i></a>\
                   </td>';
        this.link = function (scope, element, attrs, ctrls) {
            // var blsTableCtrl = ctrls[0];
            if (scope.c.isActions) {
                var eleTpl = angular.element(tpl);
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
            link: this.link,
            controller: function ($scope) {
                $scope.action = function (btn, d) {
                    btn.action(d);
                    if (btn.isRemoveAction) {
                        $scope.data.splice($scope.data.indexOf(d), 1);
                    }
                }
            }
        };
    }]);
    app.directive('blsRows', ['$log', '$compile', '$templateCache', '$timeout', function($log, $compile, $templateCache, $timeout) {
        var rowTpl = '<tr ng-repeat="d in data" ><td ng-repeat="c in cols" bls-actions dynamic="getTdTpl(c)">{{d[c.fieldName]}}</td></tr>';
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
        var templateRow = '<tr ng-repeat="d in data" data-bls-id="{{$id}}" parentId="{{parentId}}" bls-row-child func="getChildren" data-level="{{level}}"><td ng-repeat="c in cols" bls-actions dynamic="getTdTpl(c)">{{d[c.fieldName]}}</td></tr>';
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
                if (col.tpl  && col.tpl != '') {
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