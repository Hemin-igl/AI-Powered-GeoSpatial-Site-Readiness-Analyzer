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
