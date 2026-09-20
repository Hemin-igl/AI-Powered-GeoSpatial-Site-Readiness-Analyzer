import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Crosshair,
  MapPin,
  Compass,
  Layers,
  Search,
  Filter,
  Eye,
  Info,
} from 'lucide-react';
import {
  CandidateSite,
  CompetitorPoint,
  H3CellData,
  MapLayerConfig,
} from '../types';
import {
  CITY_DATA,
  ISOCHRONE_DATA,
} from '../data/mockData';
import { LayerControl } from './LayerControl';
import { City } from '../types';

const TAPI_RIVER_COORDINATES: [number, number][] = [];
const SURAT_ROADS: any[] = [];

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
  className?: string;
}

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
  className = 'h-[540px]',
  activeCity,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Map viewport states
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hoveredHex, setHoveredHex] = useState<H3CellData | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [hoveredSite, setHoveredSite] = useState<CandidateSite | null>(null);
  const [activeLayerId, setActiveLayerId] = useState<string>('pop_density');
  const [showLayerPanel, setShowLayerPanel] = useState(true);

  // Map projection bounding box for selected city
  const bounds = useMemo(() => {
    if (!activeCity) {
      return { minLat: 21.07, maxLat: 21.26, minLng: 72.67, maxLng: 72.94 }; // Default fallback
    }
    return {
      minLat: activeCity.lat - 0.1,
      maxLat: activeCity.lat + 0.1,
      minLng: activeCity.lng - 0.15,
      maxLng: activeCity.lng + 0.15,
    };
  }, [activeCity]);

  const svgWidth = 1000;
  const svgHeight = 700;

  // Project geographic coordinates to SVG coordinates
  const project = (lat: number, lng: number): [number, number] => {
    const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * svgWidth;
    // Invert Y because latitude goes north/up while SVG Y goes down
    const y = svgHeight - ((lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * svgHeight;
    return [x, y];
  };


  // Handle Pan dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag with left mouse button when not clicking a button/interactive element
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setTooltipPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle Zoom with mouse wheel
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.88;
    setZoom((prev) => Math.min(3.5, Math.max(0.7, prev * zoomFactor)));
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Center on current city
  const centerCity = () => {
    setZoom(1.2);
    setPan({ x: 0, y: 0 });
  };

  // Active layer check helper
  const isLayerActive = (layerId: string) => {
    return layers.find((l) => l.id === layerId)?.active ?? true;
  };

  const getLayerOpacity = (layerId: string) => {
    return layers.find((l) => l.id === layerId)?.opacity ?? 0.8;
  };

  // Function to create hexagon SVG polygon points from center (lat, lng)
  const getHexPolygon = (lat: number, lng: number, radius: number = 18) => {
    const [cx, cy] = project(lat, lng);
    const points: [number, number][] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i + Math.PI / 6;
      points.push([cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)]);
    }
    return points.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  };

  // Color generator for H3 hex score
  const getHexColor = (score: number) => {
    if (score >= 85) return '#6366f1'; // High (indigo-500)
    if (score >= 60) return '#38bdf8'; // Medium (sky-400)
    return '#94a3b8'; // Low (slate-400)
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      className={`relative w-full overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-900 select-none shadow-sm cursor-grab active:cursor-grabbing ${className}`}
    >
      {/* Interactive SVG Canvas */}
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-full"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.15s ease-out',
        }}
      >
        <defs>
          {/* Base Grid Pattern */}
          <pattern id="gis-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.75" />
          </pattern>

          {/* Tapi River glow */}
          <filter id="glow-river" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Hex Opportunity Gradients */}
          <linearGradient id="high-opp" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id="med-opp" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.70" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.80" />
          </linearGradient>

          <linearGradient id="low-opp" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#64748b" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#475569" stopOpacity="0.55" />
          </linearGradient>

          {/* Radial Pulse for Selected Candidate Site */}
          <radialGradient id="site-pulse" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#6366f1" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Base Cartographic Background */}
        <rect width={svgWidth} height={svgHeight} fill="#0f172a" />
        <rect width={svgWidth} height={svgHeight} fill="url(#gis-grid)" />

        {/* Urban Boundary & Landform Proxy */}
        <path
          d="M 120 80 Q 450 60 780 120 T 920 480 Q 860 620 650 640 T 260 590 Q 140 420 120 80 Z"
          fill="#131e33"
          stroke="#1e293b"
          strokeWidth="1.5"
          opacity="0.8"
        />

        {/* LAYER 1: Population Density Heatmap Underlay */}
        {isLayerActive('pop_density') && (
          <g
            className="population-layer transition-opacity duration-300"
            opacity={getLayerOpacity('pop_density')}
          >
            {/* High density urban core radial blobs */}
            <circle cx="530" cy="340" r="140" fill="#4f46e5" opacity="0.25" filter="url(#glow-river)" />
            <circle cx="560" cy="310" r="90" fill="#7c3aed" opacity="0.35" filter="url(#glow-river)" />
            <circle cx="430" cy="420" r="110" fill="#6366f1" opacity="0.22" filter="url(#glow-river)" />
            <circle cx="680" cy="270" r="100" fill="#4338ca" opacity="0.20" filter="url(#glow-river)" />
          </g>
        )}

        {/* LAYER 3: Environmental Risk Zones (Tapi Floodplain & Marshlands) */}
        {isLayerActive('risk_zones') && (
          <g opacity={getLayerOpacity('risk_zones')}>
            <polygon
              points="140,490 280,480 340,540 210,610 130,550"
              fill="rgba(245, 158, 11, 0.18)"
              stroke="#f59e0b"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
            <text x="180" y="540" fill="#fbbf24" fontSize="9" fontWeight="bold" opacity="0.8">
              Flood Buffer Zone A
            </text>
          </g>
        )}

        {/* LAYER 4: Land Use Parcels */}
        {isLayerActive('land_use') && (
          <g opacity={getLayerOpacity('land_use')}>
            {/* Commercial Corridor Vesu */}
            <rect
              x="390"
              y="440"
              width="90"
              height="70"
              rx="6"
              fill="rgba(16, 185, 129, 0.16)"
              stroke="#10b981"
              strokeWidth="1"
            />
            <text x="400" y="460" fill="#34d399" fontSize="8" fontWeight="bold">
              C-2 Commercial Vesu
            </text>

            {/* Industrial Hazira Node */}
            <rect
              x="160"
              y="320"
              width="110"
              height="90"
              rx="6"
              fill="rgba(99, 102, 241, 0.15)"
              stroke="#818cf8"
              strokeWidth="1"
            />
            <text x="170" y="340" fill="#a5b4fc" fontSize="8" fontWeight="bold">
              I-2 Hazira Heavy Ind.
            </text>
          </g>
        )}


        {/* LAYER 6: H3 Hexagonal Grid Cells (Heatmap of Opportunity) */}
        {(isLayerActive('h3_grid') || isLayerActive('hotspots') || true) && (
          <g
            className="h3-layer transition-opacity duration-300"
            opacity={
              isLayerActive('h3_grid')
                ? getLayerOpacity('h3_grid')
                : 0.65
            }
          >
            {h3Cells.map((hex) => {
              const hexPoints = getHexPolygon(hex.lat, hex.lng, 15);
              const isHovered = hoveredHex?.id === hex.id;
              const hexColor = getHexColor(hex.readinessScore);

              return (
                <polygon
                  key={hex.id}
                  points={hexPoints}
                  fill={
                    hex.opportunityLevel === 'High'
                      ? 'url(#high-opp)'
                      : hex.opportunityLevel === 'Medium'
                      ? 'url(#med-opp)'
                      : 'url(#low-opp)'
                  }
                  stroke={isHovered ? '#ffffff' : hexColor}
                  strokeWidth={isHovered ? 2.5 : 0.75}
                  strokeOpacity={isHovered ? 1 : 0.5}
                  className="cursor-pointer transition-all duration-150 hover:opacity-100"
                  onMouseEnter={() => setHoveredHex(hex)}
                  onMouseLeave={() => setHoveredHex(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSelectHexCell) onSelectHexCell(hex);
                  }}
                />
              );
            })}
          </g>
        )}

        {/* LAYER 7: Isochrone Catchment Polygons around Selected Site */}
        {showIsochrones && selectedSite && (
          <g className="isochrone-layer">
            {ISOCHRONE_DATA[isochroneMode].map((iso, i) => {
              const [cx, cy] = project(selectedSite.lat, selectedSite.lng);
              // Irregular isochrone radius simulated based on time
              const rx = iso.minutes * 4.2 * (isochroneMode === 'drive' ? 2.8 : 1.1);
              const ry = iso.minutes * 3.6 * (isochroneMode === 'drive' ? 2.4 : 0.95);

              return (
                <g key={i}>
                  <ellipse
                    cx={cx}
                    cy={cy}
                    rx={rx}
                    ry={ry}
                    fill={iso.color}
                    stroke={iso.strokeColor}
                    strokeWidth="1.5"
                    strokeDasharray="5 3"
                    className="animate-pulse"
                    style={{ animationDuration: `${3 + i}s` }}
                  />
                  <text
                    x={cx + rx - 20}
                    y={cy - 6}
                    fill="#ffffff"
                    fontSize="9"
                    fontWeight="bold"
                    opacity="0.9"
                    className="drop-shadow-sm"
                  >
                    {iso.label}
                  </text>
                </g>
              );
            })}
          </g>
        )}

        {/* LAYER 8: Competitor Markers */}
        {isLayerActive('competitors') && (
          <g opacity={getLayerOpacity('competitors')}>
            {competitors.slice(0, 45).map((comp) => {
              const [cx, cy] = project(comp.lat, comp.lng);
              return (
                <g key={comp.id} className="cursor-pointer group">
                  <circle cx={cx} cy={cy} r="3.5" fill="#f43f5e" stroke="#ffffff" strokeWidth="1" />
                  <circle cx={cx} cy={cy} r="6.5" fill="none" stroke="#f43f5e" strokeWidth="0.8" opacity="0.4" />
                </g>
              );
            })}
          </g>
        )}

        {/* LAYER 9: Candidate Sites Pins */}
        <g className="sites-layer">
          {sites.slice(0, 30).map((site) => {
            const [cx, cy] = project(site.lat, site.lng);
            const isSelected = selectedSite?.id === site.id;
            const isHovered = hoveredSite?.id === site.id;

            return (
              <g
                key={site.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectSite(site);
                }}
                onMouseEnter={() => setHoveredSite(site)}
                onMouseLeave={() => setHoveredSite(null)}
                className="cursor-pointer transition-transform duration-200"
              >
                {/* Active halo */}
                {isSelected && (
                  <>
                    <circle cx={cx} cy={cy} r="28" fill="url(#site-pulse)" className="animate-ping" style={{ animationDuration: '2.5s' }} />
                    <circle cx={cx} cy={cy} r="20" fill="rgba(99, 102, 241, 0.25)" stroke="#818cf8" strokeWidth="1.5" />
                  </>
                )}

                {/* Pin Head */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isSelected ? 8 : isHovered ? 7 : 5.5}
                  fill={isSelected ? '#6366f1' : '#4f46e5'}
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="shadow-md"
                />

                {/* Score badge next to selected or high-score pin */}
                {(isSelected || site.readinessScore >= 85) && (
                  <g transform={`translate(${cx + 8}, ${cy - 12})`}>
                    <rect
                      x="0"
                      y="0"
                      width="38"
                      height="18"
                      rx="9"
                      fill={isSelected ? '#4f46e5' : '#1e1b4b'}
                      stroke="#818cf8"
                      strokeWidth="1"
                    />
                    <text
                      x="19"
                      y="12"
                      fill="#ffffff"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {site.readinessScore}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>

        {/* Landmark Labels Map Mock */}
        <g className="map-labels pointer-events-none select-none">
          <text x="440" y="470" fill="#94a3b8" fontSize="11" fontWeight="bold" opacity="0.8">
            CENTRAL DIST
          </text>
          <text x="350" y="270" fill="#94a3b8" fontSize="11" fontWeight="bold" opacity="0.8">
            NORTH ZONE
          </text>
          <text x="590" y="240" fill="#94a3b8" fontSize="11" fontWeight="bold" opacity="0.8">
            EAST CORRIDOR
          </text>
          <text x="560" y="420" fill="#94a3b8" fontSize="11" fontWeight="bold" opacity="0.8">
            SOUTH HUB
          </text>
          <text x="210" y="310" fill="#94a3b8" fontSize="11" fontWeight="bold" opacity="0.8">
            INDUSTRIAL
          </text>
        </g>
      </svg>

      {/* Floating Header Badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 text-white text-xs shadow-md">
        <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
        <span className="font-semibold tracking-tight">{activeCity ? activeCity.name : 'Unknown City'} Base Map</span>
        <span className="text-[10px] text-slate-400 font-mono">EPSG:4326</span>
      </div>

      {/* Floating Map Layers Control Panel */}
      <div className="absolute top-4 right-4 z-10">
        <LayerControl
          layers={layers}
          onToggleLayer={onToggleLayer}
          onChangeOpacity={onChangeOpacity}
          activeLayerId={activeLayerId}
          setActiveLayerId={setActiveLayerId}
        />
      </div>

      {/* Floating Zoom & Map Action Controls */}
      <div className="absolute bottom-5 left-4 z-10 flex flex-col gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700/80 shadow-lg text-white">
        <button
          onClick={() => setZoom((prev) => Math.min(3.5, prev * 1.25))}
          className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-200 hover:text-white"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom((prev) => Math.max(0.7, prev / 1.25))}
          className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-200 hover:text-white"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleReset}
          className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-200 hover:text-white"
          title="Reset View"
        >
          <Compass className="w-4 h-4" />
        </button>
        <button
          onClick={centerCity}
          className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-200 hover:text-white"
          title="Center on City"
        >
          <Crosshair className="w-4 h-4" />
        </button>
        <button
          onClick={toggleFullscreen}
          className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-200 hover:text-white"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Opportunity Score Legend (Bottom Center) */}
      <div className="absolute bottom-5 left-24 right-48 sm:right-auto sm:left-24 z-10 bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-2xl border border-slate-700/80 text-white text-xs shadow-md flex items-center gap-4">
        <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
          Opportunity Score
        </span>
        <div className="flex items-center gap-3 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-xs" />
            <span className="text-slate-300">High (85-100)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-xs" />
            <span className="text-slate-300">Medium (60-84)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500 shadow-xs" />
            <span className="text-slate-300">Low (0-59)</span>
          </div>
        </div>
      </div>

      {/* Hex Cell Hover Tooltip */}
      {hoveredHex && (
        <div
          className="pointer-events-none absolute z-20 bg-slate-900/95 backdrop-blur-md text-white px-3.5 py-2.5 rounded-xl border border-indigo-500/40 shadow-xl text-xs space-y-1"
          style={{
            left: `${Math.min(tooltipPos.x + 15, (containerRef.current?.clientWidth || 600) - 180)}px`,
            top: `${Math.max(tooltipPos.y - 85, 20)}px`,
          }}
        >
          <div className="flex items-center justify-between gap-3 border-b border-slate-700/80 pb-1">
            <span className="font-bold text-indigo-300">Zone {hoveredHex.id.replace('h3-', '')}</span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                hoveredHex.readinessScore >= 85
                  ? 'bg-indigo-500/30 text-indigo-300'
                  : 'bg-sky-500/30 text-sky-300'
              }`}
            >
              Readiness: {hoveredHex.readinessScore}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[11px] pt-0.5 text-slate-300">
            <div>
              <span className="text-slate-400">Pop: </span>
              <span className="font-semibold text-white">{hoveredHex.population.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-slate-400">Competitors: </span>
              <span className="font-semibold text-white">{hoveredHex.competitors}</span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-400">Accessibility: </span>
              <span className="font-semibold text-emerald-400">{hoveredHex.accessibility}/100</span>
            </div>
          </div>
        </div>
      )}

      {/* Candidate Site Hover Tooltip */}
      {hoveredSite && !hoveredHex && (
        <div
          className="pointer-events-none absolute z-20 bg-slate-900/95 backdrop-blur-md text-white px-3.5 py-2.5 rounded-xl border border-purple-500/40 shadow-xl text-xs space-y-1"
          style={{
            left: `${Math.min(tooltipPos.x + 15, (containerRef.current?.clientWidth || 600) - 200)}px`,
            top: `${Math.max(tooltipPos.y - 75, 20)}px`,
          }}
        >
          <div className="font-bold text-white flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-indigo-400" />
            {hoveredSite.name}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-300">
            <span>Score: <strong className="text-indigo-300">{hoveredSite.readinessScore}/100</strong></span>
            <span>•</span>
            <span>{hoveredSite.businessType}</span>
          </div>
        </div>
      )}

      {/* Coordinates & Projection readout (Bottom Right) */}
      <div className="hidden lg:flex absolute bottom-4 right-4 z-10 items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-700/60 text-slate-400 text-[10px] font-mono shadow-sm">
        <span>{activeCity?.lat ?? 0}° N, {activeCity?.lng ?? 0}° E</span>
        <span>•</span>
        <span>Zoom: {(zoom * 10).toFixed(1)}x</span>
        <span>•</span>
        <span>Master Plan 2035</span>
      </div>
    </div>
  );
};
