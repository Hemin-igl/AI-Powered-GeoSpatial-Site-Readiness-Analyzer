# 21_CHANGE_MANAGEMENT.md

# Change Management

## Changing the UI

If changing:
- navigation
- page names
- design tokens
- map controls

update:
- Product Scope
- Design System
- Frontend Architecture
- Demo Script if needed

## Changing the score

Must update:
- Scoring Engine
- tests
- business profile config
- API documentation if response changes
- algorithm version
- decision log

## Changing API

Must update:
- API contract
- frontend service
- backend schema
- tests
- affected documentation

## Changing data model

Must update:
- Data Model
- Data Dictionary
- migrations
- affected API schemas

## Changing AI behavior

Must update:
- AI Specification
- AI system prompt
- tests
- demo script if user-facing behavior changes

## Breaking changes

Do not silently make breaking changes.
Document migration steps.
