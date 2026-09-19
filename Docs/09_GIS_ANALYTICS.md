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
