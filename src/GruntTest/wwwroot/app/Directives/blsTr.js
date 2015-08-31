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
                        $scope.$parent.data.splice($scope.index + 1, 0, res.data);
                    });
                }
            };
            $scope.collpaseState = function (config) {
                //$log.debug('in collpaseState ', config);
                if (angular.isDefined(config)) {
                    return config.collapsed ? 'fa-caret-right' : 'fa-caret-down';
                }
            };
        }]
    };
}]);
