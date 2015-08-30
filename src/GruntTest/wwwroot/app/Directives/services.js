'use strict';
app.service('dropableservice', function($log, localStorageService) {
    Array.prototype.swap = function(new_index, old_index) {
            if (new_index >= this.length) {
                var k = new_index - this.length;
                while ((k--) + 1) {
                    this.push(undefined);
                }
            }
            this.splice(new_index, 0, this.splice(old_index, 1)[0]);
            return this;
        };
    this.defaultColConfig = function(length) {
        var array = new Array(length);
        for (var i = array.length - 1; i >= 0; i--) {
            array[i] = i;
        };
        return array;
    };
    this.swapArrayElements = function(array_object, index_a, index_b) {
        var temp = array_object[index_a];
        array_object[index_a] = array_object[index_b];
        array_object[index_b] = temp;
    };
    /**
     * reorder data array from config : arrayConfig[{key:newIndex Column, value: columnTitle}]
     * @param  {array} colArray    [columns array]
     * @param  {array} dataArray    [data array]
     * @param  {string} key    [colum Reorder Data key]
     * @return {[array]}                [array col config]
     */
    this.initReorderColumns = function(colArray, dataArray, key) {
        var arrayConfig = localStorageService.get(key);
        if (arrayConfig == null || arrayConfig.length == 0) arrayConfig = this.defaultColConfig(colArray.length);
        var me = this;
        for (var i = 0; i < arrayConfig.length - 2; i++) {
            if (i != arrayConfig[i]) {
                if (i > arrayConfig[i] && i == arrayConfig[arrayConfig.indexOf(i)]) continue;
                me.swapArrayElements(colArray, i, arrayConfig.indexOf(i));
                me.swapArrayElements(dataArray, i, arrayConfig.indexOf(i));
            }
        };
        return arrayConfig;
    };
    /**
     * save col config array
     * @param  {[type]} colConfigArray [description]
     * @param  {[type]} key            [description]
     */
    this.saveConfig = function(key, colConfigArray) {
        if (localStorageService.isSupported) {
            $log.info('saveConfig  : ' + colConfigArray);
            $log.info('saveConfig key : ' + key);
            localStorageService.set(key, colConfigArray);
        }
    }
});