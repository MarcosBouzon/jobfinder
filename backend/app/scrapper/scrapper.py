import json
import locale
import re

import mongoengine as me
import requests
from app.scrapper import utils
from app.scrapper.models import Jobs, Settings

JOBS_TO_RETRIEVE = 100
JOB_ON_SITE = 1
JOB_HYBRID = 3
JOB_REMOTE = 2


class LinkedinScrapper:
    def __init__(self) -> None:
        self.li_at = "AQEDARTFYJMFXQr4AAABi15ExFIAAAGLtAwSbVYASlcoSF7Uf7QdiWza-UtfUONDSj09VcdmSv_0P_mXTLsP47Kug0LpokEV05ODq1H7HnPm6O1T44HQQKBkRMpWNHIPYO8YaoWTPel1jMwLt2FGPZLF"
        self.li_rm = "AQGbg1qZjHtjwQAAAYpSfS-hCBXt3fAZVAijH7p3aFOeI-RG5xCOA2U4YA6b3JQdb38Pe2MNPJeSO5NaznxvmDAt_jxGZCy9W5NNY0LW8R1661CNryiO9bVF_5dC3hvUzRdv4beB0juHC5NtLlE8HBViMJIYuzcQYJc0ZCkSrfLrUg54r3wT1nHvVPbzdgDa8Ae3UmmiFt1NZkiaXy8rGQPrczwJDYHjP4Djb89mZqbjrB6ftwPYQxVpmXLH6M-oserSCaQzdL_Jo8Z3Rv3sEYKAzR0160_1nhDJkPHL9rOOSr3LqhKpUNS1fqrwrp5UdvcAIbkIm0gn6ykB6VI"
        self.jsessionid = "ajax:0333426129146352671"
        self.headers = {
            "user-agent": "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/119.0",
        }
        locale.setlocale(locale.LC_ALL, "")

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
        url += f"selectedFilters:(timePostedRange:List(r86400),distance:List(25),workplaceType:List({JOB_REMOTE},{JOB_HYBRID})),"
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
                return
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
                min_salary = locale.currency(
                    float(compensation.get("minSalary")), grouping=True
                )
                max_salary = locale.currency(
                    float(compensation.get("maxSalary")), grouping=True
                )
                pay_period = compensation.get("payPeriod")

                if pay_period == "YEARLY":
                    min_salary = str(min_salary).split(",", maxsplit=1)[0]
                    max_salary = str(max_salary).split(",", maxsplit=1)[0]
                    salary = f"{min_salary}K/yr - {max_salary}K/yr"
                else:
                    salary = f"{min_salary}/h - {max_salary}h/h"

            # no salary in job post, it might be in the job description
            except TypeError:
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
            }

    def get_jobs(self):
        """Get jobs from LinkedIn"""

        from app import publish_message, reload_page

        publish_message(
            json.dumps(
                {
                    "title": "Automation",
                    "message": "Automatic jobs search has started!",
                    "success": True,
                }
            )
        )

        settings = Settings.objects.first()
        if settings.delete_on_search:
            from app.scrapper.tasks import delete_on_search

            delete_on_search.delay()

        job_ids = self.get_job_ids()
        for job_id in job_ids:
            job = self.get_job_details(job_id)
            applies = job.pop("applies")

            if int(applies) > 50:
                continue

            new_job = Jobs(**job)
            try:
                new_job.save()
            except me.errors.NotUniqueError:
                continue

        reload_page()
