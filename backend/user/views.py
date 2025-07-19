from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.parsers import MultiPartParser,FormParser
from rest_framework_simplejwt.authentication import JWTAuthentication
from user.serializers import UserSerializer,forNavbarSerializer,ChangeProfileSerializer
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model

# Create your views here.
User = get_user_model()


class UserAPIView(APIView):
    permission_class = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    def get(self, request,id):
        serializer = UserSerializer(User.objects.get(id =id))
        return Response(serializer.data)
    
class forNavbarAPIView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    def get(self,request):
        serializer = forNavbarSerializer(request.user)
        return Response(serializer.data)

class IsStaffView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    def get(self, request):
        return Response({'is_staff': request.user.is_staff})

def deleteUser(request, id):
    try:
        user = User.objects.get(id=id)
        user.delete()
        return Response({"message": "User deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

class allUsersListAPIView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    def get(self,request):
        users = User.objects.all().order_by(
                                            '-Score',
                                            '-Hard_solved',
                                            '-Medium_solved',   
                                            '-Easy_solved'      
                                        )
        print(users)
        serializer = UserSerializer(users,many = True)
        return Response(serializer.data,status=status.HTTP_200_OK)
    
    
    
class ChangeProfileAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def put(self, request):
        serializer = ChangeProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)
