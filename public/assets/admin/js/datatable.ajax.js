//== Class definition

var DatatableRemoteAjax = function() {
    //== Private functions

    // basic demo
    var loadData = function() {

        $('.m_datatable').each(function(index, table){
            var url = $(table).attr('data-url');
            var pageSize = $(table).attr('data-pagesize') || 10;
            var keywordInput = $(table).attr('data-keyword');
            var filterContainer = $(table).attr('data-filtercontainer');
            var pageSizeSelect = [10, 20, 30, 50, 100];
            columns = columns || [];
            var rowOptions = typeof rows !== 'undefined' ? rows : {};

            var datatable = $(table).mDatatable({
                // datasource definition
                data: {
                    type: 'remote',
                    source: {
                        read: {
                            // sample GET method
                            method: 'GET',
                            url: url,
                            map: function(raw) {
                                // sample data mapping
                                var dataSet = raw;
                                if (typeof raw.data !== 'undefined') {
                                    dataSet = raw.data;
                                }
                                return dataSet;
                            },
                        },
                    },
                    pageSize: pageSize,
                    serverPaging: true,
                    serverFiltering: true,
                    serverSorting: true,
                },

                // layout definition
                layout: {
                    scroll: false,
                    footer: false
                },

                // column sorting
                sortable: true,

                pagination: true,

                toolbar: {
                    // toolbar items
                    items: {
                        // pagination
                        pagination: {
                            // page size select
                            pageSizeSelect: pageSizeSelect,
                        },
                    },
                },

                search: {
                    input: keywordInput,
                },

                rows: rowOptions,

                // columns definition
                columns: columns,
            });
    
            $(filterContainer).find('input, select').each(function(index, input){
                $(input).on('change', function(){
                    datatable.search($(input).val(), $(input).attr('name'));
                });
            });
        });

        $('.m-bootstrap-select').each(function(index, el){
            $(el).selectpicker();
        });
    };

    return {
        // public functions
        init: function() {
            loadData();
        },
    };
}();

jQuery(document).ready(function() {
    DatatableRemoteAjax.init();
});