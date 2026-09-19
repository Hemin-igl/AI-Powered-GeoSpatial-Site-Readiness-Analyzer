# 00_MASTER_INDEX.md

# GeoReady — Production Documentation Index

## Purpose

GeoReady is an AI-powered GeoSpatial Site Readiness Analyzer. It ingests multiple geospatial layers, performs spatial analysis, calculates a configurable 0–100 site-readiness score, visualizes results on an interactive map, and uses AI to explain computed results.

This documentation set is the **single source of truth** for all developers and AI coding agents.

## Non-negotiable rule

Before generating or changing code, read:

1. `01_PRODUCT_REQUIREMENTS.md`
2. `02_PRODUCT_SCOPE.md`
3. `03_DESIGN_SYSTEM.md`
4. `04_FRONTEND_ARCHITECTURE.md`
5. `05_BACKEND_ARCHITECTURE.md`
6. `06_API_CONTRACT.md`
7. `07_DATA_MODEL.md`
8. `08_SCORING_ENGINE.md`
9. `09_GIS_ANALYTICS.md`
10. `10_AI_SPECIFICATION.md`
11. `11_MOCK_DATA_SPEC.md`
12. `12_MAP_INTERACTION_SPEC.md`
13. `13_TESTING_SPEC.md`
14. `14_SECURITY_AND_CONFIG.md`
15. `15_DEPLOYMENT.md`
16. `16_AI_AGENT_RULES.md`

If a request conflicts with these documents, do not silently invent a new behavior. Preserve the documented contract unless the specification is explicitly changed.

## Product identity

- Product: GeoReady
- Category: GIS / Location Intelligence / Decision Support
- Primary user: GIS analyst / business location analyst
- Initial demo geography: Surat metropolitan area
- Demo data: simulated unless explicitly marked as sourced data
- Primary UI: desktop-first responsive web application
- Primary map: MapLibre GL JS
- Frontend: React + TypeScript
- Backend: FastAPI + Python
- Database: PostgreSQL + PostGIS
- GIS processing: GeoPandas + Shapely
- Spatial indexing/grid: H3
- Clustering: DBSCAN
- Hotspot analysis: Getis-Ord Gi*
- Routing: OSRM-compatible service
- AI: LLM accessed only through backend

## Core product flow

DATA → VALIDATION → SPATIAL ANALYSIS → FEATURES → SCORE → MAP → AI EXPLANATION → OPPORTUNITY DISCOVERY → COMPARISON → REPORT

## Documentation hierarchy

Product requirements define WHAT.
Architecture defines WHERE.
API/data contracts define HOW systems communicate.
Design system defines HOW IT LOOKS.
Algorithm specifications define HOW RESULTS ARE CALCULATED.
AI agent rules define HOW AI-generated code must behave.
