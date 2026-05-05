# Development with Docker

## Prerequisites

- Docker
- Docker Compose

## Quick Start

1. **Start the application with Docker Compose**

```bash
docker-compose up
```

This will:
- Start a PostgreSQL database
- Build and run the Next.js application
- Automatically set up volumes

2. **Initialize the database**

In another terminal:

```bash
docker exec college-discovery-platform npm run db:push
docker exec college-discovery-platform npm run db:seed
```

3. **Access the application**

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env.docker` file (used by docker-compose):

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=college_discovery
JWT_SECRET=dev-secret-key-change-in-production
```

## Common Commands

### View logs

```bash
docker-compose logs -f app
docker-compose logs -f postgres
```

### Stop containers

```bash
docker-compose down
```

### Stop and remove volumes

```bash
docker-compose down -v
```

### Rebuild images

```bash
docker-compose build --no-cache
```

### Access database shell

```bash
docker exec -it <postgres-container-id> psql -U postgres -d college_discovery
```

## Production Deployment

### Build production image

```bash
docker build -t college-discovery:latest .
```

### Run production container

```bash
docker run \
  -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e JWT_SECRET="production-secret" \
  -e NEXT_PUBLIC_API_URL="https://yourdomain.com" \
  college-discovery:latest
```

## Troubleshooting

### Database connection refused

Wait for PostgreSQL to start. Check logs:

```bash
docker-compose logs postgres
```

### Port already in use

Change the port in `docker-compose.yml`:

```yaml
ports:
  - '3001:3000'  # Change 3001 to your preferred port
```

### Node modules issues

Rebuild images and volumes:

```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```
