import json
import os
import time
from datetime import datetime

import mongoengine as me
from app.scrapper import utils
from app.scrapper.models import Jobs, Settings
from selenium import webdriver
from selenium.common.exceptions import ElementClickInterceptedException
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait


class LinkedinScrapper:
    def __init__(self) -> None:
        self.options = utils.set_options()
        if os.environ.get("stage") == "docker":
            self.driver = webdriver.Remote(
                command_executor="http://jf-selenium:4444/wd/hub", options=self.options
            )
        else:
            self.driver = webdriver.Firefox(options=self.options)
        self.actions = webdriver.ActionChains(driver=self.driver)
        self.wait = WebDriverWait(self.driver, 10)
        self.keys = webdriver.Keys()
        self.driver.execute_script(
            "Object.defineProperty(navigator, 'webdriver', {get: () => undefined})"
        )

    def get_linkedin_jobs(self):
        """Get jobs from LinkedIn"""

        settings = Settings.objects.first()
        today = datetime.today()
        now = datetime.now()

        # anounce event to client
        from app import publish_message
        from app.scrapper.tasks import delete_on_search

        publish_message(
            json.dumps(
                {
                    "title": "Notice",
                    "message": "Jobs search has started, check for new jobs soon",
                    "success": True,
                }
            )
        )

        # avoid searching in weekends if setting is off
        if not settings.weekend_search and today.weekday() in (5, 6):
            return
        # avoid searching in night time if setting is off
        if not settings.night_search and now.hour >= 20:
            return
        if not settings.link_username or not settings.link_password:
            return

        # delete jobs previous to search if setting enabled
        delete_on_search.delay()

        # login
        self.driver.get("https://www.linkedin.com/login")
        self.driver.implicitly_wait(10)
        utils.login(self.driver)

        # go to jobs page
        self.driver.get("https://www.linkedin.com/jobs")
        self.driver.implicitly_wait(10)

        utils.search_jobs(self.driver, self.actions, self.keys, self.wait)
        pages = utils.get_job_pages(self.driver)

        if pages:
            last_page = pages[::-1][0].get_attribute("data-test-pagination-page-btn")
            current_page = 1
            while current_page <= int(last_page):
                pages = utils.get_job_pages(self.driver)
                for page in pages:
                    page_number = page.get_attribute("data-test-pagination-page-btn")
                    try:
                        if current_page == int(page_number):
                            page_btn = page.find_element(By.TAG_NAME, "button")
                            page_btn.click()
                            time.sleep(5)
                            self._get_jobs_list()
                            break
                    except TypeError:
                        # this is the ... button that shows more pages
                        if current_page == 36:
                            pass
                        if page.id == pages[::-1][1].id:
                            page_btn = page.find_element(By.TAG_NAME, "button")
                            page_btn.click()
                            time.sleep(5)
                            break
                current_page += 1
        else:
            self._get_jobs_list()
        self.driver.close()

    def _get_jobs_list(self):
        # get jobs list
        jobs_list = utils.get_jobs(self.driver)

        self.driver.implicitly_wait(5)
        for job in jobs_list:
            try:
                job.click()
                time.sleep(3)
            except ElementClickInterceptedException:
                continue

            applicants = utils.get_applicants(self.driver)
            if applicants > 50:
                continue

            job_id = utils.get_job_id(job)
            title = (
                job.find_element(By.CLASS_NAME, "artdeco-entity-lockup__title")
                .find_element(By.TAG_NAME, "a")
                .text
            )
            salary = utils.get_salary(job)
            link = "https://www.linkedin.com/jobs/view/" + str(job_id)
            company = job.find_element(
                By.CLASS_NAME, "job-card-container__primary-description"
            ).text
            platform = "LinkedIn"
            job_description = self.driver.find_element(
                By.CLASS_NAME, "jobs-description"
            )
            if not salary or salary == "":
                salary = utils.get_salary_from_description(job_description)
            is_match = utils.is_match(job_description)
            if is_match:
                job = Jobs(
                    job_id=job_id,
                    title=title,
                    salary=salary,
                    link=link,
                    company=company,
                    platform=platform,
                )
                try:
                    job.save()
                # job already exist
                except me.errors.NotUniqueError:
                    continue
                except me.errors.ValidationError:
                    continue
