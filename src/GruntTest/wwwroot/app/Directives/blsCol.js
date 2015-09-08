angular.module("bls_components").directive('blsCol', ['$log', function ($log) {
    var link = {
        pre: function (scope, element, attrs, ctrls) {
            // var blsTableCtrl = ctrls[0];
            var blsColsCtrl = ctrls[1];
            // var blsColCtrl = ctrls[2];
            //Récupérer les templates du Header et du TD
            this.getTemplates = function () {
                var header = element.find('header');
                return {
                    headerTpl: header.length ? header.html() : undefined,
                    tdTpl: element.find('bls-td').html()
                }
            }
            $log.debug('        Link => blsCol');
            if (attrs.isActions) {
                blsColsCtrl.addCol({
                    title: attrs.title || 'Actions',
                    isActions: true,
                    resize: angular.isDefined(attrs.resize)
                });
            } else {
                var tpls = this.getTemplates();
                blsColsCtrl.addCol({
                    title: attrs.title || attrs.fieldName,
                    fieldName: attrs.fieldName,
                    resize: angular.isDefined(attrs.resize),
                    tpl: tpls.tdTpl,
                    headerTpl: tpls.headerTpl,
                    sortable: angular.isDefined(attrs.sort),
                    dragable: angular.isDefined(attrs.dragable)
                });
            }
        }
    };

    return {
        priority: -1,
        require: ['^blsTable', '^blsCols'],
        restrict: 'E',
        link: link
    };
}]);
