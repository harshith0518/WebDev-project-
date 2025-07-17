from django.urls import path
from user.views import UserAPIView,forNavbarAPIView,deleteUser,allUsersListAPIView


urlpatterns = [
    path('navbar/',forNavbarAPIView.as_view(),name = 'get-username'),
    path('delete-user/<int:id>/',deleteUser,name = 'delete-user'),
    path('get-all/',allUsersListAPIView.as_view(),name = 'users-list'),
    path('profile/<int:id>/',UserAPIView.as_view(),name = 'user-profile'),
]