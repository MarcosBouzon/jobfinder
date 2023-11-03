from celery import Celery, Task
from flask import Flask


def celery_init_app(app: Flask) -> Celery:
    class FlaskTask(Task):
        def __call__(self, *args: object, **kwargs: object) -> object:
            with app.app_context():
                return self.run(*args, **kwargs)

    celery_app = Celery(app.name, task_cls=FlaskTask)
    celery_app.config_from_object(app.config["CELERY"])
    celery_app.set_default()
    app.extensions["celery"] = celery_app
    celery_app.autodiscover_tasks(["app.scrapper"])

    ###### Declare Periodic Tasks ######
    celery_app.conf.beat_schedule = {
        "get_linkedin_jobs": {
            "task": "app.scrapper.tasks.get_linkedin_jobs",
            "schedule": (60 * 60) * 2,  # every two hours
        },
        "delete_old_jobs": {
            "task": "app.scrapper.task.delete_old_jobs",
            "schedule": (60 * 60) * 24,  # every 24h
        },
    }

    return celery_app