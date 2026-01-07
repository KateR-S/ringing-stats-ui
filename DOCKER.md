# Docker Quick Start Guide

This guide provides quick commands to run the Ringing Stats UI with Docker.

## Prerequisites

- Docker installed (version 20.10 or later)
- Docker Compose installed (version 2.0 or later)

## Quick Start

### Production Deployment

Start the application in production mode:
```bash
docker-compose up -d
```

View logs:
```bash
docker-compose logs -f
```

Stop the application:
```bash
docker-compose down
```

### Development with Hot-Reload

Start the application in development mode with hot-reload:
```bash
docker-compose --profile dev up -d ringing-stats-ui-dev
```

View logs:
```bash
docker-compose logs -f ringing-stats-ui-dev
```

Stop the application:
```bash
docker-compose --profile dev down
```

## Environment Variables

Create a `.env` file in the project root:
```env
NEXT_PUBLIC_API_URL=http://your-backend-api:8000
```

Or set environment variables directly:
```bash
export NEXT_PUBLIC_API_URL=http://localhost:8000
docker-compose up -d
```

## Using Makefile

The project includes a Makefile for common tasks:

```bash
make docker-build    # Build the Docker image
make docker-up       # Start production container
make docker-dev      # Start development container
make docker-logs     # View production logs
make docker-dev-logs # View development logs
make docker-down     # Stop all containers
make docker-clean    # Remove containers and images
```

## Health Check

The application includes a health check endpoint:
```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2026-01-07T13:55:00.000Z"
}
```

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, modify `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Use port 3001 instead
```

### Container Won't Start

Check logs:
```bash
docker-compose logs ringing-stats-ui
```

Rebuild the image:
```bash
docker-compose build --no-cache
docker-compose up -d
```

### Can't Connect to Backend

Ensure the backend API URL is correctly set:
1. Check your `.env` file
2. Verify the backend is accessible from the container
3. If running backend locally, use `host.docker.internal` instead of `localhost`:
   ```env
   NEXT_PUBLIC_API_URL=http://host.docker.internal:8000
   ```

## Advanced Usage

### Build Only

Build the Docker image without starting:
```bash
docker-compose build
```

### Run with Custom Environment

```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://api.example.com \
  ringing-stats-ui
```

### View Container Status

```bash
docker-compose ps
```

### Access Container Shell

```bash
docker-compose exec ringing-stats-ui sh
```

## Docker Image Details

- **Base Image**: node:18-alpine
- **Multi-stage Build**: Yes (deps, builder, runner)
- **Size**: ~150MB (optimized)
- **User**: Non-root user (nextjs)
- **Health Check**: Built-in at `/api/health`
