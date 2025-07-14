from django.shortcuts import render,redirect
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from django.template import loader
from django.http import HttpResponse
from django.contrib import messages
from django.contrib.auth.decorators import login_required
# from rest_framework.permissions import IsAuthenticated
# from rest_framework.decorators import api_view,permission_classes
# from rest_framework.response import Response
# Create your views here.
from django.http import JsonResponse
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def show_preface(request):
    context = {
        "title": "Welcome to DarkJudge",
        "message": "This is the preface data for the frontend.",
        "user": str(request.user) if request.user.is_authenticated else "Anonymous"
    }
    return JsonResponse(context)


# @api_view(['GET'])
# @permission_classes(['IsAuthenticated'])
# def check(request):
#     return Response({'message':f'Hello {request.user.email}! You are authenticated.'})








