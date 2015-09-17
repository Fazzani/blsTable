/// <reference path="../../_references.js" />
(function (angular) {
    'use strict';
    app.controller("detailCtrl", function ($scope, $http, $filter, $timeout, $log, $stateParams) {
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

        $scope.update = function (person) {
            $log.debug('update person ');
            return $http.put(root + "/persons/" + person.id, person, requestOptions).then(function (response) {
                $scope.model = response.data;
            }, function (errors) {
                $log.error(errors);
            });
        };

     

        $log.debug('id => ', $stateParams.id);
        var root = 'http://localhost:3000';
        var url = root + "/persons/" + $stateParams.id;
        return $http.get(url, requestOptions).then(function (response) {
            $scope.model = response.data;
           
            $timeout(function () {
                $scope.myForm.$setPristine();
            }, 200);

        }, function (errors) {
            $log.error(errors);
        });

    });
})(window.angular);