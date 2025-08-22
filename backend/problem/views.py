from problem.models import Problem,Solution,Testcase,ProblemSet
from problem.serializers import ProblemsListSerializer,getProblemSerializer,ProblemSetSerializer,ProblemSetSerializerAllFields,SolutionsSerializerList,SolutionDetailSerializer
from problem.utils import run_code,compile_code
from django.core.files.base import ContentFile
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser,FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
import os,zipfile,shutil,traceback,uuid


class ProblemsListAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        problems = Problem.objects.all()
        serializer = ProblemsListSerializer(problems, many=True)
        return Response(serializer.data)


class getProblemSetsAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        problemSets = ProblemSet.objects.all()
        serializer = ProblemSetSerializer(problemSets, many=True)
        return Response(serializer.data)

class getProblemSetAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request,id):
        problemSet = ProblemSet.objects.get(id = id)
        serializer = ProblemSetSerializerAllFields(problemSet)
        return Response(serializer.data)



class addProblemSetAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        title = request.data.get('problemSetTitle')
        difficulty = request.data.get('difficultyLevel')
        topics = request.data.get('topics')
        problem_ids = request.data.get('problemIds')

        if not title or not difficulty or not topics or not problem_ids:
            return Response({"error": "All fields are required."}, status=400)
        try:
            problems = Problem.objects.filter(id__in=problem_ids)
            if problems.count() != len(problem_ids):
                return Response({"error": "Some problem IDs are invalid."}, status=400)
            problem_set = ProblemSet.objects.create(
                problemSetTitle=title,
                difficultyLevel=difficulty,
                topics=topics
            )
            problem_set.problems.set(problems)
            problem_set.save()
            return Response({
                "message": "ProblemSet created successfully",
                "id": problem_set.id,
                "title": problem_set.problemSetTitle,
                "difficulty": problem_set.difficultyLevel,
                "topics": problem_set.topics,
                "problems": [p.id for p in problems]
            }, status=201)

        except Exception as e:
            return Response({"error": str(e)}, status=500)

class AddProblemAPIView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            zip_file = request.FILES.get('testcases')
            if not zip_file:
                return Response({'error': 'Zip file not provided.'}, status=400)

            problem = Problem.objects.create(
                problemTitle=request.data.get('problemTitle'),
                problemStatement=request.data.get('problemStatement'),
                constraints=request.data.get('constraints'),
                sample_testcase_INP=request.data.get('sample_testcase_INP'),
                sample_testcase_OUT=request.data.get('sample_testcase_OUT'),
                timeLimit = request.data.get('timeLimit'),
                memoryLimit = request.data.get('memoryLimit'),
                topics = request.data.get('topics'),
            )

            temp_dir = f'temp_testcases_problem_{problem.id}'
            os.makedirs(temp_dir, exist_ok=True)

            with zipfile.ZipFile(zip_file, 'r') as zip_ref:
                zip_ref.extractall(temp_dir)

            root_items = os.listdir(temp_dir)
            extracted_root = temp_dir
            if len(root_items) == 1:
                possible_folder = os.path.join(temp_dir, root_items[0])
                if os.path.isdir(possible_folder):
                    extracted_root = possible_folder
            cnt=0
            for folder in sorted(os.listdir(extracted_root)):
                cnt+=1
                folder_path = os.path.join(extracted_root, folder)
                if os.path.isdir(folder_path):
                    input_path = os.path.join(folder_path, 'input.txt')
                    output_path = os.path.join(folder_path, 'output.txt')
                    if os.path.exists(input_path) and os.path.exists(output_path):
                        with open(input_path, 'rb') as inp_file, open(output_path, 'rb') as out_file:
                            Testcase.objects.create(
                                problem=problem,
                                input_file=ContentFile(inp_file.read(), name=f'pb{problem.id}_tc{cnt}_input.txt'),
                                output_file=ContentFile(out_file.read(), name=f'pb{problem.id}_tc{cnt}_output.txt')
                            )
            shutil.rmtree(temp_dir)
            return Response({'message': 'Problem created successfully'}, status=201)
        except Exception as e:
            print('Internal Server Error:', str(e))
            return Response({'error': 'Server error', 'details': str(e)}, status=500)


class getProblem(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request, id):
        problem = Problem.objects.get(id=id)
        serializer = getProblemSerializer(problem)
        return Response(serializer.data)


class getSolutionsListAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self,request):
        solutions = Solution.objects.all()
        serializer = SolutionsSerializerList(solutions,many = True)
        return Response(serializer.data)


class getUserSolutionsAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request, id):
        try:
            solutions = Solution.objects.filter(user__id=id).select_related("user", "problem")
            serializer = SolutionsSerializerList(solutions, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=500)

class getMyProblemSubmissionsAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self,request,id):
        try:
            solutions = Solution.objects.filter(user = request.user,problem__id = id).select_related("user","problem")
            serializer = SolutionsSerializerList(solutions,many = True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error':str(e)},status=500)
    
class ShowSolutionDetailAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request, id):
        try:
            solution = Solution.objects.get(id=id)
        except Solution.DoesNotExist:
            return Response({"error": "Solution not found"}, status=404)

        serializer = SolutionDetailSerializer(solution)
        return Response(serializer.data)

class getLatestCodeAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self,request,id):
        try:
            problem = Problem.objects.get(id=id)
            latestCode = problem.latestCode.get(language = request.data.get('language')).code
            return latestCode
        except Exception as e:
            return Response({'error':str(e)},status=404)

class SubmitCodeAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request, id):
        try:
            problem = Problem.objects.get(id=id)
        except Problem.DoesNotExist:
            return Response({'verdict': 'Problem not found.', 'success': False}, status=404)
        code = request.data.get('code')
        lang = request.data.get('language')
        if not code:
            return Response({'verdict': 'Code is required.', 'success': False}, status=400)
        solution = Solution.objects.create(
            user=request.user,
            problem=problem,
            code=code,
            language=lang,
        )

        compile_result = compile_code(lang, code)
        executable_path = compile_result.get('executable_path')
        if not compile_result['success']:
            solution.verdict = compile_result['verdict']
            solution.success = False
            solution.save()
            if executable_path and os.path.exists(executable_path):
                os.remove(executable_path)
            return Response({
                'verdict': solution.verdict,
                'success': False,
                'output_data': compile_result.get('output_data', ''),
                'submittedAt':solution.submittedAt,
            }, status=200)

        temp_dir = compile_result['temp_dir']
        counter = 0
        max_runtime = 0

        for testcase in problem.testcases.all():
            counter += 1
            try:
                testcase.input_file.seek(0)
                testcase.output_file.seek(0)
                with testcase.input_file.open("rb") as f:
                    input_data = f.read().decode()
                expected_output = testcase.output_file.open("rb").read().decode().strip()
                print(f"1.Running testcase {counter} with input: {input_data.strip()} and expected output: {expected_output.strip()}")
                run_result = run_code(lang, executable_path, input_file_path = None, temp_dir=temp_dir, input_data=input_data)
                if not run_result['success']:
                    solution.verdict = run_result['verdict']
                    solution.success = False
                    solution.save()
                    if executable_path and os.path.exists(executable_path):
                        os.remove(executable_path)
                    print(f"2.Testcase {counter} failed with verdict: {solution.verdict}")
                    return Response({
                        'verdict': solution.verdict,
                        'success': False,
                        'output_data': run_result.get('output_data', ''),
                        'submittedAt':solution.submittedAt,
                    }, status=200)

                actual_output = run_result.get('output_data', '').strip()
                runtime = run_result.get('runtime', 0)

                if actual_output != expected_output:
                    solution.verdict = f'Wrong Answer on testcase {counter}'
                    solution.success = False
                    solution.save()
                    if executable_path and os.path.exists(executable_path):
                        os.remove(executable_path)
                    print(f"3.Testcase {counter} failed with verdict: {solution.verdict}")
                    return Response({
                        'verdict': solution.verdict,
                        'success': False,
                        'submittedAt':solution.submittedAt,
                    }, status=200)

                max_runtime = max(max_runtime, runtime)

            except Exception as e:
                traceback.print_exc()
                solution.verdict = 'Internal Error'
                solution.success = False
                solution.save()
                if executable_path and os.path.exists(executable_path):
                        os.remove(executable_path)
                return Response({
                    'verdict': f'{solution.verdict} : {str(e)}',
                    'success': False,
                    'submittedAt':solution.submittedAt,
                }, status=500)

        if not Solution.objects.filter(problem=problem, user=request.user, success=True).exists():
            if problem.difficultyLevel == 'Easy':
                request.user.Score += 3
                request.user.Easy_solved += 1
            elif problem.difficultyLevel == 'Medium':
                request.user.Score += 5
                request.user.Medium_solved += 1
            else:
                request.user.Score += 10
                request.user.Hard_solved += 1
            request.user.save()
        solution.verdict = 'Accepted'
        solution.success = True
        solution.runtime = max_runtime
        solution.save()
        if executable_path and os.path.exists(executable_path):
            os.remove(executable_path)  # For localhost
            # os.remove(executable_path)  # For docker
        print(f"All testcases passed for problem {problem.id}. Verdict: {solution.verdict}, Runtime: {max_runtime}s")
        return Response({
            'verdict': 'Accepted',
            'runtime': max_runtime,
            'success': True,
            'submittedAt':solution.submittedAt,
        }, status=200)

class RunCodeAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        lang = request.data.get('language')
        code = request.data.get('code')
        input_data = request.data.get('input_data', '')
        compile_result = compile_code(lang, code)
        executable_path = compile_result.get('executable_path')
        if not compile_result['success']:
            # if executable_path and os.path.exists(executable_path):
                # os.remove(executable_path)  # For localhost
            return Response({
                'success':False,
                'verdict':"Compilation Error",
                'output_data':compile_result.get('output_data')
            },status=500)
        temp_dir = compile_result.get('temp_dir')
        unique_id = uuid.uuid4().hex
        input_file_path = os.path.join(temp_dir, f'{unique_id}_input.txt')
        try:
            with open(input_file_path, 'w') as f:
                f.write(input_data)
            run_result = run_code(lang, executable_path, input_file_path, temp_dir)
        except Exception as e:
            print(str(e))
            return Response({'success': False, 'verdict': 'Runtime Error','output_data':str(e)}, status=500)
        if executable_path and os.path.exists(executable_path):
            os.remove(executable_path)  # For localhost
            # os.remove(executable_path)  # For docker
        os.remove(input_file_path)
        return Response(run_result)