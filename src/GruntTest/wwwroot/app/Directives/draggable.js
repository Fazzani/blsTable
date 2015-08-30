//
// http://litutech.blogspot.fr/2014/02/an-angular-table-directive-having.html
//
//---------------------------------------------------------------------------
angular.module("bls_components").directive('draggable', function () {
    return {
        link: function (scope, elem, attr) {
            elem.attr("draggable", true);
            var dragDataVal = '';
            var draggedGhostImgElemId = '';
            attr.$observe('dragdata', function (newVal) {
                dragDataVal = newVal;
            });
            attr.$observe('dragimage', function (newVal) {
                draggedGhostImgElemId = newVal;
            });
            elem.bind("dragstart", function (e) {
                var sendData = angular.toJson(dragDataVal);
                e.originalEvent.dataTransfer.setData("Text", sendData);
                // if (attr.dragimage !== 'undefined') {
                //   e.originalEvent.dataTransfer.setDragImage(
                //     document.getElementById(draggedGhostImgElemId), 0, 0);
                //}
                var dragFn = attr.drag;
                if (dragFn !== 'undefined') {
                    scope.$apply(function () {
                        scope[dragFn](sendData);
                    })
                }
            });
        }
    };
});