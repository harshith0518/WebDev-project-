from rest_framework.serializers import ModelSerializer
from problem.models import Problem,Solution,ProblemSet
from user.serializers import forNavbarSerializer

class ProblemsListSerializer(ModelSerializer):
    class Meta:
        model = Problem
        fields = ['problemTitle','problemStatement','difficultyLevel','id','topics']
        
        
class getProblemSerializer(ModelSerializer):
    class Meta:
        model = Problem
        fields = '__all__'

class ProblemSetSerializer(ModelSerializer):
    class Meta:
        model = ProblemSet
        fields = ['problemSetTitle','difficultyLevel','topics','id']

class BasicProblemSerializer(ModelSerializer):
    class Meta:
        model = Problem
        fields = ['id', 'problemTitle','difficultyLevel']


class ProblemSetSerializerAllFields(ModelSerializer):
    problems = BasicProblemSerializer(many=True)
    class Meta:
        model = ProblemSet
        fields = '__all__'


class SolutionsSerializerList(ModelSerializer):
    user = forNavbarSerializer()
    problem = BasicProblemSerializer()
    class Meta:
        model = Solution
        fields = ['user','problem','verdict','success','id','submittedAt']


class SolutionDetailSerializer(ModelSerializer):
    class Meta:
        model = Solution
        fields = '__all__'




