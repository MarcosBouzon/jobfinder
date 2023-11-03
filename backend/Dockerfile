FROM python:3.11

LABEL mantainer="MarcosBouzon1@gmail.com"

RUN mkdir -p /jobfinder/

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1


# Copy files
COPY ./app /jobfinder/app
COPY ./app.py /jobfinder/app.py
COPY ./requirements.txt /jobfinder/requirements.txt

# Run updates
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install nano -y

WORKDIR /jobfinder

RUN pip install -r requirements.txt