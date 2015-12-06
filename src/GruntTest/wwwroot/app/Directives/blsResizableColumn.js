/**
 * @ngdoc directive
 * @name bls_components.directive:blsResizableColumn
 * @requires table
 * @priority -1
 * @restrict A
 * @description
 * resize column's table
 * resetResizeColumnEvent broadcast to reset width to inherited value
 */
angular.module("bls_components").directive('blsResizableColumn', ['$log', '$compile', '$templateCache', '$timeout', 'localStorageService',
    function ($log, $compile, $templateCache, $timeout, localStorageService) {
        var resizeLineTpl = '<span class="resize-header-table" style="height: 100%;width: 4px;background-color: red;cursor: col-resize;position: absolute;right: 0; top: 0;" draggable="true"></span>';

        var link = {
            pre: function (scope, element, attrs, ctrls) {
                
                var me = this;
                    
                var $table = element.closest('table');
                //var tableCtrl = ctrls[0];
                me.resizeColData = null;
                me.resizePressed = false;
                // var $resizeLine = $(element[0].nextElementSibling);
                // $resizeLine.hide();
                scope.$on('resetResizeColumnEvent', function (e) {
                    //$log.debug('resetResizeColumnEvent inercepted....');
                    element.css('width', 'inherit');
                });

                me.resizeData = {};
                scope.resizeStart = function (e) {
                    console.log('resize start');
                    var target = e.target ? e.target : e.srcElement;
                    //$resizeLine.height($($resizeLine.closest('table')).height());
                    me.resizeData.target = target.parentNode;

                    var $targetElm = $(me.resizeData.target);
                    me.resizePressed = true;
                    me.resizeData.resizePressed = true;
                    me.resizeData.startX = e.pageX || e.originalEvent.pageX;
                    me.resizeData.startWidth = $targetElm.width();
                    me.resizeData.$targetElm = $targetElm;
                    me.resizeData.tableWidth = $table.width();
                    $log.debug(me.resizeData);

                    document.addEventListener('mousemove', scope.drag);
                    document.addEventListener('mouseup', scope.resizeEnd);
                    e.stopPropagation();
                    e.preventDefault();
                };

                scope.drag = function (e) {
                        $log.info('in drag function => ', me.resizeData);

                    if (me.resizeData.resizePressed) {
                        var offset = (e.pageX || e.originalEvent.pageX) - me.resizeData.startX;

                        //$resizeLine.show();
                        //$resizeLine.css('left', me.resizeData.siblingTarget.offsetLeft);
                        var newWidth = me.resizeData.startWidth + offset;
                        //var percentNewWidth = me.resizeData.tableWidth / newWidth;
                        //$log.debug('new percentNewWidth=> ', percentNewWidth);

                        me.resizeData.$targetElm.width(newWidth);
                        //$siblingElm.width(me.resizeData.startWidthSibling - offset);
                        //me.resizeColData = {
                        //    index: me.resizeData.target.cellIndex,
                        //    width: $targetElm.width(),
                        //    indexSibling: me.resizeData.siblingTarget.cellIndex,
                        //    widthSibling: $siblingElm.width()
                        //};
                    }
                };
                scope.resizeEnd = function (e) {
                    $log.debug('resize end');
                    if (me.resizeData.resizePressed) {

                        e.stopPropagation();
                        e.preventDefault();
                        e.returnValue = false;
                        e.cancelBubble = true;
                        //$resizeLine.hide();
                        document.removeEventListener('mousemove', scope.drag);
                        document.removeEventListener('mouseup', scope.resizeEnd);

                        if (me.resizeColData !== null) {
                            $scope.setColWidth(me.resizeColData.index, me.resizeColData.width);
                            $scope.setColWidth(me.resizeColData.indexSibling, me.resizeColData.widthSibling);
                            me.resizeColData = null;
                        }
                        me.resizePressed = false;
                        me.resizeData = {};
                        return false;
                    }
                };
                var $resizeLine = angular.element(resizeLineTpl);

                element.append($resizeLine);
                $resizeLine.on('dragstart', scope.resizeStart);
                $log.debug('in blsResizableColumn directive');
            }
        };
        //var controller = ['$scope', '$filter', '$timeout', '$element', '$log', 'localStorageService', 'blsTableServices',
        //    function ($scope, $filter, $timeout, $element, $log, localStorageService, blsTableServices) {
        //        var me = this;

        //];
        return {
            priority: -1,
            // require: ['^?table'],
            restrict: 'A',
            link: link
        };
    }]);

//    Ràf 
// - resize line
// - save columns size on localStorage
// - init columns size from locaStorage
// - detect resize window event and resize table (reset sizes or convert it to percent)
// - enhance resize cursor style (hover)