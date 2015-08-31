angular.module("bls_components").directive('blsCol', ['$log', '$compile', '$templateCache', '$timeout', function ($log, $compile, $templateCache, $timeout) {
    var link = {
        pre: function (scope, element, attrs, ctrls) {
            // var blsTableCtrl = ctrls[0];
            var blsColsCtrl = ctrls[1];
            // var blsColCtrl = ctrls[2];
            $log.debug('        Link => blsCol');
            if (attrs.isActions) {
                blsColsCtrl.addCol({
                    title: attrs.title || 'Actions',
                    isActions: true,
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
    
    return {
        priority: -1,
        require: ['^blsTable', '^blsCols'],
        restrict: 'E',
        link: link
    };
}]);
