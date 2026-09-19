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
