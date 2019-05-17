from django.db import models


class CourseCategory(models.Model):
    name = models.CharField(max_length=200)


class Teacher(models.Model):
    username = models.CharField(max_length=200)
    avatar = models.URLField()
    jobtitle = models.CharField(max_length=200)
    profile = models.TextField()


class Course(models.Model):
    title = models.CharField(max_length=200)

    category = models.ForeignKey('CourseCategory', on_delete=models.DO_NOTHING)
    teacher = models.ForeignKey('Teacher', on_delete=models.DO_NOTHING)

    video_url = models.URLField()
    cover_url = models.URLField()
    price = models.FloatField()
    duration = models.IntegerField()   # 定义的是 秒
    profile = models.TextField()       # 简介
    pub_time = models.DateField(auto_now_add=True)




















