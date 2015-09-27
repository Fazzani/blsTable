/**
* @ngdoc directive
* @name bls_components.directive:blsSplitter
* @scope
* @restrict E
* @description
* dynamic splitter page
* @example
* <pre>      
*  <bls-splitter>
        <bls-splitter-region>
            <p>
                How can this be used to make a divider fill the height of the browser?
                For this question, we can make use of vh: 1vh is equal to 1% of the viewport's height. That is to say, 100vh is equal to the height of the browser window, regardless of where the element is situated in the DOM tree:
                HTML
            </p><p>
                transclude - compile the content of the element and make it available to the directive. Typically used with ngTransclude. The advantage of transclusion is that the linking function receives a transclusion function which is pre-bound to the correct scope. In a typical setup the widget creates an isolate scope, but the transclusion is not a child, but a sibling of the isolate scope. This makes it possible for the widget to have private state, and the transclusion to be bound to the parent (pre-isolate) scope.

                true - transclude the content of the directive.
                'element' - transclude the whole element including any directives defined at lower priority.
            </p>
            <p>
                transclude - compile the content of the element and make it available to the directive. Typically used with ngTransclude. The advantage of transclusion is that the linking function receives a transclusion function which is pre-bound to the correct scope. In a typical setup the widget creates an isolate scope, but the transclusion is not a child, but a sibling of the isolate scope. This makes it possible for the widget to have private state, and the transclusion to be bound to the parent (pre-isolate) scope.

                true - transclude the content of the directive.
                'element' - transclude the whole element including any directives defined at lower priority.
            </p>
            <p>
                transclude - compile the content of the element and make it available to the directive. Typically used with ngTransclude. The advantage of transclusion is that the linking function receives a transclusion function which is pre-bound to the correct scope. In a typical setup the widget creates an isolate scope, but the transclusion is not a child, but a sibling of the isolate scope. This makes it possible for the widget to have private state, and the transclusion to be bound to the parent (pre-isolate) scope.

                true - transclude the content of the directive.
                'element' - transclude the whole element including any directives defined at lower priority.
            </p>
        </bls-splitter-region>
        <bls-splitter-region>
        </bls-splitter-region>
    </bls-splitter>
* </pre>
*/
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