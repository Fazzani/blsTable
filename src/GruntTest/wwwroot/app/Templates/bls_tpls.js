(function (angular) {
    'use strict';
    angular.module("bls_tpls", []).run(["$templateCache", "$templateRequest", function ($templateCache, $templateRequest) {
        $templateCache.put('templates/blsTable.html','<div class="bls-table-container">\
            <div ng-class="{\'overlay\':isLoading}"><div ng-show="isLoading"><div class="double-bounce1"></div><div class="double-bounce2"></div></div></div>\
            <bls-tool-bar ng-hide="options.toolbar.hide"></bls-tool-bar>\
            <table class="table table-hover table-striped table-bordered blsGrid">\
                <thead ng-mousedown="resizeStart($event)" ng-mouseup="resizeEnd($event)">\
                    <bls-header></bls-header>\
                </thead>\
                <tbody>\
                    <div class="colLineOnResize"></div>\
                    <bls-rows></bls-rows>\
                </tbody>\
            </table>\
            <div style="display:none" id="colsConfig" ng-transclude></div>\
            <div class="footer">\
                <pagination class="col-md-10 col-xs-8" total-items="totalItems" ng-model="options.pagination.pageIndex" max-size="options.pagination.pager.maxSize" items-per-page="options.pagination.itemsPerPage.selected" class="pagination-sm" boundary-links="true" rotate="false"></pagination>\
                <div class="pagerList col-md-2 col-xs-4">\
                    <select class="form-control" id="sel1" ng-model="options.pagination.itemsPerPage.selected" ng-change="updateRecordsCount()" ng-options="c as c for c in options.pagination.itemsPerPage.range" ng-selected="options.pagination.itemsPerPage.selected == c"></select>\
                </div>\
            </div>\
        </div>');
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
                                <bls-drop-down links="options.toolbar.export.formats" func="export" title="titleExportButton" ng-hide="options.toolbar.export.hide"></bls-drop-down>\
                                <button type="button" ng-click="clearUserData()" ng-hide="options.toolbar.reset.hide" class="{{btnClass}}" tooltip="Reset" aria-label="Right Align"><span class="fa fa-recycle" aria-hidden="true"></span></button>\
                                <button type="button" ng-click="refresh()" ng-hide="options.toolbar.refresh.hide" class="{{btnClass}}" tooltip="Refresh" aria-label="Right Align"><span class="fa fa-refresh" aria-hidden="true"></span></button>\
                            </div>\
                            <form action="" class="search-form pull-right col-md-2 col-xs-12" ng-hide="options.toolbar.search.hide">\
                                <div class="form-group has-feedback">\
                                    <label for="search" class="sr-only">Search</label>\
                                    <input type="text" class="{{options.toolbar.search.searchClass}}" name="search" id="search" placeholder="{{searchPlaceHolder}}" ng-model="options.toolbar.search.searchedText">\
                                    <span class="glyphicon glyphicon-search form-control-feedback"></span>\
                                </div>\
                            </form>\
                        </div>\
                 </div>');
        $templateCache.put('templates/blsSearchBox.html', '<div class="col-xs-6 col-md-3 navbar-btn form-group navbar-form">\
					    <input type="text" class="form-control" placeholder="{{options.placeholder}}" ng-model="model">\
					    <button  ng-show="model==\'\'" type="submit" class="btn btn-search"><i class="fa fa-search"></i></button>\
                        <span ng-show="model" ng-click="model=null" class="glyphicon glyphicon-remove-sign form-control-feedback form-control-clear" aria-hidden="true"></span>\
                        <span class="sr-only">Clear input content</span>\
				   </div>');
        $templateCache.put('templates/blsHeader.html', '<tr>\
                        <th class="colHeader" ng-class="glyphOrder(c)" ng-repeat="c in cols" ng-click="order(c)" style="width:{{getColWidth($index)}}" allow-drag>\
                            <span ng-if="c.headerTpl!==undefined" ng-bind-html="c.headerTpl" ng-init="getTdTpl(c)" dynamic="c.headerTpl"></span>\
                            <span ng-if="c.headerTpl===undefined" ng-bind="c.title|uppercase"></span>\
                            <i ng-if="c.resize" class="resize"></i>\
                        </th>\
                   </tr>');
        $templateCache.put('templates/blsRows.html', '<tr ng-repeat="d in data">\
                 <td ng-repeat="c in cols" ng-init="getTdTpl(c)" dynamic="c.tpl" ng-bind-html="d[c.fieldName]| highlight:options.toolbar.search.searchedText:options.toolbar.search.heighLight"></td>\
            </tr>');
        $templateCache.put('templates/blsChildRows.html', '<tr ng-repeat="d in data" data-bls-id="{{$id}}" parentId="{{parentId}}" bls-row-child func="getChildren" data-level="{{level}}">\
                            <td ng-repeat="c in cols" ng-init="getTdTpl(c)" dynamic="c.tpl" ng-bind-html="d[c.fieldName]| highlight:options.toolbar.search.searchedText:options.toolbar.search.heighLight"></td></tr>');
        $templateCache.put('templates/blsStaticChildRows.html', '<tr ng-repeat="d in data" data-bls-id="{{$id}}" parentId="{{parentId}}" bls-static-child-cells level="{{level}}"></tr>');
        $templateCache.put('templates/blsStaticChildCells.html', '<td ng-repeat="c in cols" ng-init="getTdTpl(c)" dynamic="c.tpl">\
                                    <i id="{{$id}}" ng-if="isExpandable" class="fa {{expand?\'fa-caret-down\':\'fa-caret-right\'}}" style="padding:0 4px 0 {{5+(15*level)}}px"></i>\
                                    {{ngModel[c.fieldName]}}{{isExpandable}}</td>\
                                <bls-static-childs-rows ng-model="childs" ng-if="isExpandable"  level={{level++}}></bls-static-childs-rows>');
        $templateCache.put('templates/blsChildRowsCaret.html', '<i id="{{$id}}" class="fa {{expand?\'fa-caret-down\':\'fa-caret-right\'}}" style="padding:0 4px 0 {{5+(15*level)}}px"></i>');
    }]);
})(window.angular);



