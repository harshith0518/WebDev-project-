from django.urls import path,include
from problem.views import problemsPage,addProblem,problemDetails,deleteProblem


urlpatterns = [
    path('',problemsPage,name = 'problem-set'),
    path('problem/<int:problem_id>/',problemDetails,name = 'problem-details'),
    path('add-problem/',addProblem,name = 'add-problem'),
    path('delete/<int:problem_id>',deleteProblem,name = 'delete-problem'),
    
]