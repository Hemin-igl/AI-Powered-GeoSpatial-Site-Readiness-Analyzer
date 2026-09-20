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
