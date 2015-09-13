#BLSTable
____________________________
##Installation 
____________________________
###Nuget
____________________________
Install-Package blsComponents
###Examples
____________________________
<p>This is <a href="http://www.blsgrid.herokuapp.com/" title="Title">
an example</a></p>

####Default options structure
____________________________
>```javascript
 var defaultOptions = {
                        callbacks: [],
                        toolbar: {
                            hide: false,
                            search: {
                                hide: false,
                                searchedText: '',
                                searchClass: 'form-control',
                                heighLight: true,
                                minChars: {//a minimum number of characters to enable filter 
                                    enabled: true, //default Enabled after 3 characters typed
                                    count: 3
                                }
                            },
                            export: {
                                hide: false,
                                formats: ['excel', 'xml', 'csv', 'sql', 'json']
                            }, reset: {
                                hide: false
                            }, refresh: {
                                hide: false
                            }
                        },
                        pagination: {
                            pageLength: 5,
                            pageIndex: 1,
                            pager: {
                                nextTitle: 'Suivant',
                                perviousTitle: 'Précédent',
                                maxSize: 3
                            },
                            itemsPerPage: {
                                prefixStorage: 'ipp_', //itemsPerPage storage prefix 
                                selected: 10, // default selected pageLength
                                range: [10, 20] //list pageLength
                            }
                        }
                    };
```

>#####simple example 
____________________
```html
<bls-table ng-model="model.data"
           func-async="query(pageIndex, pageLength, searchedText, orderBy, order,filters)"
           options="options"
           total-items="model.totalItems">
    <bls-cols>
        <bls-col resize dragable sort field-name="id"></bls-col>
        <bls-col resize dragable sort field-name="name"></bls-col>
        <bls-col resize dragable field-name="company">
            <a href="javascript: void(0)" ng-click="options.callbacks[0](::row)">
                {{::field}}
            </a>
        </bls-col>
        <bls-col resize dragable sort title="Mail" field-name="email">{{::field|uppercase}}</bls-col>
        <bls-col resize title="Photo Profile" field-name="picture">
            <header><i class="fa fa-exclamation-triangle" style="color: #333" title="{{::field.title}}"></i></header>
            <bls-td><img style="height:18px;margin: 0 auto;" class="img-responsive" src="{{::field}}" alt="" /></bls-td>
        </bls-col>
        <bls-col resize field-name="isActive">
            <i ng-if="::field" class="fa fa-check" style="color: #333"></i>
        </bls-col>
        <bls-col resize title="Actions" is-actions="true"></bls-col>
    </bls-cols>
</bls-table>
```

>#####simple example with children
```html
<bls-table ng-model="model.data"
           func-async="query(pageIndex, pageLength, searchedText, orderBy, order,filters)"
           options="options"
           total-items="model.totalItems"
           get-children="getChildren" child-items-prop="Friends">
    <bls-cols>
        <bls-col resize dragable sort field-name="id"></bls-col>
        <bls-col resize dragable sort field-name="name"></bls-col>
        <bls-col resize dragable field-name="company">
            <a href="javascript: void(0)" ng-click="options.callbacks[0](::row)">
                {{::field}}
            </a>
        </bls-col>
        <bls-col resize dragable sort title="Mail" field-name="email">{{::field|uppercase}}</bls-col>
        <bls-col resize title="Photo Profile" field-name="picture">
            <header><i class="fa fa-exclamation-triangle" style="color: #333" title="{{::field.title}}"></i></header>
            <bls-td><img style="height:18px;margin: 0 auto;" class="img-responsive" src="{{::field}}" alt="" /></bls-td>
        </bls-col>
        <bls-col resize field-name="isActive">
            <i ng-if="::field" class="fa fa-check" style="color: #333"></i>
        </bls-col>
        <bls-col resize title="Actions" is-actions="true"></bls-col>
    </bls-cols>
</bls-table>
```

