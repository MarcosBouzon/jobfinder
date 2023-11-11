import json
import locale
import logging
import re
from datetime import datetime

import mongoengine as me
import requests
from app.scrapper import utils
from app.scrapper.models import Jobs, Settings

JOBS_TO_RETRIEVE = 100
JOB_ON_SITE = 1
JOB_REMOTE = 2
JOB_HYBRID = 3


class LinkedinScrapper:
    def __init__(self) -> None:
        locale.setlocale(locale.LC_ALL, "en_US.utf8")
        settings: Settings = Settings.objects.first()

        self.headers = {
            "user-agent": "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/119.0",
        }
        self.workplace = []
        if settings.on_site:
            self.workplace.append(str(JOB_ON_SITE))
        if settings.hybrid:
            self.workplace.append(str(JOB_HYBRID))
        if settings.remote:
            self.workplace.append(str(JOB_REMOTE))
        if not self.workplace:
            self.workplace.append(str(JOB_REMOTE))
        self.li_at = settings.li_at
        self.li_rm = settings.li_rm
        self.jsessionid = settings.jsessionid

    def get_job_ids(self):
        """Get job ids from LinkedIn voyager API"""

        url = "https://www.linkedin.com/voyager/api/voyagerJobsDashJobCards?"
        url += "decorationId=com.linkedin.voyager.dash.deco.jobs.search.JobSearchCardsCollectionLite-56&"
        url += f"count={JOBS_TO_RETRIEVE}&"
        url += "q=jobSearch&"
        url += "query=("
        url += "origin:JOBS_HOME_SEARCH_BUTTON,"
        url += "keywords:python%20developer,"
        url += "locationUnion:(geoId:103644278),"
        url += f"selectedFilters:(timePostedRange:List(r86400),distance:List(25),workplaceType:List({','.join(self.workplace)})),"
        url += "spellCorrectionEnabled:true)&"
        url += "servedEventEnabled=false&"
        url += "start=0"

        with requests.session() as s:
            s.cookies["li_at"] = self.li_at
            s.cookies["li_rm"] = self.li_rm
            s.cookies["JSESSIONID"] = self.jsessionid
            s.headers = self.headers
            s.headers["csrf-token"] = s.cookies["JSESSIONID"].strip('"')
            response = s.get(url)
            response_dict = response.json()

            ids = []
            jobs = response_dict.get("elements")
            for job in jobs:
                card = job.get("jobCardUnion")
                job_id = card.get("jobPostingCard").get(
                    "preDashNormalizedJobPostingUrn"
                )
                try:
                    job_id = re.findall("\d+", job_id)[0]
                    ids.append(job_id)
                except IndexError:
                    pass

            return ids

    def get_job_details(self, _id):
        """Get job description from LinkedIn voyager API"""

        url = f"https://www.linkedin.com/voyager/api/jobs/jobPostings/{int(_id)}?"
        url += "decorationId=com.linkedin.voyager.deco.jobs.web.shared.WebFullJobPosting-65&"
        url += "topN=1"

        with requests.session() as s:
            s.cookies["li_at"] = self.li_at
            s.cookies["li_rm"] = self.li_rm
            s.cookies["JSESSIONID"] = self.jsessionid
            s.headers = self.headers
            s.headers["csrf-token"] = s.cookies["JSESSIONID"].strip('"')
            response = s.get(url, timeout=30)

            if not response.ok:
                print(
                    "WARNING: LinkedIn API is not responding! "
                    f"Response code: {response.status_code}"
                )
                return {}
            response_dict = response.json()

            job_id = _id
            title = response_dict.get("title")
            description = response_dict.get("description").get("text")
            try:
                company = (
                    response_dict.get("companyDetails")
                    .get(
                        "com.linkedin.voyager.deco.jobs.web.shared.WebJobPostingCompany"
                    )
                    .get("companyResolutionResult")
                    .get("name")
                )
            except AttributeError:
                company = (
                    response_dict.get("companyDetails")
                    .get("com.linkedin.voyager.jobs.JobPostingCompanyName")
                    .get("companyName")
                )
            applies = response_dict.get("applies")
            compensation = response_dict.get("salaryInsights").get(
                "compensationBreakdown"
            )

            try:
                compensation = compensation[0]
                median_salary = compensation.get("medianSalary", None)
                if not median_salary:
                    min_salary = locale.currency(
                        float(compensation.get("minSalary")), grouping=True
                    )
                    max_salary = locale.currency(
                        float(compensation.get("maxSalary")), grouping=True
                    )
                pay_period = compensation.get("payPeriod")

                if pay_period == "YEARLY":
                    if median_salary:
                        median_salary = locale.currency(
                            float(median_salary), grouping=True
                        )
                        salary = f"{median_salary}K/yr"
                    else:
                        min_salary = str(min_salary).split(",", maxsplit=1)[0]
                        max_salary = str(max_salary).split(",", maxsplit=1)[0]
                        salary = f"{min_salary}K/yr - {max_salary}K/yr"
                else:
                    salary = f"{min_salary}/h - {max_salary}/h"

            # no salary in job post, it might be in the job description
            except TypeError:
                logger = logging.getLogger("logger")
                logger.error("Error when getting salary info from job id: %d", job_id)
                # salary = utils.get_salary_from_description(description)
                salary = ""

            return {
                "job_id": job_id,
                "title": title,
                "salary": salary,
                "link": f"https://www.linkedin.com/jobs/view/{int(job_id)}/",
                "company": company,
                "platform": "LinkedIn",
                "applies": applies,
                "description": description,
            }

    def get_jobs(self):
        """Get jobs from LinkedIn"""

        from app import publish_message, reload_page

        settings = Settings.objects.first()
        today = datetime.today()
        now = datetime.now()

        # avoid searching in weekends if setting is off
        if not settings.weekend_search and today.weekday() in (5, 6):
            return
        # avoid searching in night time if setting is off
        if not settings.night_search and now.hour >= 20:
            return
        if not settings.li_at or not settings.li_rm or not settings.jsessionid:
            return

        publish_message(
            json.dumps(
                {
                    "title": "Automation",
                    "message": "Automatic jobs search has started!",
                    "success": True,
                }
            )
        )

        if settings.delete_on_search:
            from app.scrapper.tasks import delete_on_search

            delete_on_search.delay()

        job_ids = self.get_job_ids()
        for job_id in job_ids:
            job = self.get_job_details(job_id)

            try:
                applies = job.pop("applies")
                description = job.pop("description")

                if int(applies) > 50:
                    continue
                if not utils.is_match(description):
                    continue

                new_job = Jobs(**job)
                try:
                    new_job.save()
                except me.errors.NotUniqueError:
                    continue
            except AttributeError:
                pass

        reload_page()
