from django.urls import path
from user.views import UserAPIView,forNavbarAPIView,deleteUser


urlpatterns = [
    path('profile/',UserAPIView.as_view(),name = 'user-details-all'),
    path('navbar/',forNavbarAPIView.as_view(),name = 'get-username'),
    path('delete-user/<int:id>/',deleteUser,name = 'delete-user'),
]