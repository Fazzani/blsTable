(function (angular) {
    'use strict';
    app.
    config(['$locationProvider', 'localStorageServiceProvider', '$stateProvider', '$urlRouterProvider',
        function ($locationProvider, localStorageServiceProvider, $stateProvider, $urlRouterProvider) {
            localStorageServiceProvider.setStorageType('sessionStorage').setPrefix('').setNotify(true, true);
            $urlRouterProvider.otherwise("/docs");

            $stateProvider.state('docs', {
                url: "/docs",
                templateUrl: "Views/Partials/docs.html",
            }).state('blsTable', {
                url: "/blsTable",
                templateUrl: "Views/Partials/blsTable.html",
                controller: 'testCtrl'
            }).state('blsSplitter', {
                url: "/blsSplitter",
                templateUrl: "Views/Partials/blsSplitterPage.html",
                controller: 'testCtrl'
            });

            $locationProvider.html5Mode(true);
        }
    ]).filter('getByProperty', function () {
        return function (propertyName, propertyValue, collection) {
            var i = 0,
                len = collection.length;
            for (; i < len; i++) {
                if (collection[i][propertyName] == propertyValue) {
                    return collection[i];
                }
            }
            return null;
        }
    }).filter('getIndexByProperty', function () {
        return function (propertyName, propertyValue, collection) {
            var i = 0,
                len = collection.length;
            for (; i < len; i++) {
                if (collection[i][propertyName] == propertyValue) {
                    return i;
                }
            }
            return null;
        }
    }).factory('Page', function () {
        var title = 'bls Table';
        return {
            title: function () { return title; },
            setTitle: function (newTitle) { title = newTitle }
        };
    });
})(window.angular);