function Banner() {
    this.bannerGroup = $('#banner-group');
    this.index = 0;
    // this.listenBannerHover();
    this.bannerUl = $('#banner-ul');
    this.leftArrow = $('.left-arrow');
    this.rightArrow = $('.right-arrow');
    this.pageControl = $('.page-control');
}

Banner.prototype.listenArrowClick = function () {
    var self = this;
    this.leftArrow.click(
        function () {
            if (self.index === 0) {
                self.index = 3;
            } else {
                self.index--;
            }
            self.bannerUl.animate({'left': -795*self.index}, 500);
        }
    );
    this.rightArrow.click(
        function () {
            if (self.index === 3) {
                self.index = 0;
            } else {
                self.index++;
            }
            self.bannerUl.animate({'left': -795*self.index}, 500);
        }
    );
};

Banner.prototype.toggleArrow = function (isShow) {
    if (isShow) {
        this.leftArrow.show();
        this.rightArrow.show();
    } else {
        this.leftArrow.hide();
        this.rightArrow.hide();
    }
};

Banner.prototype.loop = function () {
    var self = this;
    this.timer = setInterval(function () {
        if (self.index >= 3) {
            self.index = 0;
        } else {
            self.index++;
        }
        self.bannerUl.stop().animate({'left': -795*self.index}, 500);
        // eq() 是自动获取当前的 li 标签
        self.pageControl.children('li').eq(self.index).addClass('active').siblings().removeClass('active');

    }, 2000);

};

Banner.prototype.run = function () {
    this.loop();
};

Banner.prototype.listenBannerHover = function () {
    var self = this;
    this.bannerGroup.hover(function () {
        // 第一个函数时档鼠标经过时，执行的操作
        clearInterval(self.timer);
        self.toggleArrow(true);
    }, function () {
        // 第二个函数是档鼠标离开后，执行的操作
        self.loop();
        self.toggleArrow(false);
    });
};

Banner.prototype.listenPageControl = function () {
    var self = this;
    this.pageControl.children('li').each(function (index, obj) {
        $(obj).click(function () {
            self.index = index;
            self.bannerUl.animate({'left': -795*self.index}, 1000);
            $(obj).addClass('active').siblings().removeClass('active');
        });
    });
};


function Index() {
    this.p = 2;
    this.category_id = 0;
    this.loadBtn = $('#load-more-btn');

    // 自定义验证器
    template.defaults.imports.timeSince = function (dateValue) {
        var date = new Date(dateValue);
        var dates = date.getTime();  // 毫秒
        var nowts = (new Date()).getTime();    // 得到当前的时间的时间戳
        var timestamp = (nowts-dates) / 1000;  // 除以 1000 得到的是秒

        if (timestamp < 60) {
            return '刚刚'
        } else if (timestamp > 60 && timestamp < 60*60) {
            var minutes = parseInt(timestamp / 60);
            return minutes + '分钟前'
        } else if (timestamp > 60*60 && timestamp < 60*60*24) {
            var hours = parseInt(timestamp / 60 /60);
            return hours + '小时前'
        } else if (timestamp > 60*60*24 && timestamp < 60*60*24*30) {
            var days = parseInt(timestamp / 60 / 60 / 24);
            return days + '天前'
        } else {
            var year = date.getFullYear();
            var month = date.getMonth();
            var day = date.getDay();
            var hours = date.getHours();
            var minutes = data.getMinutes();

            return year+'/'+month+'/'+day+' '+hours+':'+minutes;
        }
    }
}


Index.prototype.listenLoadMoreEvent = function () {
    var self = this;

    this.loadBtn.click(function () {
        xfzajax.get({
            'url': '/news/list/',
            'data': {
                'p': self.p,
                'category_id': self.category_id
            },
            'success': function (result) {
                if (result['code'] === 200) {
                    var newses = result['data'];
                    if (newses.length > 0) {
                        // 获取模板，填入数据 newses
                        var tpl = template('news-item', {'newses': newses});
                        var ul = $('.list-inner-group');
                        // 在目标 ul 标签上，添加 模板 内容
                        ul.append(tpl);
                        self.p += 1;
                    } else {
                        self.loadBtn.hide();
                    }
                }
            }
        });
    });
};


Index.prototype.listenCategorySwitchEvent = function () {
    var self = this;
    var ul = $('.list-tab');
    ul.children().click(function () {
        var li = $(this);
        var category_id = li.attr('data-category');
        var p = 1;
        xfzajax.get({
            'url': '/news/list/',
            'data': {
                'p': p,
                'category_id': category_id
            },
            'success': function (result) {
                if (result['code'] === 200) {
                    var newses = result['data'];
                    var tpl = template('news-item', {'newses': newses});
                    var ul = $('.list-inner-group');
                    // 在目标 ul 标签上，添加 模板 内容
                    ul.empty();
                    ul.append(tpl);
                    self.category_id = category_id;
                    self.p = 2;
                    self.loadBtn.show();
                }
            }
        });
    });
};


Index.prototype.run = function () {
    this.listenLoadMoreEvent();
    this.listenCategorySwitchEvent();
};


$(function () {
    var banner = new Banner();
    banner.run();
    banner.listenBannerHover();
    banner.listenArrowClick();
    banner.listenPageControl();

    var index = new Index();
    index.run();
});

// 上面是抄老师的，下面是自己写的，效果一样
// function Banner() {
// 	this.index = 0;
// }
// Banner.prototype.loop = function () {
// 	var self = this;
// 	var bannerUl = $('#banner-ul');
// 	this.timer = setInterval(function () {
//         if (self.index >= 3) {
//         	self.index = 0;
//         } else {
//         	self.index++;
//         }
//
//         bannerUl.animate({'left': -795*self.index}, 500);
// 	}, 1000);
// };
//
// Banner.prototype.run = function () {
// 	this.loop();
// };
//
// Banner.prototype.listenBannerHover = function () {
// 	var self = this;
// 	var bannerGroup = $('#banner-group');
// 	bannerGroup.hover(function() {
// 		// 鼠标经过时，会触发这个函数
// 		clearInterval(self.timer);
// 	}, function () {
// 		// 鼠标离开后，会触发这个函数
// 		self.loop();
// 	});
// };
//
//
// $(function () {
//     var banner = new Banner();
//     banner.run();
//     banner.listenBannerHover();

// });

