FROM python:3.11

LABEL mantainer="MarcosBouzon1@gmail.com"

# Run updates and install required packages
RUN apt-get -y update && \
    apt-get -y upgrade && \
    apt-get -y install nano
RUN apt-get install -y locales locales-all

# Setup locales
ENV TZ=America/New_York
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US.UTF-8
ENV LC_ALL en_US.UTF-8
ENV LC_NUMERIC en_US.UTF-8

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Copy files
RUN mkdir -p /jobfinder/
COPY ./app /jobfinder/app
COPY ./app.py /jobfinder/app.py
COPY ./requirements.txt /jobfinder/requirements.txt

WORKDIR /jobfinder

RUN pip install -r requirements.txt