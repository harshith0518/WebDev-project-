from django.db import models
from django.contrib.auth.models import AbstractUser
from .manager import UserManager


class CustomUser(AbstractUser):
    email = models.EmailField(max_length=100, unique=True)
    username = models.CharField(max_length=20, blank=True, null=True)
    first_name = models.CharField(max_length=20, blank=True)
    last_name = models.CharField(max_length=20, blank=True)
    Score = models.IntegerField(default=0)
    Easy_solved = models.IntegerField(default=0)
    Medium_solved = models.IntegerField(default=0)
    Hard_solved = models.IntegerField(default=0)
    date_joined = models.DateTimeField(auto_now_add=True)
    profile_pic = models.ImageField(upload_to="profile_pics/", blank=True, null=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = [] 
    objects = UserManager()

    def __str__(self):
        return self.email
