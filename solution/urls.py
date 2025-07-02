from django.urls import path
from solution.views import displaySolution,testingPurpose


urlpatterns = [
    path('solution/<int:solution_id>',displaySolution,name = 'solution-details'),
    path('submit/<int:problem_id>/',testingPurpose,name = 'code-solution'),
    
]
