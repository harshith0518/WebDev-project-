from django.shortcuts import render, redirect
from .forms import TestFileForm

def upload_file_view(request):
    if request.method == 'POST':
        form = TestFileForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return render(request, 'testfile.html', {'file': form.instance.file})
    else:
        form = TestFileForm()
        return render(request, 'upload.html', {'form': form})