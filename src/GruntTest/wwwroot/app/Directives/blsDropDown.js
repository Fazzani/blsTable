angular.module("bls_components").directive('blsDropDown', [function () {
    return {
        templateUrl: 'templates/blsDropDown.html',
        replace: true,
        scope: {
            links: '=',
            title: '=',
            func: '&'
        }
    }
}]);