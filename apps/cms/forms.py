from django import forms
from apps.forms import FormMixin
from apps.news.models import News


class EditNewsCategory(forms.Form, FormMixin):
    pk = forms.IntegerField()
    name = forms.CharField(max_length=200)


class NewsForm(forms.ModelForm):
    category = forms.IntegerField()

    class Meta:
        model = News
        exclude = ['pub_time', 'category', 'author']







