import { CandidateSite, CompetitorPoint, H3CellData, MapLayerConfig, OpportunityZone, ScoringWeights, City, CityData } from '../types';

export const CITIES: City[] = [
  {
    id: 'surat',
    name: 'Surat Metropolitan Area',
    state: 'Gujarat',
    country: 'India',
    lat: 21.1702,
    lng: 72.8311,
  },
  {
    id: 'mumbai',
    name: 'Mumbai Metropolitan Region',
    state: 'Maharashtra',
    country: 'India',
    lat: 19.0760,
    lng: 72.8777,
  },
  {
    id: 'delhi',
    name: 'National Capital Region (NCR)',
    state: 'Delhi',
    country: 'India',
    lat: 28.7041,
    lng: 77.1025,
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
  { id: 'pop_density', name: 'Population Density', category: 'core', active: true, opacity: 0.75, featureCount: 1420, lastUpdated: 'Today, 14:30', color: '#6366f1', description: 'High-resolution Census & mobile trace population distribution heat grid.' },
  { id: 'road_access', name: 'Road Accessibility', category: 'core', active: true, opacity: 0.85, featureCount: 864, lastUpdated: 'Yesterday', color: '#0ea5e9', description: 'Multi-modal transit network with speed limits and intersection topology.' },
  { id: 'competitors', name: 'Competitors', category: 'analysis', active: true, opacity: 0.90, featureCount: 105, lastUpdated: 'Live Feed', color: '#f43f5e', description: 'Direct and adjacent commercial competitors scraped from spatial registries.' },
  { id: 'land_use', name: 'Land Use', category: 'core', active: true, opacity: 0.65, featureCount: 420, lastUpdated: '3 days ago', color: '#10b981', description: 'Municipal zoning plans, commercial plots, setbacks, and building footprints.' },
  { id: 'risk_zones', name: 'Risk Zones', category: 'risk', active: true, opacity: 0.60, featureCount: 68, lastUpdated: '1 week ago', color: '#f59e0b', description: 'Environmental and operational risk areas (e.g. flood plain buffer zones).' },
  { id: 'h3_grid', name: 'H3 Grid', category: 'analysis', active: false, opacity: 0.70, featureCount: 132, lastUpdated: 'Static Index', color: '#8b5cf6', description: 'Uber H3 Resolution 8 spatial tessellation with indexed readiness indices.' },
  { id: 'hotspots', name: 'DBSCAN Hotspots', category: 'analysis', active: false, opacity: 0.80, featureCount: 14, lastUpdated: 'On-demand', color: '#ec4899', description: 'Auto-clustered spatial hotspots identifying agglomeration economies.' },
];

// Helper to generate dynamic data for a given city
const generateCityData = (city: City) => {
  const isSurat = city.id === 'surat';
  
  // Generating sites
  const candidateSites = Array.from({ length: 45 }, (_, i) => {
    const latOffset = (Math.sin(i * 1.7) * 0.08) + (Math.cos(i * 0.9) * 0.03);
    const lngOffset = (Math.cos(i * 1.4) * 0.11) + (Math.sin(i * 0.6) * 0.04);
    const types: any[] = ['Retail Store', 'Warehouse', 'EV Charging Station', 'Telecom Tower', 'Renewable Energy'];
    const bType = types[i % types.length];
    
    // Pick different area names for realism
    const localities = isSurat ? ['Vesu', 'Adajan', 'Varachha', 'Dumas', 'Katargam'] : ['Central Phase 1', 'North Zone', 'East Wing', 'Industrial Park A', 'Tech Corridor'];
    const loc = localities[i % localities.length];
    
    // Some math to make consistent looking data
    const popScore = Math.floor(65 + (Math.abs(Math.sin(i * 3.1)) * 32));
    const accScore = Math.floor(68 + (Math.abs(Math.cos(i * 2.3)) * 28));
    const compScore = Math.floor(55 + (Math.abs(Math.sin(i * 4.5)) * 40));
    const riskScore = Math.floor(62 + (Math.abs(Math.sin(i * 2.9)) * 33));
    const overall = Math.round((popScore * 0.3) + (accScore * 0.25) + (compScore * 0.15) + (70 * 0.15) + (riskScore * 0.15));

    return {
      id: `${city.id}-site-${i}`,
      name: `${loc} ${bType} Node ${i+1}`,
      area: loc,
      lat: Number((city.lat + latOffset).toFixed(4)),
      lng: Number((city.lng + lngOffset).toFixed(4)),
      businessType: bType,
      readinessScore: overall,
      status: (overall >= 80 ? 'High Potential' : overall >= 65 ? 'Moderate Potential' : 'Needs Review') as 'High Potential' | 'Moderate Potential' | 'Needs Review',
      factors: { population: popScore, accessibility: accScore, competition: compScore, landUse: 70, environmentalRisk: riskScore },
      metrics: {
        populationWithin5km: Math.floor(80000 + (popScore * 1800)),
        populationDensity: Math.floor(4000 + (popScore * 140)),
        nearestHighwayKm: Number((0.5 + (Math.abs(Math.sin(i)) * 3.5)).toFixed(1)),
        nearestMajorRoadMeters: Math.floor(100 + (Math.abs(Math.cos(i)) * 600)),
        competitorsWithin1km: Math.floor(1 + (Math.abs(Math.sin(i * 2)) * 4)),
        competitorsWithin3km: Math.floor(3 + (Math.abs(Math.cos(i * 3)) * 8)),
        competitorsWithin5km: Math.floor(7 + (Math.abs(Math.sin(i * 5)) * 14)),
        medianIncomeMonthly: Math.floor(52000 + (Math.abs(Math.cos(i)) * 38000)),
        zoningCode: 'M-1 Mixed Development',
        floodRiskLevel: (riskScore < 70 ? 'High' : riskScore < 82 ? 'Medium' : 'Low') as 'Low' | 'Medium' | 'High',
      },
      summary: `Spatial screening for ${loc} indicates robust accessibility index and balanced demographic catchment for ${bType.toLowerCase()} placement.`
    };
  });

  // H3 Cells
  const h3Cells: H3CellData[] = [];
  const rows = 11;
  const cols = 12;
  const latStep = 0.013;
  const lngStep = 0.017;
  
  let count = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      count++;
      const lat = Number((city.lat - 0.06 + (r * latStep) + ((c % 2) * (latStep / 2))).toFixed(4));
      const lng = Number((city.lng - 0.1 + (c * lngStep)).toFixed(4));
      const oppLevel: any = count % 3 === 0 ? 'High' : 'Medium';
      h3Cells.push({
        id: `h3-${count}`,
        h3Index: `886189${(count + 100).toString(16)}ffff`,
        lat,
        lng,
        readinessScore: 60 + (r * 2),
        population: 8000 + c * 100,
        competitors: (r + c) % 5,
        accessibility: 70 + c,
        opportunityLevel: oppLevel,
        hotspotType: 'neutral',
        clusterId: 1
      });
    }
  }

  // Opportunity Zones
  const opportunityZones: OpportunityZone[] = Array.from({ length: 6 }, (_, idx) => ({
    id: `opp-${idx}`,
    name: `Zone ${idx + 1} Strategic Cluster`,
    siteId: candidateSites[idx].id,
    lat: candidateSites[idx].lat,
    lng: candidateSites[idx].lng,
    readinessScore: candidateSites[idx].readinessScore,
    recommendedArchetype: candidateSites[idx].businessType,
    populationDensityTier: 'High',
    competitionTier: 'Low',
    estimatedFootfallDaily: 4500 + idx * 230
  }));

  const demographics = {
    totalMetropolitanPopulation: isSurat ? 2640000 : 8000000,
    averageDensityPerSqKm: isSurat ? 12480 : 22000,
    medianMonthlyIncomeINR: isSurat ? 68500 : 85000,
    activeHouseholds: isSurat ? 590000 : 1200000,
    ageDistribution: [
      { range: '18-24', percentage: 24, label: 'Young Adults & Students' },
      { range: '25-34', percentage: 31, label: 'Core Workforce & Families' },
      { range: '35-44', percentage: 21, label: 'Mid-Career Professionals' },
      { range: '45-54', percentage: 14, label: 'Mature Households' },
      { range: '55+', percentage: 10, label: 'Seniors & Retired' },
    ],
    incomeBrackets: [
      { tier: '< ₹35k', share: 18, color: '#94a3b8' },
      { tier: '₹35k - ₹60k', share: 34, color: '#818cf8' },
      { tier: '₹60k - ₹100k', share: 31, color: '#6366f1' },
      { tier: '> ₹100k', share: 17, color: '#4338ca' },
    ]
  };

  return {
    city,
    candidateSites,
    competitors: [], // Omitted large generation for brevity, can generate if needed
    h3Cells,
    demographics,
    opportunityZones,
    riverCoordinates: [],
    roads: [],
  };
};

export const CITY_DATA: Record<string, CityData> = {
  surat: generateCityData(CITIES[0]),
  mumbai: generateCityData(CITIES[1]),
  delhi: generateCityData(CITIES[2]),
};
