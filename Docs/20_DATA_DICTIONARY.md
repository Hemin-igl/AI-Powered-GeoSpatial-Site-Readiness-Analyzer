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
