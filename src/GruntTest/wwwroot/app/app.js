/// <reference path="../_references.js" />
'use strict';
console.log('creating app');
var app = angular.module('app', ['bls_components', 'ui.bootstrap', 'LocalStorageModule', 'ngRoute', 'ngAnimate', 'ui.router', 'blsFormModified'])
.constant('PREFIX_STORAGE', 'bls.')
.config(['$locationProvider', 'localStorageServiceProvider', '$stateProvider', '$urlRouterProvider', '$logProvider', 'PREFIX_STORAGE',
    function ($locationProvider, localStorageServiceProvider, $stateProvider, $urlRouterProvider, $logProvider, PREFIX_STORAGE) {

        // $logProvider.debugEnabled(true);
        localStorageServiceProvider.setStorageType('localStorage').setPrefix(PREFIX_STORAGE).setNotify(true, true);
        $urlRouterProvider.otherwise("/docs/api");

        $stateProvider.state('root', {
            abstract: true,
            url: "/examples",
            template: '<ui-view></ui-view>',
            controller: 'rootCtrl'
        }).state('root.blsTable', {
            url: "/blsTable",
            views: {
                "header@": { templateUrl: "Views/Partials/headerActions.html", controller: 'testCtrl' },
                "main@": { templateUrl: "Views/Partials/blsTable.html", controller: 'testCtrl' },
                "footer@": { template: '<div class="nav">BLS components</div>' }
            }
        }).state('root.blsTableSample.detail', {
            url: "^/detail/{id:int}",
            views: {
                "header@": {
                    template: '<span> <a class="btn btn-default" ui-sref="^"> <span class="glyphicon glyphicon-arrow-left" aria-hidden="true"></span> Retour</a></span>',
                    controller: 'testCtrl'
                },
                "main@": { templateUrl: "Views/Partials/detailPerson.html", controller: 'detailCtrl' },
                "footer@": { template: '<div class="nav">BLS components</div>' }
            }
        }).state('root.blsTableSample', {
            url: "/blsTableSample",
            views: {
                "header@": { templateUrl: "Views/Partials/headerActions.html", controller: 'testCtrl' },
                "main@": { templateUrl: "Views/Partials/blsTable_Sample.html", controller: 'testCtrl' },
                "footer@": { template: '<div class="nav">BLS components</div>' }
            }
        }).state('root.blsSplitter', {
            url: "/blsSplitter",
            views: {
                "header@": { template: "" },
                "main@": { templateUrl: 'Views/Partials/blsSplitterPage.html' },
                "footer@": { template: '<div class="nav">BLS components</div>' }
            },
            controller: 'testCtrl'
        }).state('root.resizableTable', {
            url: "/resizableTable",
            views: {
                "header@": { template: "" },
                "main@": { templateUrl: 'Views/Partials/resizableTable.html', controller: 'testCtrl' },
                "footer@": { template: '<div class="nav">BLS components</div>' }
            }
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
}).factory('optionsBlsTable', function () {
    return {
        options: {
            multiSelection: true,
            callbacks: [function (row) { alert(row.name + ' ' + row.company); }, function (row) { alert(row.name + ' ' + row.company); }],
            toolbar: {
                hide: false,
                search: {
                    hide: false,
                    searchedText: '',
                    searchClass: 'form-control',
                    heighLight: true,
                    minChars: {//a minimum number of characters to enable filter 
                        enabled: true,
                        count: 3
                    }
                },
                export: {
                    hide: false,
                    formats: ['csv', 'json', 'xml']
                }, reset: {
                    hide: false
                }, refresh: {
                    hide: false
                }
            },
            actions: [{
                title: 'edit',
                glyphicon: 'glyphicon glyphicon-edit',
                class: 'btn-circle btn-info btn-xs',
                isRemoveAction: false,
                action: function (row) {
                    var deferred = $q.defer();
                    $log.info('edit row : ' + row.id);
                    //var obj = $filter('filter')($scope.model.data, {
                    //    id: row.id
                    //})[0];
                    //$log.info(obj);
                    row.name = 'Edited row ' + row.id;
                    if (row) {
                        deferred.resolve("Success");
                    } else {
                        deferred.reject("Error");
                    }

                    return deferred.promise;
                }
            }, {
                title: 'delete',
                glyphicon: 'glyphicon glyphicon-remove',
                class: 'btn-circle btn-danger btn-xs',
                isRemoveAction: true,
                action: function (row) {
                    var deferred = $q.defer();

                    $log.info('delete  : ' + row.id);
                    var obj = $filter('filter')($scope.model.data, {
                        id: row.id
                    })[0];
                    $log.info(obj);
                    //$log.info($scope.model.data.indexOf(obj));
                    //$scope.model.data.splice($scope.model.data.indexOf(obj), 1);
                    $scope.model.totalItems--;

                    if (row) {
                        deferred.resolve("Success");
                    } else {
                        deferred.reject("Error");
                    }
                    return deferred.promise;
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
        }
    };
});
