from django.urls import path,include
from problem.views import RunCodeAPIView,ProblemsListAPIView,getProblem,SubmitCodeAPIView,AddProblemAPIView


urlpatterns = [
    path('run/',RunCodeAPIView.as_view(),name = 'run-code'),
    path('',ProblemsListAPIView.as_view(),name= 'problems-list'),
    path('<int:id>/',getProblem.as_view(),name= 'problems-list'),
    path('submit/<int:id>/',SubmitCodeAPIView.as_view(),name = 'submit-code'),
    path('add-problem/',AddProblemAPIView.as_view(),name = 'add-problem'),
]