# 16_AI_AGENT_RULES.md

# Rules for AI Coding Agents

This file is mandatory for every AI coding assistant working on GeoReady.

## Rule 1 — Read the specification

Before coding, read all relevant documents in `/docs`.

## Rule 2 — Do not redesign the product

Do not independently:
- rename pages
- rename core concepts
- change navigation
- change scoring factors
- change API response shapes
- change colors/layout conventions

unless explicitly requested.

## Rule 3 — One source of truth

Do not duplicate:
- score formulas
- business profiles
- mock data
- TypeScript types
- API URLs

## Rule 4 — Numerical integrity

Never hard-code a score in the UI if it can be derived from analysis data.

Never let an LLM generate the numerical score.

## Rule 5 — GIS integrity

Never swap latitude and longitude.

GeoJSON coordinate order is:
`[longitude, latitude]`.

## Rule 6 — Demo-data honesty

Simulated data must be labeled as simulated.

## Rule 7 — Existing components

Before creating a component, search for an existing reusable component.

## Rule 8 — Existing API

Before creating a new endpoint, check `06_API_CONTRACT.md`.

## Rule 9 — Error states

Every async feature needs:
- loading
- success
- error
- empty

## Rule 10 — Types

Use shared types.
Avoid `any`.

## Rule 11 — Changes

For every significant feature:
1. update implementation
2. update tests
3. update relevant docs
4. mention changed files

## Rule 12 — Do not invent dependencies

Do not add a library unless:
- it solves a documented requirement
- it is compatible with the architecture
- it is actually necessary

## Rule 13 — AI-generated explanations

AI text must use structured backend data and must not invent measurements.

## Rule 14 — Preserve UX

Do not replace the map with a static image.
Do not remove layer controls.
Do not remove score breakdown.
Do not remove AI explanation.

## Rule 15 — Before finishing

Run:
- type checking
- lint
- tests
- production build

Then report:
- what changed
- what was tested
- known limitations
