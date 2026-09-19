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


---

# 01_PRODUCT_REQUIREMENTS.md

# Product Requirements Document

## 1. Product vision

GeoReady helps users evaluate locations for potential commercial or infrastructure use by combining demographic, transportation, competition, land-use, and environmental information into an explainable spatial analysis workflow.

## 2. Problem

Location selection is often performed with disconnected GIS tools, spreadsheets, manual calculations, and subjective interpretation. GeoReady centralizes the workflow.

## 3. Primary users

### GIS Analyst
Needs layer control, spatial analysis, map inspection, and exportable evidence.

### Business/Location Analyst
Needs site comparison, opportunity discovery, and understandable explanations.

### Decision Maker
Needs concise score breakdowns, risks, trade-offs, and reports.

## 4. Supported use cases

- Retail store
- Warehouse
- EV charging station
- Telecom tower
- Renewable-energy installation

## 5. Core capabilities

### P0 — mandatory
- Interactive map
- Five or more geospatial layers
- Site selection
- 0–100 configurable readiness score
- Score breakdown
- Weight configuration
- Competitor distance analysis
- Opportunity map
- Site comparison
- Layer toggling
- AI explanation using computed facts

### P1
- H3 visualization
- DBSCAN clustering
- Getis-Ord Gi* hotspot analysis
- 10/20/30 minute accessibility
- Polygon analysis
- Report generation
- Data upload workflow

### P2
- Natural-language analysis
- Scenario saving
- Real routing provider
- Production data ingestion
- Multi-city support
- User accounts and permissions

## 6. Product principles

1. GIS calculations are deterministic.
2. AI explains data; AI does not invent GIS measurements.
3. Every score must be traceable to underlying factors.
4. Demo data must be visibly identified as simulated.
5. UI behavior must be consistent across pages.
6. The same input and configuration must produce the same score.
7. No hidden scoring factors.
8. Every important map visualization needs a legend.
9. Every analytical result must have units and a defined geography.
10. Avoid presenting simulated data as real-world fact.

## 7. Definition of done

A feature is complete only when:
- UI exists
- API/data contract exists
- loading state exists
- error state exists
- empty state exists where applicable
- deterministic mock behavior exists
- tests exist for core logic
- documentation is updated


---

# 02_PRODUCT_SCOPE.md

# Product Scope and User Journeys

## Main navigation

### Overview
Executive dashboard with KPIs and opportunity map.

### Site Analysis
Analyze a specific coordinate and inspect score details.

### Opportunity Map
Search an entire study area for qualifying zones.

### Compare Sites
Compare up to three candidate sites.

### Demographics
Population and demographic analysis.

### Accessibility
Travel-time and catchment analysis.

### Competition
Competitor proximity and density analysis.

### Risk Analysis
Environmental/risk layer analysis.

### Hotspots & Clusters
H3, DBSCAN, and Getis-Ord Gi* visualizations.

### Data Layers
Manage imported layers.

### AI Assistant
Ask natural-language questions about currently loaded analytical results.

### Reports
Generate/share/export analytical reports.

## Primary user journey

1. Open Overview.
2. Select study area and business profile.
3. Inspect layer-enabled map.
4. Click a location.
5. Run site analysis.
6. Inspect 0–100 score.
7. Inspect factor contribution.
8. Change weights.
9. Inspect accessibility.
10. Inspect competition.
11. Ask AI to explain the result.
12. Open Opportunity Map.
13. Search for qualifying zones.
14. Select up to three sites.
15. Compare sites.
16. Generate report.

## Site analysis journey

Input:
- latitude
- longitude
- business type
- analysis radius

Output:
- normalized factors
- constraints
- final score
- confidence/data completeness indicators
- supporting measurements
- AI explanation

## Opportunity search journey

Input:
- business type
- minimum readiness
- population preference
- accessibility preference
- competition preference
- risk preference
- search polygon

Output:
- qualifying zones
- zone scores
- factor breakdowns
- map visualization

## Important UX rule

Do not use vague labels such as “good location” without showing the measurable reasons behind the result.


---

# 03_DESIGN_SYSTEM.md

# GeoReady Design System

## Brand

Product name: GeoReady

Tone:
- analytical
- modern
- trustworthy
- calm
- professional
- data-focused

Do not use cartoon illustrations or gaming-style UI.

## Color tokens

Primary:
- `--color-primary-50`
- `--color-primary-100`
- `--color-primary-500`
- `--color-primary-600`
- `--color-primary-700`

Neutral:
- `--color-bg`
- `--color-surface`
- `--color-surface-muted`
- `--color-border`
- `--color-text`
- `--color-text-muted`

Semantic:
- success
- warning
- danger
- info

Map colors must be defined separately from UI colors.

## Typography

Use Inter or another modern sans-serif.

- Page title: 24–32px, semibold
- Section title: 16–20px, semibold
- Body: 14–16px
- Metadata: 12–13px
- KPI number: 28–36px, semibold/bold

## Spacing

Use a consistent 4px base scale:
4, 8, 12, 16, 20, 24, 32, 40, 48.

## Radius

- Small controls: 8px
- Cards: 12–16px
- Modals: 16px
- Pills: 999px

## Shadows

Use subtle elevation. Avoid heavy shadows.

## Layout

Desktop:
- Sidebar: 240–264px
- Top navigation: 64px
- Content max width: 1600px
- Main page padding: 24px

## Cards

Every card should have:
- title
- optional description
- optional action
- content
- consistent padding

## Buttons

Primary:
- filled primary color
- white text

Secondary:
- neutral surface
- border

Danger:
- reserved for destructive operations

## States

Every interactive component must define:
- default
- hover
- focus
- active
- disabled
- loading
- error

## Map UI

Map controls must not obscure critical map content.
Legends must use consistent scales.
Selected features use a clear selected state.

## Accessibility

- keyboard navigation
- visible focus state
- semantic buttons
- labels for controls
- sufficient contrast
- charts require textual summaries


---

# 04_FRONTEND_ARCHITECTURE.md

# Frontend Architecture

## Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- Recharts
- Lucide React
- MapLibre GL JS

## Directory structure

```text
src/
  app/
    App.tsx
    router.tsx
  components/
    layout/
    map/
    charts/
    scoring/
    ai/
    forms/
    common/
  pages/
    Overview/
    SiteAnalysis/
    OpportunityMap/
    CompareSites/
    Demographics/
    Accessibility/
    Competition/
    RiskAnalysis/
    Hotspots/
    DataLayers/
    AIAssistant/
    Reports/
    Settings/
  services/
    api.ts
    siteAnalysis.ts
    opportunities.ts
    layers.ts
    accessibility.ts
    competition.ts
    ai.ts
  hooks/
  store/
  types/
  utils/
  data/
  styles/
```

## State ownership

Server state:
- TanStack Query

UI state:
- React state or a small global store

Form state:
- React Hook Form if needed

Do not duplicate server data into multiple unrelated global stores.

## Reusable components

Required components:
- `AppShell`
- `Sidebar`
- `Topbar`
- `PageHeader`
- `KpiCard`
- `MapView`
- `MapLayerControl`
- `MapLegend`
- `SiteMarker`
- `SiteScoreCard`
- `ScoreBreakdown`
- `WeightSlider`
- `AnalysisCard`
- `AiExplanation`
- `FilterPanel`
- `ComparisonTable`
- `ChartCard`
- `DataLayerCard`
- `Modal`
- `Toast`

## Routing

Routes:

```text
/
/site-analysis
/opportunities
/compare
/demographics
/accessibility
/competition
/risk
/hotspots
/data-layers
/ai
/reports
/settings
```

## Frontend rules

- No API calls directly inside visual components.
- Use service functions.
- No hard-coded duplicate scoring formulas in UI.
- UI receives score results from one scoring source.
- Map and charts consume typed data.
- Avoid `any`.
- Use shared TypeScript types.


---

# 05_BACKEND_ARCHITECTURE.md

# Backend Architecture

## Stack

- Python 3.x
- FastAPI
- Pydantic
- SQLAlchemy
- GeoAlchemy2
- PostgreSQL
- PostGIS
- GeoPandas
- Shapely
- H3
- scikit-learn
- PySAL/esda
- OSRM-compatible routing
- LLM provider SDK

## Directory structure

```text
backend/
  app/
    main.py
    config.py
    api/
      routes/
        layers.py
        sites.py
        scoring.py
        opportunities.py
        accessibility.py
        competition.py
        hotspots.py
        ai.py
        reports.py
    schemas/
    models/
    services/
      ingestion/
      spatial/
      scoring/
      routing/
      ai/
      reports/
    repositories/
    db/
    utils/
  tests/
  migrations/
```

## Layering

HTTP route
→ Pydantic schema
→ service
→ repository/spatial operation
→ database
→ response schema

Routes must not contain complex GIS algorithms.

## Service boundaries

### IngestionService
Validates and normalizes uploaded spatial data.

### SpatialService
Distance, buffer, intersection, density and spatial queries.

### ScoringService
Converts analytical features into normalized scores and final score.

### AccessibilityService
Calculates travel-time polygons and reachable population.

### CompetitionService
Calculates competitor density and distance decay.

### HotspotService
H3, DBSCAN, and Getis-Ord calculations.

### AIService
Turns structured analysis results into explanations.

## Determinism

Given:
- same dataset version
- same site
- same business profile
- same weights
- same algorithm parameters

the analytical score must be identical.

AI wording may vary, but AI numerical values must be taken from the structured analysis response.


---

# 06_API_CONTRACT.md

# API Contract

Base URL:
`/api/v1`

## GET /health

Response:
```json
{
  "status": "ok",
  "version": "1.0.0"
}
```

## GET /layers

Returns available layers.

```json
{
  "layers": [
    {
      "id": "population",
      "name": "Population Density",
      "type": "polygon",
      "feature_count": 1000,
      "status": "active"
    }
  ]
}
```

## POST /sites/analyze

Request:
```json
{
  "latitude": 21.1702,
  "longitude": 72.8311,
  "business_type": "retail",
  "radius_km": 5,
  "weights": {
    "population": 0.30,
    "accessibility": 0.25,
    "competition": 0.15,
    "land_use": 0.15,
    "risk": 0.15
  }
}
```

Response:
```json
{
  "site_id": "site_demo_001",
  "score": 84,
  "factors": {
    "population": 91,
    "accessibility": 87,
    "competition": 63,
    "land_use": 95,
    "risk": 78
  },
  "contributions": {
    "population": 27.30,
    "accessibility": 21.75,
    "competition": 9.45,
    "land_use": 14.25,
    "risk": 11.70
  },
  "metrics": {
    "population_10min": 18400,
    "population_20min": 64200,
    "population_30min": 142700,
    "competitors_1km": 2,
    "competitors_3km": 5,
    "competitors_5km": 11
  },
  "constraints": [],
  "data_quality": {
    "completeness": 0.96
  }
}
```

## POST /opportunities/search

Request:
```json
{
  "business_type": "retail",
  "minimum_score": 70,
  "filters": {
    "population": "high",
    "competition": "low",
    "accessibility": "high",
    "risk": "low"
  }
}
```

Response:
```json
{
  "zones": [
    {
      "id": "zone_001",
      "score": 89,
      "center": [72.8311, 21.1702],
      "geometry": {},
      "factors": {}
    }
  ]
}
```

## POST /accessibility/isochrone

Request:
```json
{
  "latitude": 21.1702,
  "longitude": 72.8311,
  "mode": "drive",
  "minutes": [10, 20, 30]
}
```

## POST /competition/analyze

Request:
```json
{
  "latitude": 21.1702,
  "longitude": 72.8311,
  "radius_km": 5,
  "decay": {
    "type": "exponential",
    "k": 0.5
  }
}
```

## GET /hotspots

Query:
- algorithm=h3|dbscan|gi_star
- layer=population|competition|readiness

## POST /ai/explain

Request:
```json
{
  "analysis": {},
  "question": "Why does this site have this score?"
}
```

The backend must pass structured analysis data to the AI. The AI must not receive permission to alter numerical results.


---

# 07_DATA_MODEL.md

# Data Model

## Coordinate standard

External GeoJSON interchange uses WGS84 longitude/latitude. GeoJSON positions are `[longitude, latitude]`, not `[latitude, longitude]`.

Database geometry types and SRIDs must be explicit.

## Core tables

### study_areas
- id
- name
- geometry
- created_at

### layers
- id
- name
- layer_type
- source
- version
- status
- metadata
- created_at

### population_zones
- id
- layer_id
- population
- population_density
- geometry

### roads
- id
- layer_id
- road_type
- speed_limit
- geometry

### competitors
- id
- layer_id
- name
- category
- geometry

### land_use_zones
- id
- layer_id
- category
- geometry

### risk_zones
- id
- layer_id
- risk_type
- risk_level
- geometry

### candidate_sites
- id
- name
- business_type
- location
- created_at

### analysis_runs
- id
- candidate_site_id
- business_type
- radius_km
- weights
- algorithm_version
- score
- result_json
- created_at

### h3_cells
- h3_index
- resolution
- geometry
- population_score
- accessibility_score
- competition_score
- land_use_score
- risk_score
- readiness_score

## Geometry rules

- Validate geometries during ingestion.
- Reject or repair invalid geometries according to documented ingestion policy.
- Never silently swap latitude and longitude.
- Store geometry type and SRID explicitly.
- Use appropriate projected/geographic calculations for distance and area.

## Data provenance

Every imported layer must retain:
- source
- source URL if applicable
- acquisition date
- version
- CRS
- processing steps
- license/usage notes


---

# 08_SCORING_ENGINE.md

# Scoring Engine Specification

## Purpose

Produce an explainable Site Readiness Score from 0–100.

## Default retail profile

```text
Population       0.30
Accessibility    0.25
Competition      0.15
Land Use         0.15
Risk             0.15
```

Weights must sum to 1.0.

## Formula

```text
final_score =
    population_score * population_weight
  + accessibility_score * accessibility_weight
  + competition_score * competition_weight
  + land_use_score * land_use_weight
  + risk_score * risk_weight
```

Clamp final score to `[0, 100]`.

## Normalization

All factor scores must be normalized to 0–100 before weighting.

Never combine raw values such as population count and distance directly.

## Population score

Inputs may include:
- population density
- catchment population
- demographic target fit

The exact normalization method must be versioned.

## Accessibility score

Inputs:
- travel time
- road proximity
- reachable population

## Competition score

Competition is a negative factor.

Base measurement:
```text
competitive_pressure = sum(distance_decay(distance_i))
```

Example exponential decay:
```text
decay(d) = exp(-k * d)
```

The pressure is normalized to a competition score where:
- lower pressure → higher score
- higher pressure → lower score

## Land-use score

Based on business compatibility with the land-use category.

Example:
```text
commercial = 100
mixed_use = 85
residential = 60
industrial = 40
restricted = 0
```

The actual mapping must live in configuration, not duplicated in code.

## Risk score

Risk is a negative factor.

Example conceptual model:
```text
risk_score = 100 - normalized_risk
```

## Constraints

Constraints are separate from weighted factors.

Examples:
- prohibited land use
- extreme flood risk
- outside study area

A hard constraint may mark a site as:
`ineligible`

Do not hide hard constraints inside the weighted score.

## Score explanation

Every result must provide:
- factor score
- weight
- contribution
- underlying metrics
- constraints
- algorithm version

## Business profiles

Profiles are configuration objects, not hard-coded UI branches.

```json
{
  "id": "retail",
  "name": "Retail Store",
  "weights": {
    "population": 0.30,
    "accessibility": 0.25,
    "competition": 0.15,
    "land_use": 0.15,
    "risk": 0.15
  }
}
```

## Versioning

Scoring changes require an algorithm version such as:
`score-v1.0`.

Historical analysis runs retain the algorithm version used.


---

# 09_GIS_ANALYTICS.md

# GIS Analytics Specification

## 1. Spatial layers

Minimum supported analytical layers:
1. Population
2. Transportation
3. Competitors/POIs
4. Land use/zoning
5. Environmental/risk

## 2. Spatial operations

Supported operations:
- point-in-polygon
- polygon intersection
- buffer
- nearest feature
- distance
- density
- aggregation
- spatial join

## 3. H3

Purpose:
- aggregate analysis into consistent hexagonal cells
- visualize city-wide opportunity
- support opportunity search

Each H3 cell should contain:
- index
- geometry
- feature metrics
- normalized factor scores
- readiness score

## 4. DBSCAN

Purpose:
identify spatial clusters in point datasets.

Parameters:
- `eps`
- `min_samples`

Parameters must be visible in the analysis metadata.

## 5. Getis-Ord Gi*

Purpose:
identify statistically significant spatial hotspots/coldspots.

Output must include:
- statistic
- significance measure
- classification
- geometry

Do not label an area a statistically significant hotspot without actually calculating the statistic.

## 6. Accessibility

Supported modes:
- drive
- walk

Supported time bands:
- 10 minutes
- 20 minutes
- 30 minutes

Outputs:
- isochrone geometry
- reachable population
- route statistics

## 7. Competitive density

For each candidate site:
- count competitors within configured radii
- calculate distance-decayed pressure
- normalize pressure to score

## 8. Spatial accuracy

Distance/area calculations must use a method appropriate to the coordinate reference system. Do not assume that degree differences are kilometers.

## 9. Map output

Backend should return GeoJSON FeatureCollections for web map consumption where appropriate.

All returned feature properties must be documented.


---

# 10_AI_SPECIFICATION.md

# AI Specification

## AI's role

The AI is an explanation and natural-language interface layer.

It is NOT the GIS calculation engine.

## Allowed AI tasks

- explain a score
- summarize factors
- describe trade-offs
- answer questions about computed metrics
- translate user language into structured filters
- generate report narrative
- explain GIS algorithms in plain language

## Forbidden AI behavior

The AI must not:
- invent population numbers
- invent competitor counts
- invent distances
- change the calculated score
- fabricate GIS calculations
- claim simulated data is real
- silently change scoring weights
- override hard constraints

## Grounding

AI receives structured analysis JSON.

Example:
```json
{
  "score": 84,
  "factors": {
    "population": 91,
    "accessibility": 87,
    "competition": 63,
    "land_use": 95,
    "risk": 78
  }
}
```

The AI must reference only values present in the analysis payload.

## Explanation format

When asked "Why this score?", respond with:

1. Overall score
2. Strongest positive factors
3. Limiting factors
4. Important measurable evidence
5. Constraints if present
6. Short conclusion

## Natural-language search

User:
"Find areas with high population, low competition and good accessibility."

AI converts this into structured parameters:

```json
{
  "population": "high",
  "competition": "low",
  "accessibility": "high"
}
```

The GIS backend performs the search.

AI does not directly select coordinates.

## Hallucination policy

If data is missing:
- say it is unavailable
- do not estimate silently

If data is simulated:
- explicitly identify it as simulated

If the user asks for a calculation:
- use backend-calculated values

## AI prompt contract

System prompt must include:
- product role
- data-grounding rules
- output format
- demo-data disclaimer
- no numerical invention rule


---

# 11_MOCK_DATA_SPEC.md

# Mock Data Specification

## Purpose

The frontend must work without external APIs during development and demonstrations.

## Study area

Use a simulated study area around Surat, Gujarat.

All mock data must be labeled:
`DEMO DATA — Simulated for prototype purposes`

Do not imply that simulated values represent actual measurements.

## Required volume

- 100+ H3 cells
- 100 competitor points
- 50 candidate sites
- 100+ population polygons/cells
- 100+ road segments
- 20+ land-use polygons
- 20+ risk polygons

## Determinism

Use a fixed seed.

Do not use `Math.random()` directly for data that must remain stable between runs.

## Mock site example

```json
{
  "id": "site_001",
  "name": "Demo Site A",
  "latitude": 21.1702,
  "longitude": 72.8311,
  "score": 84
}
```

## Mock analysis example

```json
{
  "score": 84,
  "factors": {
    "population": 91,
    "accessibility": 87,
    "competition": 63,
    "land_use": 95,
    "risk": 78
  }
}
```

## Mock layer metadata

Every layer should have:
- id
- display name
- geometry type
- feature count
- status
- opacity
- source = `synthetic-demo`
- version

## Mock API behavior

Service functions must mimic asynchronous network behavior.

Use:
- loading delay
- deterministic response
- error simulation switch for testing

Never duplicate mock datasets across pages.


---

# 12_MAP_INTERACTION_SPEC.md

# Map Interaction Specification

## Default map

Center around the selected study area.

Initial layers:
- base map
- opportunity heatmap
- candidate sites

## Controls

Required:
- zoom in
- zoom out
- reset view
- fullscreen
- layer control
- legend

## Layer behavior

Each layer:
- can be toggled
- has opacity
- has legend
- has loading state

## Site click

Click candidate site:
1. highlight marker
2. open analysis panel
3. show site score
4. show factor breakdown
5. provide "Open full analysis"

## H3 hover

Tooltip:
- H3 cell id
- readiness
- population
- accessibility
- competitor count

## H3 click

Open zone detail.

## Opportunity zone click

Show:
- zone score
- factor scores
- center coordinate
- population metrics
- competition metrics
- accessibility metrics

## Drawing tools

Support:
- point
- polygon

Polygon analysis:
- calculate area
- summarize population
- summarize competitors
- summarize land use
- summarize risk

## Map performance

Do not render thousands of individual React markers when a vector layer or clustering approach is appropriate.

Keep map state independent from page state where possible.


---

# 13_TESTING_SPEC.md

# Testing Specification

## Unit tests

Test:
- weight normalization
- score calculation
- factor normalization
- distance decay
- competition score
- constraint handling
- deterministic mock data

## Example score test

Given:
```text
population=91
accessibility=87
competition=63
land_use=95
risk=78
```

and weights:
```text
0.30, 0.25, 0.15, 0.15, 0.15
```

Expected:
`84.45`, displayed as `84` if integer display is configured.

## Integration tests

Test:
- frontend → API
- API → scoring service
- API → spatial service
- AI service receives analysis payload

## UI tests

Test:
- navigation
- site selection
- weight sliders
- map layer toggles
- opportunity filters
- comparison selection
- AI assistant
- report generation

## Contract tests

API request and response structures must match `06_API_CONTRACT.md`.

## Regression rule

Changing scoring behavior requires:
- updated algorithm version
- updated tests
- updated documentation

## Demo test

Before presentation, verify:
1. app loads
2. map renders
3. layer toggles work
4. site click works
5. score appears
6. weights update score
7. accessibility appears
8. competition appears
9. AI explanation works
10. opportunity search works
11. comparison works
12. report flow works


---

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


---

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


---

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


---

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


---

# 18_DEMO_SCRIPT.md

# Demo Script

## Opening

"GeoReady is an AI-powered geospatial decision-support platform for evaluating locations."

## Step 1 — Overview

Show:
- KPIs
- map
- layers
- opportunity heatmap

Say:
"The platform combines multiple geographic layers into a common analytical view."

## Step 2 — Select a site

Click a candidate site.

Say:
"Instead of manually checking separate GIS datasets, we can analyze this location in one workflow."

## Step 3 — Score

Show:
`84/100`

Open breakdown.

Explain:
"The score is deterministic and calculated from configurable factors."

## Step 4 — Change weights

Move Population from 30% to 40%.

Say:
"The same location can be evaluated under different business priorities."

## Step 5 — Accessibility

Open 10/20/30-minute isochrones.

Say:
"We can measure the population reachable through the road network rather than relying only on straight-line distance."

## Step 6 — Competition

Show competitor density.

Say:
"Nearby competitors have stronger influence through distance decay."

## Step 7 — AI

Ask:
"Why does this site have this score?"

Show explanation.

Say:
"The AI explains the computed result; it is not responsible for inventing the underlying GIS measurements."

## Step 8 — Opportunity Finder

Set:
- high population
- low competition
- high accessibility

Click Find Opportunities.

Say:
"The platform can scan the study area and identify zones matching the selected criteria."

## Step 9 — Compare

Select three sites.

Show comparison table and radar chart.

## Step 10 — Close

"GeoReady converts fragmented spatial data into an explainable workflow: data, spatial analysis, scoring, AI explanation, and opportunity discovery."


---

# 19_DECISION_LOG.md

# Architecture Decision Log

## ADR-001 — AI is not the GIS engine

Decision:
GIS and scoring calculations remain deterministic backend services.

Reason:
Numerical reproducibility, auditability, and protection against hallucinated measurements.

## ADR-002 — PostGIS is the spatial system of record

Decision:
Persist production spatial datasets in PostgreSQL/PostGIS.

Reason:
Centralized spatial queries, indexing, persistence, and integration with Python GIS tooling.

## ADR-003 — GeoJSON for web interchange

Decision:
Use GeoJSON for browser-facing feature exchange where appropriate.

Reason:
It is a standard web-friendly geographic interchange format.

## ADR-004 — H3 for city-wide aggregation

Decision:
Use H3 cells for opportunity aggregation and visualization.

Reason:
Consistent spatial units and efficient city-wide analytical visualization.

## ADR-005 — Configurable scoring profiles

Decision:
Business profiles are configuration, not separate scoring implementations.

Reason:
Avoid duplicated logic and allow future business types.

## ADR-006 — Mock-first frontend

Decision:
Frontend can operate entirely on deterministic mock services.

Reason:
Parallel development and reliable demonstrations before backend completion.


---

# 20_DATA_DICTIONARY.md

# Data Dictionary

| Field | Type | Meaning |
|---|---|---|
| latitude | float | Geographic latitude |
| longitude | float | Geographic longitude |
| geometry | geometry | Spatial feature geometry |
| population | integer | Population associated with zone |
| population_density | float | Population per area unit |
| competitor_count | integer | Competitors in configured area |
| competitive_pressure | float | Distance-decayed competition measurement |
| accessibility_score | float | Normalized 0–100 accessibility |
| land_use_score | float | Normalized business compatibility |
| risk_score | float | Normalized safety/environment factor |
| readiness_score | float | Final 0–100 score |
| weight | float | Factor contribution weight |
| contribution | float | Score × weight |
| algorithm_version | string | Version of scoring/analysis implementation |
| data_version | string | Version of dataset used |
| completeness | float | Estimated completeness of required inputs |
| source | string | Data provenance identifier |

## Units

Every raw metric must specify units.

Examples:
- distance: meters or kilometers
- area: square meters or square kilometers
- time: minutes
- population: persons
- density: persons per square kilometer

Never return ambiguous values such as `distance: 5`.
Use `distance_km: 5`.


---

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


---

# 22_MASTER_AI_PROMPT.md

# Master Prompt for Any AI Coding Tool

You are a senior full-stack GIS engineer working on the GeoReady project.

You MUST treat the `/docs` directory as the project's source of truth.

## Project

GeoReady is an AI-powered GeoSpatial Site Readiness Analyzer.

Its pipeline is:

DATA → VALIDATION → SPATIAL ANALYSIS → FEATURES → SCORE → MAP → AI EXPLANATION → OPPORTUNITY DISCOVERY

## Architecture

Frontend:
React + TypeScript + Tailwind + MapLibre + Recharts

Backend:
FastAPI + Python

Database:
PostgreSQL + PostGIS

GIS:
GeoPandas + Shapely + H3 + scikit-learn + PySAL/esda

Routing:
OSRM-compatible service

AI:
Backend-only LLM integration

## Mandatory behavior

1. Read relevant files in `/docs` before changing code.
2. Do not redesign the application without explicit instruction.
3. Reuse existing components.
4. Reuse existing types.
5. Reuse existing services.
6. Never duplicate scoring formulas.
7. Never hard-code analytical results into UI components.
8. Never allow AI to invent GIS metrics.
9. Keep mock data deterministic.
10. Mark simulated data as simulated.
11. Preserve API contracts.
12. Add tests for analytical logic.
13. Add loading/error/empty states.
14. Never expose secrets in frontend code.
15. Keep coordinate order correct: GeoJSON is `[longitude, latitude]`.
16. Update documentation when architecture or contracts change.

## When asked to implement a feature

First produce:
- interpretation
- affected files
- relevant existing components/services
- API changes if any
- data changes if any

Then implement.

Do not create a second competing implementation.

## When uncertain

Prefer the documented existing behavior over invention.

If a requirement is genuinely ambiguous, identify the ambiguity and choose the least disruptive implementation consistent with the existing architecture.

## Completion report

At the end provide:
- files changed
- behavior added
- tests run
- known limitations
- documentation updated


---

# README.md

# GeoReady Production Docs

This folder is the single source of truth for the GeoReady project.

Start with `00_MASTER_INDEX.md`.

For AI coding tools, also provide `22_MASTER_AI_PROMPT.md` and instruct the agent to read the complete `/docs` directory before modifying code.

The documentation is intentionally split by concern so frontend, backend, GIS, data, AI, QA, and DevOps contributors can work in parallel without creating incompatible implementations.


---
