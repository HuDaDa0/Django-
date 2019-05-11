function Banners() {

}


// 上传图片
Banners.prototype.addImageEvent = function (bannerItem) {
    var image = bannerItem.find('.thumbnail');
    var imageInput = bannerItem.find('.image-input');

    image.click(function () {
        imageInput.click();
    });
    imageInput.change(function () {
        var file = this.files[0];
        var formData = new FormData();
        formData.append('file', file);

        xfzajax.post({
            'url': '/cms/upload_file/',
            'data': formData,
            'processData': false,
            'contentType': false,
            'success': function (result) {
                if (result['code'] === 200) {
                    var url = result['data']['url'];
                    image.attr('src', url);
                }
            }
        });
    });
};


// 点击关闭按钮
Banners.prototype.removeBannerEvent = function (bannerItem) {
    var closeBtn = bannerItem.find('.close-btn');

    closeBtn.click(function () {
        var bannerId = bannerItem.attr('data-banner-id');
        if (bannerId) {
            xfzalert.alertConfirm({
                'text': '你确定要删除么？',
                'confirmCallback': function () {
                    xfzajax.post({
                        'url': '/cms/delete_banner/',
                        'data': {
                            'banner_id': bannerId
                        },
                        'success': function (result) {
                            if (result['code'] === 200) {
                                bannerItem.remove();
                                window.messageBox.showSuccess('轮播图删除成功！');
                            }
                        }
                    });
                }
            });
        } else {
            bannerItem.remove();
        }
    });
};


// 点击保存事件，将轮播图的内容保存到数据库中
Banners.prototype.addSaveBannerEvent = function (bannerItem) {
    var saveBtn = bannerItem.find('.save-btn');

    saveBtn.click(function () {
        var imageTag = bannerItem.find('.thumbnail');
        var priorityInput = bannerItem.find("input[name='priority']");
        var linktoInput = bannerItem.find("input[name='link_to']");

        var image_url = imageTag.attr('src');
        var priority = priorityInput.val();
        var link_to = linktoInput.val();
        var bannerId = bannerItem.attr('data-banner-id');

        var url = '';
        if (bannerId) {
            url = '/cms/edit_banner/';
        } else {
            url = '/cms/add_banner/'
        }

        xfzajax.post({
            'url': url,
            'data': {
                'priority': priority,
                'link_to': link_to,
                'image_url': image_url,
                'pk': bannerId
            },
            'success': function (result) {
                if (result['code'] === 200) {
                    if (bannerId) {
                        window.messageBox.showSuccess('修改成功');
                    } else {
                        bannerId = result['data']['banner_id'];
                        bannerItem.attr('data-banner-id', bannerId);
                        window.messageBox.showSuccess('轮播图添加成功');
                    }
                    var priorityTag = bannerItem.find('.priority');
                    priorityTag.text('优先级：'+priority);
                }
            }
        });
    });
};


Banners.prototype.listenAddBannersEvent = function () {
    var self = this;
    var addBanners = $('#add-banners');

    addBanners.click(function () {
        var bannersListGroup = $('.banners-list-group');
        var length = bannersListGroup.children().length;

        if (length >= 6) {
            window.messageBox.showInfo('最多只能添加6张轮播图');
            return ;
        }
        var tpl = template('banners-item');
        bannersListGroup.prepend(tpl);

        // 获取刚刚添加的第一个 banner-item
        var bannerItem = bannersListGroup.find('.banner-item:first');
        // 执行上传图片的功能
        self.addImageEvent(bannerItem);
        // 点击关闭按钮
        self.removeBannerEvent(bannerItem);
        // 点击保存按钮，添加轮播图
        self.addSaveBannerEvent(bannerItem);
    });
};


Banners.prototype.loadData = function () {
    var self = this;

    xfzajax.get({
        'url': '/cms/banner_list/',
        'success': function (result) {
            if (result['code'] === 200) {
                var banners = result['data'];
                var bannersListGroup = $('.banners-list-group');

                for (var i = 0; i < banners.length; i++) {
                    var banner = banners[i];
                    var tpl = template('banners-item', {'banner': banner});
                    bannersListGroup.append(tpl);

                    // 获取刚刚添加的 banner-item  每添加一个banner-item就会绑定下面事件
                    var bannerItem = bannersListGroup.find('.banner-item:last');
                    // 执行上传图片的功能
                    self.addImageEvent(bannerItem);
                    // 点击关闭按钮
                    self.removeBannerEvent(bannerItem);
                    // 点击保存按钮，添加轮播图
                    self.addSaveBannerEvent(bannerItem);
                }
            }
        }
    });
};


Banners.prototype.run = function () {
    this.listenAddBannersEvent();
    this.loadData();
};


$(function () {
    var banners = new Banners();
    banners.run();
});

