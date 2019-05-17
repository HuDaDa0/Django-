from django.shortcuts import render
from django.contrib.admin.views.decorators import staff_member_required
from django.views import View
from django.views.decorators.http import require_POST, require_GET
from utils import restful
import os
from apps.news.models import NewsCategory, Banners, News
from .forms import EditNewsCategory, NewsForm, BannerForm, EditBannerForm, EditNewsForm
from django.conf import settings
from apps.news.serializers import BannersSerializers
from django.core.paginator import Paginator
from django.utils.timezone import make_aware
from datetime import datetime
from urllib import parse


@staff_member_required(login_url='index')
def index(request):
    return render(request, 'cms/index.html')


class NewsListView(View):

    def get(self, request):
        # 通过 request.GET.get() 得到的数据全是字符串
        page = int(request.GET.get('p', 1))
        start = request.GET.get('start')
        end = request.GET.get('end')
        title = request.GET.get('title')
        category_id = int(request.GET.get('category', 0) or 0)

        newses = News.objects.select_related('category', 'author')

        if start or end:
            if start:
                # <class 'datetime.datetime'>  这个是幼稚的时间
                start = datetime.strptime(start, '%Y/%m/%d')
            else:
                start = datetime(year=2019, month=5, day=8)

            if end:
                end = datetime.strptime(end, '%Y/%m/%d')
            else:
                end = datetime.today()
            newses = newses.filter(pub_time__range=(make_aware(start), make_aware(end)))

            # 下面两个都是 <class 'str'> 类型
            start = start.strftime('%Y/%m/%d')
            end = end.strftime('%Y/%m/%d')

        if title:
            newses = newses.filter(title__icontains=title)

        if category_id:
            newses = newses.filter(category_id=category_id)

        paginator = Paginator(newses, 4)  # 一页显示4个序列内容
        page_obj = paginator.page(page)   # page_obj 是当前页面

        paginator_data = self.get_pagination_data(paginator, page_obj)

        context = {
            'newses': page_obj.object_list,
            'categories': NewsCategory.objects.all(),
            'page_obj': page_obj,
            'paginator': paginator,
            'start': start,
            'end': end,
            'title': title,
            'category_id': category_id,
            'url_query': '&' + parse.urlencode({
                'start': start or '',
                'end': end or '',
                'title': title or '',
                'category': category_id or ''
            })
        }
        context.update(paginator_data)

        return render(request, 'cms/news_list.html', context=context)

    def get_pagination_data(self, paginator, page_obj, around_count=2):
        current_page = page_obj.number
        num_pages = paginator.num_pages

        left_has_more = False
        right_has_more = False

        if current_page <= around_count + 2:
            left_pages = range(1, current_page)
        else:
            left_has_more = True
            left_pages = range(current_page-around_count, current_page)

        if current_page >= num_pages - around_count - 1:
            right_pages = range(current_page+1, num_pages+1)
        else:
            right_has_more = True
            right_pages = range(current_page+1, current_page+around_count+1)

        return {
            'left_pages': left_pages,
            'right_pages': right_pages,
            'current_page': current_page,
            'left_has_more': left_has_more,
            'right_has_more': right_has_more,
            'num_pages': num_pages
        }


class writeNewsView(View):

    def get(self, request):
        categories = NewsCategory.objects.all()
        context = {
            'categories': categories
        }
        return render(request, 'cms/write_news.html', context=context)

    def post(self, request):
        form = NewsForm(request.POST)
        if form.is_valid():
            category_id = form.cleaned_data.get('category')
            category = NewsCategory.objects.get(pk=category_id)
            author = request.user

            news = form.save(commit=False)
            news.category = category
            news.author = author
            news.save()
            return restful.ok()
        else:
            return restful.params_error(message=form.get_errors())


class EditNewsView(View):
    def get(self, request):
        pk = request.GET.get('news_id')
        news = News.objects.get(pk=pk)

        context = {
            'news': news,
            'categories': NewsCategory.objects.all()
        }
        return render(request, 'cms/write_news.html', context=context)

    def post(self, request):
        form = EditNewsForm(request.POST)
        if form.is_valid():
            pk = form.cleaned_data.get('pk')
            title = form.cleaned_data.get('title')
            desc = form.cleaned_data.get('desc')
            thumbnail = form.cleaned_data.get('thumbnail')
            content = form.cleaned_data.get('content')
            category_id = form.cleaned_data.get('category')
            category = NewsCategory.objects.get(pk=category_id)

            News.objects.filter(pk=pk).update(title=title, desc=desc, thumbnail=thumbnail,
                                              content=content, category=category)
            return restful.ok()
        else:
            return restful.params_error(message=form.get_errors())


def delete_news(request):
    news_id = request.POST.get('news_id')
    News.objects.filter(pk=news_id).delete()
    return restful.ok()


@require_GET
def news_category(request):
    categories = NewsCategory.objects.all()
    context = {
        'categories': categories
    }
    return render(request, 'cms/category.html', context=context)


@require_POST
def add_news_category(request):
    name = request.POST.get('name')
    exists = NewsCategory.objects.filter(name=name).exists()
    if not exists:
        NewsCategory.objects.create(name=name)
        return restful.ok()
    else:
        return restful.params_error(message='分类已经存在，不能重复添加')


@require_POST
def edit_news_category(request):
    form = EditNewsCategory(request.POST)
    if form.is_valid():
        pk = form.cleaned_data.get('pk')
        name = form.cleaned_data.get('name')
        try:
            NewsCategory.objects.filter(pk=pk).update(name=name)
            return restful.ok()
        except:
            return restful.params_error(message='找不到对应的分类')
    else:
        return restful.params_error(message=form.get_errors())


@require_POST
def delete_news_category(request):
    pk = request.POST.get('pk')
    try:
        NewsCategory.objects.filter(pk=pk).delete()
        return restful.ok()
    except:
        return restful.params_error(message='找不到你要的分类')


@require_POST
def upload_file(request):
    file = request.FILES.get('file')
    name = file.name
    with open(os.path.join(settings.MEDIA_ROOT, name), 'wb') as fp:
        for chunk in file.chunks():
            fp.write(chunk)
    url = request.build_absolute_uri(settings.MEDIA_URL+name)

    return restful.ok(data={'url': url})


def banners(request):
    # banners = Banners.objects.all()
    # context = {
    #     'banners': banners
    # }
    return render(request, 'cms/banners.html')


def banner_list(request):
    banners = Banners.objects.all()
    serializers = BannersSerializers(banners, many=True)
    data = serializers.data
    # data = [{}, {}, {}, {}]
    return restful.ok(data=data)


def add_banner(request):
    form = BannerForm(request.POST)
    if form.is_valid():
        banner = form.save()
        return restful.ok(data={'banner_id': banner.pk})
    else:
        return restful.params_error(message=form.get_errors())


def delete_banner(request):
    banner_id = request.POST.get('banner_id')
    Banners.objects.filter(id=banner_id).delete()
    return restful.ok()


def edit_banner(request):
    # 修改轮播图，需要传递轮播图的id，不然不知道要修改哪个轮播图
    # 还需要传递轮播图的其他各个参数
    form = EditBannerForm(request.POST)
    if form.is_valid():
        pk = form.cleaned_data.get('pk')
        priority = form.cleaned_data.get('priority')
        image_url = form.cleaned_data.get('image_url')
        link_to = form.cleaned_data.get('link_to')
        Banners.objects.filter(pk=pk).update(priority=priority, image_url=image_url, link_to=link_to)
        return restful.ok()
    else:
        return restful.params_error(message=form.get_errors())











