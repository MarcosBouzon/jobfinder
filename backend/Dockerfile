FROM python:3.11

LABEL mantainer="MarcosBouzon1@gmail.com"

RUN mkdir -p /jobfinder/

RUN apt-get update
RUN apt-get install -y locales locales-all
ENV LC_ALL en_US.UTF-8
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US.UTF-8

ENV LANG en_US.UTF-8
ENV LC_NUMERIC en_US.UTF-8

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