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



def show_preface(request):
    template = loader.get_template('homeInitial.html')
    context = {}
    return HttpResponse(template.render(context,request))



# @api_view(['GET'])
# @permission_classes(['IsAuthenticated'])
# def check(request):
#     return Response({'message':f'Hello {request.user.email}! You are authenticated.'})








