#BlsGrid
========
<p>This is <a href="http://www.blsgrid.herokuapp.com/" title="Title">
an example</a></p>

###Default options structure
____________________________
>```var defaultOptions = {
    multiSelection: true,
    autoSaveReorderColumns: true,
    search: {
        searchText: '',
        searchClass: 'form-control'
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
            selected: 10,
            range: [10, 20]
        }
    }
};```

>#####simple example 
____________________
```
<bls-grid id="ngGrid1" 
		ng-model="fakeData" 
		options="options"  
		grid-class="table table-hover table-striped table-bordered" 
		>
</bls-grid>```

>#####simple Async example 
<bls-grid-async
id="ngGridAsync"
ng-model = "model"
func-async="query(pageIndex, pageLength, searchedText, orderBy, order)"
options="options"
grid-class="table table-hover table-striped table-bordered"
>
</bls-grid-async>


