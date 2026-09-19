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
