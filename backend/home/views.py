from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from rest_framework import status
from problem.models import Problem,Solution
User = get_user_model()


class homeRequirementsAPIView(APIView):
    
    def get(self,request):
        user_cnt = User.objects.count()
        problem_cnt = Problem.objects.count()
        solution_cnt = Solution.objects.count()
        return Response({
            'userCnt':user_cnt,
            'problemCnt':problem_cnt,
            'solutionCnt':solution_cnt,
        })






