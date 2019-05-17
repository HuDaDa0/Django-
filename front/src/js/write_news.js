function News() {

}


News.prototype.run = function () {
    this.listenUploadFileEvent();
    this.initUeditorEvent();
    this.listenSubmitEvent();
};

// 上传文件
News.prototype.listenUploadFileEvent = function () {
    var uploadBtn = $('.thumbnail-btn');

    uploadBtn.change(function() {
        var file = uploadBtn[0].files[0];
        var formData = new FormData();
        formData.append('file', file);

        xfzajax.post({
            'url': '/cms/upload_file/',
            'data': formData,
            'processData': false,
            'contentType': false,
            'success': function(result) {
                if (result['code'] === 200) {
                    var thumbnailInput = $('#thumbnail-form');
                    var url = result['data']['url'];
                    thumbnailInput.val(url);
                }
            }
        });
    });
};


// 富文本编辑器
News.prototype.initUeditorEvent = function () {
    window.ue = UE.getEditor('editor', {
        'initialFrameHeight': 400,
        'serverUrl': '/ueditor/upload/'
    });

};


// 发布新闻
News.prototype.listenSubmitEvent = function () {
    var submitBtn = $('#submit-btn');

    submitBtn.click(function (event) {
        event.preventDefault();
        var self = $(this);
        var pk = self.attr('data-news-id');

        var title = $("input[name='title']").val();
        var category = $("select[name='category']").val();
        var desc = $("input[name='desc']").val();
        var thumbnail = $("input[name='thumbnail']").val();
        var content = window.ue.getContent();

        var url = '';
        if (pk) {
            var url = '/cms/edit_news/';
        } else {
            var url = '/cms/write_news/';
        }

        xfzajax.post({
            'url': url,
            'data': {
                'title': title,
                'category': category,
                'desc': desc,
                'thumbnail': thumbnail,
                'content': content,
                'pk': pk
            },
            'success': function (result) {
                if (result['code'] === 200) {
                    xfzalert.alertSuccess('发文成功！', function () {
                        window.location.reload();
                    });
                }
            },
            'fail': function () {

            }
        });
    });
};


$(function () {
    var news = new News();
    news.run();
});






















