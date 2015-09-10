angular.module("bls_components").directive('blsCol', ['$log', '$timeout', function ($log, $timeout) {
    var tpl = [];
    var link = function (scope, element, attrs, ctrls) {
        //$log.debug('link post => col');
        // var blsTableCtrl = ctrls[0];
        var blsColsCtrl = ctrls[1];
        // var blsColCtrl = ctrls[2];
        //Récupérer les templates du Header et du TD
        this.getTemplates = function () {
            var instanceTpl = tpl[attrs.fieldName];
            //$log.debug('instanceTpl =================> ', instanceTpl, ' for ______  : ', attrs.fieldName);
            if (instanceTpl !== '' && !instanceTpl.startsWith('{{')) {
                var tplHtml = $('<div></div>').wrapInner(instanceTpl)
                var header = tplHtml.find('header');
                return {
                    headerTpl: header.length ? header.html() : undefined,
                    tdTpl: header.length ? tplHtml.find('bls-td').html() : tplHtml.html()
                };
            } else if (instanceTpl.startsWith('{{'))
                return {
                    headerTpl: undefined,
                    tdTpl: instanceTpl
                };
            else
                return {
                    headerTpl: undefined,
                    tdTpl: undefined
                };
        };
        //$log.debug('        Link => blsCol');
        if (attrs.isActions) {
            blsColsCtrl.addCol({
                title: attrs.title || 'Actions',
                isActions: true,
                resize: angular.isDefined(attrs.resize)
            });
        } else {
            var tpls = this.getTemplates();
            //$log.debug('tpls =>: ', tpls);
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
    };

    return {
        //transclude:true,
        priority: -1,
        require: ['^blsTable', '^blsCols'],
        restrict: 'E',
        compile: function compile(tElement, tAttrs, transclude) {
            tpl[tAttrs.fieldName] = tElement.html();
            tElement.empty();
            return {
                pre: link
            }
        }
    };
}]);
