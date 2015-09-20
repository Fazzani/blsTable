/**
* @ngdoc service
* @name bls_components.blsTableConfigManager
* @description
* blsTableConfigManager service
*/
angular.module("bls_components").factory('blsTableConfigManager', ['$log', 'localStorageService', function ($log, localStorageService) {
    /*
     * @ngdoc method
     * @constructs bls_components.blsTableConfigManager
     * @description constructor of blsTableConfigManager
     */
    function blsTableConfigManager(storageKey) {
        this.storageKey = storageKey;
        this.tableConfig = {};
    }
    
    blsTableConfigManager.prototype = {
        /**
        * @ngdoc function
        * @name get
        * @methodOf bls_components.blsTableConfigManager
        * @description
        * This is called when we need the count of records by page change
        *
        * @param {*} value The value of the input to check for emptiness.
        * @returns {Array} tableConfig.
        */
        get: function () { return this.tableConfig; },
        //init columns disposition from the localStorage if exists else create new Object
        init: function (columns, elementOffsetWidth) {
            if (localStorageService.isSupported) this.tableConfig = localStorageService.get(this.storageKey);
            if (this.tableConfig !== null && angular.isDefined(this.tableConfig.cols) && this.tableConfig.cols.length != columns.length)
                this.tableConfig = null;
            if (this.tableConfig === null) {
                this.tableConfig = {
                    id: this.storageKey,
                    cols: []
                };
                var defaulColWidth = Math.round(elementOffsetWidth / columns.length);
                for (var i = 0; i <= columns.length - 1; i++) {
                    this.tableConfig.cols.push({
                        index: i,
                        fieldName: columns[i].fieldName,
                        width: defaulColWidth,
                        sortDirection: 'none'//Enum: none, asc, desc
                    });
                }
                this.save(this.tableConfig);
            }
            return this.tableConfig;
        },
        /*
        * @ngdoc function
        * @name saveItemsByPage
        * @methodOf bls_components.blsTableConfigManager
        * @description 
        * save Items By page on localstorage
        */
        saveItemsByPage: function (itemsByPage) {
            this.tableConfig.itemsByPage = itemsByPage;
            this.save(this.tableConfig);
        },
        /*
        * @ngdoc method
        * @name swapCol
        * @methodOf bls_components.blsTableConfigManager
        * @description 
        * save Items By page on localstorage
        */
        swapCol: function (from, to) {
            this.tableConfig.cols.swap(from, to);
            this.save(this.tableConfig);
        },
        setSortDirection: function (index, sortDirection) {
            this.tableConfig.cols[index].sortDirection = sortDirection;
            this.save(this.tableConfig);
        },
        setColWidth: function (index, width) {
            //$log.debug('setColWidth => ', index, ' width = ', width);
            this.tableConfig.cols[index].width = width;
            this.save(this.tableConfig);
            return this.tableConfig;
        },
        listSortedCols: function () {
            var sortTable = [];
            this.tableConfig.cols.forEach(function (col) {
                if (col.sortDirection !== 'none' && angular.isDefined(col.fieldName))
                    sortTable.push(col);
            });
            return sortTable;
        },
        save: function (val) {
            if (localStorageService.isSupported) localStorageService.set(this.storageKey, val);
        },
        destroy: function () {
            if (localStorageService.isSupported) {
                $log.debug('clear all regex => ', '^(.)+' + this.storageKey + '$');
                localStorageService.clearAll(this.storageKey + '$');
            }
        }
    };
    return (blsTableConfigManager);

}]);


