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
        bannerItem.remove();
        // bannerItem.hide();
    });
};


Banners.prototype.listenAddBannersEvent = function () {
    var self = this;
    var addBanners = $('#add-banners');

    addBanners.click(function () {
        var tpl = template('banners-item');
        var bannersListGroup = $('.banners-list-group');
        bannersListGroup.prepend(tpl);

        var bannerItem = bannersListGroup.find('.banner-item:first');
        // 执行上传图片的功能
        self.addImageEvent(bannerItem);
        // 点击关闭按钮
        self.removeBannerEvent(bannerItem);
    });
};


Banners.prototype.run = function () {
    this.listenAddBannersEvent();
};


$(function () {
    var banners = new Banners();
    banners.run();
});

