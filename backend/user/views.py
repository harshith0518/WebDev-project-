from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from user.serializers import UserSerializer,forNavbarSerializer,ChangeProfileSerializer
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
# Create your views here.
User = get_user_model()


class UserAPIView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    def get(self, request,id):
        serializer = UserSerializer(User.objects.get(id =id),context ={'request': request})
        return Response(serializer.data)
    
class forNavbarAPIView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    def get(self,request):
        serializer = forNavbarSerializer(request.user,context={'request': request})
        return Response(serializer.data)

class IsStaffView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    def get(self, request):
        return Response({'is_staff': request.user.is_staff})

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
        serializer = UserSerializer(users,many = True)
        return Response(serializer.data,status=status.HTTP_200_OK)
    
import os
from django.conf import settings

# class ChangeProfileAPIView(APIView):
#     authentication_classes = [JWTAuthentication]
#     permission_classes = [IsAuthenticated]

#     def patch(self, request):
#         user = request.user
#         profile_pic = request.FILES.get('profile_pic', None)
#         if profile_pic is not None: print(profile_pic.name)
#         else: print("----------> Profile_pic is None")
#         if profile_pic and user.profile_pic and 'BatmanDefaultPic.webp' not in str(user.profile_pic):
#             old_path = os.path.join(settings.MEDIA_ROOT, str(user.profile_pic))
#             print("-----------> Old path:", old_path)
#             if os.path.exists(old_path):
#                 print(old_path)
#                 os.remove(old_path)
#             ext = os.path.splitext(profile_pic.name)[1]  # e.g. '.png'
#             profile_pic.name = f"{user.id}_profilepic{ext}"
#         serializer = ChangeProfileSerializer(user, data=request.data, partial=True)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=200)
#         return Response(serializer.errors, status=400)

class ChangeProfileAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        print("==========[DEBUG] ChangeProfileAPIView PATCH CALLED==========")
        print("User making request:", request.user.username, " | ID:", request.user.id)

        # Debug incoming data
        print("Request data keys:", request.data.keys())
        print("Request FILES keys:", request.FILES.keys())

        user = request.user
        profile_pic = request.FILES.get('profile_pic', None)

        # Debugging file input
        if profile_pic is not None:
            print("----------> Incoming profile_pic:", profile_pic.name, " | Size:", profile_pic.size)
        else:
            print("----------> Profile_pic is None (no file uploaded)")

        # If a new file is uploaded and the old one is not the default
        if profile_pic and user.profile_pic and 'BatmanDefaultPic.webp' not in str(user.profile_pic):
            old_path = os.path.join(settings.MEDIA_ROOT, str(user.profile_pic))
            print("-----------> Checking old path:", old_path)

            if os.path.exists(old_path):
                print("-----------> Old profile pic found at:", old_path)
                # os.remove(old_path)
                print("-----------> Old profile pic deleted")
            else:
                print("-----------> Old path does not exist on filesystem")

            # Rename new file to user_id_profilepic.ext
            # ext = os.path.splitext(profile_pic.name)[1]  # e.g. '.png'
            # new_name = f"{user.id}_profilepic{ext}"
            # profile_pic.name = new_name
            # print("-----------> Renaming new profile pic to:", new_name)
        else:
            if profile_pic:
                print("-----------> No old pic to delete (Default Batman still set)")
                # ext = os.path.splitext(profile_pic.name)[1]  # e.g. '.png'
                # new_name = f"{user.id}_profilepic{ext}"
                # profile_pic.name = new_name
                # print("-----------> Renaming new profile pic to:", new_name)
            else:
                print("-----------> Skipping file replacement since no new file uploaded")

        # Serializer debugging
        print("-----------> Initializing serializer with partial data")
        serializer = ChangeProfileSerializer(user, data=request.data, partial=True)

        if serializer.is_valid():
            print("-----------> Serializer valid")
            updated_user = serializer.save()
            print("-----------> Serializer saved changes to user:", updated_user.username)
            return Response(serializer.data, status=200)

        print("-----------> Serializer invalid, errors:")
        print(serializer.errors)
        return Response(serializer.errors, status=400)

