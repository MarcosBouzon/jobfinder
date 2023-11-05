"""Main flask definition"""

import os

from app.scrapper import scrapper_bp
from app.scrapper.database import init_db
from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO

from .celery import celery_init_app

if os.environ.get("stage") == "docker":
    REDIS_BROKER = "redis://jf-redis:6379"
    SOCKET_ORIGIN = "http://localhost:9090"
else:
    REDIS_BROKER = "redis://localhost:6379"
    SOCKET_ORIGIN = "http://localhost:5173"

app = Flask(__name__)
socketio = SocketIO(
    app,
    cors_allowed_origins=SOCKET_ORIGIN,
    message_queue=REDIS_BROKER,
    async_mode="threading",
)
CORS(app)

# config
app.config[
    "SECRET_KEY"
] = "0ec574c02af44e688a82f3b6ba1c550a44b05aca19262892c149f8beb9af7462"
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.config["CELERY"] = {
    "broker_url": REDIS_BROKER,
    "result_backend": REDIS_BROKER,
    "task_always_eager": False,
    "broker_connection_retry_on_startup": True,
}
app.config["CORS_ORIGINS"] = "http://localhost"
app.config["CORS_SEND_WILDCARD"] = True

# register blueprints
app.register_blueprint(scrapper_bp)

# init db
init_db()

# init celery
celery = celery_init_app(app)


def publish_message(message: str) -> None:
    socketio.emit("notification", message)


def reload_page() -> None:
    socketio.emit("reload_page")
