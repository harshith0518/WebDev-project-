from django.shortcuts import render,redirect
from django.contrib.auth.models import User
from django.contrib import messages
from django.template import loader
from django.http import HttpResponse
from django.contrib.auth import authenticate,login,logout
from django.contrib.auth import get_user_model

User = get_user_model()

# Create your views here.

def register_user(request):
    
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        email = request.POST.get('email')
        user = User.objects.filter(username= username)
        if user.exists():
            messages.info(request,'Username already exists!')
            return redirect('register-user')
        user = User.objects.filter(email = email)
        if user.exists():
            messages.info(request,'Email already registered!')
            return redirect('register-user')
        
        user = User.objects.create_user(username = username,email = email,password=password)
        user.save()
        messages.info(request,'Registered successfully!')
        return redirect('login-user')
    
    template = loader.get_template('register.html')
    context = {}
    return HttpResponse(template.render(context,request))


def login_user(request):
    
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        user = User.objects.filter(email = email)
        
        if not user.exists():
            messages.info(request,'Unregistered email')
            return redirect('login-user')
        
        user = authenticate(request,email = email,password = password)
        
        if user is None:
            messages.info(request,'Incorrect password')
            return redirect('login-user')
        login(request,user)
        # messages.info(request,'Login successful')
        return redirect('preface-home')
    
    template = loader.get_template('login.html')
    context = {}
    return HttpResponse(template.render(context,request))



def logout_user(request):
    logout(request)
    messages.info(request,'Logout successful')
    return redirect('login-user')



