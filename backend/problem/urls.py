from django.urls import path
from problem.views import RunCodeAPIView,ProblemsListAPIView,getProblem,SubmitCodeAPIView,AddProblemAPIView,getProblemSetAPIView,getProblemSetsAPIView,getSolutionsListAPIView,getUserSolutionsAPIView ,addProblemSetAPIView,ShowSolutionDetailAPIView,getLatestCodeAPIView,getMyProblemSubmissionsAPIView

urlpatterns = [
    path('run/',RunCodeAPIView.as_view(),name = 'run-code'),
    path('',ProblemsListAPIView.as_view(),name= 'problems-list'),
    path('<int:id>/',getProblem.as_view(),name= 'problems-list'),
    path('<int:id>/solutions/solution/mine/',getMyProblemSubmissionsAPIView.as_view(),name = 'solution-detail'),
    path('submit/<int:id>/',SubmitCodeAPIView.as_view(),name = 'submit-code'),
    path('add-problem/',AddProblemAPIView.as_view(),name = 'add-problem'),
    path('problem-sets/',getProblemSetsAPIView.as_view(),name = 'all-problem-sets'),
    path('problem-sets/add-set/',addProblemSetAPIView.as_view(),name = 'all-problem-sets'),
    path('problem-sets/<int:id>/',getProblemSetAPIView.as_view(),name = 'problem-set-detail'),
    path('solutions/all/',getSolutionsListAPIView.as_view(),name = 'global-solutions'),
    path('solutions/user-solutions/<int:id>/',getUserSolutionsAPIView.as_view(),name = 'user-solutions'),
    path('solutions/solution/<int:id>/',ShowSolutionDetailAPIView.as_view(),name = 'solution-detail'),
    path('<int:id>/latest-code/',getLatestCodeAPIView.as_view(),name = 'problem-latest-code')

]