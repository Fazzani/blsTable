(function (angular) {
    'use strict';
    app.controller("testCtrl", function ($scope, $http, $filter, $timeout, $log) {
        var root = 'http://localhost:3000';
        // http://localhost:3000/persons/1/friends
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
        $scope.query = function (pageIndex, pageLength, searchedText, orderBy, order) {
            var offset = (pageIndex - 1) * pageLength;
            var url = root + "/persons" + "?_start=" + offset + "&_end=" + (offset + pageLength);
            if (angular.isDefined(searchedText) && searchedText !== "") url += "&q=" + searchedText;
            if (angular.isDefined(orderBy)) {
                url += '&_sort=' + orderBy;
                url += '&_order=' + (order == 0 ? 'ASC' : 'DESC');
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
        $scope.columns = ['id', 'name', 'company', 'email', 'picture', 'phone'];
        $scope.options = {
            multiSelection: true,
            search: {
                searchText: '',
                searchClass: 'form-control'
            },
            actions: [{
                title: 'edit',
                glyphicon: 'glyphicon glyphicon-edit',
                class: 'btn-circle btn-info btn-xs',
                action: function (row) {
                    $log.info('edit row : ' + row.id);
                    var obj = $filter('filter')($scope.model.data, {
                        id: row.id
                    })[0];
                    $log.info(obj);
                    obj.name = 'Edited row '+row.id;
                }
            }, {
                title: 'delete',
                glyphicon: 'glyphicon glyphicon-remove',
                class: 'btn-circle btn-danger btn-xs',
                action: function (row) {
                    //$scope.listPersons.
                    $log.info('delete  : ' + row.id);
                    var obj = $filter('filter')($scope.model.data, {
                        id: row.id
                    })[0];
                    $log.info(obj);
                    $log.info($scope.model.data.indexOf(obj));
                    $scope.model.data.splice($scope.model.data.indexOf(obj), 1);
                    $scope.model.totalItems--;
                    //$scope.model.data.slice($scope.model.data.indexOf(row),1);
                }
            }],
            pagination: {
                pageLength: 20,
                pageIndex: 1,
                pager: {
                    nextTitle: 'Suivant',
                    perviousTitle: 'Précédent',
                    maxSize: 5
                },
                itemsPerPage: {
                    prefixStorage: 'ipp_', //itemsPerPage
                    selected: 20,
                    range: [20, 50, 100]
                }
            }
        };
        $scope.callFunction = function () {
            console.log('sdffffffffff');
        };
        //$scope.query(1, 10);
        //$scope.cols = ['id', 'name', 'firstName', 'birthday', 'phone'];
        // $scope.data = [{
        //     id: '1',
        //     name: 'fazzani',
        //     firstName: 'heni',
        //     birthday: 1982,
        //     phone: '0667426422'
        // }, {
        //     id: '2',
        //     name: 'fazzani2',
        //     firstName: 'heni',
        //     birthday: 1982,
        //     phone: '0667426422'
        // }, {
        //     id: '3',
        //     name: 'fazzani3',
        //     firstName: 'heni',
        //     birthday: 1982,
        //     phone: '0667426422'
        // }, {
        //     id: '4',
        //     name: 'fazzani4',
        //     firstName: 'heni',
        //     birthday: 1982,
        //     phone: '0667426422'
        // }, {
        //     id: '5',
        //     name: 'fazzani5',
        //     firstName: 'heni',
        //     birthday: 1982,
        //     phone: '0667426422'
        // }, {
        //     id: '6',
        //     name: 'fazzani',
        //     firstName: 'heni',
        //     birthday: 1980,
        //     phone: '0667426422'
        // }];
        $scope.cols = ['id', 'name', 'firstName', 'birthday', 'phone'];
        // $scope.getChildren = function(obj) {
        //     $log.debug('in getChildren...');
        //     var childs = angular.copy($scope.data.slice(obj.id - 1));
        //     angular.forEach($scope.cols, function(val, key) {
        //         angular.forEach(childs, function(v, k) {
        //             childs[k][val] = childs[k][val] + '-' + obj.id;
        //         });
        //     });
        //     return childs;
        // };
    });
})(window.angular);