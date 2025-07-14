from django.contrib import messages
from problem.models import Problem,Solution,Testcase
from problem.serializers import ProblemsListSerializer,getProblemSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser,FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
import os
import time
import uuid
import zipfile
import shutil
import subprocess
import traceback
import json
from django.conf import settings
from django.core.files.base import ContentFile

class ProblemsListAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        problems = Problem.objects.all()
        serializer = ProblemsListSerializer(problems, many=True)
        return Response(serializer.data)

import os
import shutil
import zipfile
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.core.files.base import ContentFile
from .models import Problem, Testcase

class AddProblemAPIView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            zip_file = request.FILES.get("testcases")
            if not zip_file:
                return Response({"error": "Zip file not provided."}, status=400)

            # Create Problem instance
            problem = Problem.objects.create(
                problemTitle=request.data.get("problemTitle"),
                problemStatement=request.data.get("problemStatement"),
                constraints=request.data.get("constraints"),
                sample_testcase_INP=request.data.get("sample_testcase_INP"),
                sample_testcase_OUT=request.data.get("sample_testcase_OUT"),
            )

            # Extract zip
            temp_dir = f"temp_testcases_problem_{problem.id}"
            os.makedirs(temp_dir, exist_ok=True)

            with zipfile.ZipFile(zip_file, 'r') as zip_ref:
                zip_ref.extractall(temp_dir)

            # Handle one extra root folder in zip
            root_items = os.listdir(temp_dir)
            extracted_root = temp_dir
            if len(root_items) == 1:
                possible_folder = os.path.join(temp_dir, root_items[0])
                if os.path.isdir(possible_folder):
                    extracted_root = possible_folder
            cnt=0
            # Traverse testcases inside extracted_root
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
                                input_file=ContentFile(inp_file.read(), name=f"pb{problem.id}_tc{cnt}_input.txt"),
                                output_file=ContentFile(out_file.read(), name=f"pb{problem.id}_tc{cnt}_output.txt")
                            )
            shutil.rmtree(temp_dir)
            return Response({"message": "Problem created successfully"}, status=201)
        except Exception as e:
            print("Internal Server Error:", str(e))
            return Response({"error": "Server error", "details": str(e)}, status=500)
        
        
class getProblem(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request, id):
        try:
            problem = Problem.objects.get(id=id)
        except Problem.DoesNotExist:
            return Response({"error": "Problem not found"}, status=404)

        serializer = getProblemSerializer(problem)
        return Response(serializer.data)
    
import traceback
import json
class SubmitCodeAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, id):
        problem = Problem.objects.get(id=id)
        code = request.data.get("code")
        lang = request.data.get("language")

        if not code:
            return Response({"error": "Code is required."}, status=400)

        counter = 0
        max_runtime = 0
        # print(f"Submitting code to Problem ID: {problem.id}, Lang: {lang}")

        for testcase in problem.testcases.all():
            counter += 1
            try:
                print(f"Testcase {counter}")
                print(f"input_file: {testcase.input_file}, output_file: {testcase.output_file}")
                testcase.input_file.seek(0)
                input_data = testcase.input_file.read().decode().strip()
                testcase.output_file.seek(0)
                expected_output = testcase.output_file.read().decode().strip()
                # print(f"📥 Input: {input_data}")
                # print(f"📤 Expected Output: {expected_output}")

                output = run_code(lang, input_data, code)
                actual_output = output.get("output_data", "").strip()
                runtime = output.get("runtime", 0)

                # print(f"🧾 Actual Output: {actual_output}")
                # print(f"⏱ Runtime: {runtime}s")

                if actual_output != expected_output:
                    return Response({
                        "verdict": f"Wrong Answer on testcase {counter}",
                        "success":False,
                    }, status=200)

                max_runtime = max(max_runtime, runtime)

            except Exception as e:
                print("🔥 Exception in testcase execution:")
                traceback.print_exc()
                return Response({
                    "error": "Code execution failed.",
                    "success":False,
                    "details": str(e),
                }, status=500)

        return Response({
            "verdict": "Accepted",
            "runtime": max_runtime,
            "success":True,
        }, status=200)

class RunCodeAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        lang = request.data.get("language")
        code = request.data.get("code")
        input_data = request.data.get("input_data", "")
        return Response(run_code(lang,input_data,code))



def run_code(lang, input_data, code):
    try:    
        curr_dir = os.getcwd()
        temp_dir = os.path.join(curr_dir, "TempExecution")
        os.makedirs(temp_dir, exist_ok=True)

        unique_id = uuid.uuid4().hex
        filename = f"{unique_id}.{lang}"
        filepath = os.path.join(temp_dir, filename)
        input_file_path = os.path.join(temp_dir, f"{unique_id}_input.txt")
        output_file_path = os.path.join(temp_dir, f"{unique_id}_output.txt")

        with open(filepath, "w") as f:
            f.write(code)
        with open(input_file_path, "w") as f:
            f.write(input_data)

        verdict = "Accepted"
        output_data = ""
        runtime = 0

        if lang == "c":
            compile_cmd = ["gcc", filename, "-o", unique_id]
        elif lang == "cpp":
            compile_cmd = ["g++", filename, "-o", unique_id]
        elif lang == "py":
            compile_cmd = None
        else:
            return {
                "output_data": "",
                "verdict": "Unsupported Language",
                "runtime": None,
                "error": "Unsupported language"
            }

        if compile_cmd:
            with open(output_file_path, "w") as compile_out:
                result = subprocess.run(
                    compile_cmd,
                    stderr=compile_out,
                    stdout=compile_out,
                    cwd=temp_dir
                )
            if result.returncode != 0:
                if result.returncode in [139, -1073741819]:
                    verdict = "Segmentation Fault"
                else:
                    verdict = "Runtime Error"

                with open(output_file_path, "r") as f:
                    output_data = f.read()
                return {
                    "output_data": output_data,
                    "verdict": verdict,
                    "runtime": None
                }

        if lang == "py":
            run_cmd = ["python", filepath]
        else:
            run_cmd = [os.path.join(temp_dir, unique_id + ".exe")]

        try:
            start_time = time.time()
            with open(input_file_path, "r") as input_file, open(output_file_path, "w") as output_file:
                result = subprocess.run(
                    run_cmd,
                    stdin=input_file,
                    stdout=output_file,
                    stderr=output_file,
                    timeout=2,
                    cwd=temp_dir
                )
            end_time = time.time()
            runtime = round(end_time - start_time, 3)
            if result.returncode != 0:
                verdict = "Runtime Error"
        except subprocess.TimeoutExpired:
            verdict = "Time Limit Exceeded"
            output_data = "Execution time exceeded limit."
            runtime = 2.0
            return {
                "output_data": output_data,
                "verdict": verdict,
                "runtime": runtime
            }

        with open(output_file_path, "r") as f:
            output_data = f.read()

        return {
            "output_data": output_data,
            "verdict": verdict,
            "runtime": runtime
        }

    except Exception as e:
        print("Exception occurred:")
        traceback.print_exc()
        return {
            "output_data": "",
            "verdict": "Internal Error",
            "runtime": None,
            "error": str(e)
        }
