var SnippetLogin = function() {
    var wrapper = $("#m_login"),
        message = function(e, i, a) {
            var r = $('<div class="m-alert m-alert--outline alert alert-' + i +
                ' alert-dismissible" role="alert">\t\t\t<button type="button" class="close" data-dismiss="alert" aria-label="Close"></button>\t\t\t<span></span>\t\t</div>'
            );
            wrapper.find(".alert").remove(), r.prependTo(e), r.animateClass("fadeIn animated"), r.find("span").html(a)
        },
        animate = function() {
            wrapper.removeClass("m-login--forget-password"), wrapper.removeClass("m-login--signup"), wrapper.addClass(
                "m-login--signin"), wrapper.find(".m-login__signin").animateClass("flipInX animated")
        },
        run = function() {
            $("#m_login_forget_password").click(function(i) {
                i.preventDefault(), wrapper.removeClass("m-login--signin"), wrapper.removeClass("m-login--signup"), wrapper.addClass(
                    "m-login--forget-password"), wrapper.find(".m-login__forget-password").animateClass(
                    "flipInX animated")
            }), $("#m_login_forget_password_cancel").click(function(e) {
                e.preventDefault(), animate()
            }), $("#m_login_signup").click(function(i) {
                i.preventDefault(), wrapper.removeClass("m-login--forget-password"), wrapper.removeClass(
                    "m-login--signin"), wrapper.addClass("m-login--signup"), wrapper.find(".m-login__signup").animateClass(
                    "flipInX animated")
            }), $("#m_login_signup_cancel").click(function(e) {
                e.preventDefault(), animate()
            })
        };
    return {
        init: function() {
            run(), $("#m_login_signin_submit").click(function(e) {
                e.preventDefault();
                var loginButton = $(this),
                    form = $(this).closest("form");
                form.validate({
                    rules: {
                        account: {
                            required: !0,
                        },
                        password: {
                            required: !0
                        }
                    }
                }), form.valid() && (loginButton.addClass("m-loader m-loader--right m-loader--light").attr(
                    "disabled", !0), form.ajaxSubmit({
                    url: '',
                    method: 'POST',
                    success: function(response) {
                        if (response.status == 1) {
                            message(form, "success", "Login successfully. Redirecting...");
                            window.location.href = config.rooturl + "/admin/ib";
                        } else {
                            message(form, "danger", "Tài khoản hoặc mật khẩu không hợp lệ.");
                        }
                    },
                    error: function() {
                        message(form, "danger", "Có lỗi xảy ra. Vui lòng thử lại");
                    },
                    complete: function() {
                        loginButton
                            .removeClass("m-loader m-loader--right m-loader--light")
                            .attr("disabled", !1);
                    }
                }))
            }), $("#m_login_signup_submit").click(function(r) {
                r.preventDefault();
                var l = $(this),
                    t = $(this).closest("form");
                t.validate({
                    rules: {
                        fullname: {
                            required: !0
                        },
                        email: {
                            required: !0,
                            email: !0
                        },
                        password: {
                            required: !0
                        },
                        rpassword: {
                            required: !0
                        },
                        agree: {
                            required: !0
                        }
                    }
                }), t.valid() && (l.addClass("m-loader m-loader--right m-loader--light").attr(
                    "disabled", !0), t.ajaxSubmit({
                    url: "",
                    success: function(r, s, n, o) {
                        setTimeout(function() {
                            l.removeClass(
                                    "m-loader m-loader--right m-loader--light")
                                .attr("disabled", !1), t.clearForm(), t.validate()
                                .resetForm(), a();
                            var r = e.find(".m-login__signin form");
                            r.clearForm(), r.validate().resetForm(), message(r,
                                "success",
                                "Thank you. To complete your registration please check your email."
                            )
                        }, 2e3)
                    }
                }))
            }), $("#m_login_forget_password_submit").click(function(r) {
                r.preventDefault();
                var l = $(this),
                    t = $(this).closest("form");
                t.validate({
                    rules: {
                        email: {
                            required: !0,
                            email: !0
                        }
                    }
                }), t.valid() && (l.addClass("m-loader m-loader--right m-loader--light").attr(
                    "disabled", !0), t.ajaxSubmit({
                    url: "",
                    success: function(r, s, n, o) {
                        setTimeout(function() {
                            l.removeClass(
                                    "m-loader m-loader--right m-loader--light")
                                .attr("disabled", !1), t.clearForm(), t.validate()
                                .resetForm(), a();
                            var r = e.find(".m-login__signin form");
                            r.clearForm(), r.validate().resetForm(), message(r,
                                "success",
                                "Cool! Password recovery instruction has been sent to your email."
                            )
                        }, 2e3)
                    }
                }))
            })
        }
    }
}();
jQuery(document).ready(function() {
    SnippetLogin.init()
});