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
