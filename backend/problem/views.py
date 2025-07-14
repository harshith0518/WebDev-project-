from django.contrib import messages
from problem.models import Problem,Solution,Testcase
from problem.serializers import ProblemsListSerializer,getProblemSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
import os
import time
import uuid
import subprocess
import traceback

class ProblemsListAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        problems = Problem.objects.all()
        serializer = ProblemsListSerializer(problems, many=True)
        return Response(serializer.data)


class getProblem(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self,request,id):
        problem = Problem.objects.get(id = id)
        serializer = getProblemSerializer(problem)
        return Response(serializer.data)


class RunCodeAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
            lang = request.data.get("language")
            code = request.data.get("code")
            input_data = request.data.get("input_data", "")
            return run_code(lang,input_data,code)
        





def run_code(lang,input_data,code):
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
                return Response({"error": "Unsupported language"}, status=400)
            
            if compile_cmd:
                with open(output_file_path, "w") as compile_out:
                    result = subprocess.run(
                        compile_cmd,
                        stderr=compile_out,
                        stdout=compile_out,
                        cwd=temp_dir
                    )
                if result.returncode != 0:
                    if result.returncode == 139 or -1073741819:
                        verdict = "Segmentation Fault"
                    else:
                        verdict = "Runtime Error"

                    with open(output_file_path, "r") as f:
                        output_data = f.read()
                    return Response({
                        "output_data": output_data,
                        "verdict": verdict,
                        "runtime": None
                    }, status=200)
            if lang == "py":
                run_cmd = ["python", filepath]
            else:
                run_cmd = [os.path.join(temp_dir, unique_id + ".exe")]
            start_time = time.time()
            try:
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
                return Response({
                    "output_data": output_data,
                    "verdict": verdict,
                    "runtime": runtime
                }, status=200)

            # 7. Read and return output
            with open(output_file_path, "r") as f:
                output_data = f.read()

            return Response({
                "output_data": output_data,
                "verdict": verdict,
                "runtime": runtime
            }, status=200)

        except Exception as e:
            print("🔥 Exception occurred:")
            traceback.print_exc()
            return Response({"error": str(e)}, status=500)