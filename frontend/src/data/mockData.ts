import { CandidateSite, CompetitorPoint, H3CellData, MapLayerConfig, OpportunityZone, ScoringWeights, City, CityData } from '../types';

export const CITIES: City[] = [
  {
    id: 'workspace',
    name: 'Target Analysis Area',
    state: 'Active Workspace',
    country: 'Global',
    lat: 21.1702,
    lng: 72.8311,
  }
];

export const PRESET_WEIGHTS: Record<string, ScoringWeights> = {
  'Retail Store': { population: 0.30, accessibility: 0.25, competition: 0.15, landUse: 0.15, environmentalRisk: 0.15 },
  'Warehouse': { population: 0.10, accessibility: 0.40, competition: 0.10, landUse: 0.25, environmentalRisk: 0.15 },
  'EV Charging Station': { population: 0.20, accessibility: 0.35, competition: 0.20, landUse: 0.15, environmentalRisk: 0.10 },
  'Telecom Tower': { population: 0.35, accessibility: 0.15, competition: 0.10, landUse: 0.20, environmentalRisk: 0.20 },
  'Renewable Energy': { population: 0.05, accessibility: 0.20, competition: 0.05, landUse: 0.40, environmentalRisk: 0.30 },
};

export const ISOCHRONE_DATA = {
  drive: [
    { minutes: 10, reachablePopulation: 18400, areaSqKm: 12.8, color: 'rgba(99, 102, 241, 0.45)', strokeColor: '#4f46e5', label: '10 min Drive' },
    { minutes: 20, reachablePopulation: 64200, areaSqKm: 42.4, color: 'rgba(129, 140, 248, 0.28)', strokeColor: '#6366f1', label: '20 min Drive' },
    { minutes: 30, reachablePopulation: 142700, areaSqKm: 98.6, color: 'rgba(165, 180, 252, 0.16)', strokeColor: '#818cf8', label: '30 min Drive' },
  ],
  walk: [
    { minutes: 10, reachablePopulation: 4200, areaSqKm: 2.1, color: 'rgba(16, 185, 129, 0.40)', strokeColor: '#059669', label: '10 min Walk' },
    { minutes: 20, reachablePopulation: 11800, areaSqKm: 6.8, color: 'rgba(52, 211, 153, 0.25)', strokeColor: '#10b981', label: '20 min Walk' },
    { minutes: 30, reachablePopulation: 26500, areaSqKm: 14.5, color: 'rgba(110, 231, 183, 0.15)', strokeColor: '#34d399', label: '30 min Walk' },
  ],
};

export const DISTANCE_DECAY_DATA = [
  { distance: '0.5 km', impact: 92, weight: 'Severe', competitors: 1 },
  { distance: '1.0 km', impact: 78, weight: 'High', competitors: 2 },
  { distance: '2.0 km', impact: 54, weight: 'Moderate', competitors: 3 },
  { distance: '3.0 km', impact: 32, weight: 'Low', competitors: 5 },
  { distance: '5.0 km', impact: 14, weight: 'Minimal', competitors: 11 },
];

export const DEFAULT_MAP_LAYERS: MapLayerConfig[] = [
  { id: 'pop_density', name: 'Population Density', category: 'core', active: true, opacity: 0.75, featureCount: 1420, lastUpdated: 'Live Feed', color: '#6366f1', description: 'High-resolution Census & mobile trace population distribution heat grid.' },
  { id: 'road_access', name: 'Road Accessibility', category: 'core', active: true, opacity: 0.85, featureCount: 864, lastUpdated: 'Live Feed', color: '#0ea5e9', description: 'Multi-modal transit network with speed limits and intersection topology.' },
  { id: 'competitors', name: 'Competitors', category: 'analysis', active: true, opacity: 0.90, featureCount: 105, lastUpdated: 'Live Feed', color: '#f43f5e', description: 'Direct and adjacent commercial competitors scraped from spatial registries.' },
  { id: 'land_use', name: 'Land Use', category: 'core', active: true, opacity: 0.65, featureCount: 420, lastUpdated: 'Live Feed', color: '#10b981', description: 'Municipal zoning plans, commercial plots, setbacks, and building footprints.' },
  { id: 'risk_zones', name: 'Risk Zones', category: 'risk', active: true, opacity: 0.60, featureCount: 68, lastUpdated: 'Live Feed', color: '#f59e0b', description: 'Environmental and operational risk areas (e.g. flood plain buffer zones).' },
  { id: 'h3_grid', name: 'H3 Grid', category: 'analysis', active: true, opacity: 0.65, featureCount: 185, lastUpdated: 'Spatial Index', color: '#8b5cf6', description: 'Uber H3 Resolution 8 spatial tessellation with indexed readiness indices.' },
  { id: 'hotspots', name: 'DBSCAN Hotspots', category: 'analysis', active: true, opacity: 0.75, featureCount: 185, lastUpdated: 'On-demand', color: '#ec4899', description: 'Auto-clustered spatial hotspots identifying agglomeration economies.' },
];

// Clean City Data Generator (zero hardcoded mock sites on open)
const generateCityData = (city: City): CityData => {
  return {
    city,
    candidateSites: [],
    competitors: [],
    h3Cells: [],
    demographics: {
      totalMetropolitanPopulation: 0,
      averageDensityPerSqKm: 0,
      medianMonthlyIncomeINR: 0,
      activeHouseholds: 0,
      ageDistribution: [],
      incomeBrackets: [],
    },
    opportunityZones: [],
    riverCoordinates: [],
    roads: [],
  };
};

export const CITY_DATA: Record<string, CityData> = {
  workspace: generateCityData(CITIES[0]),
};
