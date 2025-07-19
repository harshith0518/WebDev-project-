from django.urls import path
from user.views import UserAPIView,forNavbarAPIView,allUsersListAPIView,IsStaffView,ChangeProfileAPIView


urlpatterns = [
    path('navbar/',forNavbarAPIView.as_view(),name = 'get-username'),
    path('is_staff/',IsStaffView.as_view(),name = 'is-staff'),
    path('get-all/',allUsersListAPIView.as_view(),name = 'users-list'),
    path('profile/<int:id>/',UserAPIView.as_view(),name = 'user-profile'),
    path('change-profile/',ChangeProfileAPIView.as_view(),name = 'change-profile'),
] 