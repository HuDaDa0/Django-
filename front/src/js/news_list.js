function CMSNewsList() {

}


// 日历选择器
CMSNewsList.prototype.initDataPickerEvent = function () {
    var startPicker = $('#start-picker');
    var endPicker = $('#end-picker');
    var todayDate = new Date();
    var todayStr = todayDate.getFullYear() + '/' + (todayDate.getMonth()+1) + '/' + todayDate.getDate();

    var options = {
        'showButtonPanel': true,
        'format': 'yyyy/mm/dd',
        'startDate': '2019/5/8',
        'endDate': todayStr,
        'language': 'zh-CN',
        'todayBtn': true,
        'todayHighlight': true,
        'clearBtn': true,
        'autoclose': true
    };

    startPicker.datepicker(options);
    endPicker.datepicker(options);

};


// 监听删除事件
CMSNewsList.prototype.listenDeleteEvent = function () {
    var deleteBtn = $('.delete-btn');
    var news_id = deleteBtn.attr('data-news-id');

    deleteBtn.click(function () {
        xfzalert.alertConfirm({
            'text': '你确定要删除么?',
            'confirmCallback': function () {
                xfzajax.post({
                    'url': '/cms/delete_news/',
                    'data': {
                        'news_id': news_id
                    },
                    'success': function (result) {
                        if (result['code'] === 200) {
                            window.location.reload();
                        }
                    }
                });
            }
        });
    });
};


CMSNewsList.prototype.run = function () {
    this.initDataPickerEvent();
    this.listenDeleteEvent();
};


$(function () {
    var newList = new CMSNewsList();
    newList.run();
});








