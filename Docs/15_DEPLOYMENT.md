# 15_DEPLOYMENT.md

# Deployment Specification

## Development

Frontend:
```text
npm install
npm run dev
```

Backend:
```text
python -m venv .venv
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Database:
PostgreSQL + PostGIS

## Docker

Services:
- frontend
- backend
- postgres/postgis

Optional:
- routing service
- object storage

## Production architecture

```text
Browser
  ↓
CDN / Reverse Proxy
  ↓
React Frontend
  ↓
FastAPI
  ├── PostgreSQL/PostGIS
  ├── GIS processing
  ├── Routing service
  └── AI provider
```

## Observability

Log:
- request id
- endpoint
- latency
- error type
- analysis id
- algorithm version

Do not log:
- API secrets
- unnecessary uploaded content
- sensitive user information

## Health checks

- frontend availability
- backend `/health`
- database connectivity
- routing service status
- AI provider status

## Production principle

The frontend must remain usable if optional AI services are unavailable. GIS scoring should not depend on the AI provider.
