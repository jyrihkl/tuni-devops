FROM python:3.9-slim

RUN apt-get update && apt-get install -y procps

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY service1.py .

EXPOSE 8199

CMD ["python", "service1.py"]
