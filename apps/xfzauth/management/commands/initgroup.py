"""
    自定义一个可以用于终端的命令
    例如： python manage.py initgroup
"""

from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission, ContentType
from apps.news.models import News, NewsCategory, Comment, Banners
from apps.course.models import Course, CourseCategory, Teacher


class Command(BaseCommand):
    def handle(self, *args, **options):
        # 1. 编辑组（管理新闻/管理课程/管理评论/管理轮播图等）
        edit_content_types = [
            ContentType.objects.get_for_model(News),
            ContentType.objects.get_for_model(NewsCategory),
            ContentType.objects.get_for_model(Banners),
            ContentType.objects.get_for_model(Comment),
            ContentType.objects.get_for_model(Course),
            ContentType.objects.get_for_model(CourseCategory),
            ContentType.objects.get_for_model(Teacher),
        ]
        edit_permissions = Permission.objects.filter(content_type__in=edit_content_types)
        editGroup = Group.objects.create(name='编辑')
        editGroup.permissions.set(edit_permissions)
        editGroup.save()
        self.stdout.write(self.style.SUCCESS('编辑组创建完成！'))

        # 3. 管理员组（编辑组+财务组）
        admin_permissions = edit_permissions
        adminGroup = Group.objects.create(name='管理员')
        adminGroup.permissions.set(admin_permissions)
        adminGroup.save()
        # 4. 超级管理员
        self.stdout.write(self.style.SUCCESS('管理员组创建完成！'))






