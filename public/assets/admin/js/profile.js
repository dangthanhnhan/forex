var SnippetProfile = function() {
    const elements = {
        form: $('#profileForm'),
        inputs: $('#profileForm .form-control'),
        buttonSubmit: $('#profileForm .btn-submit'),
        avatarUploadForm: $('#uploadAvatarForm'),
        avatarImage: $('.m-card-profile__pic img'),
        avatarInput: $('#uploadAvatarForm input[name="avatar"]')
    }

    run = function() {
        const form = elements.form;
        const buttonSubmit = elements.buttonSubmit;
        form.validate({
            rules: {
                fullname: {
                    required: !0,
                }
            }
        });

        buttonSubmit.on('click', function(e){
            e.preventDefault();

            form.valid() && (
                buttonSubmit.addClass("m-loader m-loader--right m-loader--light").attr("disabled", !0),
                form.ajaxSubmit({
                    url: config.rooturl_module + '/profile',
                    method: 'POST',
                    success: function(response) {
                        if (response.success == 1) {
                            Notify.success('Cập nhật thành công!');
                        } else {
                            Notify.error('Cập nhật thất bại. Vui lòng thử lại!');
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

        const avatarUploadForm = elements.avatarUploadForm;
        const avatarImage = elements.avatarImage;
        const avatarInput = elements.avatarInput;
        avatarImage.on('click', function(e){
            e.preventDefault();
            e.stopPropagation();
            avatarInput.trigger('click');
        });
        avatarInput.on('change', function(){
            avatarUploadForm.ajaxSubmit({
                url: config.rooturl_module + '/profile/uploadavatar',
                method: 'POST',
                success: function(response) {
                    if (response.success == 1) {
                        Notify.success('Cập nhật thành công!');
                    } else {
                        Notify.error('Cập nhật thất bại. Vui lòng thử lại!');
                    }
                },
                error: function() {
                    
                },
                complete: function() {
                }
            })
        });
    }

    getFormData = function() {
        let formData = {};

        elements.inputs.each(function(index, el){
            const name = $(el).attr('name');
            const value = $(el).val();
            formData[name] = value;
        });

        return formData;
    }

    return {
        init: function() {
            run();
        }
    }
}();

jQuery(document).ready(function() {
    SnippetProfile.init()
});