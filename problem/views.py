from django.shortcuts import render,redirect
from django.contrib import messages
from django.http import HttpResponse
from django.template import loader
from problem.models import Problem

# Create your views here.



def problemsPage(request):
    
    problemsList = Problem.objects.all()
    
    template = loader.get_template('problems.html')
    context = {
        'problems':problemsList
    }
    return HttpResponse(template.render(context,request))
    

def addProblem(request):
    
    if(request.method == 'POST'):
        
        problemTitle = request.POST.get('title')
        problemStatement = request.POST.get('statement')
        difficultyLevel = request.POST.get('difficulty')
        
        problem = Problem.objects.filter(problemTitle = problemTitle)
        
        if problem.exists():
            messages.error(request,'A problem with the same title already exists!')
            
            template = loader.get_template('enterProblemDetails.html')
            context = {
                'title':problemTitle,
                'statement': problemStatement,
                'difficulty': difficultyLevel
            }
            return HttpResponse(template.render(context,request))
            # planning to place a pop up 
        
        problem = Problem()
        problem.problemTitle = problemTitle
        problem.problemStatement = problemStatement
        problem.difficultyLevel = difficultyLevel
        problem.save()
        messages.success(request,f'Problem {problemTitle} has been added successfully!')
        return redirect('problem-set')
    else:
        template = loader.get_template('enterProblemDetails.html')
        context = {}
        return HttpResponse(template.render(context,request))
    
    
def problemDetails(request,problem_id):
    
    
    problem = Problem.objects.get(id = problem_id)
    template = loader.get_template('problemDetails.html')
    context = {
        'problem':problem
    }
    return HttpResponse(template.render(context,request))



