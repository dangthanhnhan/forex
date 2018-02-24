function showNotify(content, type, align) {
    // swal({
    //     "title": "", 
    //     "text": "Form validation passed. All good!", 
    //     "type": "success",
    //     "confirmButtonClass": "btn btn-secondary m-btn m-btn--wide"
    // });
    type = type || 'success';
    align = align || 'center';
    $.notify(content, { 
        type: type,
        allow_dismiss: true,
        spacing: 10,
        timer: 2000,
        placement: {
            from: 'top', 
            align: 'center'
        },
        offset: {
            x: 30, 
            y: 30
        },
        delay: 1000,
        z_index: 10000,
        animate: {
            enter: 'animated rubberBand',
            exit: 'animated bounce'
        }
    });
}

const Notify = {
    show: function(content, type, align) {
        showNotify(content, type, align)
    },
    success: function(content, align) {
        showNotify(content, 'success', align)
    },
    error: function(content, align) {
        showNotify(content, 'danger', align)
    },
    warning: function(content, align) {
        showNotify(content, 'warning', align)
    },
    info: function(content, align) {
        showNotify(content, 'info', align)
    },
    primary: function(content, align) {
        showNotify(content, 'primary', align)
    },
    brand: function(content, align) {
        showNotify(content, 'brand', align)
    }
}

const commonForm = function() {
    const form = $('#form_common_action');
    const buttonSubmit = $('#form_common_action').find('.btn-submit');
    const action = form.attr('action');

    form.validate({
        rules: {},
        invalidHandler: function(event, validator) {     
            console.log(validator);
        },
    });

    buttonSubmit.on('click', function(e){
        e.preventDefault();

        form.valid() && (
            buttonSubmit.addClass("m-loader m-loader--right m-loader--light").attr("disabled", !0),
            form.ajaxSubmit({
                url: action,
                method: 'POST',
                success: function(response) {
                    if (response.status == 1) {
                        swal({
                            "title": "", 
                            "text": "Cập nhật dữ liệu thành công!",
                            "type": "success",
                            "confirmButtonClass": "btn btn-secondary m-btn m-btn--wide"
                        });
                    } else {
                        var error = response.error.join('<br />');
                        if (error == '') {
                            error = 'Cập nhật thất bại. Vui lòng thử lại!';
                        }
                        swal({
                            "title": "", 
                            "text": error, 
                            "type": "error",
                            "confirmButtonClass": "btn btn-secondary m-btn m-btn--wide"
                        });
                    }
                },
                error: function() {
                    swal({
                        "title": "", 
                        "text": "Cập nhật thất bại. Vui lòng thử lại!", 
                        "type": "error",
                        "confirmButtonClass": "btn btn-secondary m-btn m-btn--wide"
                    });
                },
                complete: function() {
                    buttonSubmit
                        .removeClass("m-loader m-loader--right m-loader--light")
                        .attr("disabled", !1);
                }
            })
        )
    });
}

$(document).ready(function(){
    commonForm();
    
    $('.inputdatepicker').each(function(index, el){
        $(el).datepicker({
            todayHighlight: true,
            format: "dd/mm/yyyy",
            templates: {
                leftArrow: '<i class="la la-angle-left"></i>',
                rightArrow: '<i class="la la-angle-right"></i>'
            }
        });
    });

    $('.m-select-region').each(function(index, el){
        const inputId = $(el).attr('id');
        const value = parseInt($(el).attr('data-value')) || null;

        $(el).select2({
            placeholder: $(el).attr('data-placeholder'),
            allowClear: true,
            ajax: {
                url: config.rooturl_module + '/region/select',
                dataType: 'json',
                delay: 250,
                data: function(params) {
                    return {
                        parentid: parseInt($(el).attr('data-parentid')),
                        level: parseInt($(el).attr('data-level')),
                        keyword: params.term, // search term
                        page: params.page
                    };
                },
                processResults: function(data, params) {
                    // parse the results into the format expected by Select2
                    // since we are using custom formatting functions we do not need to
                    // alter the remote JSON data, except to indicate that infinite
                    // scrolling can be used
                    params.page = params.page || 1;

                    return {
                        results: data.items,
                        pagination: {
                            more: (params.page * 30) < data.total_count
                        }
                    };
                },
                cache: true
            },
            escapeMarkup: function(markup) {
                return markup;
            }, // let our custom formatter work
            templateResult: function(item) {
                return item.name;
            }, // omitted for brevity, see the source of this page
            templateSelection: function(item) {
                return item.name || item.text;
            } // omitted for brevity, see the source of this page
        });

        $(el).on('change', function(e){
            $('[data-select-depend="' + inputId + '"]').attr('data-parentid', $(el).val());
        });

        if (value != null) {
            $.ajax({
                type: 'GET',
                url: config.rooturl_module + '/region/' + value,
                success: function(json) {
                    var option = new Option(json.name, json.id, true, true);
                    $(el).append(option).trigger({
                        type: 'select2:select',
                        params: {
                            data: json
                        }
                    });
                }
            });
        }
    });
});