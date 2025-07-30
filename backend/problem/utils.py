import os,uuid,subprocess,time
from django.conf import settings



def compile_code(lang, code):
    try:
        temp_dir = os.path.join(settings.MEDIA_ROOT, 'Outputfiles')
        os.makedirs(temp_dir, exist_ok=True)
        unique_id = uuid.uuid4().hex
        filename = f'{unique_id}.{lang}'
        filepath = os.path.join(temp_dir, filename)
        output_file_path = os.path.join(temp_dir, f'{unique_id}_compile_output.txt')

        with open(filepath, 'w') as f:
            f.write(code)

        if lang == 'c':
            compile_cmd = ['gcc', filename, '-o', unique_id]
        elif lang == 'cpp':
            compile_cmd = ['g++', filename, '-o', unique_id]
        elif lang == 'py':
            return {'success': True, 'executable_path': filepath, 'temp_dir': temp_dir}
        else:
            return {'success': False, 'verdict': 'Unsupported Language', 'error': 'Unsupported language'}

        with open(output_file_path, 'w') as compile_out:
            result = subprocess.run(
                compile_cmd,
                stderr=compile_out,
                stdout=compile_out,
                cwd=temp_dir
            )

        if result.returncode != 0:
            with open(output_file_path, 'r') as f:
                output_data = f.read()
            return {'success': False, 'output_data': output_data, 'verdict': 'Compilation Error'}

        return {
            'success': True,
            # 'executable_path': os.path.join(temp_dir, unique_id + '.exe'),  for the localhost
            'executable_path': os.path.join(temp_dir, unique_id),   #  for the docker
            'temp_dir': temp_dir
        }
    except Exception as e:
        return {'success': False, 'verdict': 'Internal Error', 'error': str(e)}


def run_code(lang, executable_path, input_file_path, temp_dir):
    try:
        unique_id = uuid.uuid4().hex
        output_file_path = os.path.join(temp_dir, f'{unique_id}_output.txt')
        if lang == 'py':
            run_cmd = ['python', executable_path]
        else:
            run_cmd = [executable_path]

        start_time = time.time()
        with open(input_file_path, 'r') as input_file, open(output_file_path, 'w') as output_file:
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

        with open(output_file_path, 'r') as f:
            output_data = f.read()
        os.remove(output_file_path)
        if result.returncode != 0:
            return {
                'success': False,
                'output_data': output_data,
                'verdict': 'Runtime Error',
                'runtime': runtime
            }
        return {
            'success': True,
            'output_data': output_data,
            'verdict': 'Successful execution',
            'runtime': runtime
        }

    except subprocess.TimeoutExpired:
        os.remove(output_file_path)
        return {
            'success': False,
            'output_data': '',
            'verdict': 'Time Limit Exceeded',
            'runtime': 2.0
        }
    except Exception as e:
        os.remove(output_file_path)
        return {
            'success': False,
            'output_data': '',
            'verdict': 'Internal Error',
            'runtime': None,
            'error': str(e)
        }