from django.shortcuts import render
from django.views.generic import View

from .forms import CourseForm
from apps.course.models import CourseCategory, Teacher
from utils import restful


class PubCourse(View):

    def get(self, request):
        context = {
            'teachers': Teacher.objects.all(),
            'categories': CourseCategory.objects.all()
        }
        return render(request, 'cms/pub_course.html', context=context)

    def post(self, request):
        form = CourseForm(request.POST)
        if form.is_valid():
            teacher_id = form.cleaned_data.get('teacher')
            category_id = form.cleaned_data.get('category')

            course = form.save(commit=False)
            teacher = Teacher.objects.get(pk=teacher_id)
            category = CourseCategory.objects.get(pk=category_id)
            course.teacher = teacher
            course.category = category
            course.save()
            return restful.ok()
        else:
            print(form.get_errors())
            return restful.params_error(message=form.get_errors())










