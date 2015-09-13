angular.module("bls_components").factory('blsTableConfigManager', ['$log', 'localStorageService', function ($log, localStorageService) {
    
    function blsTableConfigManager(storageKey) {
        this.storageKey = storageKey;
        this.tableConfig = {};
    }
    
    blsTableConfigManager.prototype = {
        get: function () { return this.tableConfig; },
        //init columns disposition from the localStorage if exists else create new Object
        init: function (columns, elementOffsetWidth) {
            if (localStorageService.isSupported) this.tableConfig = localStorageService.get(this.storageKey);
            if (this.tableConfig !== null && this.tableConfig.cols.length && this.tableConfig.cols.length != columns.length)
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
        saveItemsByPage: function (itemsByPage) {
            this.tableConfig.itemsByPage = itemsByPage;
            this.save(this.tableConfig);
        },
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


