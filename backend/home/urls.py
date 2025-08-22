from django.urls import path
from home.views import upload_file_view


urlpatterns = [
    path('',upload_file_view,name = 'home'),
]


