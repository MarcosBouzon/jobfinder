import json
from datetime import datetime

from app.scrapper.models import Jobs, Settings
from flask import request
from flask.views import MethodView
from mongoengine.queryset.visitor import Q


class HomeView(MethodView):
    """Home view"""

    def get(self):
        """http get request"""

        jobs = Jobs.objects(applied=False, deleted=False).order_by(
            "platform", "company", "-created"
        )

        return json.dumps({"jobs": [job.serialize() for job in jobs]})


class AppliedView(MethodView):
    """Applied Jobs view"""

    def get(self):
        jobs = Jobs.objects(applied=True, deleted=False).order_by("-applied_date")

        return json.dumps({"jobs": [job.serialize() for job in jobs]})


class MarkSeen(MethodView):
    """Mark Jobs as seen"""

    def patch(self, job_id):
        job = Jobs.objects(id=job_id).first()
        job.seen = True
        job.save()

        return {"data": "success", "job": job.serialize()}


class MarkApplied(MethodView):
    """Mark Jobs as applied"""

    def patch(self, job_id):
        job = Jobs.objects(id=job_id).first()
        job.applied = True
        job.applied_date = datetime.today()
        job.save()

        return {"data": "success", "job": job.serialize()}


class MarkDeleted(MethodView):
    """Delete a Job"""

    def delete(self, job_id):
        job = Jobs.objects(id=job_id).first()
        job.deleted = True
        job.save()

        return {"data": "success", "job": job.serialize()}


class JobSearch(MethodView):
    """Search for job with given keywords"""

    def get(self):
        title = request.args.get("title", None)
        company = request.args.get("company", None)

        if title and company:
            jobs_list = Jobs.objects(
                Q(title__icontains=title)
                & Q(company__icontains=company)
                & Q(applied=True)
            ).order_by("-applied_date", "company")
        elif title:
            jobs_list = Jobs.objects(title__icontains=title, applied=True).order_by(
                "-applied_date", "company"
            )
        elif company:
            jobs_list = Jobs.objects(company__icontains=company, applied=True).order_by(
                "-applied_date", "company"
            )
        else:
            jobs_list = Jobs.objects(applied=True, deleted=False).order_by(
                "-applied_date"
            )

        return [j.serialize() for j in jobs_list]


class MarkUndeleted(MethodView):
    """Marks a job as undeleted"""

    def patch(self, job_id):
        job = Jobs.objects(id=job_id).first()
        job.deleted = False
        job.save()

        return {"data": "success", "job": job.serialize()}


class SettingsView(MethodView):
    """View for settings"""

    def get(self):
        try:
            settings: Settings = Settings.objects.first()
            return settings.serialize()
        except AttributeError:
            return {}

    def post(self):
        li_at = request.form.get("li_at", "")
        li_rm = request.form.get("li_rm", "")
        jsessionid = request.form.get("jsessionid", "")
        session_expires = request.form.get("session_expires", "")
        job_title = request.form.get("job-title", "")
        keywords = request.form.get("keywords", "")
        on_site = request.form.get("onsite", False)
        hybrid = request.form.get("hybrid", False)
        remote = request.form.get("remote", False)
        night_search = request.form.get("night-search", False)
        weekend_search = request.form.get("weekend-search", False)
        delete_old = request.form.get("delete-old", False)
        delete_on_search = request.form.get("delete-on-search", False)

        if jsessionid:
            colons = jsessionid.count(":")
            if colons > 1:
                jsessionid = jsessionid.split(":", maxsplit=1)[1]
            jsessionid = jsessionid.strip('"')
        if session_expires:
            colons = session_expires.count(":")
            if colons > 2:
                session_expires = session_expires.split(":", maxsplit=1)[1]
            session_expires = session_expires.strip('"')
            session_expires = session_expires.replace("GMT", "").strip()
            session_expires = datetime.strptime(
                session_expires, "%a, %d %b %Y %H:%M:%S"
            )
        if li_at:
            li_at = li_at.split(":")[1].strip('"')
        if li_rm:
            li_rm = li_rm.split(":")[1].strip('"')

        _settings = {
            "li_at": li_at,
            "li_rm": li_rm,
            "jsessionid": jsessionid,
            "session_expires": session_expires,
            "job_title": job_title,
            "keywords": keywords,
            "on_site": bool(on_site),
            "hybrid": bool(hybrid),
            "remote": bool(remote),
            "night_search": bool(night_search),
            "weekend_search": bool(weekend_search),
            "delete_old": bool(delete_old),
            "delete_on_search": bool(delete_on_search),
            "show_welcome": False,
        }

        settings: Settings = Settings.objects.first()
        if settings:
            if settings.jsessionid and jsessionid == "":
                _settings.pop("jsessionid")
            if settings.session_expires and session_expires == "":
                _settings.pop("session_expires")
            if settings.li_at and li_at == "":
                _settings.pop("li_at")
            if settings.li_rm and li_rm == "":
                _settings.pop("li_rm")
            if (
                not settings.jsessionid
                and jsessionid == ""
                or not settings.li_at
                and li_at == ""
                or not settings.li_rm
                and li_rm == ""
            ):
                _settings["show_welcome"] = True

            settings.update(**_settings)
        else:
            _settings["show_welcome"] = True
            settings = Settings(**_settings)
            settings.save()

        return {"status": "success", "data": settings.serialize()}


class HealthCheck(MethodView):
    """Health check view used for container health checks"""

    def get(self):
        return {"status": "success"}, 200
