from django.shortcuts import render, redirect, reverse
from django.views import View
from django.contrib import messages
from django.contrib.auth.models import Group

from apps.xfzauth.models import User


def staff_index(request):
    staffs = User.objects.filter(is_staff=True)
    context = {
        'staffs': staffs
    }
    return render(request, 'cms/staffs.html', context=context)


class AddStaff(View):
    def get(self, request):
        groups = Group.objects.all()
        context = {
            'groups': groups
        }
        return render(request, 'cms/add_staff.html', context=context)

    def post(self, request):
        telephone = request.POST.get('telephone')
        user = User.objects.filter(telephone=telephone).first()
        if user:
            user.is_staff = True
            group_ids = request.POST.getlist('groups')
            groups = Group.objects.filter(pk__in=group_ids)
            user.groups.set(groups)
            user.save()
            return redirect(reverse('cms:staffs'))
        else:
            messages.info(request, '手机号码不存在')
            return redirect(reverse('cms:add_staff'))

