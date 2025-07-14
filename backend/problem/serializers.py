from rest_framework.serializers import ModelSerializer
from problem.models import Problem,Solution,Testcase

class ProblemsListSerializer(ModelSerializer):
    class Meta:
        model = Problem
        fields = ['problemTitle','problemStatement','difficultyLevel','id']
        
        
class getProblemSerializer(ModelSerializer):
    class Meta:
        model = Problem
        fields = '__all__'






