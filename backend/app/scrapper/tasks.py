import json
import logging
from datetime import datetime

from app.scrapper.models import Jobs, Settings
from app.scrapper.scrapper import LinkedinScrapper
from celery import shared_task


@shared_task
def get_linkedin_jobs():
    loggger = logging.getLogger("logger")
    loggger.info("Starting jobs search in LinkedIn!")
    start_time = datetime.now()

    linkedin = LinkedinScrapper()
    saved, duplicated = linkedin.get_jobs()

    end_time = datetime.now()
    loggger.info(
        "Search finished in LinkedIn. Jobs added: %s. Duplicated: %s. Execution time: %s",
        saved,
        duplicated,
        (end_time - start_time),
    )


@shared_task
def send_test_notification():
    from app import publish_message

    publish_message(
        json.dumps(
            {
                "title": "Test message",
                "message": "TEST MESSAGE FROM SERVER!",
                "success": True,
            }
        )
    )


@shared_task
def delete_old_jobs():
    """Delete jobs older than a 24 hours"""

    settings = Settings.objects.first()
    if settings.delete_old:
        from app import publish_message, reload_page

        publish_message(
            json.dumps(
                {
                    "title": "Automation",
                    "message": "Deleting jobs older than 24h according to settings!",
                    "warning": True,
                }
            )
        )

        loggger = logging.getLogger("logger")
        loggger.info("Starting automatic jobs deletion for jobs older than 24 hours!")
        today = datetime.today()
        jobs = Jobs.objects(applied=False, deleted=False)
        for job in jobs:
            if job.created < today.date():
                job.deleted = True
                job.save()
        reload_page()


@shared_task
def delete_on_search():
    """Delete non applied jobs before every new search"""

    settings = Settings.objects.first()
    if settings.delete_on_search:
        from app import publish_message, reload_page

        publish_message(
            json.dumps(
                {
                    "title": "Automation",
                    "message": "Deleting non applied jobs before search according to settings!",
                    "warning": True,
                }
            )
        )

        loggger = logging.getLogger("logger")
        loggger.info(
            "Starting automatic jobs deletion for non applied jobs before search!"
        )
        jobs = Jobs.objects(applied=False, deleted=False)
        for job in jobs:
            job.deleted = True
            job.save()
        reload_page()
