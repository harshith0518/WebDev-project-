from django.urls import path
from problem.views import problemsPage,addProblem,problemDetails



urlpatterns = [
    path('',problemsPage,name = 'problem-set'),
    path('problem-details/<int:problem_id>',problemDetails,name = 'problem-details'),
    path('add-problem',addProblem,name = 'add-problem'),
]