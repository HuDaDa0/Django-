function AddCategory () {

}


AddCategory.prototype.run = function () {
    this.listenAddCategory();
    this.listenEditCategoryEvent();
    this.listenDeleteCategoryEvent();
};


AddCategory.prototype.listenAddCategory = function () {
    var addBtn = $('#add-btn');

    addBtn.click(function () {
        xfzalert.alertOneInput({
            'title': '添加新闻分类',
            'placeholder': '请输入新闻分类',
            'confirmCallback': function (inputValue) {
                xfzajax.post({
                    'url': '/cms/add_news_category/',
                    'data': {
                        'name': inputValue
                    },
                    'success': function (result) {
                        if (result['code'] === 200) {
                            window.location.reload();
                        } else {
                            xfzalert.close();
                        }
                    }
                });
            }
        });
    });
};


AddCategory.prototype.listenEditCategoryEvent = function () {
    var editBtn = $('.edit-btn');

    editBtn.click(function () {
        var current = $(this);
        var tr = current.parent().parent();   // tr 标签，tr上面绑定了自定义的一些元素
        var pk = tr.attr('data-pk');
        var name = tr.attr('data-name');

        xfzalert.alertOneInput({
            'title': '编辑新闻分类',
            'value': name,
            'confirmCallback': function (inputValue) {
                xfzajax.post({
                    'url': '/cms/edit_news_category/',
                    'data': {
                        'pk': pk,
                        'name': inputValue
                    },
                    'success': function (result) {
                        if (result['code'] === 200) {
                            window.location.reload();
                        } else {
                            xfzalert.close();
                        }
                    },
                });
            }
        });
    });
};


AddCategory.prototype.listenDeleteCategoryEvent = function () {
    var deleteBtn = $('.delete-btn');
    
    deleteBtn.click(function () {
        var current = $(this);
        var tr = current.parent().parent();
        var pk = tr.attr('data-pk');

        xfzalert.alertConfirm({
            'title': '你确定要删除么',
            'confirmCallback': function () {
                xfzajax.post({
                    'url': '/cms/delete_news_category/',
                    'data': {
                        'pk': pk
                    },
                    'success': function (result) {
                        if (result['code'] === 200) {
                            window.location.reload();
                        } else {
                            xfzalert.close();
                        }
                    }
                });
            }
        });
    });
};


$(function () {
    var add_category = new AddCategory();
    add_category.run();
});







