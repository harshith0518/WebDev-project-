FROM python:3.13.5-slim

WORKDIR /app
COPY . .
RUN python -m ensurepip && \
    python -m pip install --upgrade pip==25.1.1
RUN pip install -r requirements.txt


EXPOSE 8000
CMD ["python","manage.py","runserver","0.0.0.0:8000"]