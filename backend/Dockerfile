FROM python:3.10

WORKDIR /code

COPY /requirements.in /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY /src /code/backend/src

CMD ["uvicorn", "backend.src.main:app", "--host", "0.0.0.0", "--port", "8080"]
