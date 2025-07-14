from django.urls import path
from api.views import UserRegistrationAPIView, UserLoginAPIView, UserLogoutAPIView,is_auth
from rest_framework_simplejwt.views import TokenRefreshView
urlpatterns = [
    path("register/", UserRegistrationAPIView.as_view(), name="register-user"),
    path("login/", UserLoginAPIView.as_view(), name="login-user"),
    path("logout/", UserLogoutAPIView.as_view(), name="logout-user"),
    path("is-auth/",is_auth,name ='check-auth'),
    path('token/refresh/',TokenRefreshView.as_view(),name = 'refresh-token'),
]