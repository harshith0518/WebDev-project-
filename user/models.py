from django.db import models
from django.contrib.auth.models import AbstractUser
from .manager import UserManager




class CustomUser(AbstractUser):
    
    Score = models.IntegerField(default=0)
    Easy_solved = models.IntegerField(default = 0)
    Medium_solved = models.IntegerField(default = 0)
    Hard_solved = models.IntegerField(default = 0)
    email = models.EmailField(max_length=100,unique=True)
    username = models.CharField(max_length = 20)
    first_name = models.CharField(max_length = 20)
    last_name = models.CharField(max_length = 20)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    
    objects = UserManager()
    
    def __str__(self):
        return f'{self.username}'
    
    


