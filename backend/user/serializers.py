from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username','Score','first_name','last_name','Easy_solved','Medium_solved','Hard_solved','date_joined','email','profile_pic','id']
        
    def get_profile_pic(self, obj):
        request = self.context.get('request')
        if obj.profile_pic and hasattr(obj.profile_pic, 'url'):
            return request.build_absolute_uri(obj.profile_pic.url)
        return None
        
class forNavbarSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username','id','profile_pic']
    def get_profile_pic(self, obj):
        request = self.context.get('request')
        if obj.profile_pic and hasattr(obj.profile_pic, 'url'):
            return request.build_absolute_uri(obj.profile_pic.url)
        return None



class ChangeProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'profile_pic']
        extra_kwargs = {
            'username': {'required': False},
            'first_name': {'required': False},
            'last_name': {'required': False},
            'email': {'required': False},
            'profile_pic': {'required': False},
        }