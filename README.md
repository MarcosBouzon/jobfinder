# jobfinder

A simple application for searching jobs in LinkedIn. As of 2023, LinkedIn doesn't provides
an API endpoint to fetch jobs. This project uses Selenium to interact with LinkedIn
website and fetch the jobs as background task that runs every two hours.

Notice, this application is mean to run locally, and therefore not ready for production.
Feel free to modify the project according to your needs.

Local deployment:

- Download the repository
- Open a terminal, navigate to the project root folder and run `docker compose up -d`


Using the project:

- Open your browser and navigate to `http://localhost:9090`
- Go to settings page and save your LinkedIn credentials, from here the service will start
fetching new jobs every two hours.


Inspect Selenium:

- Open your browser and navigate to `http://localhost:7900/?autoconnect=1&resize=scale&password=secret`
- The Selenium task will run every two ours. When the task is running you will see the
current execution in this window. Do not interact with the any element in this page or 
Selenium execution might fail as the page elements are modified.
