# 14_SECURITY_AND_CONFIG.md

# Security and Configuration

## Secrets

Never put:
- AI API keys
- database passwords
- routing provider keys
- map provider secret keys

inside frontend source code or Git.

Use environment variables and backend proxying.

## Frontend environment

Only public configuration belongs in frontend environment variables.

Example:
```text
VITE_API_BASE_URL=
VITE_MAP_STYLE_URL=
```

## Backend environment

Example:
```text
DATABASE_URL=
AI_API_KEY=
ROUTING_BASE_URL=
MAP_PROVIDER_TOKEN=
CORS_ORIGINS=
```

## Upload security

For uploaded geospatial files:
- validate extension
- validate MIME type
- limit file size
- sandbox processing
- reject malformed data
- avoid path traversal
- never execute uploaded files
- record source metadata

## API security

Production:
- authentication
- authorization
- rate limiting
- request validation
- audit logging

## AI security

Treat user prompts as untrusted input.
Do not allow prompt content to override system/data-grounding rules.

## Privacy

Do not expose sensitive location data unnecessarily.
Do not log raw user-uploaded data unless required.
