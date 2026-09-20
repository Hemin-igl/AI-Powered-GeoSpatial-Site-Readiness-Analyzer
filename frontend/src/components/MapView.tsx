import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import maplibregl, { Map as MapLibreMap, Marker, Popup } from 'maplibre-gl';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Compass,
  Layers,
  MapPin,
  Crosshair,
  Sparkles,
  Info,
  Navigation,
  Globe,
  Sun,
  Moon,
  PenTool,
  MousePointer,
  Trash2,
  CheckCircle2,
  X,
  ChevronRight,
  ShieldAlert,
  Users,
  Building2,
  Activity,
} from 'lucide-react';
import {
  CandidateSite,
  CompetitorPoint,
  H3CellData,
  MapLayerConfig,
  City,
  BusinessType,
  ARCHETYPES,
} from '../types';
import { LayerControl } from './LayerControl';
import {
  generateRealWorldCompetitors,
  generateH3GridAround,
  generateRoadNetwork,
  generateLandUseZoning,
  generateRiskZones,
  analyzeSite,
} from '../services/gisService';

const MAP_API_KEY = import.meta.env.VITE_MAP_API_KEY || 'cb1_3r5w_1_870f82872ede2321c67a7ba6';

// MapLibre Basemap Style Presets
const MAP_STYLES = {
  dark: {
    name: 'Dark Matter GIS',
    icon: Moon,
    style: {
      version: 8,
      sources: {
        'esri-dark-base': {
          type: 'raster',
          tiles: [
            'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
          ],
          tileSize: 256,
          maxzoom: 16, // ESRI Canvas native maxzoom is 16; MapLibre will smoothly overzoom to 20+
          attribution: '&copy; Esri, DeLorme, NAVTEQ',
        },
        'esri-dark-ref': {
          type: 'raster',
          tiles: [
            'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
          ],
          tileSize: 256,
          maxzoom: 16, // Overzooms labels cleanly
          attribution: '&copy; Esri',
        },
      },
      layers: [
        {
          id: 'esri-dark-base-layer',
          type: 'raster',
          source: 'esri-dark-base',
          minzoom: 0,
          maxzoom: 24, // Allows smooth rendering up to 24x
        },
        {
          id: 'esri-dark-ref-layer',
          type: 'raster',
          source: 'esri-dark-ref',
          minzoom: 0,
          maxzoom: 24,
        },
      ],
    },
  },
  satellite: {
    name: 'Satellite Hybrid',
    icon: Globe,
    style: {
      version: 8,
      sources: {
        satellite: {
          type: 'raster',
          tiles: [
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          ],
          tileSize: 256,
          maxzoom: 18,
          attribution: '&copy; Esri, Maxar, Earthstar Geographics',
        },
        'satellite-labels': {
          type: 'raster',
          tiles: [
            'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
          ],
          tileSize: 256,
          maxzoom: 18,
          attribution: '&copy; Esri',
        },
      },
      layers: [
        {
          id: 'satellite-layer',
          type: 'raster',
          source: 'satellite',
          minzoom: 0,
          maxzoom: 24,
        },
        {
          id: 'satellite-labels-layer',
          type: 'raster',
          source: 'satellite-labels',
          minzoom: 0,
          maxzoom: 24,
        },
      ],
    },
  },
  streets: {
    name: 'OSM Navigation',
    icon: Navigation,
    style: {
      version: 8,
      sources: {
        'osm-streets': {
          type: 'raster',
          tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
          tileSize: 256,
          maxzoom: 19,
          attribution: '&copy; OpenStreetMap contributors',
        },
      },
      layers: [
        {
          id: 'osm-streets-layer',
          type: 'raster',
          source: 'osm-streets',
          minzoom: 0,
          maxzoom: 24,
        },
      ],
    },
  },
  light: {
    name: 'Positron Light',
    icon: Sun,
    style: {
      version: 8,
      sources: {
        'esri-light-base': {
          type: 'raster',
          tiles: [
            'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
          ],
          tileSize: 256,
          maxzoom: 16,
          attribution: '&copy; Esri, DeLorme, NAVTEQ',
        },
        'esri-light-ref': {
          type: 'raster',
          tiles: [
            'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
          ],
          tileSize: 256,
          maxzoom: 16,
          attribution: '&copy; Esri',
        },
      },
      layers: [
        {
          id: 'esri-light-base-layer',
          type: 'raster',
          source: 'esri-light-base',
          minzoom: 0,
          maxzoom: 24,
        },
        {
          id: 'esri-light-ref-layer',
          type: 'raster',
          source: 'esri-light-ref',
          minzoom: 0,
          maxzoom: 24,
        },
      ],
    },
  },
};

type StyleKey = keyof typeof MAP_STYLES;
type ToolMode = 'navigate' | 'pin' | 'polygon';

interface MapViewProps {
  activeCity?: City;
  sites: CandidateSite[];
  selectedSite: CandidateSite | null;
  onSelectSite: (site: CandidateSite) => void;
  competitors?: CompetitorPoint[];
  h3Cells?: H3CellData[];
  layers: MapLayerConfig[];
  onToggleLayer?: (layerId: string) => void;
  onChangeOpacity?: (layerId: string, opacity: number) => void;
  showIsochrones?: boolean;
  isochroneMode?: 'drive' | 'walk';
  spatialAlgorithm?: SpatialAlgorithm;
  onSelectHexCell?: (cell: H3CellData) => void;
  onAddNewSite?: (site: CandidateSite) => void;
  className?: string;
}

// Generate regular pointy-topped hexagon coordinates for H3 visual representation
const createHexagonPolygon = (lat: number, lng: number, radiusKm: number = 0.55): [number, number][] => {
  const coords: [number, number][] = [];
  const latRadius = radiusKm / 111.32;
  const lngRadius = radiusKm / (111.32 * Math.cos((lat * Math.PI) / 180));

  for (let i = 0; i < 6; i++) {
    // Pointy-topped vertices: 30°, 90°, 150°, 210°, 270°, 330°
    const angle = (Math.PI / 3) * i + Math.PI / 6;
    const x = lng + lngRadius * Math.cos(angle);
    const y = lat + latRadius * Math.sin(angle);
    coords.push([x, y]);
  }
  coords.push(coords[0]);
  return coords;
};

// Generate smooth catchment isochrone polygon around a center point
const createIsochronePolygon = (
  centerLat: number,
  centerLng: number,
  minutes: number,
  mode: 'drive' | 'walk' = 'drive',
  offsets?: [number, number][]
): [number, number][] => {
  if (offsets && offsets.length > 0) {
    const coords = offsets.map(([dLat, dLng]) => [centerLng + dLng, centerLat + dLat] as [number, number]);
    coords.push(coords[0]);
    return coords;
  }

  const speedKmH = mode === 'drive' ? (minutes === 10 ? 30 : minutes === 20 ? 40 : 50) : 4.5;
  const radiusKm = (speedKmH * (minutes / 60)) * 0.75;
  const numPoints = 32;
  const coords: [number, number][] = [];

  const latRadius = radiusKm / 111.32;
  const lngRadius = radiusKm / (111.32 * Math.cos((centerLat * Math.PI) / 180));

  for (let i = 0; i < numPoints; i++) {
    const angle = (2 * Math.PI * i) / numPoints;
    const noise = 1 + 0.12 * Math.sin(angle * 3) + 0.08 * Math.cos(angle * 5);
    const x = centerLng + lngRadius * noise * Math.cos(angle);
    const y = centerLat + latRadius * noise * Math.sin(angle);
    coords.push([x, y]);
  }
  coords.push(coords[0]);
  return coords;
};

// Generate circular buffer polygon
const createCirclePolygon = (centerLat: number, centerLng: number, radiusKm: number, numPoints: number = 48): [number, number][] => {
  const coords: [number, number][] = [];
  const latRadius = radiusKm / 111.32;
  const lngRadius = radiusKm / (111.32 * Math.cos((centerLat * Math.PI) / 180));
  for (let i = 0; i < numPoints; i++) {
    const angle = (2 * Math.PI * i) / numPoints;
    const x = centerLng + lngRadius * Math.cos(angle);
    const y = centerLat + latRadius * Math.sin(angle);
    coords.push([x, y]);
  }
  coords.push(coords[0]);
  return coords;
};

// Calculate geodesic polygon area in sq km
const calculatePolygonAreaKm2 = (coords: [number, number][]): number => {
  if (coords.length < 3) return 0;
  let area = 0;
  for (let i = 0; i < coords.length - 1; i++) {
    const [x1, y1] = coords[i];
    const [x2, y2] = coords[i + 1];
    area += ((x2 - x1) * 111.32 * Math.cos(((y1 + y2) / 2 * Math.PI) / 180)) * ((y2 - y1) * 111.32);
  }
  return Math.abs(Number(area.toFixed(2)));
};

export type SpatialAlgorithm = 'h3' | 'gi_star' | 'dbscan';

export const MapView: React.FC<MapViewProps> = ({
  sites,
  selectedSite,
  onSelectSite,
  competitors = [],
  h3Cells = [],
  layers,
  onToggleLayer = () => {},
  onChangeOpacity = () => {},
  showIsochrones = true,
  isochroneMode = 'drive',
  spatialAlgorithm: propSpatialAlgorithm,
  onSelectHexCell,
  onAddNewSite,
  className = 'h-[540px]',
  activeCity,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const tempMarkerRef = useRef<Marker | null>(null);
  const popupRef = useRef<Popup | null>(null);

  const [currentStyle, setCurrentStyle] = useState<StyleKey>('dark');
  const [showStyleMenu, setShowStyleMenu] = useState(false);
  const [showLayerPanel, setShowLayerPanel] = useState(false);
  const [activeLayerId, setActiveLayerId] = useState<string>('pop_density');
  const [cursorCoords, setCursorCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(12);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Advanced GIS Controls State
  const [activeIsoMode, setActiveIsoMode] = useState<'drive' | 'walk'>(isochroneMode);
  const [spatialAlgorithm, setSpatialAlgorithm] = useState<SpatialAlgorithm>(propSpatialAlgorithm || 'h3');

  // Sync propSpatialAlgorithm changes
  useEffect(() => {
    if (propSpatialAlgorithm) {
      setSpatialAlgorithm(propSpatialAlgorithm);
    }
  }, [propSpatialAlgorithm]);
  const [showRadialBuffers, setShowRadialBuffers] = useState(false);
  const [inspectedCandidateSite, setInspectedCandidateSite] = useState<CandidateSite | null>(null);

  // Drawing Tools State
  const [toolMode, setToolMode] = useState<ToolMode>('navigate');
  const [polygonPoints, setPolygonPoints] = useState<[number, number][]>([]);
  const [polygonAnalysis, setPolygonAnalysis] = useState<{
    areaKm2: number;
    estimatedPop: number;
    competitorCount: number;
    readinessScore: number;
  } | null>(null);

  // Inspected Point State
  const [inspectedSite, setInspectedSite] = useState<CandidateSite | null>(null);
  const [isEvaluatingPoint, setIsEvaluatingPoint] = useState(false);
  const [selectedHexZone, setSelectedHexZone] = useState<H3CellData | null>(null);

  // Business Archetype for Competitors Across Entire Map
  const [selectedArchetype, setSelectedArchetype] = useState<BusinessType>(
    selectedSite?.businessType || 'Retail Store'
  );

  // Sync selectedArchetype & activeCandidate when selected candidate site changes
  useEffect(() => {
    if (selectedSite?.businessType) {
      setSelectedArchetype(selectedSite.businessType);
      setInspectedCandidateSite(selectedSite);
    }
  }, [selectedSite]);

  // Compute active focus coordinates
  const defaultCenter = useMemo<[number, number]>(() => {
    if (selectedSite) return [selectedSite.lng, selectedSite.lat];
    if (activeCity) return [activeCity.lng, activeCity.lat];
    if (sites.length > 0) return [sites[0].lng, sites[0].lat];
    return [72.8311, 21.1702];
  }, [selectedSite, activeCity, sites]);

  // Generate real-world commercial competitors across the whole map for the selected archetype
  const activeCompetitors = useMemo<CompetitorPoint[]>(() => {
    const centerLat = selectedSite ? selectedSite.lat : (sites[0]?.lat ?? defaultCenter[1]);
    const centerLng = selectedSite ? selectedSite.lng : (sites[0]?.lng ?? defaultCenter[0]);
    return generateRealWorldCompetitors(centerLat, centerLng, selectedArchetype);
  }, [selectedSite, sites, defaultCenter, selectedArchetype]);

  // Merge dynamic H3 grid if array is empty
  const activeH3Cells = useMemo<H3CellData[]>(() => {
    if (h3Cells.length > 0) return h3Cells;
    const center = selectedSite || (sites.length > 0 ? sites[0] : { lat: defaultCenter[1], lng: defaultCenter[0] });
    return generateH3GridAround(center.lat, center.lng);
  }, [h3Cells, selectedSite, sites, defaultCenter]);

  // 1. Initialize MapLibre Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new MapLibreMap({
      container: mapContainerRef.current,
      style: MAP_STYLES[currentStyle].style as any,
      center: defaultCenter,
      zoom: 12.2,
      minZoom: 1,
      maxZoom: 20, // Full 20x zoom capability
      attributionControl: false,
    });

    mapRef.current = map;

    map.on('mousemove', (e) => {
      setCursorCoords({ lat: e.lngLat.lat, lng: e.lngLat.lng });
    });

    map.on('zoom', () => {
      setZoomLevel(map.getZoom());
    });

    map.on('load', () => {
      updateMapLayers(map);
    });

    map.on('styledata', () => {
      if (map.isStyleLoaded()) {
        updateMapLayers(map);
      }
    });

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      competitorMarkersRef.current.forEach((m) => m.remove());
      competitorMarkersRef.current = [];
      if (tempMarkerRef.current) tempMarkerRef.current.remove();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // 2. Handle map clicks for Pin Drop and Polygon Drawing
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const handleMapClick = async (e: maplibregl.MapMouseEvent) => {
      const { lng, lat } = e.lngLat;

      if (toolMode === 'pin') {
        // Drop pin & evaluate instant readiness
        setIsEvaluatingPoint(true);
        if (tempMarkerRef.current) tempMarkerRef.current.remove();

        const el = document.createElement('div');
        el.className = 'w-5 h-5 rounded-full bg-indigo-600 border-2 border-white ring-4 ring-indigo-500/40 animate-pulse';
        tempMarkerRef.current = new Marker({ element: el }).setLngLat([lng, lat]).addTo(map);

        const analyzed = await analyzeSite({
          lat,
          lng,
          businessType: selectedSite?.businessType || 'Retail Store',
        });

        setInspectedSite(analyzed);
        setIsEvaluatingPoint(false);
      } else if (toolMode === 'polygon') {
        // Add vertex to polygon
        setPolygonPoints((prev) => {
          const next = [...prev, [lng, lat] as [number, number]];
          if (next.length >= 3) {
            const area = calculatePolygonAreaKm2(next);
            setPolygonAnalysis({
              areaKm2: area,
              estimatedPop: Math.round(area * 4200),
              competitorCount: Math.round(area * 1.4),
              readinessScore: Math.min(94, Math.max(68, Math.round(75 + Math.sin(lat * 10) * 15))),
            });
          }
          return next;
        });
      }
    };

    map.on('click', handleMapClick);
    return () => {
      map.off('click', handleMapClick);
    };
  }, [toolMode, selectedSite]);

  // 3. Sync Drawing Polygon GeoJSON on Map
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    const polygonCoords = polygonPoints.length >= 3 ? [...polygonPoints, polygonPoints[0]] : [];
    const polygonGeoJson: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features:
        polygonCoords.length >= 3
          ? [
              {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'Polygon',
                  coordinates: [polygonCoords],
                },
              },
            ]
          : [],
    };

    if (map.getSource('drawn-polygon-source')) {
      (map.getSource('drawn-polygon-source') as any).setData(polygonGeoJson);
    } else if (polygonCoords.length >= 3) {
      map.addSource('drawn-polygon-source', { type: 'geojson', data: polygonGeoJson });
      map.addLayer({
        id: 'drawn-polygon-fill',
        type: 'fill',
        source: 'drawn-polygon-source',
        paint: { 'fill-color': '#6366f1', 'fill-opacity': 0.3 },
      });
      map.addLayer({
        id: 'drawn-polygon-stroke',
        type: 'line',
        source: 'drawn-polygon-source',
        paint: { 'line-color': '#818cf8', 'line-width': 2.5, 'line-dasharray': [3, 1] },
      });
    }
  }, [polygonPoints]);

  // 4. Fly to active city or selected site
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (selectedSite) {
      map.flyTo({
        center: [selectedSite.lng, selectedSite.lat],
        zoom: 13.8,
        speed: 1.2,
        curve: 1.4,
        essential: true,
      });
    } else if (activeCity) {
      map.flyTo({
        center: [activeCity.lng, activeCity.lat],
        zoom: 12.2,
        speed: 1.0,
        essential: true,
      });
    }
  }, [selectedSite, activeCity]);

  // 5. Helper to build and sync MapLibre GeoJSON layers
  const updateMapLayers = useCallback((map: MapLibreMap) => {
    if (!map.isStyleLoaded()) return;

    const centerLat = selectedSite ? selectedSite.lat : (sites[0]?.lat ?? defaultCenter[1]);
    const centerLng = selectedSite ? selectedSite.lng : (sites[0]?.lng ?? defaultCenter[0]);
    const targetSite = selectedSite || (sites.length > 0 ? sites[0] : null);

    // --- A. LAND USE & ZONING LAYER ---
    const landUseActive = layers.find((l) => l.id === 'land_use')?.active ?? true;
    const landUseOpacity = layers.find((l) => l.id === 'land_use')?.opacity ?? 0.50;
    const landUseGeoJson = generateLandUseZoning(centerLat, centerLng);

    if (map.getSource('land-use-source')) {
      (map.getSource('land-use-source') as any).setData(landUseGeoJson);
    } else {
      map.addSource('land-use-source', {
        type: 'geojson',
        data: landUseGeoJson,
      });

      map.addLayer({
        id: 'land-use-fill',
        type: 'fill',
        source: 'land-use-source',
        paint: {
          'fill-color': ['get', 'color'],
          'fill-opacity': landUseOpacity,
        },
      });

      map.addLayer({
        id: 'land-use-line',
        type: 'line',
        source: 'land-use-source',
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 1.5,
          'line-opacity': 0.8,
        },
      });

      map.on('mouseenter', 'land-use-fill', (e) => {
        if (!e.features || e.features.length === 0) return;
        map.getCanvas().style.cursor = 'pointer';
        const props = e.features[0].properties;
        if (!popupRef.current) popupRef.current = new Popup({ closeButton: false, closeOnClick: false });
        popupRef.current.setLngLat(e.lngLat).setHTML(`
          <div style="background:#090d1f; color:#f8fafc; padding:10px 12px; border-radius:12px; border:1px solid ${props.color}; font-size:11px; box-shadow:0 10px 25px rgba(0,0,0,0.7); max-width:220px;">
            <div style="font-weight:bold; color:${props.color}; font-size:12px;">🏗️ ${props.name}</div>
            <div style="color:#94a3b8; font-size:10px; margin-top:2px;"><b>${props.code}</b></div>
            <div style="color:#cbd5e1; font-size:10px; margin-top:4px; line-height:1.4;">${props.desc}</div>
          </div>
        `).addTo(map);
      });

      map.on('mouseleave', 'land-use-fill', () => {
        map.getCanvas().style.cursor = '';
        if (popupRef.current) popupRef.current.remove();
      });
    }

    if (map.getLayer('land-use-fill')) {
      map.setPaintProperty('land-use-fill', 'fill-opacity', landUseOpacity);
      map.setLayoutProperty('land-use-fill', 'visibility', landUseActive ? 'visible' : 'none');
      map.setLayoutProperty('land-use-line', 'visibility', landUseActive ? 'visible' : 'none');
    }

    // --- B. ENVIRONMENTAL RISK ZONES LAYER ---
    const riskActive = layers.find((l) => l.id === 'risk_zones')?.active ?? true;
    const riskOpacity = layers.find((l) => l.id === 'risk_zones')?.opacity ?? 0.55;
    const riskGeoJson = generateRiskZones(centerLat, centerLng);

    if (map.getSource('risk-zones-source')) {
      (map.getSource('risk-zones-source') as any).setData(riskGeoJson);
    } else {
      map.addSource('risk-zones-source', {
        type: 'geojson',
        data: riskGeoJson,
      });

      map.addLayer({
        id: 'risk-zones-fill',
        type: 'fill',
        source: 'risk-zones-source',
        paint: {
          'fill-color': ['get', 'color'],
          'fill-opacity': riskOpacity,
        },
      });

      map.addLayer({
        id: 'risk-zones-line',
        type: 'line',
        source: 'risk-zones-source',
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 2.0,
          'line-dasharray': [3, 2],
          'line-opacity': 0.9,
        },
      });

      map.on('mouseenter', 'risk-zones-fill', (e) => {
        if (!e.features || e.features.length === 0) return;
        map.getCanvas().style.cursor = 'pointer';
        const props = e.features[0].properties;
        if (!popupRef.current) popupRef.current = new Popup({ closeButton: false, closeOnClick: false });
        popupRef.current.setLngLat(e.lngLat).setHTML(`
          <div style="background:#090d1f; color:#f8fafc; padding:10px 12px; border-radius:12px; border:1px solid #ef4444; font-size:11px; box-shadow:0 10px 25px rgba(0,0,0,0.7); max-width:230px;">
            <div style="font-weight:bold; color:#f87171; font-size:12px;">⚠️ Hazard: ${props.name}</div>
            <div style="color:#fca5a5; font-size:10px; margin-top:2px;"><b>${props.severity}</b></div>
            <div style="color:#cbd5e1; font-size:10px; margin-top:4px; line-height:1.4;">${props.desc}</div>
          </div>
        `).addTo(map);
      });

      map.on('mouseleave', 'risk-zones-fill', () => {
        map.getCanvas().style.cursor = '';
        if (popupRef.current) popupRef.current.remove();
      });
    }

    if (map.getLayer('risk-zones-fill')) {
      map.setPaintProperty('risk-zones-fill', 'fill-opacity', riskOpacity);
      map.setLayoutProperty('risk-zones-fill', 'visibility', riskActive ? 'visible' : 'none');
      map.setLayoutProperty('risk-zones-line', 'visibility', riskActive ? 'visible' : 'none');
    }

    // --- C. SPATIAL ALGORITHMS: H3 HEXAGONS, GETIS-ORD GI*, DBSCAN, POP DENSITY ---
    const h3Active = layers.find((l) => l.id === 'opportunity_heatmap' || l.id === 'h3_hotspots' || l.id === 'h3_grid' || l.id === 'pop_density' || l.id === 'hotspots')?.active ?? true;
    const baseH3Opacity = layers.find((l) => l.id === 'opportunity_heatmap' || l.id === 'h3_hotspots' || l.id === 'h3_grid' || l.id === 'pop_density' || l.id === 'hotspots')?.opacity ?? 0.65;

    const h3Features = activeH3Cells.map((cell) => {
      let fillColor = '#6366f1';
      let statLabel = 'H3 Hex Readiness';
      let statValue = `${cell.readinessScore}/100`;
      let tagText = 'High Potential';
      let tagColor = '#10b981';

      if (spatialAlgorithm === 'h3') {
        // Felt-Style Continuous Hexagonal Tessellation (Image 2 reference)
        if (cell.readinessScore >= 90) {
          fillColor = '#4338ca'; // Deep Indigo (Highest Readiness)
          tagText = 'Tier-1 Prime Hex';
          tagColor = '#818cf8';
        } else if (cell.readinessScore >= 80) {
          fillColor = '#7c3aed'; // Purple Orchid
          tagText = 'Tier-2 High Hex';
          tagColor = '#a78bfa';
        } else if (cell.readinessScore >= 70) {
          fillColor = '#e11d48'; // Rose / Crimson
          tagText = 'Tier-3 Growth Hex';
          tagColor = '#fb7185';
        } else if (cell.readinessScore >= 60) {
          fillColor = '#f59e0b'; // Warm Amber
          tagText = 'Tier-4 Moderate Hex';
          tagColor = '#fcd34d';
        } else {
          fillColor = '#fde047'; // Canvas Pale Yellow
          tagText = 'Tier-5 Fringe Hex';
          tagColor = '#fef08a';
        }
        statLabel = 'H3 Readiness Index';
        statValue = `${cell.readinessScore}/100`;
      } else if (spatialAlgorithm === 'gi_star') {
        // Getis-Ord Gi* 7-Bin Cartography (Image 1 reference)
        const bin = cell.giBin ?? (cell.zScore && cell.zScore >= 2.58 ? 3 : cell.zScore && cell.zScore >= 1.96 ? 2 : cell.zScore && cell.zScore >= 1.65 ? 1 : cell.zScore && cell.zScore <= -2.58 ? -3 : cell.zScore && cell.zScore <= -1.96 ? -2 : cell.zScore && cell.zScore <= -1.65 ? -1 : 0);
        const z = cell.zScore ?? Number(((cell.readinessScore - 68.5) / 7.2).toFixed(2));
        
        if (bin === 3) {
          fillColor = '#b91c1c'; // Dark Red (Hot Spot 99% Conf)
          statLabel = 'Hot Spot (99% Conf)';
          tagText = 'Critical Commercial Clustered Node';
          tagColor = '#f87171';
        } else if (bin === 2) {
          fillColor = '#ea580c'; // Orange-Red (Hot Spot 95% Conf)
          statLabel = 'Hot Spot (95% Conf)';
          tagText = 'Significant High Cluster';
          tagColor = '#fb923c';
        } else if (bin === 1) {
          fillColor = '#f59e0b'; // Warm Amber (Hot Spot 90% Conf)
          statLabel = 'Hot Spot (90% Conf)';
          tagText = 'Emerging Spatial Cluster';
          tagColor = '#fbbf24';
        } else if (bin === -1) {
          fillColor = '#38bdf8'; // Cyan (Cold Spot 90% Conf)
          statLabel = 'Cold Spot (90% Conf)';
          tagText = 'Low Activity Zone';
          tagColor = '#7dd3fc';
        } else if (bin === -2) {
          fillColor = '#0284c7'; // Sky Blue (Cold Spot 95% Conf)
          statLabel = 'Cold Spot (95% Conf)';
          tagText = 'Significant Low Cluster';
          tagColor = '#38bdf8';
        } else if (bin === -3) {
          fillColor = '#1e3a8a'; // Deep Navy Blue (Cold Spot 99% Conf)
          statLabel = 'Cold Spot (99% Conf)';
          tagText = 'Spatial Void / Dead Zone';
          tagColor = '#60a5fa';
        } else {
          fillColor = '#fef08a'; // Cream / Pale Yellow (Not Significant)
          statLabel = 'Not Significant';
          tagText = 'Random Distribution (p > 0.10)';
          tagColor = '#cbd5e1';
        }
        statValue = `z = ${z > 0 ? '+' : ''}${z}`;
      } else if (spatialAlgorithm === 'dbscan') {
        // DBSCAN Density Clustering & Agglomerations (Image 3 reference)
        const cluster = cell.clusterId || 1;
        const density = cell.dbscanDensity || Math.round(cell.population / 0.78);

        if (cluster === 1) {
          fillColor = '#dc2626'; // Red (>10,000 pts/sq km)
          statLabel = 'DBSCAN: Core Commercial Hub';
          tagText = 'Ultra-Dense Core (>10k pts/km²)';
          tagColor = '#f87171';
        } else if (cluster === 2) {
          fillColor = '#ea580c'; // Dark Orange (5,001 - 10,000)
          statLabel = 'DBSCAN: Tech & Commercial Corridor';
          tagText = 'High Density (5k - 10k pts/km²)';
          tagColor = '#fb923c';
        } else if (cluster === 3) {
          fillColor = '#f59e0b'; // Amber Orange (1,001 - 5,000)
          statLabel = 'DBSCAN: Logistics Belt';
          tagText = 'Moderate Density (1k - 5k pts/km²)';
          tagColor = '#fbbf24';
        } else if (cluster === 4) {
          fillColor = '#eab308'; // Gold Yellow (101 - 1,000)
          statLabel = 'DBSCAN: Suburban Growth Node';
          tagText = 'Low Density (100 - 1k pts/km²)';
          tagColor = '#fde047';
        } else {
          fillColor = '#64748b'; // Muted Gray (<100 / Noise)
          statLabel = 'DBSCAN: Noise / Outlier';
          tagText = 'Spatial Noise (<100 pts/km²)';
          tagColor = '#94a3b8';
        }
        statValue = `${density.toLocaleString()} pts/km²`;
      }

      return {
        type: 'Feature' as const,
        properties: {
          id: cell.id,
          h3Index: cell.h3Index,
          score: cell.readinessScore,
          population: cell.population,
          competitors: cell.competitors,
          accessibility: cell.accessibility,
          fillColor,
          statLabel,
          statValue,
          tagText,
          tagColor,
          algorithm: spatialAlgorithm,
          zScore: cell.zScore,
          pValue: cell.pValue,
          dbscanDensity: cell.dbscanDensity,
          dbscanClusterName: cell.dbscanClusterName,
        },
        geometry: {
          type: 'Polygon' as const,
          coordinates: [createHexagonPolygon(cell.lat, cell.lng, 0.55)],
        },
      };
    });

    const h3GeoJson: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: h3Features,
    };

    if (map.getSource('h3-cells-source')) {
      (map.getSource('h3-cells-source') as any).setData(h3GeoJson);
    } else {
      map.addSource('h3-cells-source', {
        type: 'geojson',
        data: h3GeoJson,
      });

      map.addLayer({
        id: 'h3-cells-fill',
        type: 'fill',
        source: 'h3-cells-source',
        paint: {
          'fill-color': ['get', 'fillColor'],
          'fill-opacity': baseH3Opacity,
        },
      });

      map.addLayer({
        id: 'h3-cells-line',
        type: 'line',
        source: 'h3-cells-source',
        paint: {
          'line-color': '#ffffff',
          'line-width': 1,
          'line-opacity': 0.30,
        },
      });

      // Hover tooltip on H3 Cells
      map.on('mousemove', 'h3-cells-fill', (e) => {
        if (!e.features || e.features.length === 0) return;
        map.getCanvas().style.cursor = 'pointer';
        const feat = e.features[0];
        const props = feat.properties;

        if (!popupRef.current) {
          popupRef.current = new Popup({ closeButton: false, closeOnClick: false });
        }

        popupRef.current
          .setLngLat(e.lngLat)
          .setHTML(`
            <div style="background:#090d1f; color:#f8fafc; padding:12px 14px; border-radius:14px; border:1px solid ${props.tagColor}88; font-family:sans-serif; font-size:11px; box-shadow:0 15px 35px rgba(0,0,0,0.85); min-width:220px;">
              <div style="font-weight:900; color:#ffffff; font-size:12px; margin-bottom:4px; display:flex; justify-content:space-between; align-items:center; gap:8px;">
                <span>${props.statLabel}</span>
                <span style="color:${props.tagColor}; font-family:monospace; font-weight:900; background:rgba(255,255,255,0.06); padding:2px 6px; border-radius:6px;">${props.statValue}</span>
              </div>
              <div style="color:${props.tagColor}; font-size:10px; font-weight:700; margin-bottom:6px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:4px;">
                ${props.tagText} • <span style="color:#94a3b8; font-family:monospace;">${props.h3Index}</span>
              </div>
              <div style="color:#cbd5e1; font-size:10px; line-height:1.5;">
                👥 Population: <b style="color:#ffffff;">${props.population?.toLocaleString()}</b><br/>
                🏢 Competitors: <b style="color:#ffffff;">${props.competitors} sites</b><br/>
                ⚡ Road Access: <b style="color:#ffffff;">${props.accessibility}%</b>
              </div>
            </div>
          `)
          .addTo(map);
      });

      map.on('mouseleave', 'h3-cells-fill', () => {
        map.getCanvas().style.cursor = '';
        if (popupRef.current) popupRef.current.remove();
      });

      map.on('click', 'h3-cells-fill', (e) => {
        if (!e.features || e.features.length === 0) return;
        const cell = activeH3Cells.find((c) => c.id === e.features![0].properties.id);
        if (cell) {
          setSelectedHexZone(cell);
          if (onSelectHexCell) onSelectHexCell(cell);
        }
      });
    }

    if (map.getLayer('h3-cells-fill')) {
      map.setPaintProperty('h3-cells-fill', 'fill-color', ['get', 'fillColor']);
      map.setPaintProperty('h3-cells-fill', 'fill-opacity', baseH3Opacity);
      map.setLayoutProperty('h3-cells-fill', 'visibility', h3Active ? 'visible' : 'none');
      map.setLayoutProperty('h3-cells-line', 'visibility', h3Active ? 'visible' : 'none');
    }

    // --- D. ROAD ACCESSIBILITY & TRANSIT NETWORK LAYER ---
    const roadsActive = layers.find((l) => l.id === 'road_access')?.active ?? true;
    const roadsOpacity = layers.find((l) => l.id === 'road_access')?.opacity ?? 0.85;
    const roadsGeoJson = generateRoadNetwork(centerLat, centerLng);

    if (map.getSource('roads-source')) {
      (map.getSource('roads-source') as any).setData(roadsGeoJson);
    } else {
      map.addSource('roads-source', {
        type: 'geojson',
        data: roadsGeoJson,
      });

      map.addLayer({
        id: 'roads-casing',
        type: 'line',
        source: 'roads-source',
        paint: {
          'line-color': '#000000',
          'line-width': ['+', ['get', 'width'], 2],
          'line-opacity': 0.6,
        },
      });

      map.addLayer({
        id: 'roads-line',
        type: 'line',
        source: 'roads-source',
        paint: {
          'line-color': ['get', 'color'],
          'line-width': ['get', 'width'],
          'line-opacity': roadsOpacity,
        },
      });

      map.on('mouseenter', 'roads-line', (e) => {
        if (!e.features || e.features.length === 0) return;
        map.getCanvas().style.cursor = 'pointer';
        const props = e.features[0].properties;
        if (!popupRef.current) popupRef.current = new Popup({ closeButton: false, closeOnClick: false });
        popupRef.current.setLngLat(e.lngLat).setHTML(`
          <div style="background:#090d1f; color:#f8fafc; padding:8px 12px; border-radius:10px; border:1px solid #38bdf8; font-size:11px; box-shadow:0 10px 25px rgba(0,0,0,0.7);">
            <div style="font-weight:bold; color:#38bdf8;">🛣️ ${props.name}</div>
            <div style="color:#94a3b8; font-size:10px; margin-top:2px;">Classification: <b>${props.type}</b> • Speed: <b>${props.speedLimitKmh} km/h</b> • ${props.lanes} Lanes</div>
          </div>
        `).addTo(map);
      });

      map.on('mouseleave', 'roads-line', () => {
        map.getCanvas().style.cursor = '';
        if (popupRef.current) popupRef.current.remove();
      });
    }

    if (map.getLayer('roads-line')) {
      map.setPaintProperty('roads-line', 'line-opacity', roadsOpacity);
      map.setLayoutProperty('roads-line', 'visibility', roadsActive ? 'visible' : 'none');
      map.setLayoutProperty('roads-casing', 'visibility', roadsActive ? 'visible' : 'none');
    }

    // --- E. ISOCHRONES LAYER ---
    const isochronesActive = showIsochrones && (layers.find((l) => l.id === 'isochrones')?.active ?? true);
    const isochronesOpacity = layers.find((l) => l.id === 'isochrones')?.opacity ?? 0.45;

    const isochroneFeatures = targetSite && isochronesActive
      ? [
          {
            type: 'Feature' as const,
            properties: { minutes: 30, color: '#818cf8', label: `30 min Catchment (${activeIsoMode.toUpperCase()})`, population: activeIsoMode === 'drive' ? '820,000' : '110,000' },
            geometry: {
              type: 'Polygon' as const,
              coordinates: [createIsochronePolygon(targetSite.lat, targetSite.lng, 30, activeIsoMode, ISOCHRONE_DATA[activeIsoMode]?.[2]?.pathOffsets)],
            },
          },
          {
            type: 'Feature' as const,
            properties: { minutes: 20, color: '#38bdf8', label: `20 min Catchment (${activeIsoMode.toUpperCase()})`, population: activeIsoMode === 'drive' ? '385,000' : '52,000' },
            geometry: {
              type: 'Polygon' as const,
              coordinates: [createIsochronePolygon(targetSite.lat, targetSite.lng, 20, activeIsoMode, ISOCHRONE_DATA[activeIsoMode]?.[1]?.pathOffsets)],
            },
          },
          {
            type: 'Feature' as const,
            properties: { minutes: 10, color: '#34d399', label: `10 min Catchment (${activeIsoMode.toUpperCase()})`, population: activeIsoMode === 'drive' ? '142,000' : '18,500' },
            geometry: {
              type: 'Polygon' as const,
              coordinates: [createIsochronePolygon(targetSite.lat, targetSite.lng, 10, activeIsoMode, ISOCHRONE_DATA[activeIsoMode]?.[0]?.pathOffsets)],
            },
          },
        ]
      : [];

    const isochronesGeoJson: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: isochroneFeatures,
    };

    if (map.getSource('isochrones-source')) {
      (map.getSource('isochrones-source') as any).setData(isochronesGeoJson);
    } else {
      map.addSource('isochrones-source', {
        type: 'geojson',
        data: isochronesGeoJson,
      });

      map.addLayer({
        id: 'isochrones-fill',
        type: 'fill',
        source: 'isochrones-source',
        paint: {
          'fill-color': ['get', 'color'],
          'fill-opacity': isochronesOpacity,
        },
      });

      map.addLayer({
        id: 'isochrones-stroke',
        type: 'line',
        source: 'isochrones-source',
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 2,
          'line-opacity': 0.9,
          'line-dasharray': [2, 1],
        },
      });
    }

    if (map.getLayer('isochrones-fill')) {
      map.setPaintProperty('isochrones-fill', 'fill-opacity', isochronesOpacity);
      map.setLayoutProperty('isochrones-fill', 'visibility', isochronesActive ? 'visible' : 'none');
      map.setLayoutProperty('isochrones-stroke', 'visibility', isochronesActive ? 'visible' : 'none');
    }

    // --- F. RADIAL DISTANCE BUFFER RINGS (1km, 3km, 5km) ---
    const bufferFeatures = targetSite && showRadialBuffers
      ? [
          {
            type: 'Feature' as const,
            properties: { radius: 5, color: '#6366f1', label: '5 km Trade Area' },
            geometry: {
              type: 'Polygon' as const,
              coordinates: [createCirclePolygon(targetSite.lat, targetSite.lng, 5)],
            },
          },
          {
            type: 'Feature' as const,
            properties: { radius: 3, color: '#f59e0b', label: '3 km Catchment Zone' },
            geometry: {
              type: 'Polygon' as const,
              coordinates: [createCirclePolygon(targetSite.lat, targetSite.lng, 3)],
            },
          },
          {
            type: 'Feature' as const,
            properties: { radius: 1, color: '#f43f5e', label: '1 km Core Pressure Ring' },
            geometry: {
              type: 'Polygon' as const,
              coordinates: [createCirclePolygon(targetSite.lat, targetSite.lng, 1)],
            },
          },
        ]
      : [];

    const buffersGeoJson: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: bufferFeatures,
    };

    if (map.getSource('radial-buffers-source')) {
      (map.getSource('radial-buffers-source') as any).setData(buffersGeoJson);
    } else {
      map.addSource('radial-buffers-source', {
        type: 'geojson',
        data: buffersGeoJson,
      });

      map.addLayer({
        id: 'radial-buffers-fill',
        type: 'fill',
        source: 'radial-buffers-source',
        paint: {
          'fill-color': ['get', 'color'],
          'fill-opacity': 0.12,
        },
      });

      map.addLayer({
        id: 'radial-buffers-stroke',
        type: 'line',
        source: 'radial-buffers-source',
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 1.8,
          'line-dasharray': [4, 2],
          'line-opacity': 0.85,
        },
      });
    }

    if (map.getLayer('radial-buffers-fill')) {
      map.setLayoutProperty('radial-buffers-fill', 'visibility', showRadialBuffers ? 'visible' : 'none');
      map.setLayoutProperty('radial-buffers-stroke', 'visibility', showRadialBuffers ? 'visible' : 'none');
    }
  }, [
    selectedSite,
    sites,
    showIsochrones,
    activeIsoMode,
    spatialAlgorithm,
    showRadialBuffers,
    layers,
    activeH3Cells,
    activeCompetitors,
    onSelectHexCell,
    defaultCenter,
  ]);

  // 6. Update GeoJSON layers on state changes and listen to style changes
  useEffect(() => {
    const map = mapRef.current;
    if (map && map.isStyleLoaded()) {
      updateMapLayers(map);
    }
  }, [updateMapLayers]);

  const competitorMarkersRef = useRef<Marker[]>([]);

  // 7. Render Candidate Sites HTML Markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const sitesActive = layers.find((l) => l.id === 'candidate_sites')?.active ?? true;
    if (!sitesActive) return;

    sites.forEach((site) => {
      const isSelected = selectedSite?.id === site.id;

      const badgeBg =
        site.readinessScore >= 80
          ? 'bg-emerald-500'
          : site.readinessScore >= 65
          ? 'bg-amber-500'
          : 'bg-rose-500';

      const ringColor =
        site.readinessScore >= 80
          ? 'border-emerald-400'
          : site.readinessScore >= 65
          ? 'border-amber-400'
          : 'border-rose-400';

      const el = document.createElement('div');
      el.className = 'candidate-site-marker group cursor-pointer relative';
      el.style.transform = 'translate(-50%, -100%)';

      el.innerHTML = `
        <div class="relative flex flex-col items-center">
          ${
            isSelected
              ? `<div class="absolute -inset-3 rounded-full border-2 ${ringColor} animate-ping opacity-75"></div>`
              : ''
          }
          <div class="px-2.5 py-1 rounded-xl bg-[#090d1f] border ${
            isSelected ? 'border-indigo-400 ring-2 ring-indigo-500/50 scale-115 shadow-indigo-500/40' : 'border-white/20'
          } shadow-2xl flex items-center gap-1.5 transition-all duration-200 hover:scale-115">
            <span class="w-2 h-2 rounded-full ${badgeBg} animate-pulse"></span>
            <span class="text-[11px] font-black text-white">${site.readinessScore}</span>
          </div>
          <div class="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-[#090d1f] -mt-0.5"></div>
        </div>
      `;

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        onSelectSite(site);
      });

      const marker = new Marker({ element: el })
        .setLngLat([site.lng, site.lat])
        .addTo(map);

      markersRef.current.push(marker);
    });
  }, [sites, selectedSite, layers, onSelectSite]);

  // 8. Render Real-World Competitor HTML Badges on Map
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    competitorMarkersRef.current.forEach((m) => m.remove());
    competitorMarkersRef.current = [];

    const compActive = layers.find((l) => l.id === 'competitors' || l.id === 'competitor_nodes')?.active ?? true;
    if (!compActive) return;

    activeCompetitors.forEach((comp) => {
      const el = document.createElement('div');
      el.className = 'competitor-dot-marker group cursor-pointer relative';
      el.style.transform = 'translate(-50%, -50%)';

      // Category icon & accent color
      const isEV = comp.category.includes('EV') || comp.category.includes('Charg') || selectedArchetype === 'EV Charging Station';
      const isWarehouse = comp.category.includes('Logistics') || comp.category.includes('Warehouse') || comp.category.includes('Fulfillment') || selectedArchetype === 'Warehouse';
      const isTelecom = comp.category.includes('Tower') || comp.category.includes('Telecom') || comp.category.includes('5G') || selectedArchetype === 'Telecom Tower';
      const isSolar = comp.category.includes('Solar') || comp.category.includes('Renewable') || selectedArchetype === 'Renewable Energy';

      const iconEmoji = isEV ? '⚡' : isWarehouse ? '📦' : isTelecom ? '🗼' : isSolar ? '☀️' : '🛒';
      const themeColor = isEV ? '#38bdf8' : isWarehouse ? '#f59e0b' : isTelecom ? '#a855f7' : isSolar ? '#eab308' : '#f43f5e';

      el.innerHTML = `
        <div class="relative flex items-center justify-center">
          <!-- Subtle Red Glow Pulse -->
          <div class="absolute -inset-1 rounded-full bg-rose-500/40 animate-ping opacity-50 pointer-events-none"></div>

          <!-- Red Dot with Centered Icon -->
          <div class="relative w-7 h-7 rounded-full bg-gradient-to-br from-red-500 via-rose-600 to-rose-700 border-2 border-white shadow-xl shadow-red-950/70 flex items-center justify-center text-xs transition-all duration-200 group-hover:scale-125 group-hover:ring-4 group-hover:ring-rose-500/50 group-hover:z-50">
            <span class="select-none leading-none drop-shadow-sm">${iconEmoji}</span>
          </div>

          <!-- Hover Tooltip Preview -->
          <div class="absolute bottom-full mb-1.5 hidden group-hover:flex flex-col items-center pointer-events-none z-50">
            <div class="px-2 py-0.5 rounded-lg bg-[#090d1f]/95 text-white text-[10px] font-bold whitespace-nowrap shadow-xl border border-rose-500/40 flex items-center gap-1.5">
              <span>${comp.name}</span>
              <span class="text-rose-300 font-mono text-[9px] px-1 py-0.2 rounded bg-rose-950/80">${comp.distanceKm || '1.2'}km</span>
            </div>
            <div class="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-[#090d1f] -mt-0.5"></div>
          </div>
        </div>
      `;

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!popupRef.current) {
          popupRef.current = new Popup({ closeButton: true, closeOnClick: true });
        }

        const statusTag = comp.status || 'Open • Operational';
        const reviewsFormatted = comp.reviewsCount ? comp.reviewsCount.toLocaleString() : '1,240';
        const addressText = comp.address || 'Commercial Sector Corridor';
        const commercialType = comp.commercialType || comp.category;

        popupRef.current
          .setLngLat([comp.lng, comp.lat])
          .setHTML(`
            <div style="background:#090d1f; color:#f8fafc; padding:14px; border-radius:16px; border:1px solid ${themeColor}; font-family:sans-serif; font-size:12px; box-shadow:0 20px 40px rgba(0,0,0,0.85); min-width:240px; max-width:280px;">
              <!-- Header Banner -->
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
                <div style="display:flex; align-items:center; gap:6px;">
                  <span style="font-size:16px;">${iconEmoji}</span>
                  <span style="font-size:10px; font-weight:800; color:${themeColor}; text-transform:uppercase; letter-spacing:0.5px;">${selectedArchetype}</span>
                </div>
                <span style="background:rgba(255,255,255,0.08); color:#fef08a; border:1px solid rgba(254,240,138,0.3); padding:2px 7px; border-radius:8px; font-size:11px; font-weight:bold; display:flex; align-items:center; gap:3px;">
                  ★ ${comp.rating || 4.5} <span style="color:#94a3b8; font-size:9px; font-weight:normal;">(${reviewsFormatted})</span>
                </span>
              </div>

              <!-- Name & Type -->
              <div style="font-weight:900; color:#ffffff; font-size:13px; line-height:1.3; margin-bottom:2px;">${comp.name}</div>
              <div style="color:#94a3b8; font-size:10px; font-weight:600; margin-bottom:8px;">${commercialType} • <b>${comp.brand}</b></div>

              <!-- Live Status & Address -->
              <div style="background:rgba(255,255,255,0.04); border-radius:10px; padding:8px; border:1px solid rgba(255,255,255,0.08); margin-bottom:10px; font-size:11px; line-height:1.5;">
                <div style="color:#34d399; font-weight:bold; font-size:10px; margin-bottom:3px; display:flex; align-items:center; gap:5px;">
                  <span style="width:6px; height:6px; border-radius:50%; background:#10b981; display:inline-block;"></span>
                  ${statusTag}
                </div>
                <div style="color:#cbd5e1; font-size:10px;">📍 <b>Area:</b> ${addressText}</div>
                <div style="color:#cbd5e1; font-size:10px;">📏 <b>Proximity:</b> <b style="color:${themeColor};">${comp.distanceKm || 1.2} km</b> from candidate site</div>
              </div>

              <!-- Catchment Level Badge -->
              <div style="padding:4px 8px; background:${themeColor}22; border-radius:8px; border:1px solid ${themeColor}55; font-size:10px; color:#ffffff; text-align:center; font-weight:bold;">
                ${comp.distanceKm && comp.distanceKm < 2.0 ? '🚨 Core Catchment Competitor (< 2km)' : comp.distanceKm && comp.distanceKm < 7.0 ? '⚡ Mid-City Commercial Node' : '🌐 Outer Regional Corridor Hub'}
              </div>
            </div>
          `)
          .addTo(map);
      });

      const marker = new Marker({ element: el })
        .setLngLat([comp.lng, comp.lat])
        .addTo(map);

      competitorMarkersRef.current.push(marker);
    });
  }, [activeCompetitors, layers, selectedArchetype]);

  // 8. Basemap style switcher handler
  const handleStyleChange = (styleKey: StyleKey) => {
    const map = mapRef.current;
    if (!map || styleKey === currentStyle) return;

    setCurrentStyle(styleKey);
    setShowStyleMenu(false);

    map.setStyle(MAP_STYLES[styleKey].style as any);
  };

  // 9. Fullscreen toggle
  const toggleFullscreen = () => {
    if (!mapContainerRef.current) return;
    if (!document.fullscreenElement) {
      mapContainerRef.current.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  return (
    <div
      className={`relative w-full ${className} rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 shadow-2xl bg-[#080d1a]`}
    >
      {/* MapLibre Canvas Container */}
      <div
        ref={mapContainerRef}
        className={`w-full h-full ${toolMode === 'pin' ? 'cursor-crosshair' : toolMode === 'polygon' ? 'cursor-cell' : 'cursor-grab'}`}
      />

      {/* Top Left: Interactive Drawing & Spatial Tools Toolbar */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 pointer-events-auto">
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10 text-white shadow-2xl text-xs">
          {/* Navigate Mode */}
          <button
            onClick={() => setToolMode('navigate')}
            className={`p-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 font-semibold ${
              toolMode === 'navigate' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-300 hover:bg-white/10'
            }`}
            title="Navigate & Inspect Mode"
          >
            <MousePointer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Explore</span>
          </button>

          {/* Pin Drop Mode */}
          <button
            onClick={() => {
              setToolMode('pin');
              setInspectedSite(null);
            }}
            className={`p-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 font-semibold ${
              toolMode === 'pin' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-300 hover:bg-white/10'
            }`}
            title="Click anywhere on map to analyze point"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Drop Pin</span>
          </button>

          {/* Polygon Drawing Mode */}
          <button
            onClick={() => {
              setToolMode('polygon');
              setPolygonPoints([]);
              setPolygonAnalysis(null);
            }}
            className={`p-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 font-semibold ${
              toolMode === 'polygon' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-300 hover:bg-white/10'
            }`}
            title="Click multiple points to draw custom catchment boundary"
          >
            <PenTool className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Draw Boundary</span>
          </button>

          {/* Clear Drawings Button */}
          {(polygonPoints.length > 0 || inspectedSite) && (
            <button
              onClick={() => {
                setPolygonPoints([]);
                setPolygonAnalysis(null);
                setInspectedSite(null);
                if (tempMarkerRef.current) tempMarkerRef.current.remove();
                setToolMode('navigate');
              }}
              className="p-2 rounded-xl text-rose-400 hover:bg-rose-950/60 transition-all cursor-pointer"
              title="Clear drawings"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Selected Site / City Badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10 text-white shadow-xl text-xs">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold tracking-tight">
            {selectedSite ? selectedSite.name : activeCity ? activeCity.name : 'Target Workspace'}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            {activeCompetitors.length} Commercial Sites Across Whole Map
          </span>
        </div>
      </div>

      {/* Archetype & Spatial Algorithms Filter Toolbar */}
      <div className="absolute top-16 left-4 z-20 flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-black/85 backdrop-blur-xl border border-white/10 text-white shadow-2xl text-xs pointer-events-auto max-w-[calc(100vw-2rem)] sm:max-w-none">
        {/* Archetype Selector */}
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 hidden sm:inline">
          Archetype:
        </span>
        {ARCHETYPES.map((arch) => {
          const isActive = selectedArchetype === arch.type;
          return (
            <button
              key={arch.type}
              onClick={() => setSelectedArchetype(arch.type)}
              className={`px-2.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30 scale-102 ring-1 ring-white/20 font-bold'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
              title={`Show all ${arch.type} commercial sites & competitor network across the whole map`}
            >
              <span>{arch.icon}</span>
              <span>{arch.label}</span>
            </button>
          );
        })}

        <div className="h-4 w-px bg-white/20 mx-1 hidden md:block" />

        {/* Spatial Analytics Mode (H3 vs Gi* vs DBSCAN) */}
        <div className="hidden md:flex items-center gap-1 p-0.5 rounded-xl bg-white/5 border border-white/10">
          <button
            onClick={() => setSpatialAlgorithm('h3')}
            className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
              spatialAlgorithm === 'h3' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
            title="H3 Hexagonal Opportunity Grid"
          >
            H3 Grid
          </button>
          <button
            onClick={() => setSpatialAlgorithm('gi_star')}
            className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
              spatialAlgorithm === 'gi_star' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
            title="Getis-Ord Gi* Statistical Hotspots"
          >
            Gi* Hotspots
          </button>
          <button
            onClick={() => setSpatialAlgorithm('dbscan')}
            className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
              spatialAlgorithm === 'dbscan' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
            title="DBSCAN Density Clusters"
          >
            DBSCAN
          </button>
        </div>

        {/* Radial Distance Buffers Toggle */}
        <button
          onClick={() => setShowRadialBuffers(!showRadialBuffers)}
          className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
            showRadialBuffers
              ? 'bg-rose-600 text-white shadow-md'
              : 'text-slate-300 hover:bg-white/10 hover:text-white'
          }`}
          title="Toggle 1km, 3km, 5km Concentric Distance Buffers"
        >
          <span>🎯</span>
          <span className="hidden sm:inline">1/3/5km Buffers</span>
        </button>
      </div>

      {/* Top Right: Controls HUD */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 pointer-events-auto">
        {/* Style Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowStyleMenu(!showStyleMenu)}
            className="p-2.5 rounded-2xl bg-black/80 hover:bg-black/90 backdrop-blur-xl border border-white/10 text-slate-200 hover:text-white shadow-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            title="Change Map Style"
          >
            {React.createElement(MAP_STYLES[currentStyle].icon, { className: 'w-4 h-4 text-indigo-400' })}
            <span className="hidden sm:inline">{MAP_STYLES[currentStyle].name}</span>
          </button>

          {showStyleMenu && (
            <div className="absolute right-0 top-12 w-44 rounded-2xl bg-[#090d1f]/95 backdrop-blur-2xl border border-indigo-500/30 p-1.5 shadow-2xl space-y-1 z-30">
              {(Object.keys(MAP_STYLES) as StyleKey[]).map((key) => {
                const item = MAP_STYLES[key];
                const Icon = item.icon;
                const isActive = currentStyle === key;
                return (
                  <button
                    key={key}
                    onClick={() => handleStyleChange(key)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Layer Control Button */}
        <button
          onClick={() => setShowLayerPanel(!showLayerPanel)}
          className={`p-2.5 rounded-2xl backdrop-blur-xl border shadow-xl transition-all cursor-pointer ${
            showLayerPanel
              ? 'bg-indigo-600 text-white border-indigo-500'
              : 'bg-black/80 hover:bg-black/90 text-slate-200 hover:text-white border-white/10'
          }`}
          title="Toggle Layers"
        >
          <Layers className="w-4 h-4" />
        </button>

        {/* Reset View Button */}
        <button
          onClick={() => {
            if (mapRef.current) {
              mapRef.current.flyTo({ center: defaultCenter, zoom: 12.2, pitch: 0, bearing: 0 });
            }
          }}
          className="p-2.5 rounded-2xl bg-black/80 hover:bg-black/90 backdrop-blur-xl border border-white/10 text-slate-200 hover:text-white shadow-xl transition-all cursor-pointer"
          title="Reset View"
        >
          <Compass className="w-4 h-4 text-cyan-400" />
        </button>

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          className="p-2.5 rounded-2xl bg-black/80 hover:bg-black/90 backdrop-blur-xl border border-white/10 text-slate-200 hover:text-white shadow-xl transition-all cursor-pointer"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Floating Layer Control Drawer */}
      {showLayerPanel && (
        <div className="absolute top-16 right-4 z-20 pointer-events-auto">
          <LayerControl
            layers={layers}
            onToggleLayer={onToggleLayer}
            onChangeOpacity={onChangeOpacity}
            activeLayerId={activeLayerId}
            setActiveLayerId={setActiveLayerId}
          />
        </div>
      )}

      {/* Candidate Site Slide-In Inspection Drawer (per Docs/12_MAP_INTERACTION_SPEC.md) */}
      {inspectedCandidateSite && (
        <div className="absolute top-28 right-4 z-30 max-w-sm w-full p-4 rounded-3xl bg-[#090d1f]/95 backdrop-blur-2xl border border-indigo-500/40 text-white shadow-2xl animate-in slide-in-from-right">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Candidate Site Analysis</span>
              </div>
              <h4 className="text-sm font-bold text-white leading-tight">{inspectedCandidateSite.name}</h4>
              <span className="text-[11px] text-slate-400">{inspectedCandidateSite.area} • {inspectedCandidateSite.businessType}</span>
            </div>
            <button
              onClick={() => setInspectedCandidateSite(null)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Readiness Score Pill */}
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white/5 border border-white/10 mb-3">
            <div>
              <span className="text-slate-400 text-[10px] block">Overall Readiness</span>
              <span className="text-xs font-semibold text-emerald-300">{inspectedCandidateSite.status}</span>
            </div>
            <div className="text-2xl font-black text-emerald-400">
              {inspectedCandidateSite.readinessScore}<span className="text-xs text-slate-400 font-normal">/100</span>
            </div>
          </div>

          {/* 5-Factor Progress Breakdown */}
          <div className="space-y-2 mb-3 text-xs">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-400">👥 Population Density</span>
                <span className="font-bold text-white">{inspectedCandidateSite.factors.population}/100</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full bg-blue-500" style={{ width: `${inspectedCandidateSite.factors.population}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-400">⚡ Accessibility</span>
                <span className="font-bold text-white">{inspectedCandidateSite.factors.accessibility}/100</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full bg-cyan-500" style={{ width: `${inspectedCandidateSite.factors.accessibility}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-400">🏢 Competition Proximity</span>
                <span className="font-bold text-white">{inspectedCandidateSite.factors.competition}/100</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full bg-rose-500" style={{ width: `${inspectedCandidateSite.factors.competition}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-400">🏗️ Land Use & Zoning</span>
                <span className="font-bold text-white">{inspectedCandidateSite.factors.landUse}/100</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: `${inspectedCandidateSite.factors.landUse}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-400">🌿 Environmental Risk</span>
                <span className="font-bold text-white">{inspectedCandidateSite.factors.environmentalRisk}/100</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full bg-amber-500" style={{ width: `${inspectedCandidateSite.factors.environmentalRisk}%` }} />
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] mb-3 p-2 rounded-xl bg-white/5 border border-white/10">
            <div>
              <span className="text-slate-400 block">Pop (5km)</span>
              <span className="font-bold text-white">{inspectedCandidateSite.metrics.populationWithin5km.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Highway</span>
              <span className="font-bold text-white">{inspectedCandidateSite.metrics.nearestHighwayKm} km</span>
            </div>
            <div>
              <span className="text-slate-400 block">Competitors</span>
              <span className="font-bold text-rose-400">{inspectedCandidateSite.metrics.competitorsWithin1km} nodes</span>
            </div>
          </div>

          {/* Full Analysis Action */}
          <button
            onClick={() => onSelectSite(inspectedCandidateSite)}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/30 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Open Full AI Analysis</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Custom Inspected Point Modal / Bottom Card */}
      {inspectedSite && (
        <div className="absolute bottom-16 left-4 z-30 max-w-sm w-full p-4 rounded-3xl bg-[#090d1f]/95 backdrop-blur-2xl border border-indigo-500/40 text-white shadow-2xl animate-in slide-in-from-bottom">
          <div className="flex items-start justify-between mb-3">
            <div>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Point Evaluator</span>
              <h4 className="text-sm font-bold text-white">{inspectedSite.name}</h4>
              <span className="text-[11px] text-slate-400">Lat: {inspectedSite.lat.toFixed(4)}, Lng: {inspectedSite.lng.toFixed(4)}</span>
            </div>
            <button
              onClick={() => {
                setInspectedSite(null);
                if (tempMarkerRef.current) tempMarkerRef.current.remove();
              }}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
              <span className="text-slate-400 text-[10px] block">Readiness Score</span>
              <span className="text-lg font-black text-emerald-400">{inspectedSite.readinessScore}/100</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
              <span className="text-slate-400 text-[10px] block">Pop. (5km)</span>
              <span className="text-sm font-bold text-white">{inspectedSite.metrics.populationWithin5km.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onAddNewSite && (
              <button
                onClick={() => {
                  onAddNewSite(inspectedSite);
                  setInspectedSite(null);
                  if (tempMarkerRef.current) tempMarkerRef.current.remove();
                  setToolMode('navigate');
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Save as Candidate</span>
              </button>
            )}
            <button
              onClick={() => onSelectSite(inspectedSite)}
              className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-all cursor-pointer"
            >
              Inspect
            </button>
          </div>
        </div>
      )}

      {/* Polygon Catchment Analysis Card */}
      {polygonAnalysis && (
        <div className="absolute bottom-16 left-4 z-30 max-w-xs w-full p-4 rounded-3xl bg-[#090d1f]/95 backdrop-blur-2xl border border-emerald-500/40 text-white shadow-2xl animate-in slide-in-from-bottom">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
              <PenTool className="w-3.5 h-3.5" />
              <span>Custom Catchment Area</span>
            </div>
            <button onClick={() => setPolygonAnalysis(null)} className="p-1 text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-white/10">
              <span className="text-slate-400">Calculated Area:</span>
              <span className="font-bold text-white">{polygonAnalysis.areaKm2} km²</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/10">
              <span className="text-slate-400">Est. Enclosed Population:</span>
              <span className="font-bold text-white">{polygonAnalysis.estimatedPop.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/10">
              <span className="text-slate-400">Direct Competitors:</span>
              <span className="font-bold text-white">{polygonAnalysis.competitorCount} nodes</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Area Readiness:</span>
              <span className="font-black text-emerald-400">{polygonAnalysis.readinessScore}/100</span>
            </div>
          </div>
        </div>
      )}

      {/* H3 Zone Details Drawer / Popover */}
      {selectedHexZone && (
        <div className="absolute bottom-16 right-4 z-30 max-w-sm w-full p-4 rounded-3xl bg-[#090d1f]/95 backdrop-blur-2xl border border-indigo-500/40 text-white shadow-2xl animate-in slide-in-from-right">
          <div className="flex items-start justify-between mb-3">
            <div>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">H3 Spatial Index</span>
              <h4 className="text-sm font-bold text-white">Hex: {selectedHexZone.h3Index}</h4>
              <span className="text-[11px] text-slate-400">Lat: {selectedHexZone.lat.toFixed(4)}, Lng: {selectedHexZone.lng.toFixed(4)}</span>
            </div>
            <button onClick={() => setSelectedHexZone(null)} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
              <span className="text-slate-400 text-[10px] block">Zone Readiness</span>
              <span className="text-lg font-black text-indigo-300">{selectedHexZone.readinessScore}/100</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
              <span className="text-slate-400 text-[10px] block">Population</span>
              <span className="text-sm font-bold text-white">{selectedHexZone.population.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-300 py-1 border-t border-white/10">
            <span>Competitor Density: <b>{selectedHexZone.competitors} sites</b></span>
            <span>Accessibility: <b>{selectedHexZone.accessibility}%</b></span>
          </div>
        </div>
      )}

      {/* Bottom Right: Zoom In / Zoom Out Controls (Up to 20x) */}
      <div className="absolute bottom-6 right-4 z-20 flex flex-col gap-1.5 pointer-events-auto">
        <button
          onClick={() => {
            if (mapRef.current) {
              const currentZoom = mapRef.current.getZoom();
              mapRef.current.easeTo({ zoom: Math.min(20, currentZoom + 1) });
            }
          }}
          className="p-2.5 rounded-2xl bg-black/80 hover:bg-black/90 backdrop-blur-xl border border-white/10 text-white shadow-xl transition-all cursor-pointer hover:scale-105"
          title="Zoom In (up to 20x)"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            if (mapRef.current) {
              const currentZoom = mapRef.current.getZoom();
              mapRef.current.easeTo({ zoom: Math.max(1, currentZoom - 1) });
            }
          }}
          className="p-2.5 rounded-2xl bg-black/80 hover:bg-black/90 backdrop-blur-xl border border-white/10 text-white shadow-xl transition-all cursor-pointer hover:scale-105"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Left: Live Coordinates & Advanced Legend HUD */}
      <div className="absolute bottom-4 left-4 z-20 flex flex-wrap items-center gap-2 pointer-events-none">
        {/* Real-Time Cursor Coordinates */}
        {cursorCoords && (
          <div className="px-3 py-1.5 rounded-xl bg-black/85 backdrop-blur-md border border-white/10 text-[10px] font-mono text-slate-300 shadow-xl">
            <span>Lat: <b>{cursorCoords.lat.toFixed(4)}</b></span>
            <span className="mx-1.5 opacity-40">|</span>
            <span>Lng: <b>{cursorCoords.lng.toFixed(4)}</b></span>
            <span className="mx-1.5 opacity-40">|</span>
            <span>Zoom: <b>{zoomLevel.toFixed(1)}</b></span>
          </div>
        )}

        {/* Multi-Modal Isochrone Reach Legend (with Drive vs Walk Switcher) */}
        {showIsochrones && (
          <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-black/85 backdrop-blur-md border border-white/10 text-[10px] font-medium text-slate-300 shadow-xl pointer-events-auto">
            {/* Drive / Walk Mode Toggle */}
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-white/10 border border-white/10">
              <button
                onClick={() => setActiveIsoMode('drive')}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                  activeIsoMode === 'drive' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
                title="Switch to Drive Isochrones"
              >
                🚗 Drive
              </button>
              <button
                onClick={() => setActiveIsoMode('walk')}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                  activeIsoMode === 'walk' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
                title="Switch to Walk Isochrones"
              >
                🚶 Walk
              </button>
            </div>

            <div className="h-3 w-px bg-white/20 mx-0.5" />

            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>10m</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span>20m</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
              <span>30m</span>
            </div>
          </div>
        )}

        {/* Dynamic Spatial Algorithm Legend */}
        <div className="hidden md:flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-xl bg-black/85 backdrop-blur-md border border-white/10 text-[10px] font-medium text-slate-300 shadow-xl pointer-events-auto max-w-2xl">
          {spatialAlgorithm === 'h3' && (
            <>
              <span className="font-bold text-indigo-400">H3 Hex Mesh:</span>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4338ca]" />
                <span>Prime (&ge;90)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#7c3aed]" />
                <span>High (80-89)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#e11d48]" />
                <span>Growth (70-79)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
                <span>Mod (60-69)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#fde047]" />
                <span>Fringe (&lt;60)</span>
              </div>
            </>
          )}

          {spatialAlgorithm === 'gi_star' && (
            <>
              <span className="font-bold text-amber-400">Gi* Hotspots:</span>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#b91c1c]" />
                <span>99% Hot (z&ge;2.6)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ea580c]" />
                <span>95% Hot</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
                <span>90% Hot</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#fef08a]" />
                <span className="text-slate-400">Neutral</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8]" />
                <span>90% Cold</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]" />
                <span>95% Cold</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1e3a8a]" />
                <span>99% Cold (z&le;-2.6)</span>
              </div>
            </>
          )}

          {spatialAlgorithm === 'dbscan' && (
            <>
              <span className="font-bold text-purple-400">DBSCAN Density:</span>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#dc2626]" />
                <span>Core Hub (&gt;10k)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ea580c]" />
                <span>Tech Corridor (5k-10k)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
                <span>Logistics (1k-5k)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#eab308]" />
                <span>Suburban (100-1k)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#64748b]" />
                <span>Noise (&lt;100)</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
