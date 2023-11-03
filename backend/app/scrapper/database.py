import os

from mongoengine import connect

if os.environ.get("stage") == "docker":
    host = "jf-mongodb"
else:
    host = "localhost"


def init_db():
    connect(
        "jobfinder",
        username="root",
        password="example",
        host=host,
        port=27017,
    )
