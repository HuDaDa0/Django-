function Auth() {
    this.maskWrapper = $('.mask-wrapper');
    this.scrollWrapper = $('.scroll-wrapper');
}

Auth.prototype.run = function () {
    this.listenShowHideEvent();
    this.listenSwitchEvent();
    this.listenSigninEvent();
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
                if (result['code'] == 200) {
                    self.hideEvent();
                    window.location.reload();
                } else {
                    var messageObject = result['message'];
                    if (typeof messageObject == 'string' || messageObject.constructor == String) {
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


$(function () {
    var auth = new Auth();
    auth.run();
});







