//angular.module("bls_components")
app.directive('blsSplitter', ['$log', '$compile', '$templateCache', '$timeout', function ($log, $compile, $templateCache, $timeout) {
    /*--- Jquery UI is required ---*/
    var link = function (scope, element, attrs) {
        var me = this;
        this.getItem = function (key) {
            if (typeof localStorage !== 'undefined') {
                return localStorage.getItem(key);
            }
            else
                $log.error("localStorage n'est pas supporté");
        };
        this.setItem = function (key, item) {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem(key, item);
            } else {
                $log.error("localStorage n'est pas supporté");
            }
        };
        this.getWindowSize = function () {
            return {
                width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
                height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
            }
        };
        $(window).resize(function () {
            $(element).resizable({
                handles: 'e',
                minWidth: scope.minWidth,
                maxWidth: scope.maxWidth,
                create: function (event, ui) {
                    var initSize = { height: me.getWindowSize().height, width: me.getItem('splitPageWitdh') || 100 };
                    var ele = $(this);
                    ele.width(initSize.width);
                    var factor = $(this).parent().width() - initSize.width;
                    var f2 = $(this).parent().width() * .06;
                    //console.log('F2 =>>>> ' + f2);
                    $.each(ele.siblings(), function (idx, item) {
                        ele.siblings().eq(idx).width((factor - f2) + 'px');
                    });
                },
                resize: function (event, ui) {
                    var x = ui.element.outerWidth();
                    //var y = ui.element.outerHeight();
                    me.setItem('splitPageWitdh', x);
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
        replace:true,
        restrict: "E",
        link: link,
        scope: {
            minWidth: "=",
            maxWidth: "="
        },
        tamplate:'<div ng-transcule><div>'
    };
}]);