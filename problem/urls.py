from django.urls import path,include
from problem.views import problemsPage,addProblem,problemDetails


urlpatterns = [
    path('',problemsPage,name = 'problem-set'),
    path('problem/<int:problem_id>/',problemDetails,name = 'problem-details'),
    path('add-problem/',addProblem,name = 'add-problem'),
]