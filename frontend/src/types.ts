export type BusinessType =
  | 'Retail Store'
  | 'Warehouse'
  | 'EV Charging Station'
  | 'Telecom Tower'
  | 'Renewable Energy';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface CandidateSite {
  id: string;
  name: string;
  area: string;
  lat: number;
  lng: number;
  businessType: BusinessType;
  readinessScore: number;
  status: 'High Potential' | 'Moderate Potential' | 'Needs Review';
  factors: {
    population: number;
    accessibility: number;
    competition: number;
    landUse: number;
    environmentalRisk: number;
  };
  metrics: {
    populationWithin5km: number;
    populationDensity: number;
    nearestHighwayKm: number;
    nearestMajorRoadMeters: number;
    competitorsWithin1km: number;
    competitorsWithin3km: number;
    competitorsWithin5km: number;
    medianIncomeMonthly: number;
    zoningCode: string;
    floodRiskLevel: 'Low' | 'Medium' | 'High';
  };
  summary: string;
}

export interface ScoringWeights {
  population: number; // e.g. 0.30
  accessibility: number; // e.g. 0.25
  competition: number; // e.g. 0.15
  landUse: number; // e.g. 0.15
  environmentalRisk: number; // e.g. 0.15
}

export interface H3CellData {
  id: string;
  h3Index: string;
  lat: number;
  lng: number;
  readinessScore: number;
  population: number;
  competitors: number;
  accessibility: number;
  opportunityLevel: 'High' | 'Medium' | 'Low';
  hotspotType?: 'hot' | 'cold' | 'neutral';
  clusterId?: number;
}

export interface CompetitorPoint {
  id: string;
  name: string;
  brand: string;
  lat: number;
  lng: number;
  category: string;
  distanceKm?: number;
  rating?: number;
}

export interface IsochroneLevel {
  minutes: number;
  reachablePopulation: number;
  areaSqKm: number;
  color: string;
  pathOffsets: [number, number][]; // relative lat/lng offsets for polygon
}

export interface MapLayerConfig {
  id: string;
  name: string;
  category: 'core' | 'analysis' | 'risk';
  active: boolean;
  opacity: number;
  featureCount: number;
  lastUpdated: string;
  color: string;
  description: string;
}

export interface OpportunityZone {
  id: string;
  name: string;
  siteId: string;
  lat: number;
  lng: number;
  readinessScore: number;
  recommendedArchetype: string;
  populationDensityTier: 'High' | 'Medium' | 'Low';
  competitionTier: 'Low' | 'Medium' | 'High';
  estimatedFootfallDaily: number;
}

export interface ReportItem {
  id: string;
  title: string;
  siteName: string;
  businessType: BusinessType;
  date: string;
  author: string;
  score: number;
  summary: string;
  fileSize: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    targetPage: string;
  };
}
