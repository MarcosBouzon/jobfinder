from app.scrapper import tasks
from flask import Blueprint

from . import views

scrapper_bp = Blueprint(
    "scrapper",
    __name__,
    static_folder="static",
    static_url_path="/scrapper/static",
    template_folder="templates",
    cli_group=None,
)

# urls
scrapper_bp.add_url_rule("/", view_func=views.HomeView.as_view("home"))
scrapper_bp.add_url_rule("/applied", view_func=views.AppliedView.as_view("applied"))
scrapper_bp.add_url_rule(
    "/markseen/<string:job_id>", view_func=views.MarkSeen.as_view("markseen")
)
scrapper_bp.add_url_rule(
    "/markapplied/<string:job_id>", view_func=views.MarkApplied.as_view("markapplied")
)
scrapper_bp.add_url_rule(
    "/deletejob/<string:job_id>", view_func=views.MarkDeleted.as_view("deletejob")
)
scrapper_bp.add_url_rule(
    "/undelete/<string:job_id>", view_func=views.MarkUndeleted.as_view("undelete")
)
scrapper_bp.add_url_rule("/searchjob", view_func=views.JobSearch.as_view("searchjob"))
scrapper_bp.add_url_rule("/settings", view_func=views.SettingsView.as_view("settings"))
scrapper_bp.add_url_rule("/health", view_func=views.HealthCheck.as_view("health"))


@scrapper_bp.cli.command("get_jobs")
def get_jobs():
    tasks.get_linkedin_jobs.delay()
    # tasks.get_linkedin_jobs()


@scrapper_bp.cli.command("send_test_message")
def send_test_message():
    tasks.send_test_notification.delay()


@scrapper_bp.cli.command("delete_old_jobs")
def delete_old_jobs():
    tasks.delete_old_jobs.delay()