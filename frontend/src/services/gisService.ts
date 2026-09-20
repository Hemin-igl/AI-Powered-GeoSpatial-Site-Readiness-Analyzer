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
export const REAL_WORLD_COMPETITORS_BY_TYPE: Record<BusinessType, {
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
}[]> = {
  'Retail Store': [
    // Core & Downtown Commercial Hub (0.4km - 2km)
    { name: 'Reliance Smart Bazaar', brand: 'Reliance Retail', category: 'Hypermarket & Grocery', commercialType: 'Anchor Hypermarket', rating: 4.4, reviewsCount: 3840, status: 'Open • Closes 10:30 PM', radiusOffsetKm: 0.8, angleDeg: 35, areaDesc: 'Central Market Corridor' },
    { name: 'D-Mart Supercenter', brand: 'Avenue Supermarts', category: 'Discount Retail & Grocery', commercialType: 'Mega Superstore', rating: 4.7, reviewsCount: 8920, status: 'Open • Closes 11 PM', radiusOffsetKm: 1.4, angleDeg: 120, areaDesc: 'South Arterial Road' },
    { name: 'Starbucks Reserve & Cafe', brand: 'Tata Starbucks', category: 'Specialty Coffee & QSR', commercialType: 'High-Street Flagship', rating: 4.6, reviewsCount: 2410, status: 'Open • Closes 11:30 PM', radiusOffsetKm: 0.6, angleDeg: 210, areaDesc: 'Main High Street' },
    { name: 'Croma Mega Tech Store', brand: 'Tata Digital', category: 'Consumer Electronics & Gadgets', commercialType: 'Electronics Superstore', rating: 4.3, reviewsCount: 1950, status: 'Open • Closes 9:30 PM', radiusOffsetKm: 1.9, angleDeg: 295, areaDesc: 'West Commercial Plaza' },
    { name: 'Zudio Fast Fashion', brand: 'Trent Ltd', category: 'Apparel & Department Store', commercialType: 'Fashion Retail Store', rating: 4.2, reviewsCount: 1530, status: 'Open • Closes 10 PM', radiusOffsetKm: 1.1, angleDeg: 75, areaDesc: 'East Transit Avenue' },
    { name: 'McDonald’s 24/7 Drive-Thru', brand: 'McDonald’s', category: 'Quick Service Restaurant', commercialType: 'Drive-Thru Hub', rating: 4.2, reviewsCount: 4200, status: 'Open 24 Hours', radiusOffsetKm: 0.5, angleDeg: 15, areaDesc: 'North Intersection' },
    { name: 'Apple Authorized Premium Store', brand: 'Apple / Unicorn', category: 'Premium Technology Retail', commercialType: 'Brand Flagship Store', rating: 4.9, reviewsCount: 3100, status: 'Open • Closes 9 PM', radiusOffsetKm: 1.5, angleDeg: 190, areaDesc: 'Tech Retail Park' },
    { name: 'KFC Express & Dine-in', brand: 'Yum! Brands', category: 'Fast Food & QSR', commercialType: 'Commercial Food Node', rating: 4.1, reviewsCount: 2890, status: 'Open • Closes 11 PM', radiusOffsetKm: 1.7, angleDeg: 340, areaDesc: 'City Center Link' },

    // Mid-Ring City Commercial Centers & Megamalls (2.5km - 6.5km)
    { name: 'Decathlon Sports Megastore', brand: 'Decathlon', category: 'Sporting Goods & Equipment', commercialType: 'Destination Superstore', rating: 4.8, reviewsCount: 6540, status: 'Open • Closes 10 PM', radiusOffsetKm: 2.8, angleDeg: 165, areaDesc: 'Outer Ring Highway' },
    { name: 'Westside Lifestyle Flagship', brand: 'Trent Ltd', category: 'Fashion, Footwear & Living', commercialType: 'Department Flagship', rating: 4.4, reviewsCount: 2190, status: 'Open • Closes 9:30 PM', radiusOffsetKm: 2.1, angleDeg: 340, areaDesc: 'North City Center' },
    { name: 'Shoppers Stop Galleria Mall', brand: 'Shoppers Stop', category: 'Luxury Department Store', commercialType: 'Mall Anchor Store', rating: 4.3, reviewsCount: 3400, status: 'Open • Closes 10 PM', radiusOffsetKm: 3.2, angleDeg: 260, areaDesc: 'West Mall Galleria' },
    { name: 'Nexus Celebration Mall', brand: 'Nexus Malls', category: 'Regional Shopping Mall', commercialType: 'Shopping Mall & Multiplex', rating: 4.6, reviewsCount: 14200, status: 'Open • Closes 11 PM', radiusOffsetKm: 4.1, angleDeg: 90, areaDesc: 'East District Center' },
    { name: 'Phoenix Marketcity Megamall', brand: 'The Phoenix Mills', category: 'Destination Retail & Leisure', commercialType: 'Mega Shopping Mall', rating: 4.7, reviewsCount: 22800, status: 'Open • Closes 11 PM', radiusOffsetKm: 5.2, angleDeg: 215, areaDesc: 'South Expressway Hub' },
    { name: 'Inorbit Mega Mall', brand: 'K Raheja Corp', category: 'Shopping Mall & Entertainment', commercialType: 'Lifestyle Complex', rating: 4.5, reviewsCount: 11600, status: 'Open • Closes 10:30 PM', radiusOffsetKm: 4.8, angleDeg: 310, areaDesc: 'Northwest Commercial Hub' },
    { name: 'IKEA City Store & Warehouse', brand: 'Ingka Group', category: 'Home Furnishing Mega-Store', commercialType: 'Global Mega Retailer', rating: 4.8, reviewsCount: 18500, status: 'Open • Closes 10 PM', radiusOffsetKm: 5.8, angleDeg: 45, areaDesc: 'Northeast Bypass Road' },
    { name: 'Pantaloons Mega Fashion', brand: 'Aditya Birla Fashion', category: 'Family Apparel & Retail', commercialType: 'Retail Department Store', rating: 4.2, reviewsCount: 1870, status: 'Open • Closes 9:30 PM', radiusOffsetKm: 3.7, angleDeg: 180, areaDesc: 'Southern Retail Spine' },
    { name: 'Vijay Sales Electronics Superstore', brand: 'Vijay Sales', category: 'Home Appliances & Digital', commercialType: 'Electronics Megastore', rating: 4.3, reviewsCount: 2450, status: 'Open • Closes 9:30 PM', radiusOffsetKm: 4.4, angleDeg: 140, areaDesc: 'South Commercial Ring' },
    { name: 'H&M Global Fashion Store', brand: 'H&M Hennes & Mauritz', category: 'International Apparel', commercialType: 'High-Street Brand Outlet', rating: 4.5, reviewsCount: 4780, status: 'Open • Closes 10 PM', radiusOffsetKm: 3.5, angleDeg: 280, areaDesc: 'West End Shopping Strip' },

    // Outer Regional City Corridors & Expressways (7km - 16km)
    { name: 'Reliance Digital Mega Center', brand: 'Reliance Retail', category: 'Electronics & Tech Hypermarket', commercialType: 'Regional Tech Center', rating: 4.4, reviewsCount: 3120, status: 'Open • Closes 10 PM', radiusOffsetKm: 7.2, angleDeg: 25, areaDesc: 'North Airport Corridor' },
    { name: 'Max Fashion Hyper Store', brand: 'Landmark Group', category: 'Value Apparel Hyperstore', commercialType: 'Regional Commercial Center', rating: 4.3, reviewsCount: 1650, status: 'Open • Closes 9:30 PM', radiusOffsetKm: 8.5, angleDeg: 145, areaDesc: 'Southeast Industrial Belt' },
    { name: 'Nature’s Basket Gourmet Store', brand: 'Spencer’s Retail', category: 'Gourmet & Imported Grocery', commercialType: 'Boutique Supermarket', rating: 4.5, reviewsCount: 980, status: 'Open • Closes 10 PM', radiusOffsetKm: 6.9, angleDeg: 275, areaDesc: 'West Suburbs Plaza' },
    { name: 'Subway Fresh 24/7 Drive-Thru', brand: 'Subway IP LLC', category: 'Quick Service Dining', commercialType: 'Express Highway Kiosk', rating: 4.0, reviewsCount: 1120, status: 'Open 24 Hours', radiusOffsetKm: 9.4, angleDeg: 200, areaDesc: 'South Ring Bypass' },
    { name: 'Domino’s Mega Pizza Hub', brand: 'Jubilant FoodWorks', category: 'Fast Casual Dining', commercialType: 'QSR Delivery Hub', rating: 4.2, reviewsCount: 2340, status: 'Open • Closes 1 AM', radiusOffsetKm: 11.2, angleDeg: 65, areaDesc: 'East Tech Corridor' },
    { name: 'Smart Bazaar Superstore', brand: 'Reliance Retail', category: 'Value Supermarket & Home', commercialType: 'Outer Highway Supercenter', rating: 4.1, reviewsCount: 2900, status: 'Open • Closes 10 PM', radiusOffsetKm: 12.8, angleDeg: 330, areaDesc: 'North Expressway Gateway' },
    { name: 'Tanishq & Titan Flagship Store', brand: 'Titan Company', category: 'Jewelry & Luxury Lifestyle', commercialType: 'Luxury Destination Boutique', rating: 4.7, reviewsCount: 1540, status: 'Open • Closes 9 PM', radiusOffsetKm: 8.1, angleDeg: 110, areaDesc: 'East Commercial Boulevard' },
    { name: 'Burger King Highway Drive-Thru', brand: 'Restaurant Brands Asia', category: 'QSR Fast Food', commercialType: 'Highway Transit Outlet', rating: 4.3, reviewsCount: 3180, status: 'Open 24 Hours', radiusOffsetKm: 14.5, angleDeg: 240, areaDesc: 'Southwest Express Junction' },
    { name: 'Vishal Mega Mart', brand: 'Airplaza Retail', category: 'Hypermarket & Value Fashion', commercialType: 'Suburban Superstore', rating: 4.0, reviewsCount: 4100, status: 'Open • Closes 10 PM', radiusOffsetKm: 15.6, angleDeg: 18, areaDesc: 'North-East Orbital Ring' },
  ],
  'EV Charging Station': [
    // Core & Inner Area (0.5km - 2.5km)
    { name: 'Tata Power EZ Charge 60kW DC Fast Hub', brand: 'Tata Power', category: 'Dual-Gun CCS2 Fast Hub', commercialType: 'Public Fast Charging Hub', rating: 4.5, reviewsCount: 820, status: 'Operational • 24/7', radiusOffsetKm: 0.7, angleDeg: 45, areaDesc: 'Central Transit Plaza' },
    { name: 'Jio-bp pulse 120kW Super-Charger', brand: 'Jio-bp', category: 'Ultra-Fast Dual Gun Hub', commercialType: 'Commercial Highway Hub', rating: 4.7, reviewsCount: 1450, status: 'Operational • 24/7', radiusOffsetKm: 1.3, angleDeg: 140, areaDesc: 'South Main Arterial' },
    { name: 'Ather Grid Rapid Charging Point', brand: 'Ather Energy', category: '2-Wheeler Rapid Point', commercialType: 'Urban Fast Point', rating: 4.6, reviewsCount: 940, status: 'Operational • 24/7', radiusOffsetKm: 0.9, angleDeg: 225, areaDesc: 'West Commercial Street' },
    { name: 'Statiq Ultra Commercial Station', brand: 'Statiq', category: 'Multi-Vehicle Public Hub', commercialType: 'Commercial Fleet Hub', rating: 4.2, reviewsCount: 620, status: 'Operational • 24/7', radiusOffsetKm: 1.8, angleDeg: 315, areaDesc: 'North Metro Interchange' },
    { name: 'ChargePoint 50kW Dual Charger', brand: 'ChargePoint', category: 'Fleet & Public Fast Hub', commercialType: 'Dual Dispenser Site', rating: 4.4, reviewsCount: 390, status: 'Operational • 24/7', radiusOffsetKm: 1.5, angleDeg: 85, areaDesc: 'East Boulevard Hub' },
    { name: 'Servotech 60kW DC Fast Station', brand: 'Servotech Power', category: 'Heavy & Passenger EV Point', commercialType: 'Public Fast Charger', rating: 4.3, reviewsCount: 280, status: 'Operational • 24/7', radiusOffsetKm: 2.2, angleDeg: 195, areaDesc: 'South Tech Complex' },

    // Mid-Ring City Corridors (2.8km - 6.5km)
    { name: 'Zeon Charging 150kW Hyper-Port', brand: 'Zeon', category: 'Commercial Ultra-Fast Hub', commercialType: 'High-Power EV Plaza', rating: 4.6, reviewsCount: 1120, status: 'Operational • 24/7', radiusOffsetKm: 3.1, angleDeg: 180, areaDesc: 'South Ring Junction' },
    { name: 'Shell Recharge Ultra-Fast 120kW', brand: 'Shell EV', category: 'Highway Supercharging Plaza', commercialType: 'Fuel & EV Supercourt', rating: 4.7, reviewsCount: 1890, status: 'Operational • 24/7', radiusOffsetKm: 4.3, angleDeg: 290, areaDesc: 'West Expressway Node' },
    { name: 'BPCL e-Drive Fast EV Plaza', brand: 'Bharat Petroleum', category: 'Public Fuel & EV Station', commercialType: 'Energy Super-Station', rating: 4.3, reviewsCount: 780, status: 'Operational • 24/7', radiusOffsetKm: 3.8, angleDeg: 60, areaDesc: 'Northeast Arterial' },
    { name: 'Kazam EV Rapid Charging Hub', brand: 'Kazam', category: 'Commercial Fleet EV Point', commercialType: 'Fleet & Public Charger', rating: 4.2, reviewsCount: 510, status: 'Operational • 24/7', radiusOffsetKm: 5.1, angleDeg: 125, areaDesc: 'Southeast Commercial Park' },
    { name: 'Fortum Charge & Drive Hub', brand: 'Fortum', category: 'Green Energy DC Fast Station', commercialType: 'Nordic Clean EV Hub', rating: 4.5, reviewsCount: 670, status: 'Operational • 24/7', radiusOffsetKm: 4.9, angleDeg: 215, areaDesc: 'Southwest Tech Zone' },
    { name: 'Glida 120kW Supercharger Station', brand: 'Glida (Fortum)', category: 'Multi-Bay DC Fast Hub', commercialType: 'High-Traffic Station', rating: 4.6, reviewsCount: 890, status: 'Operational • 24/7', radiusOffsetKm: 5.9, angleDeg: 345, areaDesc: 'North Bypass Flyover' },

    // Outer Expressway Corridors (7km - 16km)
    { name: 'Tata Power 180kW Highway Mega-Hub', brand: 'Tata Power', category: 'Multi-Bay Highway Super-Hub', commercialType: 'Intercity Mega-Station', rating: 4.8, reviewsCount: 2310, status: 'Operational • 24/7', radiusOffsetKm: 8.2, angleDeg: 15, areaDesc: 'North Highway Toll Plaza' },
    { name: 'Jio-bp pulse Express Freight Charge Hub', brand: 'Jio-bp', category: 'Heavy Commercial EV Station', commercialType: 'Freight & Bus Fast Port', rating: 4.6, reviewsCount: 1140, status: 'Operational • 24/7', radiusOffsetKm: 10.5, angleDeg: 165, areaDesc: 'Logistics Park Corridor' },
    { name: 'Statiq Highway Corridor EV Station', brand: 'Statiq', category: 'Intercity DC Fast Charging', commercialType: 'Highway Oasis Port', rating: 4.4, reviewsCount: 960, status: 'Operational • 24/7', radiusOffsetKm: 12.4, angleDeg: 255, areaDesc: 'Western Bypass Exit' },
    { name: 'HPCL e-Mobility Super Hub', brand: 'Hindustan Petroleum', category: 'Multi-Standard EV Plaza', commercialType: 'Highway Service Supercourt', rating: 4.3, reviewsCount: 840, status: 'Operational • 24/7', radiusOffsetKm: 14.1, angleDeg: 345, areaDesc: 'Northwest Ring Highway' },
    { name: 'ChargeZone 240kW Ultra-Fast Hub', brand: 'ChargeZone', category: 'Ultra-High-Voltage Corridor', commercialType: 'Flagship EV Superstation', rating: 4.7, reviewsCount: 1680, status: 'Operational • 24/7', radiusOffsetKm: 15.8, angleDeg: 100, areaDesc: 'East National Corridor' },
  ],
  'Warehouse': [
    // City Edge & Industrial Zones (1.5km - 5.5km)
    { name: 'Amazon Sortation & Fulfillment Centre', brand: 'Amazon Logistics', category: 'E-commerce Mega Fulfillment', commercialType: 'Automated Mega Sort Facility', rating: 4.8, reviewsCount: 4200, status: 'Active 24/7 Operations', radiusOffsetKm: 2.4, angleDeg: 60, areaDesc: 'East Logistics Corridor' },
    { name: 'Flipkart Large Goods Hub', brand: 'Flipkart Logistics', category: 'Regional Sorting Facility', commercialType: 'Grade-A Regional Warehouse', rating: 4.5, reviewsCount: 2800, status: 'Active 24/7 Operations', radiusOffsetKm: 3.1, angleDeg: 150, areaDesc: 'South Industrial Estate' },
    { name: 'DHL Global Express Air Cargo Terminal', brand: 'DHL Express', category: 'Cross-Border Logistics Gateway', commercialType: 'Airport Cargo Hub', rating: 4.6, reviewsCount: 1940, status: 'Active • Customs Cleared', radiusOffsetKm: 1.9, angleDeg: 240, areaDesc: 'Airport Cargo Terminal' },
    { name: 'Blue Dart Aviation Cargo Hub', brand: 'Blue Dart', category: 'Express Parcel Distribution', commercialType: 'Multi-Modal Sort Depot', rating: 4.3, reviewsCount: 1510, status: 'Active 24/7 Operations', radiusOffsetKm: 2.7, angleDeg: 320, areaDesc: 'North Railway Freight Yard' },
    { name: 'Delhivery Mega Gateway & Truck Terminal', brand: 'Delhivery', category: 'Automated Hub & Spoke Facility', commercialType: 'National Sorting Superhub', rating: 4.2, reviewsCount: 3100, status: 'Active 24/7 Operations', radiusOffsetKm: 3.9, angleDeg: 105, areaDesc: 'Southeast Freight Ring' },
    { name: 'Shadowfax E-Commerce Mid-Mile Hub', brand: 'Shadowfax', category: 'Express Hyperlocal Hub', commercialType: 'Rapid Sort Facility', rating: 4.1, reviewsCount: 890, status: 'Active 24/7 Operations', radiusOffsetKm: 4.8, angleDeg: 205, areaDesc: 'South Outer Industrial Belt' },

    // Outer Logistics Parks & Dry Ports (6km - 16km)
    { name: 'IndoSpace Industrial & Logistics Park', brand: 'IndoSpace', category: 'Grade-A Warehousing Complex', commercialType: 'Multi-Tenant Logistics Park', rating: 4.7, reviewsCount: 1250, status: 'Full Capacity Operations', radiusOffsetKm: 7.8, angleDeg: 40, areaDesc: 'National Highway Logistics Zone' },
    { name: 'Mahindra Logistics Mega Multi-Client Hub', brand: 'Mahindra Logistics', category: 'Automotive & 3PL Warehouse', commercialType: 'Integrated 3PL Facility', rating: 4.5, reviewsCount: 980, status: 'Active Operations', radiusOffsetKm: 9.4, angleDeg: 195, areaDesc: 'South Industrial Mega-Cluster' },
    { name: 'TVS Supply Chain Regional Hub', brand: 'TVS SCS', category: 'Integrated Supply Chain Center', commercialType: 'Industrial Distribution Center', rating: 4.4, reviewsCount: 760, status: 'Active Operations', radiusOffsetKm: 8.6, angleDeg: 285, areaDesc: 'West Port Feeder Corridor' },
    { name: 'Allcargo Logistics Inland Container Depot', brand: 'Allcargo', category: 'Dry Port & Container Freight', commercialType: 'Inland Port & Rail Siding', rating: 4.6, reviewsCount: 1420, status: 'Active Rail Freight Node', radiusOffsetKm: 12.1, angleDeg: 135, areaDesc: 'Dedicated Freight Corridor' },
    { name: 'FedEx Express Freight Terminal', brand: 'FedEx', category: 'Global Air Cargo & Courier Hub', commercialType: 'Express Courier Distribution', rating: 4.5, reviewsCount: 1100, status: 'Active 24/7 Operations', radiusOffsetKm: 14.3, angleDeg: 330, areaDesc: 'North Outer Logistics Ring' },
    { name: 'ESR Logistics Mega Park', brand: 'ESR Group', category: 'Modern Logistics Real Estate', commercialType: 'Grade-A Mega Park', rating: 4.8, reviewsCount: 650, status: 'Operational Grade-A', radiusOffsetKm: 15.5, angleDeg: 80, areaDesc: 'Eastern Express Bypass' },
  ],
  'Telecom Tower': [
    // Urban High-Density Sector (0.4km - 3km)
    { name: 'Indus Towers 5G High-Density Node', brand: 'Indus Towers', category: 'Shared Infrastructure Monopole', commercialType: 'Shared Macrocell Tower', rating: 4.6, reviewsCount: 310, status: 'Online • 99.98% Uptime', radiusOffsetKm: 0.4, angleDeg: 30, areaDesc: 'Central Urban Core' },
    { name: 'Bharti Airtel 5G Ultra-Wideband Tower', brand: 'Airtel', category: 'Fiberized Macrocell Tower', commercialType: 'High-Power 5G Hub Site', rating: 4.7, reviewsCount: 420, status: 'Online • Fiber-Connected', radiusOffsetKm: 1.2, angleDeg: 135, areaDesc: 'South Commercial Sector' },
    { name: 'Reliance Jio True5G Giga-Node Lattice', brand: 'Jio Platforms', category: 'C-Band 5G High-Capacity', commercialType: 'Autonomous 5G Node', rating: 4.8, reviewsCount: 580, status: 'Online • Active MIMO', radiusOffsetKm: 0.8, angleDeg: 220, areaDesc: 'West Residential Cluster' },
    { name: 'American Tower Corp (ATC) Site', brand: 'ATC India', category: 'Co-Location Lattice Tower', commercialType: 'Multi-Tenant Telecom Mast', rating: 4.3, reviewsCount: 190, status: 'Online • Multi-Carrier', radiusOffsetKm: 2.1, angleDeg: 305, areaDesc: 'North Commercial Zone' },
    { name: 'Summit Digitel 5G Small Cell Cluster', brand: 'Summit Digitel', category: 'Dense Urban Small Cell Pole', commercialType: 'Street-Level Small Cell', rating: 4.5, reviewsCount: 220, status: 'Online • Active Beamforming', radiusOffsetKm: 1.6, angleDeg: 80, areaDesc: 'East Financial District' },

    // Suburban & Transit Corridors (4km - 15km)
    { name: 'BSNL Telecom Central Exchange Tower', brand: 'BSNL', category: 'State Telecom Backbone Mast', commercialType: 'Central Exchange Tower', rating: 4.0, reviewsCount: 650, status: 'Online • Microwave Backbone', radiusOffsetKm: 4.6, angleDeg: 170, areaDesc: 'South Suburb Hub' },
    { name: 'GTL Infrastructure Highway Monopole', brand: 'GTL Infra', category: 'Highway Corridor Cell Site', commercialType: 'Corridor Monopole', rating: 4.2, reviewsCount: 140, status: 'Online • Highway Feeder', radiusOffsetKm: 6.8, angleDeg: 250, areaDesc: 'Western Expressway' },
    { name: 'Indus Towers High-Power Macrocell', brand: 'Indus Towers', category: 'Long-Range Rural/Suburban Mast', commercialType: 'High-Altitude Guyed Mast', rating: 4.6, reviewsCount: 280, status: 'Online • High Gain', radiusOffsetKm: 9.3, angleDeg: 20, areaDesc: 'North Expansion Corridor' },
    { name: 'Airtel Fiberized 5G Micro-Tower', brand: 'Airtel', category: 'Transit Corridor Node', commercialType: 'Fiberized Monopole', rating: 4.7, reviewsCount: 390, status: 'Online • High Bandwidth', radiusOffsetKm: 11.5, angleDeg: 115, areaDesc: 'East Industrial Bypass' },
    { name: 'Jio 5G Massive MIMO Tower Site', brand: 'Jio Platforms', category: 'High-Density Smart City Node', commercialType: 'Massive MIMO Tower', rating: 4.8, reviewsCount: 710, status: 'Online • AI Load Balancing', radiusOffsetKm: 13.8, angleDeg: 300, areaDesc: 'Northwest Ring Corridor' },
    { name: 'ATC India Rural Reach Supermast', brand: 'ATC India', category: 'Regional Cellular Mast', commercialType: 'High-Gain Lattice Mast', rating: 4.4, reviewsCount: 160, status: 'Online • Active Backhaul', radiusOffsetKm: 15.2, angleDeg: 190, areaDesc: 'South Intercity Highway' },
  ],
  'Renewable Energy': [
    // Suburbs & Outskirts (2.5km - 16km)
    { name: 'Tata Power Solar Microgrid Plant', brand: 'Tata Power Solar', category: 'Ground-Mounted Photovoltaic Array', commercialType: '15MW Solar Farm & BESS', rating: 4.7, reviewsCount: 520, status: 'Generating • 98.4% Efficiency', radiusOffsetKm: 3.2, angleDeg: 55, areaDesc: 'Northeast Substation Corridor' },
    { name: 'Adani Green Energy Substation & Feed', brand: 'Adani Green', category: 'High-Voltage Grid Interconnection', commercialType: '33kV Clean Power Substation', rating: 4.5, reviewsCount: 410, status: 'Grid Synchronized', radiusOffsetKm: 4.1, angleDeg: 160, areaDesc: 'South Open Industrial Land' },
    { name: 'Sterling & Wilson Commercial Solar Farm', brand: 'Sterling & Wilson', category: 'Commercial Rooftop & Solar Field', commercialType: 'Commercial Distributed Plant', rating: 4.6, reviewsCount: 310, status: 'Generating • Active Net-Metering', radiusOffsetKm: 2.6, angleDeg: 280, areaDesc: 'Western Industrial Belt' },
    { name: 'ReNew Power Wind-Solar Hybrid Station', brand: 'ReNew Power', category: 'Utility-Scale Hybrid Substation', commercialType: '50MW Hybrid Utility Station', rating: 4.8, reviewsCount: 680, status: 'Generating • High Yield', radiusOffsetKm: 6.9, angleDeg: 110, areaDesc: 'Southeast Rural Outskirts' },
    { name: 'Azure Power Utility Photovoltaic Farm', brand: 'Azure Power', category: '50MW Grid Tied Solar Park', commercialType: 'Utility Solar Generation Park', rating: 4.4, reviewsCount: 390, status: 'Generating • SCADA Monitored', radiusOffsetKm: 9.7, angleDeg: 215, areaDesc: 'Southwest Agricultural Buffer' },
    { name: 'Vikram Solar Commercial Micro-Array', brand: 'Vikram Solar', category: 'Industrial Park Solar Canopy', commercialType: 'Industrial Rooftop & Carport Array', rating: 4.5, reviewsCount: 260, status: 'Generating • Active Feed', radiusOffsetKm: 8.3, angleDeg: 335, areaDesc: 'Northwest Green Zone' },
    { name: 'Waaree Energies Rooftop Solar Cluster', brand: 'Waaree Energies', category: 'Distributed Rooftop Clean Energy', commercialType: 'Cluster Grid Feed Array', rating: 4.6, reviewsCount: 470, status: 'Generating • Active Grid', radiusOffsetKm: 13.2, angleDeg: 75, areaDesc: 'Eastern High-Voltage Corridor' },
    { name: 'CleanMax Commercial Industrial Solar Farm', brand: 'CleanMax', category: 'Corporate PPA Clean Energy Plant', commercialType: 'Private Power Park', rating: 4.7, reviewsCount: 380, status: 'Generating • PPA Dedicated', radiusOffsetKm: 15.6, angleDeg: 245, areaDesc: 'Southwest Energy Corridor' },
  ],
};

/**
 * Generates realistic real-world competitors around target coordinates across the whole map
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
      reviewsCount: tmpl.reviewsCount,
      status: tmpl.status,
      address: tmpl.areaDesc,
      commercialType: tmpl.commercialType,
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
