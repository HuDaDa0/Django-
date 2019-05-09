// 弹出用户多功能
function FrontBase() {

}

FrontBase.prototype.run = function () {
    this.listenAuthBoxHover();
};

FrontBase.prototype.listenAuthBoxHover = function () {
    var authBox = $('.auth-box');
    var userMoreBox = $('.user-more-box');

    authBox.hover(function () {
        userMoreBox.show();
    }, function () {
        userMoreBox.hide();
    });

};

$(function () {
    var frontBase = new FrontBase();
    frontBase.run();
});


// 用户登录 注册框
function Auth() {
    this.maskWrapper = $('.mask-wrapper');
    this.scrollWrapper = $('.scroll-wrapper');
}

Auth.prototype.run = function () {
    this.listenShowHideEvent();
    this.listenSwitchEvent();
    this.listenSigninEvent();
    this.listenImgCaptchaEvent();
    this.listenSmsCaptchaEvent();
    this.listenSignupEvent();
};

Auth.prototype.showEvent = function () {
    this.maskWrapper.show();
};

Auth.prototype.hideEvent = function () {
    this.maskWrapper.hide();
};

Auth.prototype.listenShowHideEvent = function () {
    var self = this;
    var signinBtn = $('.signin-btn');
    var signupBtn = $('.signup-btn');
    var closeBtn = $('.close-btn');

    signinBtn.click(function () {
        self.showEvent();
        self.scrollWrapper.css({'left': 0});
    });

    signupBtn.click(function () {
        self.showEvent();
        self.scrollWrapper.css({'left': -400});
    });

    closeBtn.click(function () {
        self.hideEvent();
    });
};

Auth.prototype.listenSwitchEvent = function () {
    var self = this;
    $('.top-switch').click(function () {
        var scroll = self.scrollWrapper;
        var currentLeft = scroll.css('left');
        var currentLeft = parseInt(currentLeft);

        if (currentLeft < 0) {
            scroll.animate({'left': '0'});
        } else {
            scroll.animate({'left': '-400px'})
        }
    });
};

Auth.prototype.listenSigninEvent = function () {
    var self = this;
    var signinGroup = $('.signin-group');
    var telephoneInput = signinGroup.find("input[name='telephone']");
    var passwordInput = signinGroup.find("input[name='password']");
    var rememberInput = signinGroup.find("input[name='remember']");
    var submit = signinGroup.find("input[name='submit']");

    submit.click(function () {
        var telephone = telephoneInput.val();
        var password = passwordInput.val();
        var remember = rememberInput.prop('checked');

        xfzajax.post({
            'url': '/account/login/',
            'data': {
                'telephone': telephone,
                'password': password,
                'remember': remember
            },
            'success': function (result) {
                if (result['code'] === 200) {
                    self.hideEvent();
                    window.location.reload();
                } else {
                    var messageObject = result['message'];
                    if (typeof messageObject === 'string' || messageObject.constructor === String) {
                        window.messageBox.show(messageObject, 'error');
                    } else {
                        // {'password': ['xxxx', 'xxxx'], 'telephone': ['xxx', 'xxxx']}
                        for (var key in messageObject) {
                            var messages = messageObject[key];
                            window.messageBox.show(messages[0], 'error');
                        }
                    }
                }
            },
            'fail': function (error) {

            }
        });
    });
};


Auth.prototype.listenSignupEvent = function () {
    var self = this;
    var signupGroup = $('.signup-group');
    var submit = signupGroup.find('.submit');

    submit.click(function () {
        var telephoneInput = signupGroup.find("input[name='telephone']");
        var usernameInput = signupGroup.find("input[name='username']");
        var passwordInput1 = signupGroup.find("input[name='password1']");
        var passwordInput2 = signupGroup.find("input[name='password2']");
        var imgCaptchaInput = signupGroup.find("input[name='img_captcha']");
        var smsCaptchaInput = signupGroup.find("input[name='sms-captcha']");

        var telephone = telephoneInput.val();
        var username = usernameInput.val();
        var password1 = passwordInput1.val();
        var password2 = passwordInput2.val();
        var img_captcha = imgCaptchaInput.val();
        var sms_captcha = smsCaptchaInput.val();

        xfzajax.post({
            'url': '/account/register/',
            'data': {
                'telephone': telephone,
                'username': username,
                'password1': password1,
                'password2': password2,
                'img_captcha': img_captcha,
                'sms_captcha': sms_captcha,
            },
            'success': function (result) {
                if (result['code'] === 200) {
                    self.hideEvent();
                    window.location.reload();
                } else {
                    var messageObject = result['message'];
                    if (typeof messageObject === 'string' || messageObject.constructor === String) {
                        window.messageBox.show(messageObject, 'error');
                    } else {
                        // {'password': ['xxxx', 'xxxx'], 'telephone': ['xxx', 'xxxx']}
                        for (var key in messageObject) {
                            var messages = messageObject[key];
                            window.messageBox.show(messages[0], 'error');
                        }
                    }
                }
            },
            'fail': function (error) {
                window.messageBox.showError('服务器出现错误');
            }
        });
    });
};


Auth.prototype.listenImgCaptchaEvent = function () {
    var imgCaptcha = $('.img-captcha');
    imgCaptcha.click(function () {
        imgCaptcha.attr('src', '/account/img_captcha/' + '?random=' + Math.random());
    });
};

Auth.prototype.smsSuccessEvent = function (result) {
    var self = this;
    var smsCaptcha = $('.send');
    smsCaptcha.addClass('disable');
    smsCaptcha.unbind('click');

    var count = 60;
    var timer = setInterval(function () {
        count--;
        smsCaptcha.text(count + 's');
        if (count <= 0) {
            clearInterval(timer);
            smsCaptcha.removeClass('disable');
            smsCaptcha.text('发送验证码');
            self.listenSmsCaptchaEvent();
        }
    }, 1000);
    window.messageBox.showSuccess("你的验证码：" + result['data']['text']);
};
//
// Auth.prototype.listenSmsCaptchaEvent = function () {
//     var self = this;
//     var telephoneInput = $(".signup-group input[name='telephone']");
//     var smsCaptcha = $('.send');
//     smsCaptcha.click(function () {
//         var telephone = telephoneInput.val();
//         if (!telephone) {
//             window.messageBox.showError('请输入手机号码');
//         } else {
//             xfzajax.get({
//                 'url': '/account/sms_captcha/',
//                 'data': {
//                     'telephone': telephone
//                 },
//                 'success': function (result) {
//                     if (result['code'] == 200) {
//                         self.smsSuccessEvent(result);
//                     }
//                 },
//                 'fail': function () {
//
//                 }
//             });
//
//         }
//     });
//
// };

Auth.prototype.listenSmsCaptchaEvent = function () {
    var self = this;
    var telephoneInput = $(".signup-group input[name='telephone']");
    var smsCaptcha = $('.send');
    smsCaptcha.click(function () {
        var telephone = telephoneInput.val();
        if (!telephone) {
            window.messageBox.showError('请输入手机号码');
        } else {
            xfzajax.get({
                'url': '/account/sms_captcha/',
                'data': {
                    'telephone': telephone
                },
                'success': function (result) {
                    if (result['code'] == 200) {
                        smsCaptcha.addClass('disable');
                        // 解除 smsCaptcha 绑定的click事件， 这样在进行倒计时时，就会阻止用户再次点击
                        smsCaptcha.unbind('click');

                        var count = 60;
                        var timer = setInterval(function () {
                            count--;
                            smsCaptcha.text(count + 's');
                            if (count <= 0) {
                                clearInterval(timer);
                                smsCaptcha.removeClass('disable');
                                smsCaptcha.text('发送验证码');
                                // 倒计时结束时，要给smsCaptcha重新绑定click事件
                                self.listenSmsCaptchaEvent();
                            }
                        }, 1000);
                        window.messageBox.showSuccess("你的验证码：" + result['data']['text']);
                    }
                },
                'fail': function () {

                }
            });
        }
    });
};



$(function () {
    var auth = new Auth();
    auth.run();
});



