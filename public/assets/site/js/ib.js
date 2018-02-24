var ibPage = function() {
    const elements = {
        form: $('#ibregisterForm'),
        confirmationForm: $('#ibconfirmationForm'),
        inputs: $('#ibregisterForm .form-control'),
        buttonSubmit: $('#ibregisterForm .btn-submit'),
        buttonresendActivationCode: $('.btn-resendconfirmib'),
        buttonConfirmSubmit: $('#ibconfirmationForm .btn-submit'),
    }

    registerPage = function() {
        const form = elements.form;
        const buttonSubmit = elements.buttonSubmit;

        form.validate({
            rules: {
                fullname: {
                    required: !0,
                },
                phone: {
                    required: !0,
                },
                email: {
                    required: !0,
                    email: !0,
                },
                country: {
                    required: !0,
                },
                city: {
                    required: !0,
                }
            },
            invalidHandler: function(event, validator) {     
                console.log(validator);
            },
        });

        buttonSubmit.on('click', function(e){
            e.preventDefault();

            form.valid() && (
                buttonSubmit.addClass("m-loader m-loader--right m-loader--light").attr("disabled", !0),
                form.ajaxSubmit({
                    url: config.rooturl + '/ib/register',
                    method: 'POST',
                    success: function(response) {
                        if (response.status == 1) {
                            window.location.href = config.rooturl + '/ib/confirm?email=' + response.email;
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

    confirmationPage = function() {
        const form = elements.confirmationForm;
        const buttonresendActivationCode = elements.buttonresendActivationCode;
        const buttonConfirmSubmit = elements.buttonConfirmSubmit;

        form.validate({
            rules: {
                activation_code: {
                    required: !0,
                }
            },
            invalidHandler: function(event, validator) {     
                console.log(validator);
            },
        });

        buttonresendActivationCode.each(function(index, el) {
            $(el).on('click', function(e) {
                e.preventDefault();
                const dataSend = {
                    email: $(el).attr('data-email')
                }
                $.ajax({
                    method: 'POST',
                    url: config.rooturl + '/ib/resend',
                    data: dataSend,
                    dataType: 'json',
                    success: function(json) {
                        if (json.status == 1) {
                            swal({
                                "title": "", 
                                "text": "Mã xác nhận đã được gửi đến email của bạn.", 
                                "type": "success",
                                "confirmButtonClass": "btn btn-secondary m-btn m-btn--wide"
                            });
                        } else {
                            let message = json.error.join('<br />');
                            if (message == '') {
                                message = 'Gửi mã xác nhận thất bại. Vui lòng thử lại!';
                            }
                            swal({
                                "title": "", 
                                "text": message, 
                                "type": "error",
                                "confirmButtonClass": "btn btn-secondary m-btn m-btn--wide"
                            });
                        }
                    }
                });
            });
        });

        buttonConfirmSubmit.on('click', function(e) {
            e.preventDefault();
            form.valid() && (
                buttonConfirmSubmit.addClass("m-loader m-loader--right m-loader--light").attr("disabled", !0),
                form.ajaxSubmit({
                    url: config.rooturl + '/ib/confirm',
                    method: 'POST',
                    success: function(response) {
                        if (response.status == 1) {
                            window.location.href = config.rooturl + '/ib/success';
                        } else {
                            let error = response.error.join('<br />');
                            if (error == '') {
                                error = 'Kích hoạt tài khoản thất bại. Vui lòng thử lại!';
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
                            "text": "Kích hoạt tài khoản thất bại. Vui lòng thử lại!",
                            "type": "error",
                            "confirmButtonClass": "btn btn-secondary m-btn m-btn--wide"
                        });
                    },
                    complete: function() {
                        buttonConfirmSubmit
                            .removeClass("m-loader m-loader--right m-loader--light")
                            .attr("disabled", !1);
                    }
                })
            )
        });
    }


    return {
        init: function() {
            registerPage();
            confirmationPage();
        }
    }
}();

$(document).ready(function(){
    ibPage.init();
});