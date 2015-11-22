angular.module("bls_components")
.directive('blsDynamicDate', ['$log', function ($log) {
    var link = function (scope, element, attrs) {
        //scope.hours = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '02', '03', '04']
        scope.modes = [{ id: 0, label: 'Jours', format: 'dd-{0}', max:365 }, { id: 1, label: 'Heures', format: 'hh-{0}', max:23 }, { id: 2, label: 'Minutes', format: 'mm-{0}',max:59 }];
        scope.selectedMode = scope.modes[0];
        scope.value = 0;
        scope.$watch('selectedMode', function (n, o) {
            $log.debug(n);
            if (n !== o)
                scope.dataTimeValue = scope.modes[n.id].format.replace('{0}', scope.value);
        });
        scope.$watch('value', function (n, o) {
            if (n !== o)
                scope.dataTimeValue = scope.modes[scope.selectedMode.id].format.replace('{0}', n);
        });
    };

    return {
        restrict: "E",
        link: link,
        scope: { dataTimeValue: '=ngModel' },
        template: '<form class="form-inline"><div class="form-group">\
                    <select ng-options="item as item.label for item in modes track by item.id" ng-model="selectedMode" class="form-control"/>\
                    <div class="input-group">\
                        <span class="input-group-addon">-</span>\
                        <input class="form-control" type="number" min="0" max="{{selectedMode.max}}" ng-model="value" placeholder="{{modes[selectedMode].label}} moins..."/>\
                    </div>\
                </div></div>'
    };
}]);