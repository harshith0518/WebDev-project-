from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from problem.models import Problem,Solution
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated,AllowAny

User = get_user_model()


class homeRequirementsAPIView(APIView):
    permission_classes = [AllowAny]
    def get(self,request):
        return Response({
            'userCnt':User.objects.count(),
            'problemCnt':Problem.objects.count(),
            'solutionCnt':Solution.objects.count(),
        })






