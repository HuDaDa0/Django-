function PubCourse() {
    
}


PubCourse.prototype.initUEditor = function () {
    window.ue = UE.getEditor('editor', {
        'serverUrl': '/ueditor/upload/'
    });
};


PubCourse.prototype.listenSaveEvent = function () {
    var saveBtn = $('#submit-btn');

    saveBtn.click(function () {
        var title = $('#title-input').val();
        var category = $('#category-input').val();
        var teacher = $('#teacher-input').val();
        var video_url = $('#video-input').val();
        var cover_url = $('#cover-input').val();
        var price = $('#price-input').val();
        var duration = $('#duration-input').val();
        var profile = window.ue.getContent();

        console.log(video_url);
        console.log(cover_url);
        console.log(profile);

        xfzajax.post({
            'url': '/cms/pub_course/',
            'data': {
                'title': title,
                'category': category,
                'teacher': teacher,
                'video_url': video_url,
                'cover_url': cover_url,
                'price': price,
                'duration': duration,
                'profile': profile
            },
            'success': function (result) {
                if (result['code'] === 200) {
                    xfzalert.alertSuccess('发文成功！', function () {
                        window.location.reload();
                    });
                }
            }
        });
    });
};


PubCourse.prototype.run = function () {
    this.initUEditor();
    this.listenSaveEvent();
};


$(function () {
    var pub_course = new PubCourse();
    pub_course.run();
});
















