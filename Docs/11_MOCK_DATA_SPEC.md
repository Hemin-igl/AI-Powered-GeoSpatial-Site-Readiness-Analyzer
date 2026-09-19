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
