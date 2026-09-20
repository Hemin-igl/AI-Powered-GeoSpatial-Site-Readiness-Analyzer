import { CandidateSite, CompetitorPoint, H3CellData, MapLayerConfig, OpportunityZone, ReportItem, ScoringWeights } from '../types';

export const SURAT_CENTER = {
  lat: 21.1702,
  lng: 72.8311,
  name: 'Surat Metropolitan Area',
  state: 'Gujarat, India',
};

// Preset weights for scoring configuration
export const PRESET_WEIGHTS: Record<string, ScoringWeights> = {
  'Retail Store': {
    population: 0.30,
    accessibility: 0.25,
    competition: 0.15,
    landUse: 0.15,
    environmentalRisk: 0.15,
  },
  'Warehouse': {
    population: 0.10,
    accessibility: 0.40,
    competition: 0.10,
    landUse: 0.25,
    environmentalRisk: 0.15,
  },
  'EV Charging Station': {
    population: 0.20,
    accessibility: 0.35,
    competition: 0.20,
    landUse: 0.15,
    environmentalRisk: 0.10,
  },
  'Telecom Tower': {
    population: 0.35,
    accessibility: 0.15,
    competition: 0.10,
    landUse: 0.20,
    environmentalRisk: 0.20,
  },
  'Renewable Energy': {
    population: 0.05,
    accessibility: 0.20,
    competition: 0.05,
    landUse: 0.40,
    environmentalRisk: 0.30,
  },
};

// Tapi River ribbon points (approximate curve through Surat from east to Arabian Sea in west)
export const TAPI_RIVER_COORDINATES: [number, number][] = [
  [21.242, 72.930],
  [21.232, 72.895],
  [21.218, 72.868],
  [21.205, 72.842],
  [21.196, 72.818],
  [21.191, 72.795],
  [21.175, 72.775],
  [21.155, 72.748],
  [21.130, 72.715],
  [21.110, 72.670],
];

// Major Arterial Roads in Surat
export const SURAT_ROADS = [
  {
    name: 'Surat-Dumas Highway (Gaurav Path)',
    coords: [
      [21.185, 72.810],
      [21.168, 72.788],
      [21.152, 72.765],
      [21.135, 72.745],
      [21.118, 72.725],
    ] as [number, number][],
    type: 'arterial',
  },
  {
    name: 'Inner Ring Road',
    coords: [
      [21.215, 72.840],
      [21.195, 72.865],
      [21.165, 72.860],
      [21.145, 72.835],
      [21.148, 72.800],
      [21.175, 72.790],
      [21.205, 72.805],
      [21.215, 72.840],
    ] as [number, number][],
    type: 'ring',
  },
  {
    name: 'Adajan - Hazira Expressway',
    coords: [
      [21.210, 72.800],
      [21.200, 72.770],
      [21.185, 72.730],
      [21.175, 72.685],
    ] as [number, number][],
    type: 'expressway',
  },
  {
    name: 'Varachha Main Road',
    coords: [
      [21.205, 72.840],
      [21.220, 72.865],
      [21.235, 72.895],
      [21.250, 72.930],
    ] as [number, number][],
    type: 'arterial',
  },
  {
    name: 'Udhna - Navsari Highway',
    coords: [
      [21.175, 72.840],
      [21.150, 72.855],
      [21.120, 72.870],
      [21.090, 72.890],
    ] as [number, number][],
    type: 'highway',
  },
];

// 52 Candidate Sites spread across Surat
export const CANDIDATE_SITES: CandidateSite[] = [
  {
    id: 'site-01',
    name: 'Vesu VIP Cross Road',
    area: 'Vesu',
    lat: 21.1448,
    lng: 72.7758,
    businessType: 'Retail Store',
    readinessScore: 82,
    status: 'High Potential',
    factors: {
      population: 91,
      accessibility: 87,
      competition: 63,
      landUse: 95,
      environmentalRisk: 78,
    },
    metrics: {
      populationWithin5km: 186400,
      populationDensity: 12480,
      nearestHighwayKm: 1.4,
      nearestMajorRoadMeters: 420,
      competitorsWithin1km: 2,
      competitorsWithin3km: 5,
      competitorsWithin5km: 11,
      medianIncomeMonthly: 78500,
      zoningCode: 'C-2 High Commercial',
      floodRiskLevel: 'Low',
    },
    summary:
      'This location scores highly because of strong population density, excellent road accessibility, and favorable commercial land use. The primary limitation is competitor concentration within the 5 km catchment area.',
  },
  {
    id: 'site-02',
    name: 'Adajan Pal Palika Complex',
    area: 'Adajan - Pal',
    lat: 21.1920,
    lng: 72.7950,
    businessType: 'Retail Store',
    readinessScore: 86,
    status: 'High Potential',
    factors: {
      population: 88,
      accessibility: 94,
      competition: 74,
      landUse: 92,
      environmentalRisk: 84,
    },
    metrics: {
      populationWithin5km: 214000,
      populationDensity: 14200,
      nearestHighwayKm: 0.9,
      nearestMajorRoadMeters: 180,
      competitorsWithin1km: 1,
      competitorsWithin3km: 4,
      competitorsWithin5km: 9,
      medianIncomeMonthly: 72000,
      zoningCode: 'C-1 Mixed Commercial',
      floodRiskLevel: 'Low',
    },
    summary:
      'Outstanding road connectivity across Cable-stayed Bridge, high footfall corridor, and balanced competitive pressure with young affluent family demographics.',
  },
  {
    id: 'site-03',
    name: 'Dumas Airport Tech Corridor',
    area: 'Dumas Road',
    lat: 21.1210,
    lng: 72.7480,
    businessType: 'EV Charging Station',
    readinessScore: 89,
    status: 'High Potential',
    factors: {
      population: 74,
      accessibility: 96,
      competition: 88,
      landUse: 94,
      environmentalRisk: 90,
    },
    metrics: {
      populationWithin5km: 94000,
      populationDensity: 7800,
      nearestHighwayKm: 0.3,
      nearestMajorRoadMeters: 120,
      competitorsWithin1km: 0,
      competitorsWithin3km: 2,
      competitorsWithin5km: 4,
      medianIncomeMonthly: 89000,
      zoningCode: 'T-3 Transit Corridor',
      floodRiskLevel: 'Low',
    },
    summary:
      'Optimal highway visibility near Surat International Airport with massive commuter throughput and virtually no competing fast chargers within 3 km.',
  },
  {
    id: 'site-04',
    name: 'Varachha Diamond Bourse Park',
    area: 'Varachha',
    lat: 21.2180,
    lng: 72.8620,
    businessType: 'Retail Store',
    readinessScore: 81,
    status: 'High Potential',
    factors: {
      population: 96,
      accessibility: 79,
      competition: 58,
      landUse: 88,
      environmentalRisk: 82,
    },
    metrics: {
      populationWithin5km: 295000,
      populationDensity: 19800,
      nearestHighwayKm: 2.1,
      nearestMajorRoadMeters: 250,
      competitorsWithin1km: 4,
      competitorsWithin3km: 12,
      competitorsWithin5km: 23,
      medianIncomeMonthly: 64000,
      zoningCode: 'C-3 Dense Retail',
      floodRiskLevel: 'Low',
    },
    summary:
      'Extreme pedestrian density and high disposable trading community spending; high traffic congestion is the primary operational trade-off.',
  },
  {
    id: 'site-05',
    name: 'Hazira Port Logistics Interchange',
    area: 'Hazira Corridor',
    lat: 21.1750,
    lng: 72.6850,
    businessType: 'Warehouse',
    readinessScore: 88,
    status: 'High Potential',
    factors: {
      population: 46,
      accessibility: 98,
      competition: 84,
      landUse: 97,
      environmentalRisk: 86,
    },
    metrics: {
      populationWithin5km: 42000,
      populationDensity: 3100,
      nearestHighwayKm: 0.1,
      nearestMajorRoadMeters: 50,
      competitorsWithin1km: 1,
      competitorsWithin3km: 3,
      competitorsWithin5km: 6,
      medianIncomeMonthly: 52000,
      zoningCode: 'I-2 Heavy Logistics',
      floodRiskLevel: 'Medium',
    },
    summary:
      'Ideal freight logistics hub directly feeding multi-lane industrial corridors with heavy-axle clearances and zero municipal curfews.',
  },
  {
    id: 'site-06',
    name: 'Piplod Waterfront Promenade',
    area: 'Piplod',
    lat: 21.1590,
    lng: 72.7680,
    businessType: 'Retail Store',
    readinessScore: 84,
    status: 'High Potential',
    factors: {
      population: 86,
      accessibility: 88,
      competition: 69,
      landUse: 92,
      environmentalRisk: 85,
    },
    metrics: {
      populationWithin5km: 165000,
      populationDensity: 11200,
      nearestHighwayKm: 1.1,
      nearestMajorRoadMeters: 210,
      competitorsWithin1km: 2,
      competitorsWithin3km: 6,
      competitorsWithin5km: 14,
      medianIncomeMonthly: 81000,
      zoningCode: 'C-2 High Commercial',
      floodRiskLevel: 'Low',
    },
    summary:
      'High-income urban pocket with established fine-dining, flagship retail, and leisure night-market foot traffic.',
  },
  {
    id: 'site-07',
    name: 'Udhna Industrial Junction Hub',
    area: 'Udhna',
    lat: 21.1550,
    lng: 72.8450,
    businessType: 'Warehouse',
    readinessScore: 79,
    status: 'Moderate Potential',
    factors: {
      population: 84,
      accessibility: 82,
      competition: 71,
      landUse: 83,
      environmentalRisk: 74,
    },
    metrics: {
      populationWithin5km: 240000,
      populationDensity: 16500,
      nearestHighwayKm: 1.6,
      nearestMajorRoadMeters: 340,
      competitorsWithin1km: 2,
      competitorsWithin3km: 7,
      competitorsWithin5km: 15,
      medianIncomeMonthly: 54000,
      zoningCode: 'I-1 Light Industrial',
      floodRiskLevel: 'Medium',
    },
    summary:
      'Central mid-mile distribution node with rail siding proximity, moderate land acquisition rates, and established labor catchment.',
  },
  {
    id: 'site-08',
    name: 'Katargam GIDC Diamond Zone',
    area: 'Katargam',
    lat: 21.2310,
    lng: 72.8250,
    businessType: 'Telecom Tower',
    readinessScore: 85,
    status: 'High Potential',
    factors: {
      population: 94,
      accessibility: 76,
      competition: 72,
      landUse: 90,
      environmentalRisk: 88,
    },
    metrics: {
      populationWithin5km: 280000,
      populationDensity: 18500,
      nearestHighwayKm: 2.8,
      nearestMajorRoadMeters: 220,
      competitorsWithin1km: 1,
      competitorsWithin3km: 5,
      competitorsWithin5km: 10,
      medianIncomeMonthly: 59000,
      zoningCode: 'M-1 Mixed Industrial',
      floodRiskLevel: 'Low',
    },
    summary:
      'Dense subscriber concentration with heavy data transmission demand and optimal building roof line elevations.',
  },
  {
    id: 'site-09',
    name: 'Althan Canal Green Expressway',
    area: 'Althan',
    lat: 21.1520,
    lng: 72.8120,
    businessType: 'Retail Store',
    readinessScore: 83,
    status: 'High Potential',
    factors: {
      population: 89,
      accessibility: 86,
      competition: 77,
      landUse: 89,
      environmentalRisk: 81,
    },
    metrics: {
      populationWithin5km: 198000,
      populationDensity: 13600,
      nearestHighwayKm: 1.8,
      nearestMajorRoadMeters: 190,
      competitorsWithin1km: 1,
      competitorsWithin3km: 4,
      competitorsWithin5km: 10,
      medianIncomeMonthly: 74000,
      zoningCode: 'C-1 Commercial',
      floodRiskLevel: 'Low',
    },
    summary:
      'Fast expanding upper-middle tier residential corridor with newly developed canal walkways and high-volume school/residential vehicular traffic.',
  },
  {
    id: 'site-10',
    name: 'Ichhapore Solar Park Reserve',
    area: 'Ichhapore',
    lat: 21.1410,
    lng: 72.6980,
    businessType: 'Renewable Energy',
    readinessScore: 87,
    status: 'High Potential',
    factors: {
      population: 32,
      accessibility: 84,
      competition: 92,
      landUse: 96,
      environmentalRisk: 91,
    },
    metrics: {
      populationWithin5km: 26000,
      populationDensity: 2100,
      nearestHighwayKm: 0.8,
      nearestMajorRoadMeters: 450,
      competitorsWithin1km: 0,
      competitorsWithin3km: 1,
      competitorsWithin5km: 2,
      medianIncomeMonthly: 48000,
      zoningCode: 'U-1 Open Utility',
      floodRiskLevel: 'Low',
    },
    summary:
      'Abundant horizontal solar irradiance, flat contiguous land parcel with direct interconnection to Gujarat Energy Transmission substation.',
  },
  {
    id: 'site-11',
    name: 'Ghod Dod Road High Street',
    area: 'Athwa',
    lat: 21.1780,
    lng: 72.8020,
    businessType: 'Retail Store',
    readinessScore: 85,
    status: 'High Potential',
    factors: {
      population: 92,
      accessibility: 89,
      competition: 55,
      landUse: 96,
      environmentalRisk: 93,
    },
    metrics: {
      populationWithin5km: 220000,
      populationDensity: 15800,
      nearestHighwayKm: 2.2,
      nearestMajorRoadMeters: 50,
      competitorsWithin1km: 5,
      competitorsWithin3km: 16,
      competitorsWithin5km: 28,
      medianIncomeMonthly: 96000,
      zoningCode: 'C-3 Premium Commercial',
      floodRiskLevel: 'Low',
    },
    summary:
      'Surats premier luxury retail boulevard; saturated competition is mitigated by extraordinarily high average transaction value.',
  },
  {
    id: 'site-12',
    name: 'Sachin GIDC South Industrial Gate',
    area: 'Sachin',
    lat: 21.0850,
    lng: 72.8620,
    businessType: 'Warehouse',
    readinessScore: 84,
    status: 'High Potential',
    factors: {
      population: 58,
      accessibility: 93,
      competition: 78,
      landUse: 94,
      environmentalRisk: 82,
    },
    metrics: {
      populationWithin5km: 88000,
      populationDensity: 6400,
      nearestHighwayKm: 0.4,
      nearestMajorRoadMeters: 150,
      competitorsWithin1km: 1,
      competitorsWithin3km: 5,
      competitorsWithin5km: 11,
      medianIncomeMonthly: 49000,
      zoningCode: 'I-2 Heavy Industrial',
      floodRiskLevel: 'Low',
    },
    summary:
      'Strategic South Gujarat border entry with immediate NH-48 access, suited for freight consolidation and B2B raw materials.',
  },
  // Additional simulated sites to reach 50+ candidate sites
  ...Array.from({ length: 38 }, (_, i) => {
    const id = `site-${i + 13}`;
    const latOffset = (Math.sin(i * 1.7) * 0.08) + (Math.cos(i * 0.9) * 0.03);
    const lngOffset = (Math.cos(i * 1.4) * 0.11) + (Math.sin(i * 0.6) * 0.04);
    const types: ('Retail Store' | 'Warehouse' | 'EV Charging Station' | 'Telecom Tower' | 'Renewable Energy')[] = [
      'Retail Store',
      'Warehouse',
      'EV Charging Station',
      'Telecom Tower',
      'Renewable Energy',
    ];
    const bType = types[i % types.length];
    const localities = ['Jahangirpura', 'Kamrej', 'Rander', 'Bhimrad', 'Dindoli', 'Pandesara', 'Olpad', 'Mota Varachha', 'Sarthana', 'Variav'];
    const loc = localities[i % localities.length];
    const popScore = Math.floor(65 + (Math.abs(Math.sin(i * 3.1)) * 32));
    const accScore = Math.floor(68 + (Math.abs(Math.cos(i * 2.3)) * 28));
    const compScore = Math.floor(55 + (Math.abs(Math.sin(i * 4.5)) * 40));
    const landScore = Math.floor(70 + (Math.abs(Math.cos(i * 1.8)) * 26));
    const riskScore = Math.floor(62 + (Math.abs(Math.sin(i * 2.9)) * 33));
    const overall = Math.round((popScore * 0.3) + (accScore * 0.25) + (compScore * 0.15) + (landScore * 0.15) + (riskScore * 0.15));

    return {
      id,
      name: `${loc} Sector ${((i * 3) % 19) + 1} Point`,
      area: loc,
      lat: Number((21.1702 + latOffset).toFixed(4)),
      lng: Number((72.8311 + lngOffset).toFixed(4)),
      businessType: bType,
      readinessScore: overall,
      status: (overall >= 80 ? 'High Potential' : overall >= 65 ? 'Moderate Potential' : 'Needs Review') as 'High Potential' | 'Moderate Potential' | 'Needs Review',
      factors: {
        population: popScore,
        accessibility: accScore,
        competition: compScore,
        landUse: landScore,
        environmentalRisk: riskScore,
      },
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
        floodRiskLevel: (riskScore < 70 ? 'High' : riskScore < 82 ? 'Medium' : 'Low') as 'High' | 'Medium' | 'Low',
      },
      summary: `Spatial screening for ${loc} indicates robust accessibility index (${accScore}/100) and balanced demographic catchment for ${bType.toLowerCase()} placement.`,
    };
  }),
];

// 100+ Competitor Points mapped across Surat
export const COMPETITOR_POINTS: CompetitorPoint[] = [
  { id: 'comp-01', name: 'Reliance Smart Superstore', brand: 'Reliance Retail', lat: 21.1490, lng: 72.7780, category: 'Retail', distanceKm: 0.8, rating: 4.4 },
  { id: 'comp-02', name: 'DMart Mega Market', brand: 'Avenue Supermarts', lat: 21.1390, lng: 72.7710, category: 'Retail', distanceKm: 1.2, rating: 4.6 },
  { id: 'comp-03', name: 'Tata Power EV Fast Hub', brand: 'Tata Power EZ Charge', lat: 21.1560, lng: 72.7720, category: 'EV Charging', distanceKm: 1.5, rating: 4.3 },
  { id: 'comp-04', name: 'Jio-bp Pulse Fast Station', brand: 'Jio-bp', lat: 21.1290, lng: 72.7520, category: 'EV Charging', distanceKm: 2.1, rating: 4.5 },
  { id: 'comp-05', name: 'Star Bazaar Hypermarket', brand: 'Tata Trent', lat: 21.1640, lng: 72.7700, category: 'Retail', distanceKm: 2.4, rating: 4.3 },
  { id: 'comp-06', name: 'Zudio Fashion Mall', brand: 'Tata Retail', lat: 21.1890, lng: 72.7980, category: 'Retail', distanceKm: 3.1, rating: 4.2 },
  { id: 'comp-07', name: 'Croma Electronics Hub', brand: 'Infiniti Retail', lat: 21.1730, lng: 72.8050, category: 'Retail', distanceKm: 3.8, rating: 4.5 },
  { id: 'comp-08', name: 'DHL Express Supply Chain', brand: 'DHL Logistics', lat: 21.1690, lng: 72.6950, category: 'Warehouse', distanceKm: 4.2, rating: 4.7 },
  { id: 'comp-09', name: 'Delhivery Fulfillment Center', brand: 'Delhivery', lat: 21.1580, lng: 72.8520, category: 'Warehouse', distanceKm: 4.8, rating: 4.1 },
  { id: 'comp-10', name: 'Airtel Macro Telecom Tower', brand: 'Indus Towers', lat: 21.2280, lng: 72.8280, category: 'Telecom', distanceKm: 5.1, rating: 4.8 },
  // Generate additional competitors to ensure 100+ points across all quadrants
  ...Array.from({ length: 95 }, (_, i) => {
    const brands = [
      'Reliance Fresh', 'DMart Express', 'Nature Basket', 'Jio-bp Pulse', 'Tata Power EV',
      'Statiq EV Station', 'Blue Dart Warehousing', 'Flipkart Hub', 'Amazon Sortation',
      'Indus Towers', 'ATC India', 'Adani Total Gas', 'Shell Recharge'
    ];
    const brand = brands[i % brands.length];
    const category = brand.includes('EV') || brand.includes('Recharge') ? 'EV Charging' :
      brand.includes('Warehouse') || brand.includes('Hub') || brand.includes('Sortation') ? 'Warehouse' :
      brand.includes('Tower') ? 'Telecom' : 'Retail';
    
    // Spread in ring around Surat center
    const angle = (i / 95) * Math.PI * 2 * 3.7;
    const radius = 0.02 + ((i % 11) * 0.009);
    const lat = Number((21.1702 + (Math.sin(angle) * radius)).toFixed(4));
    const lng = Number((72.8311 + (Math.cos(angle) * (radius * 1.15))).toFixed(4));

    return {
      id: `comp-${i + 11}`,
      name: `${brand} (${lat > 21.17 ? 'North' : 'South'})`,
      brand,
      lat,
      lng,
      category,
      distanceKm: Number((0.5 + (radius * 50)).toFixed(1)),
      rating: Number((3.8 + ((i % 12) * 0.1)).toFixed(1)),
    };
  }),
];

// 120+ H3 Hexagonal Grid Cells covering Surat area
export const H3_HEXAGONS: H3CellData[] = (() => {
  const cells: H3CellData[] = [];
  const rows = 11;
  const cols = 12;
  const baseLat = 21.110;
  const baseLng = 72.730;
  const latStep = 0.013;
  const lngStep = 0.017;

  let count = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      count++;
      const lat = Number((baseLat + (r * latStep) + ((c % 2) * (latStep / 2))).toFixed(4));
      const lng = Number((baseLng + (c * lngStep)).toFixed(4));

      // Distance from center determines baseline readiness & population
      const dist = Math.sqrt(Math.pow(lat - 21.1702, 2) + Math.pow(lng - 72.8311, 2));
      const normalizedDist = Math.min(1, dist / 0.12);

      const popSeed = Math.sin(r * 1.5 + c * 2.1);
      const pop = Math.floor(7000 + (1 - normalizedDist) * 16000 + Math.abs(popSeed) * 5000);
      const competitors = Math.max(0, Math.floor((1 - normalizedDist) * 7 + Math.sin(c) * 2));
      const accessibility = Math.floor(55 + (1 - normalizedDist) * 35 + Math.cos(r) * 10);
      
      const rawScore = Math.floor(52 + (1 - normalizedDist) * 40 + (Math.sin(r + c) * 8));
      const score = Math.max(38, Math.min(98, rawScore));

      const oppLevel: 'High' | 'Medium' | 'Low' = score >= 85 ? 'High' : score >= 60 ? 'Medium' : 'Low';
      const hotspotType: 'hot' | 'cold' | 'neutral' = score >= 82 ? 'hot' : score <= 55 ? 'cold' : 'neutral';
      const clusterId = (r * 2 + c) % 5 + 1;

      cells.push({
        id: `h3-${count}`,
        h3Index: `886189${(count + 100).toString(16)}ffff`,
        lat,
        lng,
        readinessScore: score,
        population: pop,
        competitors,
        accessibility: Math.min(100, accessibility),
        opportunityLevel: oppLevel,
        hotspotType,
        clusterId,
      });
    }
  }
  return cells;
})();

// Isochrone Catchment Data for Site Analysis
export const ISOCHRONE_DATA = {
  drive: [
    {
      minutes: 10,
      reachablePopulation: 18400,
      areaSqKm: 12.8,
      color: 'rgba(99, 102, 241, 0.45)', // Indigo-500
      strokeColor: '#4f46e5',
      label: '10 min Drive',
    },
    {
      minutes: 20,
      reachablePopulation: 64200,
      areaSqKm: 42.4,
      color: 'rgba(129, 140, 248, 0.28)', // Indigo-400
      strokeColor: '#6366f1',
      label: '20 min Drive',
    },
    {
      minutes: 30,
      reachablePopulation: 142700,
      areaSqKm: 98.6,
      color: 'rgba(165, 180, 252, 0.16)', // Indigo-300
      strokeColor: '#818cf8',
      label: '30 min Drive',
    },
  ],
  walk: [
    {
      minutes: 10,
      reachablePopulation: 4200,
      areaSqKm: 2.1,
      color: 'rgba(16, 185, 129, 0.40)', // Emerald
      strokeColor: '#059669',
      label: '10 min Walk',
    },
    {
      minutes: 20,
      reachablePopulation: 11800,
      areaSqKm: 6.8,
      color: 'rgba(52, 211, 153, 0.25)',
      strokeColor: '#10b981',
      label: '20 min Walk',
    },
    {
      minutes: 30,
      reachablePopulation: 26500,
      areaSqKm: 14.5,
      color: 'rgba(110, 231, 183, 0.15)',
      strokeColor: '#34d399',
      label: '30 min Walk',
    },
  ],
};

// Distance-decay competition curve data
export const DISTANCE_DECAY_DATA = [
  { distance: '0.5 km', impact: 92, weight: 'Severe', competitors: 1 },
  { distance: '1.0 km', impact: 78, weight: 'High', competitors: 2 },
  { distance: '2.0 km', impact: 54, weight: 'Moderate', competitors: 3 },
  { distance: '3.0 km', impact: 32, weight: 'Low', competitors: 5 },
  { distance: '5.0 km', impact: 14, weight: 'Minimal', competitors: 11 },
];

// Surat Demographics Data
export const SURAT_DEMOGRAPHICS = {
  totalMetropolitanPopulation: 2640000,
  averageDensityPerSqKm: 12480,
  medianMonthlyIncomeINR: 68500,
  activeHouseholds: 590000,
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
  ],
};

// Default GIS Map Layers
export const DEFAULT_MAP_LAYERS: MapLayerConfig[] = [
  {
    id: 'pop_density',
    name: 'Population Density',
    category: 'core',
    active: true,
    opacity: 0.75,
    featureCount: 1420,
    lastUpdated: 'Today, 14:30',
    color: '#6366f1',
    description: 'High-resolution Census & mobile trace population distribution heat grid.',
  },
  {
    id: 'road_access',
    name: 'Road Accessibility',
    category: 'core',
    active: true,
    opacity: 0.85,
    featureCount: 864,
    lastUpdated: 'Yesterday',
    color: '#0ea5e9',
    description: 'Multi-modal transit network with speed limits and intersection topology.',
  },
  {
    id: 'competitors',
    name: 'Competitors',
    category: 'analysis',
    active: true,
    opacity: 0.90,
    featureCount: 105,
    lastUpdated: 'Live Feed',
    color: '#f43f5e',
    description: 'Direct and adjacent commercial competitors scraped from spatial registries.',
  },
  {
    id: 'land_use',
    name: 'Land Use',
    category: 'core',
    active: true,
    opacity: 0.65,
    featureCount: 420,
    lastUpdated: '3 days ago',
    color: '#10b981',
    description: 'Municipal zoning plans, commercial plots, setbacks, and building footprints.',
  },
  {
    id: 'risk_zones',
    name: 'Risk Zones',
    category: 'risk',
    active: true,
    opacity: 0.60,
    featureCount: 68,
    lastUpdated: '1 week ago',
    color: '#f59e0b',
    description: 'Tapi flood plain buffer zones, seismic zones, and heritage conservation belts.',
  },
  {
    id: 'h3_grid',
    name: 'H3 Grid',
    category: 'analysis',
    active: false,
    opacity: 0.70,
    featureCount: 132,
    lastUpdated: 'Static Index',
    color: '#8b5cf6',
    description: 'Uber H3 Resolution 8 spatial tessellation with indexed readiness indices.',
  },
  {
    id: 'hotspots',
    name: 'Hotspots',
    category: 'analysis',
    active: false,
    opacity: 0.80,
    featureCount: 48,
    lastUpdated: 'Calculated',
    color: '#ec4899',
    description: 'Getis-Ord Gi* statistical spatial clusters of commercial potential.',
  },
];

// Initial Previous Reports
export const INITIAL_REPORTS: ReportItem[] = [
  {
    id: 'rep-01',
    title: 'Retail Site Analysis — Surat Vesu Corridor',
    siteName: 'Vesu VIP Cross Road',
    businessType: 'Retail Store',
    date: 'Sep 17, 2026',
    author: 'Rahul Patel',
    score: 82,
    summary: 'Detailed evaluation of flagship retail viability in Vesu. High footfall and favorable commercial zoning with moderate competitive pressure.',
    fileSize: '4.2 MB',
  },
  {
    id: 'rep-02',
    title: 'EV Charging Analysis — Surat Dumas Tech Belt',
    siteName: 'Dumas Airport Tech Corridor',
    businessType: 'EV Charging Station',
    date: 'Sep 15, 2026',
    author: 'Rahul Patel',
    score: 89,
    summary: 'High-speed DC charging deployment assessment along the airport corridor with 10-min throughput and low competitor density.',
    fileSize: '3.8 MB',
  },
  {
    id: 'rep-03',
    title: 'Warehouse Catchment Analysis — Surat Hazira Expressway',
    siteName: 'Hazira Port Logistics Interchange',
    businessType: 'Warehouse',
    date: 'Sep 12, 2026',
    author: 'Rahul Patel',
    score: 88,
    summary: 'Industrial supply chain logistics feasibility, multi-axle freight road connectivity, and 30-min regional industrial catchment.',
    fileSize: '5.1 MB',
  },
];

// Aliases for compatibility
export const MOCK_CANDIDATE_SITES = CANDIDATE_SITES;
export const MOCK_COMPETITORS = COMPETITOR_POINTS;
export const SURAT_H3_GRID = H3_HEXAGONS;

// 24 Opportunity Zones across Surat
export const OPPORTUNITY_ZONES: OpportunityZone[] = CANDIDATE_SITES.slice(0, 24).map((site, i) => {
  const popTier: 'High' | 'Medium' | 'Low' =
    site.factors.population > 80 ? 'High' : site.factors.population > 60 ? 'Medium' : 'Low';
  const compTier: 'Low' | 'Medium' | 'High' =
    site.factors.competition > 80 ? 'Low' : site.factors.competition > 60 ? 'Medium' : 'High';

  return {
    id: `zone-${i + 1}`,
    name: `${site.name} Opportunity Zone`,
    siteId: site.id,
    lat: site.lat,
    lng: site.lng,
    readinessScore: site.readinessScore,
    recommendedArchetype: site.businessType,
    populationDensityTier: popTier,
    competitionTier: compTier,
    estimatedFootfallDaily: Math.floor(8000 + (site.factors.population * 220) + ((i % 5) * 1400)),
  };
});

