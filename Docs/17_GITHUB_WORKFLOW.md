# 17_GITHUB_WORKFLOW.md

# Git/GitHub Team Workflow

## Branches

```text
main
develop
feature/*
fix/*
```

## Branch naming

```text
feature/site-analysis
feature/opportunity-map
feature/ai-assistant
feature/postgis-ingestion
fix/map-layer-toggle
```

## Commit format

```text
feat: add site analysis panel
fix: correct score weight normalization
docs: update API contract
refactor: extract map layer service
test: add scoring engine tests
```

## Pull request requirements

Every PR must contain:
- purpose
- changed areas
- screenshots for UI changes
- tests performed
- documentation changes
- known limitations

## AI-generated code rule

AI-generated code must be reviewed by a human before merge.

## Avoid conflicts

Assign ownership by module:

Frontend:
- layout/UI
- map
- charts

Backend:
- APIs
- scoring
- GIS

Data:
- ingestion
- datasets
- provenance

AI:
- prompt
- explanation
- report generation

QA:
- integration
- regression
- demo flow

SECURITY RULES — API KEYS

1. NEVER hardcode API keys in source code.
2. NEVER commit .env files.
3. NEVER put secret API keys in frontend/client-side code.
4. NEVER print API keys in logs.
5. NEVER include API keys in API responses.
6. All AI API calls must go through the backend.
7. Read secrets from environment variables.
8. Use .env.example for documentation only.
9. Before creating a commit, check for accidentally exposed secrets.
10. If an API key is accidentally committed, immediately stop and report it.