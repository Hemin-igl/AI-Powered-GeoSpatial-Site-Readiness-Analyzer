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
