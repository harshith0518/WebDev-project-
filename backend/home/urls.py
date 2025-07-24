from django.urls import path
from home.views import homeRequirementsAPIView


urlpatterns = [
    path('',homeRequirementsAPIView.as_view(),name = 'home'),
]


