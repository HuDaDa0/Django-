from django.shortcuts import render
from django.contrib.admin.views.decorators import staff_member_required
from django.views import View
from django.views.decorators.http import require_POST, require_GET
from utils import restful
import os

from apps.news.models import NewsCategory
from .forms import EditNewsCategory, NewsForm
from django.conf import settings


@staff_member_required(login_url='index')
def index(request):
    return render(request, 'cms/index.html')


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
    return render(request, 'cms/banners.html')

















