/**
 * @ngdoc directive
 * @name bls_components.directive:blsCol
 * @requires bls_components.directive:blsTable
 * @requires bls_components.directive:blsCols 
 * @priority -1
 * @restrict E
 * @description
 * Collect information's column
 * @example
 * <pre>
 * <bls-col resize dragable title="Le nom" sort field-name="name"></bls-col>
 * </pre>
 */
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
    };

    return {
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
