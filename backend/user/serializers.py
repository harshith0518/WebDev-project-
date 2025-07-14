from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated
User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username','Score','first_name','last_name','Solved','Easy_solved','Medium_solved','Hard_solved','date_joined','email']
        
        
class forNavbarSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username','id','profile_pic']

    


