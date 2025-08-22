from django.db import models

# Create your models here.

class TestFile(models.Model):
    name = models.CharField(max_length=255)
    file = models.FileField(upload_to='test_files/')
    
    def __str__(self):
        return self.name