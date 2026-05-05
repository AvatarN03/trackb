# API Development Guide

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <jwt-token>
```

## Error Handling

All API responses follow this structure:

```json
{
  "success": boolean,
  "data": T | null,
  "error": string | null,
  "message": string | null
}
```

### Common Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized
- `404`: Not Found
- `500`: Server Error

## Rate Limiting

API endpoints have basic rate limiting (100 requests per minute per IP).

## Pagination

List endpoints support pagination:

```
GET /api/colleges?page=1&pageSize=10

Response:
{
  "success": true,
  "data": {
    "data": [...],
    "total": 100,
    "page": 1,
    "pageSize": 10,
    "totalPages": 10
  }
}
```

## Validation

Input validation uses Zod schemas defined in `src/types/validation.ts`.

Common validation errors include:
- Missing required fields
- Invalid email format
- Password too short
- Invalid enum values

## Examples

### Register a new user

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get colleges

```bash
curl http://localhost:3000/api/colleges?search=IIT&location=Delhi
```

### Compare colleges

```bash
curl -X POST http://localhost:3000/api/compare \
  -H "Content-Type: application/json" \
  -d '{
    "collegeIds": ["id1", "id2", "id3"]
  }'
```

### Get college details

```bash
curl http://localhost:3000/api/colleges/college-id-here
```

### Predict colleges

```bash
curl -X POST http://localhost:3000/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "exam": "JEE",
    "rank": 500
  }'
```

### Ask a question (requires auth)

```bash
curl -X POST http://localhost:3000/api/questions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer token-here" \
  -d '{
    "title": "What is the placement rate?",
    "body": "I want to know about placement opportunities",
    "collegeId": "college-id-here"
  }'
```

## Testing

### Using Postman

1. Import the API collection
2. Set the base URL to `http://localhost:3000`
3. Use the auth endpoints to get a token
4. Add token to Authorization header for protected endpoints

### Using curl

See examples above

### Using HTTP client (VS Code)

Create a `.http` file in the project root and use the REST Client extension.

## API Endpoints Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/colleges` | No | List colleges with filters |
| GET | `/api/colleges/:id` | No | Get college details |
| POST | `/api/compare` | No | Compare colleges |
| GET | `/api/predict` | No | Predict colleges |
| POST | `/api/auth/signup` | No | Create account |
| POST | `/api/auth/login` | No | Login user |
| GET | `/api/user/saved` | Yes | Get saved colleges |
| POST | `/api/user/saved/:collegeId` | Yes | Toggle save college |
| GET | `/api/questions` | No | Get Q&A |
| POST | `/api/questions` | Yes | Post question |
| POST | `/api/answers` | Yes | Post answer |

## Best Practices

1. **Always validate input** - Use Zod schemas
2. **Sanitize output** - Never expose sensitive data
3. **Use proper status codes** - Help clients understand responses
4. **Handle errors gracefully** - Provide meaningful error messages
5. **Log important events** - Use console for now, consider logging service later
6. **Implement pagination** - For list endpoints
7. **Cache when possible** - Reduce database queries
8. **Use transactions** - For multi-step operations
