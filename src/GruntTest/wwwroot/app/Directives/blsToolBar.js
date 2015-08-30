app.directive('blsDropDown', ['$log', function($log) {
    var tpl = '<div class="dropdown">\
                  <button class="btn btn-default btn-sm dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">\
                    {{title}}\
                    <span class="caret"></span>\
                  </button>\
                  <ul class="dropdown-menu" aria-labelledby="dropdownMenu1" >\
                    <li ng-repeat="link in links"><a ng-click="func()(link)">{{link}}</a></li>\
                  </ul>\
             </div>';
    return {
        template: tpl,
        replace: true,
        scope: {
            links: '=',
            title: '=',
            func: '&'
        },
        link: function(scope, element, attrs) {}
    }
}]);
app.directive('blsToolBar', [function() {
    // Runs during compile
    return {
        priority: 2,
        scope: true, // {} = isolate, true = child, false/undefined = no change
        restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
        template: '<div class="row">\
                       <div class="btn-toolbar pull-right col-xs-12" role="toolbar">\
                            <div class="btn-group btn-group-sm pull-right ">\
                                <bls-drop-down links="links" func="export" title="titleExportButton" ></bls-drop-down>\
                                <button type="button" class="{{btnClass}}" tooltip="Settings" aria-label="Right Align"><span class="fa fa-cog" aria-hidden="true"></span></button>\
                                <button type="button" ng-click="clearUserData()" class="{{btnClass}}" tooltip="Reset" aria-label="Right Align"><span class="fa fa-recycle" aria-hidden="true"></span></button>\
                                <button type="button" ng-click="refresh()" class="{{btnClass}}" tooltip="Refresh" aria-label="Right Align"><span class="fa fa-refresh" aria-hidden="true"></span></button>\
                                <button type="button" ng-click="toggleSelectAll()" class="{{btnClass}}" tooltip="{{selectedAll?\'Deselect all\':\'Select all\'}}" aria-label="Right Align"><span class="glyphicon " ng-class="selectedAll?\'glyphicon-unchecked\':\'glyphicon-check\'" aria-hidden="true"></span></button>\
                            </div>\
                            <form action="" class="search-form pull-right col-md-2 col-xs-12">\
                                <div class="form-group has-feedback">\
                                    <label for="search" class="sr-only">Search</label>\
                                    <input type="text" class="{{options.search.searchClass}}" name="search" id="search" placeholder="{{searchPlaceHolder}}" ng-model="options.search.searchText">\
                                    <span class="glyphicon glyphicon-search form-control-feedback"></span>\
                                </div>\
                            </form>\
                        </div>\
                 </div>',
        replace: true,
        //transclude: true,
        controller: function($scope, $element, $document, $log) {
            $scope.btnClass = "btn btn-default";
            $scope.searchPlaceHolder = "search...";
            $scope.selectedAll = false;
            $scope.titleExportButton = "Export";
            $scope.clearUserData = function() {
                $scope.$emit('flushEvent');
            }
            $scope.refresh = function() {
                $scope.$emit('refreshEvent');
            }
            $scope.toggleSelectAll = function() {
                $scope.selectedAll = !$scope.selectedAll;
                $scope.$emit('toggleSelectAllEvent', $scope.selectedAll);
            }
            $scope.export = function(type) {
                $log.debug('    export type => ', type)
                $scope.$emit('exportEvent', type);
            }
            $scope.links = ['excel', 'xml', 'csv','sql', 'json','doc', 'powerpoint' ];
        }
    };
}]);