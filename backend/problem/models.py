from django.db import models
from django.conf import settings
from django.contrib.auth import  get_user_model
from django.contrib.auth.models import  User
# Create your models here.
User = get_user_model()


class Problem(models.Model):
    problemTitle = models.CharField(max_length = 30)
    problemStatement = models.TextField()
    totalAccepted = models.IntegerField(default=0)
    totalRejected = models.IntegerField(default=0)
    sample_testcase_INP = models.TextField(default = '')
    sample_testcase_OUT = models.TextField(default='no constraints provided')
    constraints = models.TextField(default='')
    topics  = models.TextField(default='')
    timeLimit = models.IntegerField(default = 2)
    memoryLimit = models.IntegerField(default=256)
    difficultyLevel = models.CharField(max_length=10)   # only accepts the Easy,Medium ,Hard strings
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null = True,    # to replace author as NULL in db if the author's account was deleted.
        blank = True,   # to replace author as blank in the admin page.
        related_name='authored_problems',
    )
    def __str__(self):
        return f'{self.problemTitle}'
    def get_accuracy(self):
        if (self.totalAccepted+self.totalRejected == 0): return '100%'
        else: return f'{self.totalAccepted/(self.totalRejected+self.totalAccepted):.2f}%'


class Testcase(models.Model):
    input_file = models.FileField(upload_to='testcases/inputs/',null = True,blank = True)
    output_file = models.FileField(upload_to='testcases/outputs/',null = True,blank = True)
    problem = models.ForeignKey(
        Problem,
        on_delete = models.CASCADE,
        related_name='testcases',
    )
    def __str__(self):
        return f"Testcase for Problem {self.problem.id}"


class Solution(models.Model):
    code = models.TextField()
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
    submittedAt = models.DateTimeField(auto_now_add=True)
    verdict = models.CharField(max_length=30)   # --> accepted,wrong answer,memory/time limit exceeded,run time error
    language = models.CharField(max_length = 10)  # c,cpp,python
    success = models.BooleanField(default=False)
    runtime = models.FloatField(default=0)
    def __str__(self):
        return f'solution{self.id} submitted by {self.user.username} for problem {self.problem.problemTitle}'


class ProblemSet(models.Model):
    problems = models.ManyToManyField(Problem,related_name = 'problem_sets')
    topics = models.TextField(default='')
    difficultyLevel = models.CharField(max_length = 30)
    problemSetTitle = models.CharField(max_length=30)
    def  __str__(self):
        return self.problemSetTitle


