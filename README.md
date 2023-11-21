# jobfinder

A simple application for searching jobs in LinkedIn. The project uses LinkedIn's Voyager API
to fetch the jobs as a background task that runs every two hours.

Notice, this application is mean to run locally, and therefore not ready for production.
Feel free to modify the project according to your needs.

Local deployment:

- Download the repository
- Open a terminal, navigate to the project root folder and run `docker compose up -d`


Using the project:

- Open your browser and navigate to `http://localhost:9090`
- Go to settings page and save your LinkedIn credentials, from here the service will start
fetching new jobs every two hours.


Technologies:

- Python
- Flask
- Celery
- React
- Nginx
- MongoDB
- Docker
- Docker-Composer
- Redis
