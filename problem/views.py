from django.shortcuts import render,redirect
from django.contrib import messages
from django.http import HttpResponse
from django.template import loader
from problem.models import Problem
from django.contrib.auth.decorators import login_required
# Create your views here.



def problemsPage(request):
    
    problemsList = Problem.objects.all()
    
    template = loader.get_template('problems.html')
    context = {
        'problems':problemsList
    }
    return HttpResponse(template.render(context,request))
    



#still not added the test cases part
def addProblem(request):
    
    if(request.method == 'POST'):
        
        if not request.user.is_authenticated:
            return redirect(f'/auth/login/?next={request.path}')
        
        problemTitle = request.POST.get('title')
        problemStatement = request.POST.get('statement')
        difficultyLevel = request.POST.get('difficulty')
        
        if problemTitle == '' or problemStatement == '' or difficultyLevel == '':
            messages.error(request,'Title, Statement and difficulty level must be filled!')
            template = loader.get_template('enterProblemDetails.html')
            context = {
                'title':problemTitle,
                'statement': problemStatement,
                'difficulty': difficultyLevel
            }
            return HttpResponse(template.render(context,request))
        
        
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
        
        
        
        Problem.objects.create(
                        problemTitle = problemTitle,
                        problemStatement = problemStatement,
                        difficultyLevel = difficultyLevel,
                        author = request.user
                    )
        messages.success(request,f'Problem {problemTitle} has been added successfully!')
        return redirect('problem-set')
    else:
        template = loader.get_template('enterProblemDetails.html')
        context = {}
        return HttpResponse(template.render(context,request))
    

def problemDetails(request,problem_id):
    
    problem = Problem.objects.get(id = problem_id)
    template = loader.get_template('problemPage.html')
    context = {
        'problem':problem
    }
    return HttpResponse(template.render(context,request))



def deleteProblem(request,problem_id):
    Problem.objects.get(id = problem_id).delete()
    return redirect('problem-set')
    
    



