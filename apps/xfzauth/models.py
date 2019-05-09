from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from shortuuidfield import ShortUUIDField


class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, telephone, username, password, **extra_fields):
        if not telephone:
            raise ValueError('请输入手机号码~')
        if not username:
            raise ValueError('请输入用户名~')
        if not password:
            raise ValueError('请输入密码~')
        user = self.model(telephone=telephone, username=username, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_user(self, telephone, username, password, **extra_fields):
        extra_fields['is_superuser'] = False
        return self._create_user(telephone=telephone, username=username, password=password, **extra_fields)

    def create_superuser(self, telephone, username, password, **extra_fields):
        extra_fields['is_superuser'] = True
        extra_fields['is_staff'] = True
        return self._create_user(telephone, username, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    # shortuuid 是全球唯一的字符串
    uid = ShortUUIDField(primary_key=True)
    telephone = models.CharField(max_length=11, unique=True)
    username = models.CharField(max_length=200, unique=True)
    email = models.EmailField(unique=True, null=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    data_join = models.DateField(auto_now_add=True)

    USERNAME_FIELD = 'telephone'
    REQUIRED_FIELDS = ['username']
    EMAIL_FIELD = 'email'

    objects = UserManager()

    def get_full_name(self):
        return self.username

    def get_short_name(self):
        return self.username







