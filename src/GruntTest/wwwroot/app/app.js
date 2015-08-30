(function(angular) {
    'use strict';
    app.
    config(['localStorageServiceProvider', '$routeProvider', '$locationProvider',
        function(localStorageServiceProvider, $routeProvider, $locationProvider) {
            localStorageServiceProvider.setStorageType('sessionStorage').setPrefix('').setNotify(true, true);
            $routeProvider.when('/blsGrid', {
                templateUrl: "Views/Partials/blsGrid.html", 
                controller:'homeCtrl'
            }).when("/blsGridAsync", {
                templateUrl: "Views/Partials/blsGridAsync.html",
                controller:'homeCtrl'
            }).when("/blsGridTreeView", {
                templateUrl: "Views/Partials/blsGridTreeView.html",
                controller:'homeCtrl'
            }).when("/hfGrid", {
                templateUrl: "Views/Partials/hfGrid.html",
                controller:'homeCtrl'
            }).when("/docs", {
                templateUrl: "Views/Partials/docs.html"
            }).when("/blsRow", {
                templateUrl: "Views/Partials/blsRow.html",
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
   var title = 'blsGrid';
   return {
     title: function() { return title; },
     setTitle: function(newTitle) { title = newTitle }
   };
});
})(window.angular);