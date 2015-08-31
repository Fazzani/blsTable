angular.module("bls_components")
.directive('blsSplitter', ['$log', 'localStorageService', function ($log, localStorageService) {
    /*--- Jquery UI is required ---*/
    var link = function (scope, element, attrs) {
        var me = this;
        var $element = $(element);
        $(window).resize(function () {
            $element.resizable({
                handles: 'e',
                minWidth: scope.minWidth,
                maxWidth: scope.maxWidth,
                create: function (event, ui) {
                    var initSize = { height: $element.parent().height(), width: localStorageService.get('splitPageWitdh') || 100 };
                    var ele = $(this);
                    ele.width(initSize.width);
                    ele.height(initSize.height);
                    var factor = $(this).parent().width() - initSize.width;
                    var f2 = $(this).parent().width() * .06;
                    //console.log('F2 =>>>> ' + f2);
                    $.each(ele.siblings(), function (idx, item) {
                        ele.siblings().eq(idx).width((factor - f2) + 'px').height(initSize.height);
                    });
                },
                resize: function (event, ui) {
                    var x = ui.element.outerWidth();
                    //var y = ui.element.outerHeight();
                    localStorageService.set('splitPageWitdh', x);
                    var ele = ui.element;
                    var factor = $(this).parent().width() - x;
                    var f2 = $(this).parent().width() * .02999;
                    //console.log('F2 =>>>> '+f2);
                    $.each(ele.siblings(), function (idx, item) {
                        //ele.siblings().eq(idx).css('height', y + 'px');
                        //ele.siblings().eq(idx).css('width',(factor-41)+'px');
                        ele.siblings().eq(idx).width((factor - f2) + 'px');
                    });
                }
            });
        });
        $(window).trigger('resize');
    };

    return {
        transclude: true,
        restrict: "E",
        link: link,
        scope: {
            minWidth: "=",
            maxWidth: "="
        },
        template: '<div><ng-transclude></ng-transclude><div>'
    };
}]);