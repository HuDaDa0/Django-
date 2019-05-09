function Comment() {

}


Comment.prototype.listenCommentEvent = function () {
    var submitBtn = $('.submit-btn');

    submitBtn.click(function () {
        var contentInput = $('#comment');
        var content = contentInput.val();
        var news_id = submitBtn.attr('data-news-id');

        xfzajax.post({
            'url':'/news/public_comment/',
            'data': {
                'news_id': news_id,
                'content': content
            },
            'success': function (result) {
                if (result['code'] === 200) {
                    var comment = result['data'];
                    var tpl = template('comment-item', {'comment': comment});
                    var ul = $('.comment-list');
                    ul.prepend(tpl);

                    window.messageBox.showSuccess('评论成功');
                    contentInput.val("");
                } else {
                    window.messageBox.showError(message=result['message']);

                }
            }
        });
    });
};


Comment.prototype.run = function () {
    this.listenCommentEvent();

};


$(function () {
    var comment = new Comment();
    comment.run();
});






