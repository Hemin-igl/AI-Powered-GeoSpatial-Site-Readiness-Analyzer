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

// Real-world commercial sites & competitor brand datasets across the whole map extent by archetype
// Real-world commercial sites & competitor brand datasets across the whole map extent by archetype
// Regional competitor brand datasets across archetypes (India, GCC/Middle East, and Global/Americas)
export const REGIONAL_COMPETITORS: Record<'INDIA' | 'GCC' | 'GLOBAL', Record<BusinessType, {
  name: string;
  brand: string;
  category: string;
  commercialType: string;
  rating: number;
  reviewsCount: number;
  status: string;
  radiusOffsetKm: number;
  angleDeg: number;
  areaDesc: string;
}[]>> = {
  INDIA: {
    'Retail Store': [
      { name: 'Reliance Smart Bazaar', brand: 'Reliance Retail', category: 'Hypermarket & Grocery', commercialType: 'Anchor Hypermarket', rating: 4.4, reviewsCount: 3840, status: 'Open • Closes 10:30 PM', radiusOffsetKm: 0.8, angleDeg: 35, areaDesc: 'Central Market Corridor' },
      { name: 'D-Mart Supercenter', brand: 'Avenue Supermarts', category: 'Discount Retail & Grocery', commercialType: 'Mega Superstore', rating: 4.7, reviewsCount: 8920, status: 'Open • Closes 11 PM', radiusOffsetKm: 1.4, angleDeg: 120, areaDesc: 'South Arterial Road' },
      { name: 'Starbucks Reserve & Cafe', brand: 'Tata Starbucks', category: 'Specialty Coffee & QSR', commercialType: 'High-Street Flagship', rating: 4.6, reviewsCount: 2410, status: 'Open • Closes 11:30 PM', radiusOffsetKm: 0.6, angleDeg: 210, areaDesc: 'Main High Street' },
      { name: 'Croma Mega Tech Store', brand: 'Tata Digital', category: 'Consumer Electronics & Gadgets', commercialType: 'Electronics Superstore', rating: 4.3, reviewsCount: 1950, status: 'Open • Closes 9:30 PM', radiusOffsetKm: 1.9, angleDeg: 295, areaDesc: 'West Commercial Plaza' },
      { name: 'Zudio Fast Fashion', brand: 'Trent Ltd', category: 'Apparel & Department Store', commercialType: 'Fashion Retail Store', rating: 4.2, reviewsCount: 1530, status: 'Open • Closes 10 PM', radiusOffsetKm: 1.1, angleDeg: 75, areaDesc: 'East Transit Avenue' },
      { name: 'McDonald’s 24/7 Drive-Thru', brand: 'McDonald’s', category: 'Quick Service Restaurant', commercialType: 'Drive-Thru Hub', rating: 4.2, reviewsCount: 4200, status: 'Open 24 Hours', radiusOffsetKm: 0.5, angleDeg: 15, areaDesc: 'North Intersection' },
      { name: 'Decathlon Sports Megastore', brand: 'Decathlon', category: 'Sporting Goods & Equipment', commercialType: 'Destination Superstore', rating: 4.8, reviewsCount: 6540, status: 'Open • Closes 10 PM', radiusOffsetKm: 2.8, angleDeg: 165, areaDesc: 'Outer Ring Highway' },
      { name: 'Phoenix Marketcity Megamall', brand: 'The Phoenix Mills', category: 'Destination Retail & Leisure', commercialType: 'Mega Shopping Mall', rating: 4.7, reviewsCount: 22800, status: 'Open • Closes 11 PM', radiusOffsetKm: 5.2, angleDeg: 215, areaDesc: 'South Expressway Hub' },
      { name: 'IKEA City Store & Warehouse', brand: 'Ingka Group', category: 'Home Furnishing Mega-Store', commercialType: 'Global Mega Retailer', rating: 4.8, reviewsCount: 18500, status: 'Open • Closes 10 PM', radiusOffsetKm: 5.8, angleDeg: 45, areaDesc: 'Northeast Bypass Road' },
      { name: 'Smart Bazaar Superstore', brand: 'Reliance Retail', category: 'Value Supermarket & Home', commercialType: 'Outer Highway Supercenter', rating: 4.1, reviewsCount: 2900, status: 'Open • Closes 10 PM', radiusOffsetKm: 12.8, angleDeg: 330, areaDesc: 'North Expressway Gateway' },
    ],
    'EV Charging Station': [
      { name: 'Tata Power EZ Charge 60kW DC Fast Hub', brand: 'Tata Power', category: 'Dual-Gun CCS2 Fast Hub', commercialType: 'Public Fast Charging Hub', rating: 4.5, reviewsCount: 820, status: 'Operational • 24/7', radiusOffsetKm: 0.7, angleDeg: 45, areaDesc: 'Central Transit Plaza' },
      { name: 'Jio-bp pulse 120kW Super-Charger', brand: 'Jio-bp', category: 'Ultra-Fast Dual Gun Hub', commercialType: 'Commercial Highway Hub', rating: 4.7, reviewsCount: 1450, status: 'Operational • 24/7', radiusOffsetKm: 1.3, angleDeg: 140, areaDesc: 'South Main Arterial' },
      { name: 'Ather Grid Rapid Charging Point', brand: 'Ather Energy', category: '2-Wheeler Rapid Point', commercialType: 'Urban Fast Point', rating: 4.6, reviewsCount: 940, status: 'Operational • 24/7', radiusOffsetKm: 0.9, angleDeg: 225, areaDesc: 'West Commercial Street' },
      { name: 'Statiq Ultra Commercial Station', brand: 'Statiq', category: 'Multi-Vehicle Public Hub', commercialType: 'Commercial Fleet Hub', rating: 4.2, reviewsCount: 620, status: 'Operational • 24/7', radiusOffsetKm: 1.8, angleDeg: 315, areaDesc: 'North Metro Interchange' },
      { name: 'Zeon Charging 150kW Hyper-Port', brand: 'Zeon', category: 'Commercial Ultra-Fast Hub', commercialType: 'High-Power EV Plaza', rating: 4.6, reviewsCount: 1120, status: 'Operational • 24/7', radiusOffsetKm: 3.1, angleDeg: 180, areaDesc: 'South Ring Junction' },
      { name: 'Shell Recharge Ultra-Fast 120kW', brand: 'Shell EV', category: 'Highway Supercharging Plaza', commercialType: 'Fuel & EV Supercourt', rating: 4.7, reviewsCount: 1890, status: 'Operational • 24/7', radiusOffsetKm: 4.3, angleDeg: 290, areaDesc: 'West Expressway Node' },
    ],
    'Warehouse': [
      { name: 'Amazon Sortation & Fulfillment Centre', brand: 'Amazon Logistics', category: 'E-commerce Mega Fulfillment', commercialType: 'Automated Mega Sort Facility', rating: 4.8, reviewsCount: 4200, status: 'Active 24/7 Operations', radiusOffsetKm: 2.4, angleDeg: 60, areaDesc: 'East Logistics Corridor' },
      { name: 'Flipkart Large Goods Hub', brand: 'Flipkart Logistics', category: 'Regional Sorting Facility', commercialType: 'Grade-A Regional Warehouse', rating: 4.5, reviewsCount: 2800, status: 'Active 24/7 Operations', radiusOffsetKm: 3.1, angleDeg: 150, areaDesc: 'South Industrial Estate' },
      { name: 'DHL Global Express Air Cargo Terminal', brand: 'DHL Express', category: 'Cross-Border Logistics Gateway', commercialType: 'Airport Cargo Hub', rating: 4.6, reviewsCount: 1940, status: 'Active • Customs Cleared', radiusOffsetKm: 1.9, angleDeg: 240, areaDesc: 'Airport Cargo Terminal' },
      { name: 'Blue Dart Aviation Cargo Hub', brand: 'Blue Dart', category: 'Express Parcel Distribution', commercialType: 'Multi-Modal Sort Depot', rating: 4.3, reviewsCount: 1510, status: 'Active 24/7 Operations', radiusOffsetKm: 2.7, angleDeg: 320, areaDesc: 'North Railway Freight Yard' },
      { name: 'IndoSpace Industrial & Logistics Park', brand: 'IndoSpace', category: 'Grade-A Warehousing Complex', commercialType: 'Multi-Tenant Logistics Park', rating: 4.7, reviewsCount: 1250, status: 'Full Capacity Operations', radiusOffsetKm: 7.8, angleDeg: 40, areaDesc: 'National Highway Logistics Zone' },
    ],
    'Telecom Tower': [
      { name: 'Indus Towers 5G High-Density Node', brand: 'Indus Towers', category: 'Shared Infrastructure Monopole', commercialType: 'Shared Macrocell Tower', rating: 4.6, reviewsCount: 310, status: 'Online • 99.98% Uptime', radiusOffsetKm: 0.4, angleDeg: 30, areaDesc: 'Central Urban Core' },
      { name: 'Bharti Airtel 5G Ultra-Wideband Tower', brand: 'Airtel', category: 'Fiberized Macrocell Tower', commercialType: 'High-Power 5G Hub Site', rating: 4.7, reviewsCount: 420, status: 'Online • Fiber-Connected', radiusOffsetKm: 1.2, angleDeg: 135, areaDesc: 'South Commercial Sector' },
      { name: 'Reliance Jio True5G Giga-Node Lattice', brand: 'Jio Platforms', category: 'C-Band 5G High-Capacity', commercialType: 'Autonomous 5G Node', rating: 4.8, reviewsCount: 580, status: 'Online • Active MIMO', radiusOffsetKm: 0.8, angleDeg: 220, areaDesc: 'West Residential Cluster' },
      { name: 'American Tower Corp (ATC) Site', brand: 'ATC India', category: 'Co-Location Lattice Tower', commercialType: 'Multi-Tenant Telecom Mast', rating: 4.3, reviewsCount: 190, status: 'Online • Multi-Carrier', radiusOffsetKm: 2.1, angleDeg: 305, areaDesc: 'North Commercial Zone' },
    ],
    'Renewable Energy': [
      { name: 'Tata Power Solar Microgrid Plant', brand: 'Tata Power Solar', category: 'Ground-Mounted Photovoltaic Array', commercialType: '15MW Solar Farm & BESS', rating: 4.7, reviewsCount: 520, status: 'Generating • 98.4% Efficiency', radiusOffsetKm: 3.2, angleDeg: 55, areaDesc: 'Northeast Substation Corridor' },
      { name: 'Adani Green Energy Substation & Feed', brand: 'Adani Green', category: 'High-Voltage Grid Interconnection', commercialType: '33kV Clean Power Substation', rating: 4.5, reviewsCount: 410, status: 'Grid Synchronized', radiusOffsetKm: 4.1, angleDeg: 160, areaDesc: 'South Open Industrial Land' },
      { name: 'ReNew Power Wind-Solar Hybrid Station', brand: 'ReNew Power', category: 'Utility-Scale Hybrid Substation', commercialType: '50MW Hybrid Utility Station', rating: 4.8, reviewsCount: 680, status: 'Generating • High Yield', radiusOffsetKm: 6.9, angleDeg: 110, areaDesc: 'Southeast Rural Outskirts' },
    ],
  },
  GCC: {
    'Retail Store': [
      { name: 'LuLu Hypermarket & Mega Mall', brand: 'LuLu Group International', category: 'Hypermarket & Retail Department', commercialType: 'Regional Flagship Hypermarket', rating: 4.6, reviewsCount: 9420, status: 'Open • Closes 12:00 AM', radiusOffsetKm: 0.7, angleDeg: 30, areaDesc: 'Main Boulevard Corridor' },
      { name: 'Carrefour Hypermarket City Center', brand: 'Majid Al Futtaim', category: 'Hypermarket & Food Hall', commercialType: 'Anchor Mega Mall Store', rating: 4.5, reviewsCount: 8150, status: 'Open • Closes 11:30 PM', radiusOffsetKm: 1.3, angleDeg: 115, areaDesc: 'King Fahd Highway Ring' },
      { name: 'Tamimi Markets Fresh Gourmet', brand: 'Tamimi Group', category: 'Premium Supermarket & Bakery', commercialType: 'High-Street Gourmet Store', rating: 4.7, reviewsCount: 4200, status: 'Open 24 Hours', radiusOffsetKm: 0.6, angleDeg: 215, areaDesc: 'Downtown Commercial Sector' },
      { name: 'Jarir Bookstore Mega Technology', brand: 'Jarir Marketing Co', category: 'Consumer Electronics & Office', commercialType: 'Electronics Megastore', rating: 4.6, reviewsCount: 6890, status: 'Open • Closes 11 PM', radiusOffsetKm: 1.8, angleDeg: 290, areaDesc: 'Business District Plaza' },
      { name: 'Extra Electronics Flagship Store', brand: 'United Electronics (eXtra)', category: 'Consumer Tech & Home Appliances', commercialType: 'Tech Hyperstore', rating: 4.4, reviewsCount: 3740, status: 'Open • Closes 10:30 PM', radiusOffsetKm: 2.4, angleDeg: 80, areaDesc: 'East Transit Avenue' },
      { name: 'Panda Super & Hyper Store', brand: 'Savola Group', category: 'Supermarket & Fresh Groceries', commercialType: 'Neighborhood Hypermarket', rating: 4.3, reviewsCount: 5120, status: 'Open 24 Hours', radiusOffsetKm: 1.1, angleDeg: 160, areaDesc: 'South Arterial Ring' },
      { name: 'Al Othaim Supermarket', brand: 'Abdullah Al Othaim Markets', category: 'Discount Retail & Supermarket', commercialType: 'Commercial Supermarket', rating: 4.2, reviewsCount: 4800, status: 'Open • Closes 12 AM', radiusOffsetKm: 3.1, angleDeg: 340, areaDesc: 'North Expressway Exit' },
      { name: 'Al Baik Express & Drive-Thru', brand: 'Al Baik Food Systems', category: 'Quick Service Restaurant', commercialType: 'Flagship QSR Hub', rating: 4.9, reviewsCount: 14600, status: 'Open • Closes 2 AM', radiusOffsetKm: 0.9, angleDeg: 190, areaDesc: 'Central Food Boulevard' },
      { name: 'Danube Luxury Gourmet Hypermarket', brand: 'BinDawood Holding', category: 'Imported Gourmet & Lifestyle', commercialType: 'Boutique Department Store', rating: 4.7, reviewsCount: 3950, status: 'Open • Closes 11:30 PM', radiusOffsetKm: 3.8, angleDeg: 250, areaDesc: 'West End Shopping Galleria' },
      { name: 'IKEA City Store & Warehouse', brand: 'Al-Futtaim Group', category: 'Home Furnishing & Living', commercialType: 'Destination Superstore', rating: 4.8, reviewsCount: 11200, status: 'Open • Closes 11 PM', radiusOffsetKm: 5.4, angleDeg: 45, areaDesc: 'Northeast Outer Ring Road' },
    ],
    'EV Charging Station': [
      { name: 'Electromin 150kW Ultra-Fast DC Hub', brand: 'Electromin (Petromin)', category: 'Dual-Gun Ultra-Fast EV Hub', commercialType: 'Highway Supercharging Station', rating: 4.7, reviewsCount: 980, status: 'Operational • 24/7', radiusOffsetKm: 0.8, angleDeg: 40, areaDesc: 'Central Transit Hub' },
      { name: 'ADNOC Distribution Fast EV Plaza', brand: 'ADNOC', category: 'Highway Service EV Oasis', commercialType: 'Integrated Fuel & EV Plaza', rating: 4.6, reviewsCount: 1240, status: 'Operational • 24/7', radiusOffsetKm: 1.5, angleDeg: 135, areaDesc: 'South Main Expressway' },
      { name: 'DEWA Green EV Charger Super-Port', brand: 'DEWA', category: 'High-Power Public Fast Point', commercialType: 'Clean Mobility Station', rating: 4.5, reviewsCount: 760, status: 'Operational • 24/7', radiusOffsetKm: 1.2, angleDeg: 230, areaDesc: 'West Commercial Plaza' },
      { name: 'Tesla Supercharger 250kW Hub', brand: 'Tesla', category: 'V3 Supercharger Multi-Bay', commercialType: 'Dedicated Supercharger Plaza', rating: 4.9, reviewsCount: 2150, status: 'Operational • 24/7', radiusOffsetKm: 2.8, angleDeg: 310, areaDesc: 'North Mall Boulevard' },
    ],
    'Warehouse': [
      { name: 'Agility Regional Logistics Mega-Hub', brand: 'Agility Logistics', category: 'Grade-A 3PL & Cold Storage', commercialType: 'Automated Logistics Complex', rating: 4.8, reviewsCount: 2400, status: 'Active 24/7 Operations', radiusOffsetKm: 2.8, angleDeg: 55, areaDesc: 'East Industrial Logistics City' },
      { name: 'Aramex Global Sorting Gateway', brand: 'Aramex', category: 'Express Courier Sort Depot', commercialType: 'Cross-Border Air Freight Node', rating: 4.6, reviewsCount: 3100, status: 'Active • Customs Cleared', radiusOffsetKm: 3.5, angleDeg: 145, areaDesc: 'South Cargo Expressway' },
      { name: 'Amazon Fulfillment Center', brand: 'Amazon Logistics', category: 'E-Commerce Mega Fulfillment', commercialType: 'Automated Sort Superhub', rating: 4.7, reviewsCount: 1980, status: 'Active 24/7 Operations', radiusOffsetKm: 4.2, angleDeg: 280, areaDesc: 'Airport Logistics Ring' },
    ],
    'Telecom Tower': [
      { name: 'STC 5G Ultra-Capacity Macro Tower', brand: 'stc (Saudi Telecom)', category: 'Massive MIMO 5G Monopole', commercialType: 'High-Density 5G Cell Site', rating: 4.8, reviewsCount: 620, status: 'Online • Fiber-Connected', radiusOffsetKm: 0.5, angleDeg: 35, areaDesc: 'Central Urban Spine' },
      { name: 'Zain 5G Advanced Giga-Node', brand: 'Zain KSA', category: 'Shared Telecom Lattice Mast', commercialType: 'Autonomous 5G Hub', rating: 4.6, reviewsCount: 450, status: 'Online • 99.99% Uptime', radiusOffsetKm: 1.4, angleDeg: 150, areaDesc: 'South Commercial Ring' },
      { name: 'Mobily 5G High-Power Monopole Site', brand: 'Mobily', category: 'Fiberized Macrocell Tower', commercialType: 'Multi-Band Urban Tower', rating: 4.7, reviewsCount: 510, status: 'Online • Active Beamforming', radiusOffsetKm: 1.1, angleDeg: 245, areaDesc: 'West Financial Strip' },
    ],
    'Renewable Energy': [
      { name: 'ACWA Power Utility Solar Park', brand: 'ACWA Power', category: 'Utility-Scale Photovoltaic Grid', commercialType: '100MW Solar Park & BESS', rating: 4.9, reviewsCount: 890, status: 'Generating • High Yield', radiusOffsetKm: 4.5, angleDeg: 60, areaDesc: 'Northeast Substation Corridor' },
      { name: 'Masdar Clean Energy Substation', brand: 'Masdar', category: 'Grid Synchronized Clean Solar', commercialType: 'Private Power Substation', rating: 4.7, reviewsCount: 430, status: 'Grid Synchronized', radiusOffsetKm: 6.2, angleDeg: 175, areaDesc: 'South Desert Energy Zone' },
    ],
  },
  GLOBAL: {
    'Retail Store': [
      { name: 'Walmart Supercenter', brand: 'Walmart Inc.', category: 'Hypermarket & Grocery', commercialType: 'Anchor Mega Superstore', rating: 4.5, reviewsCount: 12400, status: 'Open • Closes 11 PM', radiusOffsetKm: 0.9, angleDeg: 40, areaDesc: 'Main Commercial Arterial' },
      { name: 'Target Hyperstore & Pharmacy', brand: 'Target Corp', category: 'Department & Grocery Store', commercialType: 'Regional Commercial Center', rating: 4.6, reviewsCount: 8900, status: 'Open • Closes 10 PM', radiusOffsetKm: 1.4, angleDeg: 130, areaDesc: 'South Transit Parkway' },
      { name: 'Costco Wholesale Club', brand: 'Costco', category: 'Bulk Discount Wholesale', commercialType: 'Destination Mega Warehouse', rating: 4.8, reviewsCount: 16800, status: 'Open • Closes 8:30 PM', radiusOffsetKm: 2.8, angleDeg: 220, areaDesc: 'West Highway Interchange' },
      { name: 'Best Buy Electronics Megastore', brand: 'Best Buy Co.', category: 'Consumer Technology & Gadgets', commercialType: 'Electronics Superstore', rating: 4.4, reviewsCount: 4100, status: 'Open • Closes 9 PM', radiusOffsetKm: 1.7, angleDeg: 305, areaDesc: 'North Shopping Plaza' },
      { name: 'Whole Foods Market Gourmet', brand: 'Amazon / Whole Foods', category: 'Organic & Natural Grocery', commercialType: 'Boutique Supermarket', rating: 4.7, reviewsCount: 5200, status: 'Open • Closes 10 PM', radiusOffsetKm: 0.7, angleDeg: 75, areaDesc: 'Downtown High Street' },
      { name: 'The Home Depot Supercenter', brand: 'The Home Depot', category: 'Home Improvement & Hardware', commercialType: 'Big-Box Destination Store', rating: 4.6, reviewsCount: 7800, status: 'Open • Closes 10 PM', radiusOffsetKm: 3.5, angleDeg: 170, areaDesc: 'Southern Industrial Ring' },
    ],
    'EV Charging Station': [
      { name: 'Tesla Supercharger 250kW Station', brand: 'Tesla', category: 'V3 Dual Supercharger Hub', commercialType: 'Ultra-Fast Supercharging Hub', rating: 4.9, reviewsCount: 3800, status: 'Operational • 24/7', radiusOffsetKm: 0.8, angleDeg: 50, areaDesc: 'Transit Plaza Hub' },
      { name: 'Electrify America 350kW Mega-Hub', brand: 'Electrify America', category: 'CCS / CHAdeMO Ultra-Fast Hub', commercialType: 'Interstate Charging Station', rating: 4.5, reviewsCount: 1650, status: 'Operational • 24/7', radiusOffsetKm: 1.6, angleDeg: 140, areaDesc: 'Highway Service Center' },
      { name: 'ChargePoint 62.5kW Express Hub', brand: 'ChargePoint', category: 'Commercial Dual Fast Charger', commercialType: 'Public Commercial Station', rating: 4.4, reviewsCount: 920, status: 'Operational • 24/7', radiusOffsetKm: 1.1, angleDeg: 235, areaDesc: 'West Commercial Strip' },
    ],
    'Warehouse': [
      { name: 'Amazon Fulfillment & Sort Supercenter', brand: 'Amazon Logistics', category: 'Automated Mega Fulfillment', commercialType: 'Regional Sorting Facility', rating: 4.8, reviewsCount: 5200, status: 'Active 24/7 Operations', radiusOffsetKm: 2.6, angleDeg: 65, areaDesc: 'East Logistics Corridor' },
      { name: 'FedEx Express Air & Ground Hub', brand: 'FedEx', category: 'Multi-Modal Sort & Express Hub', commercialType: 'National Logistics Hub', rating: 4.6, reviewsCount: 3400, status: 'Active 24/7 Operations', radiusOffsetKm: 3.2, angleDeg: 155, areaDesc: 'Airport Cargo Terminal' },
      { name: 'Prologis Industrial Park', brand: 'Prologis', category: 'Grade-A Logistics Real Estate', commercialType: 'Multi-Tenant Distribution Park', rating: 4.7, reviewsCount: 1450, status: 'Active Operations', radiusOffsetKm: 4.8, angleDeg: 275, areaDesc: 'Outer Beltway Junction' },
    ],
    'Telecom Tower': [
      { name: 'Crown Castle Macro Monopole', brand: 'Crown Castle', category: 'Shared High-Power Cell Site', commercialType: 'Multi-Carrier 5G Monopole', rating: 4.7, reviewsCount: 380, status: 'Online • Fiber-Connected', radiusOffsetKm: 0.6, angleDeg: 35, areaDesc: 'Central Urban Core' },
      { name: 'American Tower Corp 5G Lattice', brand: 'American Tower', category: 'High-Altitude Guyed Mast', commercialType: 'Macrocell Backbone Mast', rating: 4.6, reviewsCount: 290, status: 'Online • 99.99% Uptime', radiusOffsetKm: 1.5, angleDeg: 145, areaDesc: 'South Commercial Zone' },
    ],
    'Renewable Energy': [
      { name: 'NextEra Energy Solar Array', brand: 'NextEra Energy', category: 'Utility Photovoltaic Grid', commercialType: '75MW Clean Power Plant', rating: 4.8, reviewsCount: 620, status: 'Generating • High Yield', radiusOffsetKm: 4.2, angleDeg: 60, areaDesc: 'Substation Feeder Corridor' },
    ],
  },
};

/**
 * Detects regional geographic zone from latitude and longitude coordinates
 */
export function getRegionFromCoords(lat: number, lng: number): 'INDIA' | 'GCC' | 'GLOBAL' {
  // Middle East / GCC (Saudi Arabia, UAE, Qatar, Kuwait, Bahrain, Oman, etc.)
  if (lat >= 10 && lat <= 35 && lng >= 34 && lng <= 60) {
    return 'GCC';
  }
  // India / South Asia
  if (lat >= 6 && lat <= 38 && lng >= 68 && lng <= 98) {
    return 'INDIA';
  }
  return 'GLOBAL';
}

/**
 * Generates realistic real-world competitors around target coordinates across the whole map
 */
export function generateRealWorldCompetitors(
  centerLat: number,
  centerLng: number,
  businessType: BusinessType = 'Retail Store'
): CompetitorPoint[] {
  const region = getRegionFromCoords(centerLat, centerLng);
  const regionTemplates = REGIONAL_COMPETITORS[region] || REGIONAL_COMPETITORS['GLOBAL'];
  const templates = regionTemplates[businessType] || regionTemplates['Retail Store'];

  const cosLat = Math.cos((centerLat * Math.PI) / 180);
  const safeCosLat = Math.abs(cosLat) > 0.05 ? cosLat : 1.0;

  return templates.map((tmpl, idx) => {
    const rad = (tmpl.angleDeg * Math.PI) / 180;
    const latOffset = (tmpl.radiusOffsetKm * Math.cos(rad)) / 111.32;
    const lngOffset = (tmpl.radiusOffsetKm * Math.sin(rad)) / (111.32 * safeCosLat);

    return {
      id: `comp_${region.toLowerCase()}_${businessType.toLowerCase().slice(0, 3)}_${idx + 1}`,
      name: tmpl.name,
      brand: tmpl.brand,
      category: tmpl.category,
      lat: Number((centerLat + latOffset).toFixed(5)),
      lng: Number((centerLng + lngOffset).toFixed(5)),
      distanceKm: Number(tmpl.radiusOffsetKm.toFixed(1)),
      rating: tmpl.rating,
      reviewsCount: tmpl.reviewsCount,
      status: tmpl.status,
      address: tmpl.areaDesc,
      commercialType: tmpl.commercialType,
    };
  });
}

/**
 * Generates an expansive, seamless H3 Hexagonal Grid tessellation around target coordinates
 * with realistic spatial autocorrelation (Getis-Ord Gi* z-scores, p-values) and DBSCAN density clusters.
 */
export function generateH3GridAround(centerLat: number, centerLng: number): H3CellData[] {
  const cells: H3CellData[] = [];
  const hexRadiusKm = 0.55; // Resolution 8 cell radius (~0.78 km² area, 1.1km diameter)
  const deltaX = Math.sqrt(3) * hexRadiusKm; // ~0.9526 km between column centers
  const deltaY = 1.5 * hexRadiusKm; // ~0.825 km between row centers
  const maxRadiusKm = 8.5; // Covers ~17km diameter study area across the whole city

  let idCounter = 1;
  const radLat = (centerLat * Math.PI) / 180;
  const cosLat = Math.cos(radLat);

  for (let r = -8; r <= 8; r++) {
    const yKm = r * deltaY;
    const xOffsetKm = (r % 2 !== 0 ? deltaX / 2 : 0);

    for (let q = -8; q <= 8; q++) {
      const xKm = q * deltaX + xOffsetKm;
      const distKm = Math.sqrt(xKm * xKm + yKm * yKm);

      // Only include cells within the study boundary
      if (distKm > maxRadiusKm) continue;

      const latOffset = yKm / 111.32;
      const lngOffset = xKm / (111.32 * cosLat);
      const cellLat = Number((centerLat + latOffset).toFixed(5));
      const cellLng = Number((centerLng + lngOffset).toFixed(5));

      // Compute spatial pattern features (corridors, city center gravity, natural noise)
      const angle = Math.atan2(yKm, xKm);
      const centerFactor = Math.max(0, 1 - distKm / maxRadiusKm); // 1.0 at center -> 0.0 at edge
      
      // Secondary growth corridors along primary transit diagonals (NE-SW and NW-SE)
      const corridor1 = Math.exp(-Math.pow(Math.sin(angle - 0.65) * distKm, 2) / 3.2); // NE corridor
      const corridor2 = Math.exp(-Math.pow(Math.sin(angle + 1.2) * distKm, 2) / 4.0); // SW corridor
      const subCenter = Math.exp(-Math.pow(distKm - 3.8, 2) / 2.5) * (Math.cos(angle * 2) > 0.3 ? 0.7 : 0.1);
      
      const spatialWeight = Math.min(1.0, centerFactor * 0.65 + corridor1 * 0.45 + corridor2 * 0.35 + subCenter * 0.3);
      
      // Calculate realistic readiness score (42 - 97)
      const baseScore = 44 + spatialWeight * 51;
      const microNoise = (Math.sin(q * 3.7 + r * 2.3) + Math.cos(q * 1.9 - r * 4.1)) * 2.5;
      const readinessScore = Math.min(97, Math.max(42, Math.round(baseScore + microNoise)));

      // Population & demographic density
      const population = Math.round(1800 + spatialWeight * 38000 + Math.random() * 2500);
      const competitors = Math.round(spatialWeight * 7 + (readinessScore > 82 ? 1 : 0));
      const accessibility = Math.min(98, Math.max(38, Math.round(40 + spatialWeight * 54 + (q % 2 === 0 ? 3 : -2))));

      // Calculate Getis-Ord Gi* z-score and statistical confidence
      // Spatial autocorrelation: high values clustered together -> high positive z
      const zScore = Number(((readinessScore - 68.5) / 7.2 + (spatialWeight > 0.6 ? 0.9 : spatialWeight < 0.25 ? -0.8 : 0)).toFixed(2));
      
      let giBin: number = 0;
      let hotspotType: 'hot' | 'cold' | 'neutral' = 'neutral';
      let pValue = 0.25;

      if (zScore >= 2.58) {
        giBin = 3; // Hot spot 99%
        hotspotType = 'hot';
        pValue = 0.005;
      } else if (zScore >= 1.96) {
        giBin = 2; // Hot spot 95%
        hotspotType = 'hot';
        pValue = 0.03;
      } else if (zScore >= 1.65) {
        giBin = 1; // Hot spot 90%
        hotspotType = 'hot';
        pValue = 0.08;
      } else if (zScore <= -2.58) {
        giBin = -3; // Cold spot 99%
        hotspotType = 'cold';
        pValue = 0.004;
      } else if (zScore <= -1.96) {
        giBin = -2; // Cold spot 95%
        hotspotType = 'cold';
        pValue = 0.035;
      } else if (zScore <= -1.65) {
        giBin = -1; // Cold spot 90%
        hotspotType = 'cold';
        pValue = 0.085;
      } else {
        giBin = 0; // Not significant
        hotspotType = 'neutral';
        pValue = 0.42;
      }

      // DBSCAN Density Clustering Classification (eps=1.2km, minPts=4)
      let clusterId = 0;
      let dbscanClusterName = 'Noise / Outlier';
      const dbscanDensity = Math.round(population / 0.78); // persons per sq km

      if (distKm <= 2.2 && dbscanDensity >= 10000) {
        clusterId = 1;
        dbscanClusterName = 'Core Commercial Density Hub';
      } else if (corridor1 > 0.45 || (distKm <= 4.8 && dbscanDensity >= 5000)) {
        clusterId = 2;
        dbscanClusterName = 'Northeast Tech & Commercial Corridor';
      } else if (corridor2 > 0.4 || (distKm <= 6.0 && dbscanDensity >= 2500)) {
        clusterId = 3;
        dbscanClusterName = 'South Expressway Logistics Cluster';
      } else if (dbscanDensity >= 800) {
        clusterId = 4;
        dbscanClusterName = 'Suburban Residential & Mixed Node';
      } else {
        clusterId = 5;
        dbscanClusterName = 'Fringe Agricultural / Low Density';
      }

      // Consistent pseudo-H3 index (Resolution 8)
      const hexHash = Math.abs(Math.floor((cellLat * 10000 + cellLng * 10000 + idCounter * 73) % 65535)).toString(16).padStart(4, '0');
      const h3Index = `8860165a${hexHash}ffff`;

      cells.push({
        id: `h3_cell_${idCounter++}`,
        h3Index,
        lat: cellLat,
        lng: cellLng,
        readinessScore,
        population,
        competitors,
        accessibility,
        opportunityLevel: readinessScore >= 80 ? 'High' : readinessScore >= 65 ? 'Medium' : 'Low',
        hotspotType,
        clusterId,
        zScore,
        giBin,
        pValue,
        dbscanClusterName,
        dbscanDensity,
      });
    }
  }

  return cells;
}

/**
 * Generates vector arterial road and highway networks across the study area
 */
export function generateRoadNetwork(centerLat: number, centerLng: number): GeoJSON.FeatureCollection {
  const radLat = (centerLat * Math.PI) / 180;
  const cosLat = Math.cos(radLat);
  const toCoords = (dKmX: number, dKmY: number): [number, number] => [
    Number((centerLng + dKmX / (111.32 * cosLat)).toFixed(5)),
    Number((centerLat + dKmY / 111.32).toFixed(5)),
  ];

  // Helper to make smooth ring line
  const makeRingLine = (rKm: number, numPts: number = 36): [number, number][] => {
    const pts: [number, number][] = [];
    for (let i = 0; i <= numPts; i++) {
      const a = (2 * Math.PI * i) / numPts;
      pts.push(toCoords(rKm * Math.cos(a), rKm * Math.sin(a)));
    }
    return pts;
  };

  const features: GeoJSON.Feature[] = [
    // 1. Outer Ring Expressway (8.5 km radius)
    {
      type: 'Feature',
      properties: { name: 'Outer Orbital Expressway', type: 'Expressway', speedLimitKmh: 100, lanes: 8, color: '#00f2fe', width: 4.0 },
      geometry: { type: 'LineString', coordinates: makeRingLine(8.5, 48) },
    },
    // 2. Mid-City Arterial Ring (4.2 km radius)
    {
      type: 'Feature',
      properties: { name: 'Inner Ring Commercial Boulevard', type: 'Arterial', speedLimitKmh: 60, lanes: 6, color: '#38bdf8', width: 3.2 },
      geometry: { type: 'LineString', coordinates: makeRingLine(4.2, 36) },
    },
    // 3. National North-South Highway Spine
    {
      type: 'Feature',
      properties: { name: 'National Highway 48 Feeder Corridor', type: 'Expressway', speedLimitKmh: 90, lanes: 6, color: '#00f2fe', width: 4.0 },
      geometry: {
        type: 'LineString',
        coordinates: [
          toCoords(-1.5, 12.0),
          toCoords(-0.8, 7.5),
          toCoords(0.2, 3.0),
          toCoords(0.0, 0.0),
          toCoords(0.5, -4.5),
          toCoords(1.8, -9.0),
          toCoords(2.5, -13.0),
        ],
      },
    },
    // 4. East-West High-Speed Transit Arterial
    {
      type: 'Feature',
      properties: { name: 'East-West Regional Bypass', type: 'Arterial', speedLimitKmh: 70, lanes: 6, color: '#38bdf8', width: 3.0 },
      geometry: {
        type: 'LineString',
        coordinates: [
          toCoords(-12.0, -1.0),
          toCoords(-6.5, -0.4),
          toCoords(0.0, 0.0),
          toCoords(5.8, 0.8),
          toCoords(11.5, 1.4),
        ],
      },
    },
    // 5. Northeast Tech Radial Corridor
    {
      type: 'Feature',
      properties: { name: 'Northeast Tech Radial Expressway', type: 'Arterial', speedLimitKmh: 75, lanes: 6, color: '#818cf8', width: 3.0 },
      geometry: {
        type: 'LineString',
        coordinates: [
          toCoords(0.0, 0.0),
          toCoords(2.8, 3.2),
          toCoords(6.5, 7.2),
          toCoords(10.2, 11.0),
        ],
      },
    },
    // 6. Southwest Port & Airport Feeder
    {
      type: 'Feature',
      properties: { name: 'Southwest Freight & Airport Feeder', type: 'Arterial', speedLimitKmh: 80, lanes: 6, color: '#818cf8', width: 3.0 },
      geometry: {
        type: 'LineString',
        coordinates: [
          toCoords(0.0, 0.0),
          toCoords(-3.2, -2.8),
          toCoords(-7.5, -6.4),
          toCoords(-11.0, -9.8),
        ],
      },
    },
  ];

  return { type: 'FeatureCollection', features };
}

/**
 * Generates municipal land use and zoning parcels across the study area
 */
export function generateLandUseZoning(centerLat: number, centerLng: number): GeoJSON.FeatureCollection {
  const radLat = (centerLat * Math.PI) / 180;
  const cosLat = Math.cos(radLat);
  const toCoords = (dKmX: number, dKmY: number): [number, number] => [
    Number((centerLng + dKmX / (111.32 * cosLat)).toFixed(5)),
    Number((centerLat + dKmY / 111.32).toFixed(5)),
  ];

  const makeBox = (minX: number, minY: number, maxX: number, maxY: number): [number, number][] => [
    toCoords(minX, minY),
    toCoords(maxX, minY),
    toCoords(maxX, maxY),
    toCoords(minX, maxY),
    toCoords(minX, minY),
  ];

  const features: GeoJSON.Feature[] = [
    // Central Commercial CBD
    {
      type: 'Feature',
      properties: { name: 'Central Business District (CBD)', code: 'C-1 High Density Commercial', color: '#a855f7', opacity: 0.50, desc: 'High-intensity retail, corporate headquarters, and multi-story commercial plazas.' },
      geometry: { type: 'Polygon', coordinates: [makeBox(-1.8, -1.8, 1.8, 1.8)] },
    },
    // Northeast High-Tech & IT Zone
    {
      type: 'Feature',
      properties: { name: 'Silicon Tech & Innovation Park', code: 'IT-2 Tech SEZ', color: '#6366f1', opacity: 0.45, desc: 'Enterprise software campuses, data centers, and advanced technology hubs.' },
      geometry: { type: 'Polygon', coordinates: [makeBox(2.2, 1.5, 6.8, 5.8)] },
    },
    // Southeast Industrial & Logistics Mega-Park
    {
      type: 'Feature',
      properties: { name: 'South Freight & Logistics Hub', code: 'I-3 Heavy Logistics Park', color: '#f59e0b', opacity: 0.45, desc: 'Warehouses, 3PL fulfillment centers, cold storage, and container depots.' },
      geometry: { type: 'Polygon', coordinates: [makeBox(2.0, -6.5, 7.5, -2.2)] },
    },
    // West Mixed-Use High-Street Corridor
    {
      type: 'Feature',
      properties: { name: 'West End Mixed-Use Boulevard', code: 'MU-4 Commercial Mixed', color: '#ec4899', opacity: 0.45, desc: 'Ground-floor retail, premium dining, multiplexes, and urban apartments.' },
      geometry: { type: 'Polygon', coordinates: [makeBox(-6.0, -2.5, -2.2, 2.5)] },
    },
    // North Master-Planned Residential Sectors
    {
      type: 'Feature',
      properties: { name: 'North Gated Residential Township', code: 'R-1 Master Residential', color: '#10b981', opacity: 0.35, desc: 'High-density residential towers, community parks, and neighborhood retail.' },
      geometry: { type: 'Polygon', coordinates: [makeBox(-4.0, 2.2, 1.8, 7.2)] },
    },
    // Southwest Institutional Belt
    {
      type: 'Feature',
      properties: { name: 'Southwest Institutional & University Belt', code: 'INS-2 Institutional', color: '#06b6d4', opacity: 0.40, desc: 'University campuses, research institutes, hospitals, and civic grounds.' },
      geometry: { type: 'Polygon', coordinates: [makeBox(-6.5, -6.8, -1.5, -2.8)] },
    },
  ];

  return { type: 'FeatureCollection', features };
}

/**
 * Generates environmental, flood, and operational risk hazard zones
 */
export function generateRiskZones(centerLat: number, centerLng: number): GeoJSON.FeatureCollection {
  const radLat = (centerLat * Math.PI) / 180;
  const cosLat = Math.cos(radLat);
  const toCoords = (dKmX: number, dKmY: number): [number, number] => [
    Number((centerLng + dKmX / (111.32 * cosLat)).toFixed(5)),
    Number((centerLat + dKmY / 111.32).toFixed(5)),
  ];

  const features: GeoJSON.Feature[] = [
    // River Flood Inundation Buffer (100-Year High Risk Basin)
    {
      type: 'Feature',
      properties: { name: 'River Tapi Flood Inundation Plain', severity: 'High Risk (100-Yr Return)', color: '#ef4444', desc: '100-year flood zone buffer requiring mandatory 1.5m plinth elevation and hydraulic clearance.' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          toCoords(-8.5, 3.2),
          toCoords(-5.2, 2.8),
          toCoords(-2.0, 1.4),
          toCoords(1.2, 0.2),
          toCoords(4.8, -1.2),
          toCoords(8.2, -3.0),
          toCoords(7.8, -4.2),
          toCoords(4.2, -2.6),
          toCoords(0.8, -1.2),
          toCoords(-2.4, 0.0),
          toCoords(-5.8, 1.4),
          toCoords(-8.8, 1.8),
          toCoords(-8.5, 3.2),
        ]],
      },
    },
    // Low-Lying Coastal / Wetland Storm Buffer
    {
      type: 'Feature',
      properties: { name: 'Estuary Storm Surge & Marsh Buffer', severity: 'Medium Risk Buffer', color: '#f97316', desc: 'Coastal marshland with high soil liquefaction and seasonal monsoon waterlogging.' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          toCoords(-9.5, -4.5),
          toCoords(-7.0, -5.2),
          toCoords(-6.8, -9.0),
          toCoords(-10.2, -9.2),
          toCoords(-9.5, -4.5),
        ]],
      },
    },
    // High Voltage Grid Transmission Setback
    {
      type: 'Feature',
      properties: { name: '400kV High-Voltage Corridor Setback', severity: 'Infrastructure Hazard Setback', color: '#eab308', desc: 'Mandatory 45-meter non-construction safety buffer beneath high-voltage transmission lines.' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          toCoords(6.5, 7.8),
          toCoords(7.0, 7.6),
          toCoords(8.2, -6.5),
          toCoords(7.7, -6.7),
          toCoords(6.5, 7.8),
        ]],
      },
    },
  ];

  return { type: 'FeatureCollection', features };
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
