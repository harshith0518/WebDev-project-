from django.urls import path
from user.views import UserAPIView,forNavbarAPIView,deleteUser,allUsersListAPIView,isStaffSerializer,ChangeProfileAPIView


urlpatterns = [
    path('navbar/',forNavbarAPIView.as_view(),name = 'get-username'),
    path('delete-user/<int:id>/',deleteUser,name = 'delete-user'),
    path('is_staff/',isStaffSerializer,name = 'is-staff'),
    path('get-all/',allUsersListAPIView.as_view(),name = 'users-list'),
    path('profile/<int:id>/',UserAPIView.as_view(),name = 'user-profile'),
    path('change-profile/',ChangeProfileAPIView.as_view(),name = 'change-profile'),
] 