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
        self.logger = logging.getLogger("logger")

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

    def get_job_details(self, job_id: int = None) -> dict:
        """Get job details from LinkedIn voyager API

        Args:
        - job_id: Job id to get details for.

        Retruns: A dict with all the job details.
        """

        url = f"https://www.linkedin.com/voyager/api/jobs/jobPostings/{int(job_id)}?"
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
                self.logger.error(
                    "LinkedIn API is not responding code: %s", response.status_code
                )
                return {}
            response_dict = response.json()

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
                try:
                    company = (
                        response_dict.get("companyDetails")
                        .get("com.linkedin.voyager.jobs.JobPostingCompanyName")
                        .get("companyName")
                    )
                except AttributeError:
                    company = ""

            try:
                compensation = response_dict.get("salaryInsights").get(
                    "compensationBreakdown"
                )
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
                    if median_salary:
                        salary = f"{median_salary}/h"
                    else:
                        salary = f"{min_salary}/h - {max_salary}/h"

            # no salary in job post, it might be in the job description
            except TypeError:
                self.logger.info("Failed to get salary info from job id: %s", job_id)
                # salary = utils.get_salary_from_description(description)
                salary = ""

            return {
                "job_id": job_id,
                "title": response_dict.get("title"),
                "salary": salary,
                "link": f"https://www.linkedin.com/jobs/view/{int(job_id)}/",
                "company": company,
                "platform": "LinkedIn",
                "applies": response_dict.get("applies"),
                "description": response_dict.get("description").get("text"),
            }

    def process_job(self, details: dict = None) -> Jobs | None:
        """Process a job. The details dictionary should have the following keys:
        - job_id: The job id.
        - title: The job title.
        - salary: The job salary.
        - link: The job link.
        - company: The job company.
        - platform: The job platform.
        - applies: The job applies.
        - description: The job description.

        Args:
            details (dict, optional): Dict containing the job details. Defaults to {}.

        Returns: An instance of Jobs class if the job was saved, or None if the job wasn't
        saved.
        """

        if not details:
            details = {}

        try:
            applies = details.pop("applies")
            description = details.pop("description")

            if int(applies) > 50:
                return None
            if not utils.is_match(description):
                return None

            new_job = Jobs(**details)
            try:
                new_job.save()
                return new_job
            except me.errors.NotUniqueError:
                return None
        except AttributeError as e:
            logger = logging.getLogger("logger")
            logger.error("get_jobs() error when processing job details. Error: %s", e)
            return None

    def get_jobs(self) -> tuple[int, int]:
        """Get jobs from LinkedIn

        Returns: A tuple containing the number of jobs added and the number of jobs
        duplicated. The tuple is (jobs_added, jobs_duplicated).
        """

        from app import publish_message, reload_page

        settings = Settings.objects.first()
        today = datetime.today()
        now = datetime.now()

        # avoid searching in weekends if setting is off
        if not settings.weekend_search and today.weekday() in (5, 6):
            return 0, 0
        # avoid searching in night time if setting is off
        if not settings.night_search and now.hour >= 20:
            return 0, 0
        if not settings.li_at or not settings.li_rm or not settings.jsessionid:
            return 0, 0

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

        jobs_counter = 0
        duplicated_counter = 0
        job_ids = self.get_job_ids()

        for job_id in job_ids:
            job_details = self.get_job_details(job_id)
            job = self.process_job(job_details)

            if job:
                jobs_counter += 1
            else:
                duplicated_counter += 1

        reload_page()
        return jobs_counter, duplicated_counter
