"""Utils for the scrapper class"""

import re
import time

from selenium.common.exceptions import (
    ElementNotInteractableException,
    NoSuchElementException,
    StaleElementReferenceException,
)
from selenium.webdriver import ActionChains, Chrome, ChromeOptions, FirefoxOptions, Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.wait import WebDriverWait

from .models import Settings


def set_options() -> ChromeOptions:
    """Set options for the Chrome driver"""

    options = FirefoxOptions()
    options.add_argument("--start-maximized")
    options.add_argument("--disable-blink-features=AutomationControlled")
    # options.add_experimental_option("detach", True)
    # options.add_experimental_option("excludeSwitches", ["enable-automation"])
    # options.add_experimental_option("useAutomationExtension", False)
    # options.add_argument("disable-infobars")
    # options.add_argument("--disable-extensions")
    # options.add_argument("--disable-gpu")
    # options.add_argument("--disable-dev-shm-usage")
    # options.add_argument("--no-sandbox")
    # options.add_argument("--headless")
    # options.set_capability("browserVersion", "116")
    # options.binary_location = "/usr/bin/chromedriver"

    return options


def login(driver: Chrome = None) -> None:
    """Log into page

    Args:
        driver (Chrome): Instance of Chrome driver to use. Defaults to None.
    """

    email = driver.find_element(By.ID, "username")
    password = driver.find_element(By.ID, "password")
    signin_btn = driver.find_element(By.CLASS_NAME, "btn__primary--large")

    settings = Settings.objects.first()

    email.send_keys(settings.link_username)
    password.send_keys(settings.link_password)
    signin_btn.submit()
    time.sleep(15)


def search_jobs(
    driver: Chrome = None,
    actions: ActionChains = None,
    keys: Keys = None,
    wait: WebDriverWait = None,
) -> None:
    """Search for jobs with last 24 hours filters applied

    Args:
        driver (Chrome): Instance of Chrome driver to use. Defaults to None.
    """

    settings = Settings.objects.first()

    # search by title
    search_keyword = driver.find_element(
        By.CLASS_NAME, "jobs-search-box__input--keyword"
    )
    search_keyword = search_keyword.find_elements(By.TAG_NAME, "input")[0]
    search_keyword.send_keys(settings.job_title)
    actions.send_keys_to_element(search_keyword, keys.ENTER).perform()
    time.sleep(2)

    # filter by job location
    search_location = driver.find_element(By.ID, "searchFilter_workplaceType")
    search_location.click()
    time.sleep(1)

    if settings.on_site:
        on_site = driver.find_element(By.ID, "workplaceType-1")
        actions.click(on_site).perform()
        time.sleep(0.5)
    if settings.remote:
        remote = driver.find_element(By.ID, "workplaceType-2")
        actions.click(remote).perform()
        time.sleep(0.5)
    if settings.hybrid:
        hybrid = driver.find_element(By.ID, "workplaceType-3")
        actions.click(hybrid).perform()
        time.sleep(0.5)

    search_location.click()
    time.sleep(2)

    # filter by date posted, last 24 hours
    date_posted = wait.until(
        EC.element_to_be_clickable((By.ID, "searchFilter_timePostedRange"))
    )
    date_posted.click()
    past_24 = driver.find_elements(By.NAME, "date-posted-filter-value")[3]
    actions.click(past_24).perform()
    time.sleep(2)
    date_posted.click()
    time.sleep(5)


def get_job_pages(driver: Chrome = None) -> list:
    """Get available job pages if any

    Args:
        driver (Chrome): Instance of a web driver to use. Defaults to None.

    Returns:
        list: Returns a list of elements with all available pages.
    """

    pages = []
    pagination = driver.find_element(
        By.CLASS_NAME, "jobs-search-results-list__pagination"
    )
    if pagination:
        pages = pagination.find_elements(By.TAG_NAME, "li")

    return pages


def get_jobs(driver: Chrome = None) -> list:
    """Get all jobs from current page

    Args:
        driver (WebDriver): Instance of a web driver to use. Defaults to None.

    Returns:
        list: Returns a list with all the jobs visible in the current page
    """

    job_ids = []
    jobs_list = []
    is_bottom = False
    while not is_bottom:
        all_exist = True
        jobs = driver.find_elements(By.CLASS_NAME, "job-card-container")
        for job in jobs:
            if job.id not in job_ids:
                job_ids.append(job.id)
                jobs_list.append(job)
                all_exist = False
        if all_exist:
            is_bottom = True
        try:
            last_in_view = jobs[::-1][0]
            driver.execute_script("arguments[0].scrollIntoView(true);", last_in_view)
            time.sleep(3)
        except IndexError:
            is_bottom = True
            break

    return jobs_list


def get_job_id(job: str) -> int:
    """Parse a job html text and attempt to get the job id

    Args:
        job (object): Instance of page element.

    Returns:
        int: Integer representing the job id.
    """

    job_id = job.get_attribute("data-job-id")

    return int(job_id)


def get_salary(job) -> str:
    """Attempts to get the salary from a job

    Args:
        job (object): Instance of page element

    Returns:
        str: String representing the salary as posted in the page
    """

    try:
        salary = (
            job.find_element(By.CLASS_NAME, "artdeco-entity-lockup__metadata")
            .find_element(By.TAG_NAME, "li")
            .text
        )
        if "$" in salary:
            salary = salary.split("·")[0].strip().rstrip()
        else:
            salary = ""
    except NoSuchElementException:
        salary = ""

    return salary


def is_match(job_description) -> bool:
    """Parse the job description looking for keywords to match against. If any of the
    keywords is present, then is a possible match.

    Args:
        job_description (object): Instance of page element.

    Returns:
        bool: True if the job is a match, False otherwise.
    """

    match = False
    description = ""
    keywords = Settings.objects.first().keywords.split(",")

    elements = job_description.find_elements(By.TAG_NAME, "p")
    for p_tag in elements:
        try:
            description += f"{p_tag.text} "
        except StaleElementReferenceException:
            continue
    elements = job_description.find_elements(By.TAG_NAME, "li")
    for p_tag in elements:
        try:
            description += f"{p_tag.text} "
        except StaleElementReferenceException:
            continue
    for keyword in keywords:
        if keyword.strip().lower() in description.lower():
            match = True

    return match


def get_salary_from_description(job_description) -> str:
    """Parse the job description looking possible salary.

    Args:
        job_description (object): Instance of page element.

    Returns:
        str: String representing the job's salary if any.
    """

    description = ""

    elements = job_description.find_elements(By.TAG_NAME, "p")
    for p_tag in elements:
        try:
            description += f"{p_tag.text} "
        except StaleElementReferenceException:
            continue
    elements = job_description.find_elements(By.TAG_NAME, "li")
    for p_tag in elements:
        try:
            description += f"{p_tag.text} "
        except StaleElementReferenceException:
            continue

    pattern = re.compile(r"\$\s?\d+[\W|\s]?[\w|\d]+[\W?][\w]*[^\W]")
    matches = re.findall(pattern, description)
    if matches:
        return " - ".join(matches)

    return ""


def get_applicants(driver: Chrome = None) -> int:
    """Get applicants for a given job

    Args:
        driver (object): Instance of WebDriver.

    Returns:
        int: Returns an integer representing how many people have applied for the given
        job.
    """

    try:
        applicants = (
            driver.find_element(
                By.CLASS_NAME, "job-details-jobs-unified-top-card__primary-description"
            )
            .find_elements(By.TAG_NAME, "span")[::-1][0]
            .text
        )
        applicants = applicants.split(" ")[0].replace(",", "")

        return int(applicants)
    except StaleElementReferenceException:
        return 0
