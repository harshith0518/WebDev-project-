from django.urls import path,include
from home.views import show_preface


urlpatterns = [
    path('preface/',show_preface,name = 'preface-home'),
]


