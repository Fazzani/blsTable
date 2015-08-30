(function (angular) {
    app.directive('blsCols', ['$log', '$compile', '$templateCache', '$timeout', function ($log, $compile, $templateCache, $timeout) {
        this.link = {
            post: function (scope, element, attrs, ctrls) {
                var blsTableCtrl = ctrls[0];
                var blsColsCtrl = ctrls[1];
                $log.debug('    Link => blsCols');
                blsTableCtrl.setCols(blsColsCtrl.getCols());
            }
        };
        this.controller = ['$scope', '$filter', '$timeout', '$element', '$log', 'localStorageService', 'dropableservice',
            function ($scope, $filter, $timeout, $element, $log, localStorageService, dropableService) {
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
            link: this.link,
            controller: this.controller
        };
    }]).directive('blsCol', ['$log', '$compile', '$templateCache', '$timeout', function ($log, $compile, $templateCache, $timeout) {
        this.link = {
            pre: function (scope, element, attrs, ctrls) {
                // var blsTableCtrl = ctrls[0];
                var blsColsCtrl = ctrls[1];
                // var blsColCtrl = ctrls[2];
                $log.debug('        Link => blsCol');
                if (attrs.isActions) {
                    blsColsCtrl.addCol({
                        title: attrs.title || 'Actions',
                        isActions:true,
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
        this.controller = ['$scope', '$filter', '$timeout', '$element', '$log', 'localStorageService', 'dropableservice',
            function ($scope, $filter, $timeout, $element, $log, localStorageService, dropableService) {
                $log.debug('        controller => blsCol');
            }
        ];
        return {
            priority: -1,
            require: ['^blsTable', '^blsCols', 'blsCol'],
            restrict: 'E',
            link: this.link,
            controller: this.controller
        };
    }]);
})(window.angular);