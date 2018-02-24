var SnippetUser = function() {
    const elements = {
        form: $('#userAddForm'),
        inputs: $('#userAddForm .form-control'),
        buttonSubmit: $('#userAddForm .btn-submit')
    }

    run = function() {
        const form = elements.form;
        const buttonSubmit = elements.buttonSubmit;
        form.validate({
            rules: {
                fullname: {
                    required: !0,
                },
                email: {
                    required: !0,
                    email: true
                },
                password: {
                    required: !0,
                },
                password2: {
                    required: !0,
                    equalTo: '#password'
                }
            },
            messages: {
                fullname: {
                    required: 'Bạn chưa nhập họ và tên.',
                },
                email: {
                    required: 'Bạn chưa nhập email.',
                    email: 'Email không đúng định dạng.'
                },
                password: {
                    required: 'Bạn chưa nhập mật khẩu.',
                },
                password2: {
                    required: 'Bạn chưa xác nhận mật khẩu.',
                    equalTo: 'Xác nhận mật khẩu không khớp.'
                },
            }
        });

        buttonSubmit.on('click', function(e){
            e.preventDefault();

            form.valid() && (
                buttonSubmit.addClass("m-loader m-loader--right m-loader--light").attr("disabled", !0),
                form.ajaxSubmit({
                    url: form.attr('action'),
                    method: 'POST',
                    success: function(response) {
                        if (response.status == 1) {
                            Notify.success('Cập nhật thành công!');
                        } else {
                            Notify.error(response.error.join('<br />'));
                        }
                    },
                    error: function() {
                        
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

    return {
        init: function() {
            run();
        }
    }
}();

$(document).ready(function(){
    SnippetUser.init();
});