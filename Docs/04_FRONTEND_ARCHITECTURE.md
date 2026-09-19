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
