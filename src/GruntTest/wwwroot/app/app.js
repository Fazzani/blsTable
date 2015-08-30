(function(angular) {
    'use strict';
    app.
    config(['localStorageServiceProvider', '$routeProvider', '$locationProvider',
        function(localStorageServiceProvider, $routeProvider, $locationProvider) {
            localStorageServiceProvider.setStorageType('sessionStorage').setPrefix('').setNotify(true, true);
            $routeProvider.when("/docs", {
                templateUrl: "Views/Partials/docs.html"
            }).when("/blsTable", {
                templateUrl: "Views/Partials/blsTable.html",
                controller:'testCtrl'
            }).otherwise({
                redirectTo: '/docs'
            });
            $locationProvider.html5Mode(true);
        }
    ]).filter('getByProperty', function() {
        return function(propertyName, propertyValue, collection) {
            var i = 0,
                len = collection.length;
            for (; i < len; i++) {
                if (collection[i][propertyName] == propertyValue) {
                    return collection[i];
                }
            }
            return null;
        }
    }).filter('getIndexByProperty', function() {
        return function(propertyName, propertyValue, collection) {
            var i = 0,
                len = collection.length;
            for (; i < len; i++) {
                if (collection[i][propertyName] == propertyValue) {
                    return i;
                }
            }
            return null;
        }
    }).factory('Page', function() {
   var title = 'bls Table';
   return {
     title: function() { return title; },
     setTitle: function(newTitle) { title = newTitle }
   };
});
})(window.angular);