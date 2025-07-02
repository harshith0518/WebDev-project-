from django.shortcuts import render,redirect
from django.template import loader
from django.http import HttpResponse

# Create your views here.



def displaySolution(request):

    template = loader.get_template('solution.html')
    context = {}
    return HttpResponse(template.render(context=context,request=request))

def testingPurpose(request,problem_id):
    
    template = loader.get_template('solution.html')
    context = {
        'problem_id':problem_id
    }
    return HttpResponse(template.render(context=context,request=request))

