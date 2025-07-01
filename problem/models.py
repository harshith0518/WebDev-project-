from django.db import models

# Create your models here.





class Problem(models.Model):
    problemTitle = models.CharField(max_length = 20)
    problemStatement = models.TextField()
    totalAccepted = models.IntegerField(default=0)
    totalRejected = models.IntegerField(default=0)
    difficultyLevel = models.CharField(max_length=10)   # only accepts the Easy,Medium ,Hard strings
    
    def __str__(self):
        return f'{self.problemTitle}'
    




