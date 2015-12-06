(function (angular) {
    'use strict';
    app.controller("testCtrl", function ($scope, $http, $filter, $timeout, $log, $q, optionsBlsTable, $rootScope) {

        $scope.options = optionsBlsTable.options;
        var root = 'http://localhost:3000';
        // http://localhost:3000/persons/1/friends
        $log.debug('init testCtrl...');
        var requestOptions = {
            dataType: 'json',
            data: '',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'X-Testing': 'testing',
                'JsonStub-User-Key': '9b0c8e63-914c-44bf-a7b9-79d70e7510fa',
                'JsonStub-Project-Key': 'fa7febb9-c680-4114-9088-09e474b9d002'
            }
        };
        $scope.model = {
            totalItems: 0,
            data: {}
        };
        $scope.getChildren = function (obj, resource) {
            if (!angular.isDefined(resource)) resource = "/friends"
            $log.debug('in getChildrens request children of parendId : ', obj.id);
            var url = root + "/persons/" + obj.id + resource;
            return $http.get(url, requestOptions);
        };
        $scope.query = function (pageIndex, pageLength, searchedText, sortTable, filters) {
            var offset = (pageIndex - 1) * pageLength;
            var url = root + "/persons" + "?_start=" + offset + "&_end=" + (offset + pageLength);
            if (angular.isDefined(searchedText) && searchedText !== "") url += "&q=" + searchedText;
            if (angular.isDefined(sortTable)) {
                sortTable.forEach(function (order) {
                    url += '&_sort=' + order.fieldName;
                    url += '&_order=' + order.sortDirection.toUpperCase();
                });
                
            }
            if (angular.isDefined(filters) && angular.isArray(filters)) {
                $log.debug('    has filters');
                angular.forEach(filters, function (filter, key) {
                    url += "&" + filter.name + "=" + filter.value;
                });
            }
            $log.debug('url=> ' + url);
            return $http.get(url, requestOptions).then(function (response) {
                $scope.model.totalItems = response.headers()['x-total-count'];
                $scope.model.data = response.data;
                return $scope.model;
            }, function (errors) {
                $log.error(errors);
            });
        };
        
        $scope.callFunction = function () {
            console.log('sdffffffffff');
        };
        $scope.$watch('options.toolbar.search.searchedText', function (newValue, oldValue) {
            $log.debug('=> testCtrl :  searchedText changed => ', newValue);
            //$scope.$applyAsync(function () { $scope.options.toolbar.search.searchedText = newValue;})
        });
        $scope.pastTime = '';
        $scope.$watch('pastTime', function (n, o) { $log.debug('pastTime %s', $scope.pastTime); });

        $log.debug('getting data for resizableTableModel');
        $scope.query(1, 20).then(function (res) {
            $log.debug('getting data for resizableTableModel');

        });

        $scope.resetResizeColumn = function () {
            $rootScope.$broadcast('resetResizeColumnEvent');
        };
       
    });
})(window.angular);