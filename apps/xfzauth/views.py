from django.views.decorators.http import require_POST
from .forms import LoginForm, RegisterForm
from django.contrib.auth import login, logout, authenticate, get_user_model
from utils import restful
from django.shortcuts import redirect, reverse
from utils.captcha.xfzcaptcha import Captcha
from django.http import HttpResponse
from io import BytesIO
import random
from django.core.cache import cache

User = get_user_model()


@require_POST  # get请求的页面在/cms/login已经实现了，所以这个的login只能用post请求去验证数据的
def login_view(request):
    form = LoginForm(request.POST)
    if form.is_valid():
        telephone = form.cleaned_data.get('telephone')
        password = form.cleaned_data.get('password')
        remember = form.cleaned_data.get('remember')
        user = authenticate(username=telephone, password=password)
        if user:
            if user.is_active:
                login(request, user)
                if remember:
                    request.session.set_expiry(None)
                else:
                    request.session.set_expiry(0)
                return restful.ok()
            else:
                return restful.unauth(message='你的账号已被冻结~')
        else:
            return restful.params_error(message='你输入的手机号码或者密码出错')
    else:
        errors = form.get_errors()
        return restful.params_error(message=errors)


def logout_view(request):
    logout(request)
    return redirect(reverse('index'))


@require_POST
def register(request):
    form = RegisterForm(request.POST)
    if form.is_valid():
        telephone = form.cleaned_data.get('telephone')
        username = form.cleaned_data.get('username')
        password = form.cleaned_data.get('password1')
        user = User.objects.create_user(telephone=telephone, username=username, password=password)
        login(request, user)
        return restful.ok()
    else:
        return restful.params_error(message=form.get_errors())


def img_captcha(request):
    text, image = Captcha.gene_code()
    # BytesIO 相当于数据流管道， 用来存储图片的流数据
    out = BytesIO()
    # 将 image 保存到 BytesIO 管道里
    image.save(out, 'png')
    # 保存结束后，BytesIO文件指针自动指向数据流 末尾， 但是后面要读取数据流，所以要让指针指向开头 0 处
    out.seek(0)

    # 设置缓存，用于验证
    cache.set(text.lower(), text.lower(), 50*60)

    response = HttpResponse(content_type='image/png')
    response.write(out.read())
    response['Content_length'] = out.tell()  # 获取文件的长度
    return response


def sms_captcha(request):
    # 接受来自ajax的请求，发送手机号码过来，视图在发送验证码给用户
    telephone = request.GET.get('telephone')
    # 如下是我自己没钱购买短信验证码，自己写的随机生成6位验证码
    source = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    text = random.sample(source, 6)
    text = ''.join(text)
    print(text)
    data = {'text': text}
    # 设置缓存 用于验证的 存储于本地，保留时间为5分钟
    cache.set(telephone, text, 5*60)
    return restful.ok(data=data)


