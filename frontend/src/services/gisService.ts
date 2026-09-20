import {
  CITY_DATA,
  DEFAULT_MAP_LAYERS,
  ISOCHRONE_DATA,
  PRESET_WEIGHTS,
} from '../data/mockData';
import {
  BusinessType,
  CandidateSite,
  CompetitorPoint,
  H3CellData,
  MapLayerConfig,
  ScoringWeights,
} from '../types';

// Real-world competitor brand datasets by business archetype
export const REAL_WORLD_COMPETITORS_BY_TYPE: Record<BusinessType, { name: string; brand: string; category: string; rating: number; radiusOffsetKm: number; angleDeg: number }[]> = {
  'Retail Store': [
    { name: 'Reliance Smart Bazaar', brand: 'Reliance Retail', category: 'Hypermarket & Grocery', rating: 4.4, radiusOffsetKm: 0.8, angleDeg: 35 },
    { name: 'D-Mart Supercenter', brand: 'Avenue Supermarts', category: 'Discount Retail & Supermarket', rating: 4.7, radiusOffsetKm: 1.4, angleDeg: 120 },
    { name: 'Starbucks Coffee & Drive-Thru', brand: 'Tata Starbucks', category: 'Specialty Cafe & QSR', rating: 4.5, radiusOffsetKm: 0.6, angleDeg: 210 },
    { name: 'Croma Mega Electronics', brand: 'Tata Digital', category: 'Consumer Electronics & Appliances', rating: 4.3, radiusOffsetKm: 1.9, angleDeg: 295 },
    { name: 'Zudio Fast Fashion', brand: 'Trent Ltd', category: 'Apparel & Department Store', rating: 4.2, radiusOffsetKm: 1.1, angleDeg: 75 },
    { name: 'Decathlon Sports Hub', brand: 'Decathlon', category: 'Sporting Goods Mega-Store', rating: 4.8, radiusOffsetKm: 2.8, angleDeg: 165 },
    { name: 'Westside Flagship', brand: 'Trent Ltd', category: 'Fashion & Lifestyle Retail', rating: 4.4, radiusOffsetKm: 2.1, angleDeg: 340 },
    { name: 'McDonald’s Drive-Thru', brand: 'McDonald’s', category: 'Quick Service Restaurant', rating: 4.2, radiusOffsetKm: 0.5, angleDeg: 15 },
    { name: 'Apple Premium Reseller (Unicorn)', brand: 'Apple Authorized', category: 'Premium Technology Retail', rating: 4.9, radiusOffsetKm: 1.5, angleDeg: 190 },
    { name: 'Shoppers Stop Lifestyle Mall', brand: 'Shoppers Stop', category: 'Department Store & Cosmetics', rating: 4.3, radiusOffsetKm: 3.2, angleDeg: 260 },
  ],
  'EV Charging Station': [
    { name: 'Tata Power EZ Charge 60kW DC Fast Hub', brand: 'Tata Power', category: 'Dual-Gun CCS2 Fast Hub', rating: 4.5, radiusOffsetKm: 0.7, angleDeg: 45 },
    { name: 'Jio-bp pulse 120kW Super-Charger', brand: 'Jio-bp', category: 'Ultra-Fast Highway Hub', rating: 4.7, radiusOffsetKm: 1.3, angleDeg: 140 },
    { name: 'Ather Grid Fast Charging Point', brand: 'Ather Energy', category: '2-Wheeler Rapid Point', rating: 4.6, radiusOffsetKm: 0.9, angleDeg: 225 },
    { name: 'Statiq Ultra Commercial Station', brand: 'Statiq', category: 'Public Multi-Vehicle Hub', rating: 4.2, radiusOffsetKm: 2.2, angleDeg: 315 },
    { name: 'ChargePoint 50kW Dual Charger', brand: 'ChargePoint', category: 'Fleet & Public Fast Hub', rating: 4.4, radiusOffsetKm: 1.8, angleDeg: 85 },
    { name: 'Zeon Charging 150kW Hyper-Port', brand: 'Zeon', category: 'Commercial Ultra-Fast', rating: 4.6, radiusOffsetKm: 3.1, angleDeg: 180 },
  ],
  'Warehouse': [
    { name: 'Amazon Sortation & Fulfillment Centre', brand: 'Amazon Logistics', category: 'E-commerce Mega Fulfillment', rating: 4.8, radiusOffsetKm: 2.4, angleDeg: 60 },
    { name: 'Flipkart Large Goods Hub', brand: 'Flipkart Logistics', category: 'Regional Sorting Facility', rating: 4.5, radiusOffsetKm: 3.1, angleDeg: 150 },
    { name: 'DHL Global Express Air Freight Terminal', brand: 'DHL Express', category: 'Cross-Border Logistics Gateway', rating: 4.6, radiusOffsetKm: 1.9, angleDeg: 240 },
    { name: 'Blue Dart Aviation Cargo Hub', brand: 'Blue Dart', category: 'Express Parcel Distribution', rating: 4.3, radiusOffsetKm: 2.7, angleDeg: 320 },
    { name: 'Delhivery Mega Gateway & Truck Terminal', brand: 'Delhivery', category: 'Automated Hub & Spoke Facility', rating: 4.2, radiusOffsetKm: 3.9, angleDeg: 105 },
  ],
  'Telecom Tower': [
    { name: 'Indus Towers 5G High-Density Active Node', brand: 'Indus Towers', category: 'Shared Infrastructure Monopole', rating: 4.6, radiusOffsetKm: 0.4, angleDeg: 30 },
    { name: 'Bharti Airtel 5G Ultra-Wideband Tower', brand: 'Airtel', category: 'Fiberized Macrocell Tower', rating: 4.7, radiusOffsetKm: 1.2, angleDeg: 135 },
    { name: 'Reliance Jio True5G Giga-Node Lattice', brand: 'Jio Platforms', category: 'C-Band 5G High-Capacity', rating: 4.8, radiusOffsetKm: 0.8, angleDeg: 220 },
    { name: 'American Tower Corp (ATC) Multi-Tenant Site', brand: 'ATC India', category: 'Co-Location Lattice Tower', rating: 4.3, radiusOffsetKm: 2.1, angleDeg: 305 },
  ],
  'Renewable Energy': [
    { name: 'Tata Power Solar Microgrid Plant', brand: 'Tata Power Solar', category: 'Ground-Mounted Photovoltaic Array', rating: 4.7, radiusOffsetKm: 3.2, angleDeg: 55 },
    { name: 'Adani Green Energy Substation & Feed', brand: 'Adani Green', category: 'High-Voltage Grid Interconnection', rating: 4.5, radiusOffsetKm: 4.1, angleDeg: 160 },
    { name: 'Sterling & Wilson Commercial Solar Farm', brand: 'Sterling & Wilson', category: 'Commercial Rooftop & Solar Field', rating: 4.6, radiusOffsetKm: 2.6, angleDeg: 280 },
  ],
};

/**
 * Generates realistic real-world competitors around target coordinates
 */
export function generateRealWorldCompetitors(
  centerLat: number,
  centerLng: number,
  businessType: BusinessType = 'Retail Store'
): CompetitorPoint[] {
  const templates = REAL_WORLD_COMPETITORS_BY_TYPE[businessType] || REAL_WORLD_COMPETITORS_BY_TYPE['Retail Store'];

  return templates.map((tmpl, idx) => {
    const rad = (tmpl.angleDeg * Math.PI) / 180;
    const latOffset = (tmpl.radiusOffsetKm * Math.cos(rad)) / 111.32;
    const lngOffset = (tmpl.radiusOffsetKm * Math.sin(rad)) / (111.32 * Math.cos((centerLat * Math.PI) / 180));

    return {
      id: `comp_${businessType.toLowerCase().slice(0, 3)}_${idx + 1}`,
      name: tmpl.name,
      brand: tmpl.brand,
      category: tmpl.category,
      lat: Number((centerLat + latOffset).toFixed(5)),
      lng: Number((centerLng + lngOffset).toFixed(5)),
      distanceKm: Number(tmpl.radiusOffsetKm.toFixed(1)),
      rating: tmpl.rating,
    };
  });
}

/**
 * Generates H3 Hexagonal Opportunity Grid around target coordinates
 */
export function generateH3GridAround(centerLat: number, centerLng: number): H3CellData[] {
  const cells: H3CellData[] = [];
  const rings = [
    { radiusKm: 0.0, count: 1, prefix: 'core' },
    { radiusKm: 0.75, count: 6, prefix: 'ring1' },
    { radiusKm: 1.5, count: 12, prefix: 'ring2' },
  ];

  let idCounter = 1;

  rings.forEach((ring) => {
    if (ring.radiusKm === 0) {
      cells.push({
        id: `h3_cell_${idCounter++}`,
        h3Index: `8860165a${Math.floor(1000 + Math.random() * 9000)}ffff`,
        lat: centerLat,
        lng: centerLng,
        readinessScore: 91,
        population: 34200,
        competitors: 2,
        accessibility: 94,
        opportunityLevel: 'High',
        hotspotType: 'hot',
        clusterId: 1,
      });
      return;
    }

    const stepAngle = (2 * Math.PI) / ring.count;
    for (let i = 0; i < ring.count; i++) {
      const angle = i * stepAngle;
      const latOffset = (ring.radiusKm * Math.cos(angle)) / 111.32;
      const lngOffset = (ring.radiusKm * Math.sin(angle)) / (111.32 * Math.cos((centerLat * Math.PI) / 180));

      const variance = (Math.sin(angle * 2) + Math.cos(angle * 3) + 2) / 4;
      const score = Math.min(96, Math.max(52, Math.round(60 + variance * 34)));

      cells.push({
        id: `h3_cell_${idCounter++}`,
        h3Index: `8860165a${Math.floor(1000 + (i + 1) * 731)}ffff`,
        lat: Number((centerLat + latOffset).toFixed(5)),
        lng: Number((centerLng + lngOffset).toFixed(5)),
        readinessScore: score,
        population: Math.round(12000 + variance * 28000),
        competitors: Math.round(1 + variance * 5),
        accessibility: Math.round(55 + variance * 40),
        opportunityLevel: score >= 80 ? 'High' : score >= 65 ? 'Medium' : 'Low',
        hotspotType: score >= 80 ? 'hot' : score < 65 ? 'cold' : 'neutral',
        clusterId: score >= 80 ? 1 : score >= 65 ? 2 : 3,
      });
    }
  });

  return cells;
}

/**
 * Generates high-density 3D building polygon footprints with realistic heights and architectural types
 */
export function generate3DBuildingsAround(centerLat: number, centerLng: number) {
  const buildings: {
    id: string;
    height: number;
    base: number;
    color: string;
    type: string;
    coordinates: [number, number][];
  }[] = [];

  const buildingArchetypes = [
    { name: 'Sky-Tower Corporate Plaza', minH: 90, maxH: 175, colors: ['#a855f7', '#8b5cf6', '#7c3aed'] },
    { name: 'Metropolitan Tech Center', minH: 60, maxH: 120, colors: ['#38bdf8', '#0ea5e9', '#0284c7'] },
    { name: 'Commercial Megamall & Hub', minH: 32, maxH: 55, colors: ['#10b981', '#059669', '#34d399'] },
    { name: 'Financial District Tower', minH: 100, maxH: 185, colors: ['#c084fc', '#e879f9', '#d946ef'] },
    { name: 'High-Rise Luxury Residences', minH: 70, maxH: 135, colors: ['#6366f1', '#4f46e5', '#818cf8'] },
    { name: 'Civic Center & Co-Working', minH: 28, maxH: 65, colors: ['#06b6d4', '#0891b2', '#22d3ee'] },
    { name: 'Logistics & Supply Depot', minH: 18, maxH: 35, colors: ['#f59e0b', '#d97706', '#fbbf24'] },
    { name: 'Innovation Research Lab', minH: 45, maxH: 85, colors: ['#ec4899', '#db2777', '#f472b6'] },
  ];

  const gridSize = 10;
  const spacingKm = 0.16;

  for (let x = -gridSize; x <= gridSize; x++) {
    for (let y = -gridSize; y <= gridSize; y++) {
      // Leave slight central clearing for site marker visibility
      const distFromCenter = Math.sqrt(x * x + y * y);
      if (distFromCenter < 0.6) continue;
      // Urban street grid cutouts
      if ((x % 3 === 0 && y % 2 === 0) || Math.random() < 0.15) continue;

      const typeIndex = Math.abs(x * 7 + y * 11) % buildingArchetypes.length;
      const archetype = buildingArchetypes[typeIndex];
      const color = archetype.colors[Math.abs(x * 3 + y * 5) % archetype.colors.length];

      // Central business district height decay
      const decayFactor = Math.max(0.35, 1.25 - (distFromCenter / gridSize) * 0.75);
      const randomJitter = 0.85 + Math.random() * 0.3;
      const height = Math.round(
        (archetype.minH + Math.random() * (archetype.maxH - archetype.minH)) * decayFactor * randomJitter
      );

      const bCenterLat = centerLat + (y * spacingKm + (Math.random() - 0.5) * 0.025) / 111.32;
      const bCenterLng =
        centerLng + (x * spacingKm + (Math.random() - 0.5) * 0.025) / (111.32 * Math.cos((centerLat * Math.PI) / 180));

      // Realistic building footprint size
      const width = 0.00045 + Math.random() * 0.00045;
      const length = 0.00045 + Math.random() * 0.00045;

      const coords: [number, number][] = [
        [bCenterLng - width, bCenterLat - length],
        [bCenterLng + width, bCenterLat - length],
        [bCenterLng + width, bCenterLat + length],
        [bCenterLng - width, bCenterLat + length],
        [bCenterLng - width, bCenterLat - length],
      ];

      buildings.push({
        id: `bld_${x}_${y}`,
        height,
        base: 0,
        color,
        type: archetype.name,
        coordinates: coords,
      });
    }
  }

  return buildings;
}

const workspaceData = CITY_DATA.workspace || { candidateSites: [], competitors: [], h3Cells: [] };
const CANDIDATE_SITES = workspaceData.candidateSites || [];
const COMPETITOR_POINTS = workspaceData.competitors || [];
const H3_HEXAGONS = workspaceData.h3Cells || [];

/**
 * Calculates a normalized readiness score given raw factor scores and weights.
 */
export function calculateReadinessScore(
  factors: CandidateSite['factors'],
  weights: ScoringWeights
): {
  finalScore: number;
  contributions: {
    factor: string;
    weight: number;
    rawScore: number;
    contribution: number;
  }[];
} {
  const sumWeights =
    weights.population +
    weights.accessibility +
    weights.competition +
    weights.landUse +
    weights.environmentalRisk;

  const normWeights: ScoringWeights =
    sumWeights > 0
      ? {
          population: weights.population / sumWeights,
          accessibility: weights.accessibility / sumWeights,
          competition: weights.competition / sumWeights,
          landUse: weights.landUse / sumWeights,
          environmentalRisk: weights.environmentalRisk / sumWeights,
        }
      : weights;

  const contributions = [
    {
      factor: 'Population Density',
      weight: normWeights.population,
      rawScore: factors.population,
      contribution: Number((factors.population * normWeights.population).toFixed(2)),
    },
    {
      factor: 'Accessibility',
      weight: normWeights.accessibility,
      rawScore: factors.accessibility,
      contribution: Number((factors.accessibility * normWeights.accessibility).toFixed(2)),
    },
    {
      factor: 'Competition',
      weight: normWeights.competition,
      rawScore: factors.competition,
      contribution: Number((factors.competition * normWeights.competition).toFixed(2)),
    },
    {
      factor: 'Land Use',
      weight: normWeights.landUse,
      rawScore: factors.landUse,
      contribution: Number((factors.landUse * normWeights.landUse).toFixed(2)),
    },
    {
      factor: 'Environmental Risk',
      weight: normWeights.environmentalRisk,
      rawScore: factors.environmentalRisk,
      contribution: Number((factors.environmentalRisk * normWeights.environmentalRisk).toFixed(2)),
    },
  ];

  const total = contributions.reduce((acc, c) => acc + c.contribution, 0);
  const finalScore = Math.round(total);

  return { finalScore, contributions };
}

/**
 * Simulates analyzing a geographic location (lat, lng, businessType, weights).
 */
export async function analyzeSite(params: {
  name?: string;
  lat: number;
  lng: number;
  businessType: BusinessType;
  weights?: ScoringWeights;
  radiusKm?: number;
}): Promise<CandidateSite> {
  const siteName = params.name || `Site @ ${params.lat.toFixed(4)}, ${params.lng.toFixed(4)}`;
  const weights = params.weights || PRESET_WEIGHTS[params.businessType] || PRESET_WEIGHTS['Retail Store'];

  try {
    const res = await fetch('http://localhost:8000/api/v1/sites/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        latitude: params.lat,
        longitude: params.lng,
        business_type: params.businessType.toLowerCase().replace(/\s+/g, '_'),
        radius_km: params.radiusKm || 5,
        weights: {
          population: weights.population,
          accessibility: weights.accessibility,
          competition: weights.competition,
          land_use: weights.landUse,
          risk: weights.environmentalRisk,
        },
      }),
    });

    if (res.ok) {
      const data = await res.json();
      const finalScore = Math.round(data.score);
      return {
        id: data.site_id,
        name: siteName,
        area: `Geo Coordinates (${params.lat.toFixed(3)}, ${params.lng.toFixed(3)})`,
        lat: params.lat,
        lng: params.lng,
        businessType: params.businessType,
        readinessScore: finalScore,
        status: finalScore >= 80 ? 'High Potential' : finalScore >= 65 ? 'Moderate Potential' : 'Needs Review',
        factors: {
          population: Math.round(data.factors.population),
          accessibility: Math.round(data.factors.accessibility),
          competition: Math.round(data.factors.competition),
          landUse: Math.round(data.factors.land_use),
          environmentalRisk: Math.round(data.factors.risk),
        },
        metrics: {
          populationWithin5km: data.metrics.population_30min || 120000,
          populationDensity: Math.round((data.factors.population || 75) * 120),
          nearestHighwayKm: Number((data.metrics.road_proximity_m ? data.metrics.road_proximity_m / 1000 : 0.8).toFixed(1)),
          nearestMajorRoadMeters: data.metrics.road_proximity_m || 150,
          competitorsWithin1km: data.metrics.competitors_1km || 1,
          competitorsWithin3km: data.metrics.competitors_3km || 3,
          competitorsWithin5km: data.metrics.competitors_5km || 7,
          medianIncomeMonthly: 55000,
          zoningCode: data.metrics.zoning_classification || 'Commercial Multi-Use',
          floodRiskLevel: data.metrics.flood_risk_zone || 'Low',
        },
        summary: `Grounded backend scoring engine v1.0 evaluated ${siteName} with a score of ${finalScore}/100 based on normalized spatial factors.`,
      };
    }
  } catch {
    // Graceful fallback to client-side formula if server offline
  }

  // Pure deterministic spatial calculation
  const factorBase = (Math.sin(params.lat * 8.5) + Math.cos(params.lng * 8.5) + 2.0) / 4.0;
  const rawPop = Math.min(99, Math.round(50 + factorBase * 45));
  const rawAcc = Math.min(99, Math.round(55 + factorBase * 40));
  const rawComp = Math.min(95, Math.round(40 + (1 - factorBase) * 45));
  const rawLand = Math.min(98, Math.round(65 + factorBase * 30));
  const rawRisk = Math.min(95, Math.round(60 + factorBase * 35));

  const factors = {
    population: rawPop,
    accessibility: rawAcc,
    competition: rawComp,
    landUse: rawLand,
    environmentalRisk: rawRisk,
  };

  const { finalScore } = calculateReadinessScore(factors, weights);
  const siteId = `site_${Math.abs(Math.round(params.lat * 10000 + params.lng * 10000))}`;

  return {
    id: siteId,
    name: siteName,
    area: `Location (${params.lat.toFixed(3)}, ${params.lng.toFixed(3)})`,
    lat: params.lat,
    lng: params.lng,
    businessType: params.businessType,
    readinessScore: finalScore,
    status: finalScore >= 80 ? 'High Potential' : finalScore >= 65 ? 'Moderate Potential' : 'Needs Review',
    factors,
    metrics: {
      populationWithin5km: Math.round(50000 + factorBase * 150000),
      populationDensity: Math.round(3500 + factorBase * 10000),
      nearestHighwayKm: Number((0.5 + (1 - factorBase) * 2.5).toFixed(1)),
      nearestMajorRoadMeters: Math.round(100 + (1 - factorBase) * 450),
      competitorsWithin1km: Math.round(1 + factorBase * 3),
      competitorsWithin3km: Math.round(2 + factorBase * 6),
      competitorsWithin5km: Math.round(5 + factorBase * 10),
      medianIncomeMonthly: Math.round(45000 + factorBase * 40000),
      zoningCode: 'Commercial Multi-Use',
      floodRiskLevel: rawRisk < 70 ? 'High' : rawRisk < 82 ? 'Medium' : 'Low',
    },
    summary: `Spatial evaluation for ${siteName} yields readiness of ${finalScore}/100 based on multi-criteria analysis.`,
  };
}

/**
 * Returns available GIS layers
 */
export async function getLayers(): Promise<MapLayerConfig[]> {
  return DEFAULT_MAP_LAYERS;
}

/**
 * Searches and discovers opportunity zones based on user-defined criteria
 */
export async function getOpportunities(filters: {
  businessType: BusinessType;
  minReadiness: number;
  populationFilter: 'All' | 'High' | 'Medium' | 'Low';
  competitionFilter: 'All' | 'Low' | 'Medium' | 'High';
  accessibilityFilter: 'All' | 'High' | 'Medium';
  riskFilter: 'All' | 'Low' | 'Medium';
  radiusKm?: number;
}): Promise<CandidateSite[]> {
  await new Promise((res) => setTimeout(res, 200));

  return CANDIDATE_SITES.filter((site) => {
    if (site.readinessScore < filters.minReadiness) return false;

    if (filters.populationFilter === 'High' && site.factors.population < 80) return false;
    if (filters.populationFilter === 'Low' && site.factors.population > 70) return false;

    if (filters.competitionFilter === 'Low' && site.factors.competition < 75) return false; // Higher score = lower competition penalty
    if (filters.competitionFilter === 'High' && site.factors.competition > 65) return false;

    if (filters.accessibilityFilter === 'High' && site.factors.accessibility < 80) return false;
    if (filters.riskFilter === 'Low' && site.factors.environmentalRisk < 80) return false;

    return true;
  });
}

/**
 * Returns catchment / isochrone polygons and stats
 */
export async function getIsochrone(mode: 'drive' | 'walk' = 'drive') {
  return ISOCHRONE_DATA[mode];
}

/**
 * Returns competitor points near a coordinate
 */
export async function getCompetitors(lat: number, lng: number, radiusKm: number = 5): Promise<CompetitorPoint[]> {
  return COMPETITOR_POINTS.filter((comp) => {
    const dist = Math.sqrt(Math.pow(comp.lat - lat, 2) + Math.pow(comp.lng - lng, 2)) * 111; // approximate km
    return dist <= radiusKm;
  });
}

/**
 * Returns H3 Hexagonal Grid with algorithm clustering applied
 */
export async function getHotspots(algorithm: 'H3 Grid' | 'DBSCAN' | 'Getis-Ord Gi*'): Promise<H3CellData[]> {
  return H3_HEXAGONS.map((hex) => {
    if (algorithm === 'Getis-Ord Gi*') {
      return {
        ...hex,
        opportunityLevel: hex.hotspotType === 'hot' ? 'High' : hex.hotspotType === 'cold' ? 'Low' : 'Medium',
      };
    }
    if (algorithm === 'DBSCAN') {
      return {
        ...hex,
        opportunityLevel: hex.clusterId && hex.clusterId <= 2 ? 'High' : hex.clusterId === 3 ? 'Medium' : 'Low',
      };
    }
    return hex;
  });
}

/**
 * Generates simulated AI site intelligence explanation based on factors and site metadata
 */
export function generateAiExplanation(
  site: CandidateSite,
  type: 'explain' | 'weaknesses' | 'recommendations'
): string {
  const topFactor = Object.entries(site.factors).sort((a, b) => b[1] - a[1])[0];
  const lowestFactor = Object.entries(site.factors).sort((a, b) => a[1] - b[1])[0];

  const factorNameMap: Record<string, string> = {
    population: 'population density',
    accessibility: 'road accessibility',
    competition: 'competition density index',
    landUse: 'favorable commercial land use',
    environmentalRisk: 'environmental/flood security',
  };

  if (type === 'weaknesses') {
    return `Analysis of potential limitations for ${site.name}:
• Primary bottleneck: ${factorNameMap[lowestFactor[0]]} scored at ${lowestFactor[1]}/100.
• Competitor pressure: ${site.metrics.competitorsWithin3km} direct competitors identified within a 3 km catchment zone.
• Access friction: Minor peak-hour traffic bottleneck along connecting feeder streets (${site.metrics.nearestMajorRoadMeters}m from main arterial corridor).
• Recommended Mitigation: Secure dedicated ingress/egress parking bays and evaluate customer acquisition strategies to offset local market saturation.`;
  }

  if (type === 'recommendations') {
    return `Actionable spatial recommendations for ${site.name}:
1. Fast-Track Permitting: Commercial land use is rated exceptionally high (${site.factors.landUse}/100) under zoning code ${site.metrics.zoningCode}.
2. Catchment Optimization: Approximately ${(site.metrics.populationWithin5km / 1000).toFixed(1)}k residents live within 5 km, yielding high primary customer density.
3. Marketing Radius: Target promotional campaigns within the 10-minute isochrone (~18,400 immediate population) before expanding outward.
4. Infrastructure Readiness: High-speed grid power and multi-modal transit links allow accelerated deployment within 60 days.`;
  }

  return `This location scores ${site.readinessScore}/100 because of strong ${factorNameMap[topFactor[0]]} (${topFactor[1]}/100), excellent road accessibility (${site.factors.accessibility}/100), and favorable commercial land use (${site.factors.landUse}/100).

The primary limitation is competitor concentration within the 5 km catchment area (${site.metrics.competitorsWithin5km} competing sites detected).

The site has approximately 64,200 people reachable within 20 minutes and immediate access to arterial transit lines.`;
}
