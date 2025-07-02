from django.db import models
from django.conf import settings
# Create your models here.





class Problem(models.Model):
    problemTitle = models.CharField(max_length = 20)
    problemStatement = models.TextField()
    totalAccepted = models.IntegerField(default=0)
    totalRejected = models.IntegerField(default=0)
    difficultyLevel = models.CharField(max_length=10)   # only accepts the Easy,Medium ,Hard strings

    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,  # if the user account was deleted then we set this as no author exist.
        null = True,    # to replace author as NULL in db if the author's account was deleted.
        blank = True,   # to replace author as blank in the admin page.
        related_name='problems',
    )
    
    author_name = models.CharField(max_length=100, null=True, blank=True)   # author's name is stored permanently no matter what!
    
    def __str__(self):
        return f'{self.problemTitle}'
    
    
    def get_accuracy(self):
        if (self.totalAccepted+self.totalRejected == 0): return '100%'
        else: return f'{self.totalAccepted/(self.totalRejected+self.totalAccepted):.2f}%'




