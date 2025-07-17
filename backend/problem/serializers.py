from rest_framework.serializers import ModelSerializer
from problem.models import Problem,Solution,ProblemSet
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from user.serializers import forNavbarSerializer
User = get_user_model()

class ProblemsListSerializer(ModelSerializer):
    class Meta:
        model = Problem
        fields = ['problemTitle','problemStatement','difficultyLevel','id']
        
        
class getProblemSerializer(ModelSerializer):
    class Meta:
        model = Problem
        fields = '__all__'

class ProblemSetSerializer(ModelSerializer):
    class Meta:
        model = ProblemSet
        fields = ['problemSetTitle','difficultyLevel','topics','id']

class ProblemSerializer(ModelSerializer):
    class Meta:
        model = Problem
        fields = ['id', 'problemTitle','difficultyLevel']


class ProblemSetSerializerAllFields(ModelSerializer):
    problems = ProblemSerializer(many=True)
    class Meta:
        model = ProblemSet
        fields = '__all__'
        

class SolutionsSerializerList(ModelSerializer):
    user = forNavbarSerializer()
    problem = ProblemSerializer()
    class Meta:
        model = Solution
        fields = ['user','problem','verdict','success','id','submittedAt']


class SolutionDetailSerializer(ModelSerializer):
    class Meta:
        model = Solution
        fields = '__all__'




