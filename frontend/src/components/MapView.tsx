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
} from '../types';
import { LayerControl } from './LayerControl';
import { ISOCHRONE_DATA } from '../data/mockData';
import { generateRealWorldCompetitors, generateH3GridAround, analyzeSite } from '../services/gisService';

const MAP_API_KEY = import.meta.env.VITE_MAP_API_KEY || 'cb1_3r5w_1_870f82872ede2321c67a7ba6';

// MapLibre Basemap Style Presets
const MAP_STYLES = {
  dark: {
    name: 'Dark Matter',
    icon: Moon,
    style: {
      version: 8,
      sources: {
        'carto-dark': {
          type: 'raster',
          tiles: [
            'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
            'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
            'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
          ],
          tileSize: 256,
          attribution: '&copy; OpenStreetMap, &copy; CARTO',
        },
      },
      layers: [
        {
          id: 'carto-dark-layer',
          type: 'raster',
          source: 'carto-dark',
          minzoom: 0,
          maxzoom: 20,
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
          attribution: '&copy; Esri, Maxar, Earthstar Geographics',
        },
      },
      layers: [
        {
          id: 'satellite-layer',
          type: 'raster',
          source: 'satellite',
          minzoom: 0,
          maxzoom: 20,
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
          attribution: '&copy; OpenStreetMap contributors',
        },
      },
      layers: [
        {
          id: 'osm-streets-layer',
          type: 'raster',
          source: 'osm-streets',
          minzoom: 0,
          maxzoom: 19,
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
        'carto-light': {
          type: 'raster',
          tiles: [
            'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png',
            'https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png',
            'https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png',
          ],
          tileSize: 256,
          attribution: '&copy; OpenStreetMap, &copy; CARTO',
        },
      },
      layers: [
        {
          id: 'carto-light-layer',
          type: 'raster',
          source: 'carto-light',
          minzoom: 0,
          maxzoom: 20,
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
  onSelectHexCell?: (cell: H3CellData) => void;
  onAddNewSite?: (site: CandidateSite) => void;
  className?: string;
}

// Generate regular hexagon coordinates for H3 visual representation
const createHexagonPolygon = (lat: number, lng: number, radiusKm: number = 0.38): [number, number][] => {
  const coords: [number, number][] = [];
  const latRadius = radiusKm / 111.32;
  const lngRadius = radiusKm / (111.32 * Math.cos((lat * Math.PI) / 180));

  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
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

  // Compute active focus coordinates
  const defaultCenter = useMemo<[number, number]>(() => {
    if (selectedSite) return [selectedSite.lng, selectedSite.lat];
    if (activeCity) return [activeCity.lng, activeCity.lat];
    if (sites.length > 0) return [sites[0].lng, sites[0].lat];
    return [72.8311, 21.1702];
  }, [selectedSite, activeCity, sites]);

  // Merge real-world competitors around active site / coordinates if array is empty
  const activeCompetitors = useMemo<CompetitorPoint[]>(() => {
    if (competitors.length > 0) return competitors;
    const center = selectedSite || (sites.length > 0 ? sites[0] : { lat: defaultCenter[1], lng: defaultCenter[0], businessType: 'Retail Store' as BusinessType });
    return generateRealWorldCompetitors(center.lat, center.lng, center.businessType || 'Retail Store');
  }, [competitors, selectedSite, sites, defaultCenter]);

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

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
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

    // --- A. ISOCHRONES LAYER ---
    const targetSite = selectedSite || (sites.length > 0 ? sites[0] : null);
    const isochronesActive = showIsochrones && (layers.find((l) => l.id === 'isochrones')?.active ?? true);
    const isochronesOpacity = layers.find((l) => l.id === 'isochrones')?.opacity ?? 0.45;

    const isochroneFeatures = targetSite && isochronesActive
      ? [
          {
            type: 'Feature' as const,
            properties: { minutes: 30, color: '#818cf8', label: '30 min Catchment' },
            geometry: {
              type: 'Polygon' as const,
              coordinates: [createIsochronePolygon(targetSite.lat, targetSite.lng, 30, isochroneMode, ISOCHRONE_DATA[isochroneMode]?.[2]?.pathOffsets)],
            },
          },
          {
            type: 'Feature' as const,
            properties: { minutes: 20, color: '#38bdf8', label: '20 min Catchment' },
            geometry: {
              type: 'Polygon' as const,
              coordinates: [createIsochronePolygon(targetSite.lat, targetSite.lng, 20, isochroneMode, ISOCHRONE_DATA[isochroneMode]?.[1]?.pathOffsets)],
            },
          },
          {
            type: 'Feature' as const,
            properties: { minutes: 10, color: '#34d399', label: '10 min Catchment' },
            geometry: {
              type: 'Polygon' as const,
              coordinates: [createIsochronePolygon(targetSite.lat, targetSite.lng, 10, isochroneMode, ISOCHRONE_DATA[isochroneMode]?.[0]?.pathOffsets)],
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

    // --- B. H3 HEXAGONAL OPPORTUNITY & HOTSPOT CELLS ---
    const h3Active = layers.find((l) => l.id === 'opportunity_heatmap' || l.id === 'h3_hotspots' || l.id === 'h3_grid')?.active ?? true;
    const h3Opacity = layers.find((l) => l.id === 'opportunity_heatmap' || l.id === 'h3_hotspots' || l.id === 'h3_grid')?.opacity ?? 0.55;

    const h3Features = activeH3Cells.map((cell) => {
      let fillColor = '#6366f1';
      if (cell.readinessScore >= 80) fillColor = '#10b981';
      else if (cell.readinessScore >= 65) fillColor = '#f59e0b';
      else fillColor = '#f43f5e';

      if (cell.hotspotType === 'hot') fillColor = '#ef4444';
      if (cell.hotspotType === 'cold') fillColor = '#06b6d4';

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
        },
        geometry: {
          type: 'Polygon' as const,
          coordinates: [createHexagonPolygon(cell.lat, cell.lng)],
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
          'fill-opacity': h3Opacity,
        },
      });

      map.addLayer({
        id: 'h3-cells-line',
        type: 'line',
        source: 'h3-cells-source',
        paint: {
          'line-color': '#ffffff',
          'line-width': 1,
          'line-opacity': 0.25,
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
            <div style="background:#090d1e; color:#f8fafc; padding:8px 12px; border-radius:10px; border:1px solid rgba(99,102,241,0.4); font-family:sans-serif; font-size:11px; box-shadow:0 10px 25px rgba(0,0,0,0.6);">
              <div style="font-weight:bold; color:#818cf8; margin-bottom:4px; display:flex; justify-content:space-between; gap:10px;">
                <span>H3 Hex: <b>${props.h3Index}</b></span>
                <span style="color:#34d399; font-weight:900;">${props.score}/100</span>
              </div>
              <div style="color:#94a3b8; font-size:10px; line-height:1.4;">
                👥 Pop: <b>${props.population?.toLocaleString()}</b><br/>
                🏢 Competitors: <b>${props.competitors}</b> | ⚡ Access: <b>${props.accessibility}%</b>
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
      map.setPaintProperty('h3-cells-fill', 'fill-opacity', h3Opacity);
      map.setLayoutProperty('h3-cells-fill', 'visibility', h3Active ? 'visible' : 'none');
      map.setLayoutProperty('h3-cells-line', 'visibility', h3Active ? 'visible' : 'none');
    }

    // --- C. REAL-WORLD COMPETITOR POINTS LAYER ---
    const compActive = layers.find((l) => l.id === 'competitors' || l.id === 'competitor_nodes')?.active ?? true;
    const compFeatures = activeCompetitors.map((comp) => ({
      type: 'Feature' as const,
      properties: {
        id: comp.id,
        name: comp.name,
        brand: comp.brand,
        category: comp.category,
        distanceKm: comp.distanceKm || 1.2,
        rating: comp.rating || 4.4,
      },
      geometry: {
        type: 'Point' as const,
        coordinates: [comp.lng, comp.lat],
      },
    }));

    const compGeoJson: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: compFeatures,
    };

    if (map.getSource('competitors-source')) {
      (map.getSource('competitors-source') as any).setData(compGeoJson);
    } else {
      map.addSource('competitors-source', {
        type: 'geojson',
        data: compGeoJson,
      });

      map.addLayer({
        id: 'competitors-halo',
        type: 'circle',
        source: 'competitors-source',
        paint: {
          'circle-radius': 9,
          'circle-color': '#f43f5e',
          'circle-opacity': 0.25,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#f43f5e',
        },
      });

      map.addLayer({
        id: 'competitors-point',
        type: 'circle',
        source: 'competitors-source',
        paint: {
          'circle-radius': 5,
          'circle-color': '#f43f5e',
          'circle-stroke-width': 1.5,
          'circle-stroke-color': '#ffffff',
        },
      });

      map.on('mouseenter', 'competitors-point', (e) => {
        if (!e.features || e.features.length === 0) return;
        map.getCanvas().style.cursor = 'pointer';
        const props = e.features[0].properties;

        if (!popupRef.current) {
          popupRef.current = new Popup({ closeButton: false, closeOnClick: false });
        }

        popupRef.current
          .setLngLat(e.lngLat)
          .setHTML(`
            <div style="background:#090d1e; color:#f8fafc; padding:8px 12px; border-radius:10px; border:1px solid rgba(244,63,94,0.5); font-size:11px; box-shadow:0 10px 25px rgba(0,0,0,0.6);">
              <div style="font-weight:bold; color:#fda4af; margin-bottom:2px;">${props.name}</div>
              <div style="color:#94a3b8; font-size:10px; line-height:1.4;">
                🏢 <b>${props.brand}</b> • ${props.category}<br/>
                📍 Distance: <b>${props.distanceKm} km</b> • ★ <b>${props.rating}</b>
              </div>
            </div>
          `)
          .addTo(map);
      });

      map.on('mouseleave', 'competitors-point', () => {
        map.getCanvas().style.cursor = '';
        if (popupRef.current) popupRef.current.remove();
      });
    }

    if (map.getLayer('competitors-point')) {
      map.setLayoutProperty('competitors-point', 'visibility', compActive ? 'visible' : 'none');
      map.setLayoutProperty('competitors-halo', 'visibility', compActive ? 'visible' : 'none');
    }
  }, [selectedSite, sites, showIsochrones, isochroneMode, layers, activeH3Cells, activeCompetitors, onSelectHexCell]);

  // 6. Update GeoJSON layers on state changes
  useEffect(() => {
    const map = mapRef.current;
    if (map && map.isStyleLoaded()) {
      updateMapLayers(map);
    }
  }, [updateMapLayers]);

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

  // 8. Basemap style switcher handler
  const handleStyleChange = (styleKey: StyleKey) => {
    const map = mapRef.current;
    if (!map || styleKey === currentStyle) return;

    setCurrentStyle(styleKey);
    setShowStyleMenu(false);

    map.setStyle(MAP_STYLES[styleKey].style as any);
    map.once('style.load', () => {
      updateMapLayers(map);
    });
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
            {activeCompetitors.length} Competitors • {activeH3Cells.length} H3 Cells
          </span>
        </div>
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

      {/* Bottom Right: Zoom In / Zoom Out Controls */}
      <div className="absolute bottom-6 right-4 z-20 flex flex-col gap-1.5 pointer-events-auto">
        <button
          onClick={() => mapRef.current?.zoomIn()}
          className="p-2.5 rounded-2xl bg-black/80 hover:bg-black/90 backdrop-blur-xl border border-white/10 text-white shadow-xl transition-all cursor-pointer hover:scale-105"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => mapRef.current?.zoomOut()}
          className="p-2.5 rounded-2xl bg-black/80 hover:bg-black/90 backdrop-blur-xl border border-white/10 text-white shadow-xl transition-all cursor-pointer hover:scale-105"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Left: Live Coordinates & Legend HUD */}
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

        {/* Isochrone Legend */}
        {showIsochrones && (
          <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-black/85 backdrop-blur-md border border-white/10 text-[10px] font-medium text-slate-300 shadow-xl">
            <span className="font-bold text-slate-400">Reach:</span>
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
      </div>
    </div>
  );
};
