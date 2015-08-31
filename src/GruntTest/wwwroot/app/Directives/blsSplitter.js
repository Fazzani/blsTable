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