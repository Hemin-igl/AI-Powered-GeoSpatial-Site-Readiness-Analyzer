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
