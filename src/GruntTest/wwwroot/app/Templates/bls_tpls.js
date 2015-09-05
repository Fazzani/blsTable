(function (angular) {
    'use strict';
    angular.module("bls_tpls", []).run(["$templateCache", "$templateRequest", function ($templateCache, $templateRequest) {
        $templateRequest('templates/blsTr.html');
        $templateRequest('templates/blsTable.html');
        $templateCache.put('templates/blsDropDown.html', '<div class="dropdown">\
                  <button class="btn btn-default btn-sm dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">\
                    {{title}}\
                    <span class="caret"></span>\
                  </button>\
                  <ul class="dropdown-menu" aria-labelledby="dropdownMenu1" >\
                    <li ng-repeat="link in links"><a ng-click="func()(link)">{{link}}</a></li>\
                  </ul>\
             </div>');
        $templateCache.put('templates/blsToolBar.html', '<div class="row">\
                       <div class="btn-toolbar pull-right col-xs-12" role="toolbar">\
                            <div class="btn-group btn-group-sm pull-right ">\
                                <bls-drop-down links="links" func="export" title="titleExportButton" ng-hide="options.toolbar.export.hide"></bls-drop-down>\
                                <button type="button" ng-click="clearUserData()" ng-hide="options.toolbar.reset.hide" class="{{btnClass}}" tooltip="Reset" aria-label="Right Align"><span class="fa fa-recycle" aria-hidden="true"></span></button>\
                                <button type="button" ng-click="refresh()" ng-hide="options.toolbar.refresh.hide" class="{{btnClass}}" tooltip="Refresh" aria-label="Right Align"><span class="fa fa-refresh" aria-hidden="true"></span></button>\
                            </div>\
                            <form action="" class="search-form pull-right col-md-2 col-xs-12" ng-hide="options.toolbar.search.hide">\
                                <div class="form-group has-feedback">\
                                    <label for="search" class="sr-only">Search</label>\
                                    <input type="text" class="{{options.toolbar.search.searchClass}}" name="search" id="search" placeholder="{{searchPlaceHolder}}" ng-model="options.toolbar.search.searchText">\
                                    <span class="glyphicon glyphicon-search form-control-feedback"></span>\
                                </div>\
                            </form>\
                        </div>\
                 </div>');
        $templateCache.put('templates/blsHeader.html', '<tr>\
                        <th class="colHeader" ng-repeat="col in cols" ng-click="order(col)" style="width:{{getColWidth($index)}}" allow-drag>\
                                        {{col.title|uppercase}}\
                            <i ng-if="col.sortable" class="pull-left fa " ng-class="glyphOrder(col)"></i><i ng-if="col.resize" class="resize"></i>\
                        </th>\
                   </tr>');
        $templateCache.put('templates/blsActions.html', '<td ng-if="c.isActions" class="center">\
                            <a ng-repeat="btn in options.actions" class="btn btn-default {{btn.class}}" ng-click="action(btn,d)" title="{{btn.title}}" ng-class="btn.class"><i class="{{btn.glyphicon}}"></i></a>\
                   </td>');
        $templateCache.put('templates/blsRows.html', '<tr ng-repeat="d in data" ><td ng-repeat="c in cols" bls-actions dynamic="getTdTpl(c)">{{d[c.fieldName]}}</td></tr>');
        $templateCache.put('templates/blsChildRows.html', '<tr ng-repeat="d in data" data-bls-id="{{$id}}" parentId="{{parentId}}" bls-row-child func="getChildren" data-level="{{level}}"><td ng-repeat="c in cols" bls-actions dynamic="getTdTpl(c)">{{d[c.fieldName]}}</td></tr>');
        $templateCache.put('templates/blsStaticChildRows.html', '<tr ng-repeat="d in data" data-bls-id="{{$id}}" parentId="{{parentId}}" bls-static-child-cells level="{{level}}">\
                                </tr>');
        $templateCache.put('templates/blsStaticChildCells.html', '<td ng-repeat="c in cols" dynamic="getTdTpl(c)">\
                                    <i id="{{$id}}" ng-if="isExpandable" class="fa {{expand?\'fa-caret-down\':\'fa-caret-right\'}}" style="padding:0 4px 0 {{5+(15*level)}}px"></i>\
                                    {{ngModel[c.fieldName]}}{{isExpandable}}</td>\
                                <bls-static-childs-rows ng-model="childs" ng-if="isExpandable"  level={{level++}}></bls-static-childs-rows>');
        $templateCache.put('templates/blsChildRowsCaret.html', '<i id="{{$id}}" class="fa {{expand?\'fa-caret-down\':\'fa-caret-right\'}}" style="padding:0 4px 0 {{5+(15*level)}}px"></i>');
    }]);
})(window.angular);



