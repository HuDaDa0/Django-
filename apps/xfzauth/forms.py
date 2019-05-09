from django import forms
from apps.forms import FormMixin
from django.core.cache import cache
from django.contrib.auth import get_user_model


User = get_user_model()


class LoginForm(forms.Form, FormMixin):
    telephone = forms.CharField(max_length=11)
    password = forms.CharField(max_length=20, min_length=6, error_messages={'min_length': '最小长度不能小于6位', 'max_length': '密码最大长度不能超过20位'})
    remember = forms.CharField(required=False)


class RegisterForm(forms.Form, FormMixin):
    telephone = forms.CharField(max_length=11)
    username = forms.CharField(max_length=200)
    password1 = forms.CharField(max_length=20, min_length=6)
    password2 = forms.CharField(max_length=20, min_length=6)
    img_captcha = forms.CharField(max_length=4, min_length=4)
    sms_captcha = forms.CharField(max_length=6, min_length=6)

    def clean(self):
        cleaned_data = super(RegisterForm, self).clean()

        # 验证密码
        password1 = cleaned_data.get('password1')
        password2 = cleaned_data.get('password2')
        if password1 != password2:
            raise forms.ValidationError('俩次输入的密码不一样~')

        # 验证 图形验证码
        img_captcha = cleaned_data.get('img_captcha')
        cache_img_captcha = cache.get(img_captcha.lower())
        if not cache_img_captcha or cache_img_captcha != img_captcha.lower():
            raise forms.ValidationError('图形验证码输入错误')

        # 验证 短信验证码
        sms_captcha = cleaned_data.get('sms_captcha')
        telephone = cleaned_data.get('telephone')
        cache_sms_captcha = cache.get(telephone)
        if not cache_sms_captcha or cache_sms_captcha != sms_captcha:
            raise forms.ValidationError('短信验证码输入错误')

        # 验证 手机号是否唯一
        exists = User.objects.filter(telephone=telephone).exists()
        if exists:
            raise forms.ValidationError('你的手机号码已注册过了~')

        return cleaned_data


