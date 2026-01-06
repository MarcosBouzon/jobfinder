# JobFinder AI Agent Instructions

## Overview
JobFinder is a LinkedIn job scraper with a Flask backend, React frontend, and Celery task queue. It scrapes LinkedIn's Voyager API every hour and displays jobs in a simple SPA. Not production-ready—designed for local development only.

## Architecture

### Service Boundaries
- **Flask Backend** (`backend/app.py`, port 5100): REST API + Flask-SocketIO server
- **React Frontend** (port 9090 via Nginx): Vite + React Router + Redux Toolkit
- **Celery Worker**: Background tasks with beat scheduler for periodic jobs
- **MongoDB**: Document store for jobs and settings (MongoEngine ODM)
- **Redis**: Celery broker + SocketIO message queue

### Environment-Aware Configuration
The app detects `stage=docker` environment variable to switch between:
- **Docker mode**: Service hostnames (`jf-mongodb`, `jf-redis`, `nginx:9090`)
- **Local mode**: `localhost` with port mappings (27017, 16379, 5173)

See [backend/app/__init__.py](backend/app/__init__.py#L13-L18) and [backend/app/scrapper/database.py](backend/app/scrapper/database.py#L4-L8).

### Data Flow
1. Celery beat triggers `get_linkedin_jobs` task hourly
2. `LinkedinScrapper` hits LinkedIn Voyager API with session cookies (li_at, li_rm, JSESSIONID)
3. Jobs saved to MongoDB via MongoEngine models
4. Flask-SocketIO emits `reload_page` event to frontend
5. React components refetch via RTK Query, updating UI

## Key Components

### Backend Structure
- **`app/scrapper/scrapper.py`**: LinkedIn API client—builds URLs with query params for workplace type, location (geoId:103644278), time filter (r86400=24h)
- **`app/scrapper/tasks.py`**: Celery tasks including `delete_old_jobs` (runs at 6am via crontab) and `delete_on_search`
- **`app/scrapper/views.py`**: Flask MethodViews for CRUD operations on jobs (mark seen/applied/deleted)
- **`app/scrapper/models.py`**: MongoEngine documents—`Jobs` (with job_id unique index) and `Settings` (singleton for credentials)

### Frontend Structure
- **`src/features/api/apiSlice.js`**: RTK Query API slice with auto-generated hooks (`useGetJobsQuery`, `useMarkAppliedMutation`, etc.)
- **`src/pages/Home.jsx`** & **`src/components/UI/Notifications.jsx`**: Both create separate Socket.IO clients—socket connects to `http://localhost:5100` and listens for `reload_page` and `notification` events
- **State management**: Redux store in `src/store/` for notifications; RTK Query handles data fetching

### Real-Time Communication
Flask-SocketIO uses Redis as message queue to share events across workers. Helper functions in [backend/app/__init__.py](backend/app/__init__.py#L52-L57):
- `publish_message(message)`: Emits JSON notification to frontend
- `reload_page()`: Triggers data refetch in React

## Development Workflow

### Running Locally
```bash
docker compose up -d  # Starts all services (nginx, app, celery, mongodb, redis)
```
Navigate to `http://localhost:9090`. Backend at `http://localhost:5100`.

### Manual Task Execution
```bash
# From backend directory
flask scrapper get_jobs           # Trigger LinkedIn scrape immediately
flask scrapper send_test_message  # Test SocketIO connection
flask scrapper delete_old_jobs    # Run cleanup task
```

### Debugging Celery Tasks
Celery uses `watchmedo` in compose.yaml to auto-restart on `.py` file changes. Check logs:
```bash
docker logs -f jf-celery
```

### Frontend Development
```bash
cd frontend
npm run dev  # Vite dev server on port 5173
```
Update `SOCKET_ORIGIN` in [backend/app/__init__.py](backend/app/__init__.py#L15) to `http://localhost:5173` for local frontend dev.

## Project-Specific Patterns

### MongoEngine Model Serialization
Models implement `serialize()` method converting ObjectId to string and dates to `%Y-%m-%d` format. See [backend/app/scrapper/models.py](backend/app/scrapper/models.py#L19-L31).

### MethodView URL Registration
Flask routes use class-based views via `add_url_rule` in [backend/app/scrapper/__init__.py](backend/app/scrapper/__init__.py#L15-L30). Pattern: `/endpoint/<string:job_id>` for item operations.

### Celery Beat Schedule
Periodic tasks defined in `celery_init_app()` using `conf.beat_schedule` dict. See [backend/app/celery.py](backend/app/celery.py#L19-L28).

### LinkedIn API Authentication
Scraper requires three cookies from authenticated LinkedIn session: `li_at`, `li_rm`, `JSESSIONID`. Stored in `Settings` model and passed to requests session. The `csrf-token` header MUST match the JSESSIONID value (stripped of quotes).

### Socket.IO Client Pattern
Frontend creates socket instances with hardcoded URLs—should match backend's `SOCKET_ORIGIN`. Multiple components create separate sockets; consider centralizing in production.

## Common Pitfalls

- **Docker networking**: Use service names (`jf-mongodb`) not `localhost` in docker mode
- **CORS**: Flask-SocketIO needs `cors_allowed_origins="*"` for local dev; tighten in production
- **Celery eager mode**: `task_always_eager=False` required for background execution
- **MongoDB unique constraint**: `job_id` field prevents duplicates—scraper skips existing jobs
- **Environment variables**: `stage=docker` in compose.yaml controls all service discovery logic

## Testing Notes
No test suite exists. To validate changes:
1. Check LinkedIn scrape: `flask scrapper get_jobs` and verify new jobs appear in frontend
2. Test SocketIO: `flask scrapper send_test_message` should show notification in UI
3. Verify Celery tasks: Check logs for hourly execution and 6am cleanup

## External Dependencies
- **LinkedIn Voyager API**: Undocumented internal API—requires valid session cookies. Rate limits unknown; scraper retrieves 100 jobs per run.
- **MongoEngine**: Query API differs from PyMongo—use `.objects()` not `.find()`.
