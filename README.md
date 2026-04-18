# AI Prompt Library

A full-stack web app to store and manage AI image generation prompts.

## Tech Stack
- **Frontend:** Angular 16
- **Backend:** Django 4.2
- **Database:** PostgreSQL 14
- **Cache/Counter:** Redis 7
- **DevOps:** Docker + Docker Compose

## Quick Start

```bash
docker-compose up --build
```

| Service    | URL                          |
|------------|------------------------------|
| Frontend   | http://localhost:4200        |
| API        | http://localhost:8000/prompts/ |
| Admin      | http://localhost:8000/admin/ |

## Create Admin User (optional)
```bash
docker-compose exec backend python manage.py createsuperuser
```

## API Endpoints

| Method | Endpoint          | Description                        |
|--------|-------------------|------------------------------------|
| GET    | /prompts/         | List all prompts                   |
| POST   | /prompts/         | Create a new prompt                |
| GET    | /prompts/:id/     | Get prompt + increment view count  |

### POST body example
```json
{
  "title": "Sunset Fantasy",
  "content": "A golden sunset over mountains with dramatic clouds and vivid orange and pink hues",
  "complexity": 4
}
```

## Validation Rules
- `title`: minimum 3 characters
- `content`: minimum 20 characters
- `complexity`: integer between 1 and 10

## Architecture
- PostgreSQL stores all prompt data permanently
- Redis stores view counters as `prompt:{id}:views` (INCR on every detail request)
- Django uses plain function-based views with JsonResponse (no DRF)
- Angular uses ReactiveFormsModule for the add form and a single PromptService for all HTTP calls
- Angular dev server proxies `/prompts` → `http://backend:8000` inside Docker

## Stop the App
```bash
docker-compose down       # keep data
docker-compose down -v    # wipe database
```
