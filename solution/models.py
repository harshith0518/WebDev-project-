from django.db import models
from problem.models import Problem
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
# Create your models here.

User = get_user_model()

class Testcase(models.Model):
    
    inputFile = models.FileField(upload_to='testcases/input/')
    outputFile = models.FileField(upload_to='testcases/outputs')
    problem = models.ForeignKey(
        Problem,
        on_delete = models.CASCADE,
        related_name='testcases',
    )
    
    


#--------------NOTE--------------------------#
# note even though we delete the user or a problem the accuracy and total submitted those counts will not be changed 
# just the deleted one and the objects which are totally dependent on that can't be accessed in web that is all 

class Solution(models.Model):
    solutionCode = models.FileField(upload_to='solution/')
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='solutions',
    )
    problem = models.ForeignKey(
        Problem,
        on_delete=models.CASCADE,
        related_name='solutions',
    )
    verdict = models.CharField(max_length=30)   # --> accepted,wrong answer,memory/time limit exceeded,run time error
    language = models.CharField(max_length = 10)  # cpp,python,java
    
    def __str__(self):
        return f'solution{self.id} submitted by {self.user.username} for problem {self.problem.problemTitle}'
    
    
