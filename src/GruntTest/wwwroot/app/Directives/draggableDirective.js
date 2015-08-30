app.directive("allowDrag", function() {
    return {
        restrict: "A",
        require: ['^blsCompositeGrid'],
        controller: function() {},
        compile: function(el, attr) {
            function removeDragClass(element, className) {
                var elm = element[0].parentNode.querySelector('.' + className);
                if (!!elm) elm.classList.remove(className);
            }
            return function pre(scope, element, attrs, ctrl) {
                var blsCompositeGridCtrl = ctrl[0];
                element.attr('draggable', true);
                element.bind("dragstart", function(e) {
                    blsCompositeGridCtrl.target = this;
                    this.classList.add("dragged");
                    e.originalEvent.dataTransfer.setData("text", blsCompositeGridCtrl.target.cellIndex);
                });
                element.bind("dragover", function(e) {
                    e.preventDefault();
                });
                element.bind("dragenter", function(e) {
                    blsCompositeGridCtrl.toTarget = this;
                    if (!this.classList.contains("draggedOver") && !this.classList.contains("dragged")) this.classList.add("draggedOver");
                    e.preventDefault();
                    e.stopPropagation();
                });
                element.bind("dragend", function(e) {
                    if (this.classList.contains("dragged")) this.classList.remove("dragged");
                    e.preventDefault();
                });
                element.bind("dragleave", function(e) {
                    this.classList.remove("draggedOver");
                });
                element.bind("drop", function(e) {
                    var currentIndex = blsCompositeGridCtrl.toTarget.cellIndex,
                        draggedIndex = parseInt(e.originalEvent.dataTransfer.getData("text"), 10);
                    removeDragClass(element, 'dragged');
                    removeDragClass(element, 'draggedOver');
                    blsCompositeGridCtrl.changeColumnsOrder(currentIndex, draggedIndex);
                    e.preventDefault();
                });
            };
        }
    };
});