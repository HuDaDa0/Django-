from django.shortcuts import render
from .models import News, NewsCategory, Comment, Banners
from django.conf import settings
from utils import restful
from .serializers import NewsSerializers, CommentSerializers
from .forms import CommentForm
from .decorators import xfz_login_require


def index(request):
    count = settings.ONE_PAGE_NEWS_COUNT
    newses = News.objects.select_related('category', 'author').all()[0: count]
    categories = NewsCategory.objects.all()
    context = {
        'newses': newses,
        'categories': categories,
        'banners': Banners.objects.all()
    }
    return render(request, 'news/index.html', context=context)


# 通过点击‘查看更多’，每次显示两篇文章
# 前端通过 ajax 向 /news/list/ 发送请求
# 服务器返回一个 json 数据， 包含了文章的所有的详情信息（通过django插件序列化实现的）
def news_list(request):
    count = settings.ONE_PAGE_NEWS_COUNT
    # 通过 p 参数，来指定要获取第几页的数据
    # 并且这个参数是通过字符串的方式传递过来的 /news/list/?p=2
    page = int(request.GET.get('p', 1))
    # 0 表示不进行分类
    category_id = int(request.GET.get('category_id', 0))
    # 第一页： 0, 1
    # 第二页： 2, 3
    # 第三页： 4, 5
    start = (page-1) * count
    end = start + count

    if category_id == 0:
        newses = News.objects.select_related('category', 'author').all()[start: end]
    else:
        newses = News.objects.select_related('category', 'author').filter(category__id=category_id)[start: end]
    serializers = NewsSerializers(newses, many=True)
    data = serializers.data
    # 这样数据 data 就会这样返回
    # {'id': xx, 'title': 'xx', 'desc': 'xx', 'thumbnail': 'xxx', 'category': {'id': xx, 'name': 'xx'}, 'author': {'uid': xxx, 'username':'c'}} 类似的，
    # 会把外键的字段返回来
    # 这样就可以传给前端，前端用 art-template 模板渲染 就会展示数据了
    return restful.ok(data=data)


def news_detail(request, news_id):
    news = News.objects.select_related('category', 'author').get(pk=news_id)
    comments = Comment.objects.filter(news_id=news_id).all()

    context = {
        'news': news,
        'comments': comments
    }
    return render(request, 'news/news_details.html', context=context)


@xfz_login_require
def public_comment(request):
    form = CommentForm(request.POST)
    if form.is_valid():
        news_id = form.cleaned_data.get('news_id')
        content = form.cleaned_data.get('content')

        news = News.objects.get(pk=news_id)
        author = request.user
        comment = Comment.objects.create(content=content, news=news, author=author)
        # 对 Comment 进行序列化 用于返回 Comment 外键的内容
        serializer = CommentSerializers(comment)
        # 将数据返回给前端，
        return restful.ok(data=serializer.data)
    else:
        return restful.params_error(message=form.get_errors())


def search(request):
    return render(request, 'search/search.html')




