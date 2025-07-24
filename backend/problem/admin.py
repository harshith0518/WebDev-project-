from django.contrib import admin
from problem.models import Problem,Solution,Testcase,ProblemSet,LatestCodeForProblem
# Register your models here.


admin.site.register(Problem)
admin.site.register(Solution)
admin.site.register(Testcase)
admin.site.register(ProblemSet)
admin.site.register(LatestCodeForProblem)