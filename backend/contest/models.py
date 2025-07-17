from django.db import models
from problem.models import Problem
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
User = get_user_model()
# Create your models here.

class contest(models.Model):
    problems = models.ManyToManyField(Problem,related_name='contests')
    registered_users = models.ManyToManyField(User,related_name='contests')
    contestTitle = models.CharField(max_length=50)
    duration = models.PositiveIntegerField(help_text="In minutes")
    start_time = models.DateTimeField()
    
    def __str__(self):
        return self.contestTitle

