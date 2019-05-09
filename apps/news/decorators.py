from utils import restful
from django.shortcuts import redirect


def xfz_login_require(func):
    def wrapper(request, *args, **kwargs):
        if request.user.is_authenticated:
            return func(request, *args, **kwargs)
        else:
            if request.is_ajax():
                return restful.unauth(message='请先登录！')
            return redirect('/')

    return wrapper

