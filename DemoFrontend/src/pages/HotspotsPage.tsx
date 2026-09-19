import React, { useState } from 'react';
import {
  Flame,
  Grid,
  Activity,
  Sparkles,
  Info,
  Layers,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { CandidateSite, CompetitorPoint, H3CellData } from '../types';
import { MapView } from '../components/MapView';

interface HotspotsPageProps {
  currentSite: CandidateSite;
  sites: CandidateSite[];
  competitors: CompetitorPoint[];
  h3Cells: H3CellData[];
  onSelectSite: (site: CandidateSite) => void;
}

export const HotspotsPage: React.FC<HotspotsPageProps> = ({
  currentSite,
  sites,
  competitors,
  h3Cells,
  onSelectSite,
}) => {
  const [algorithm, setAlgorithm] = useState<'H3 Grid' | 'DBSCAN' | 'Getis-Ord Gi*'>('H3 Grid');

  // Explanations for the 3 spatial algorithms
  const algorithmInfo = {
    'H3 Grid': {
      title: 'Uber H3 Spatial Hexagonal Tessellation',
      subtitle: 'Discrete Global Grid System (Resolution 8)',
      description:
        'H3 divides the Surat Metropolitan Area into uniform hexagons of equal area (~0.7 km² each). It minimizes shape distortion and calculates readiness scores using multi-factor linear indexing without edge boundary anomalies.',
      legend: [
        { label: 'High Opportunity (85-100)', color: '#6366f1' },
        { label: 'Medium Opportunity (60-84)', color: '#38bdf8' },
        { label: 'Low Opportunity (0-59)', color: '#94a3b8' },
      ],
      kpi1: '132 Hex Cells',
      kpi2: '24 Prime Cells',
      formula: 'Hex Area = 0.73 km²',
    },
    DBSCAN: {
      title: 'Density-Based Spatial Clustering (DBSCAN)',
      subtitle: 'Spatial Agglomeration & Noise Elimination (Eps = 1.2km, MinPts = 4)',
      description:
        'DBSCAN discovers clusters of arbitrary shapes by identifying core points with dense competitor and footfall neighbors. It separates saturated commercial agglomerations from spatial noise and isolated candidate nodes.',
      legend: [
        { label: 'Core Cluster 1 (Vesu-Athwa Retail Hub)', color: '#a855f7' },
        { label: 'Core Cluster 2 (Varachha Diamond Zone)', color: '#6366f1' },
        { label: 'Cluster 3 (Adajan Transit Belt)', color: '#38bdf8' },
        { label: 'Isolated Noise Points', color: '#64748b' },
      ],
      kpi1: '3 Core Clusters',
      kpi2: '84% In Clusters',
      formula: 'Eps: 1.2 km | MinPts: 4',
    },
    'Getis-Ord Gi*': {
      title: 'Getis-Ord Gi* Local Spatial Statistics',
      subtitle: 'Statistical Significance of Spatial Clustering (z-score & p-value)',
      description:
        'Getis-Ord Gi* compares local sums of opportunity readiness against expected values across Surat. It statistically isolates spatial Hotspots (high values surrounded by high values, 99% confidence), Coldspots, and random neutral distributions.',
      legend: [
        { label: 'Statistical Hotspot (99% Confidence)', color: '#ec4899' },
        { label: 'Statistical Hotspot (95% Confidence)', color: '#f43f5e' },
        { label: 'Neutral Distribution (Not Significant)', color: '#64748b' },
        { label: 'Statistical Coldspot (Low Potential Cluster)', color: '#0ea5e9' },
      ],
      kpi1: '18 Hotspots (99%)',
      kpi2: '12 Coldspots',
      formula: 'Gi* = (∑wijxj - X̄∑wij) / S√...',
    },
  };

  const currentInfo = algorithmInfo[algorithm];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner & Algorithm Selector Tabs */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Hotspots & Spatial Clustering Algorithms
            </h1>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
              Spatial Data Science
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Toggle between discrete global grids, density clustering, and local spatial autocorrelation statistics.
          </p>
        </div>

        {/* 3 Algorithm Tabs */}
        <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80">
          {(['H3 Grid', 'DBSCAN', 'Getis-Ord Gi*'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setAlgorithm(tab)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                algorithm === tab
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Map View & Algorithm Analysis Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map Canvas (8 Cols) */}
        <div className="lg:col-span-8 bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-purple-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Surat Spatial Hotspot Shader: {algorithm}
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Projection: EPSG:4326
            </span>
          </div>

          <MapView
            sites={sites}
            selectedSite={currentSite}
            onSelectSite={onSelectSite}
            competitors={algorithm === 'DBSCAN' ? competitors : []}
            h3Cells={h3Cells}
            layers={[
              {
                id: 'h3_grid',
                name: 'H3 Grid',
                category: 'analysis',
                active: true,
                opacity: 0.85,
                featureCount: 132,
                lastUpdated: 'Live',
                color: '#8b5cf6',
                description: 'Hex Grid',
              },
            ]}
            onToggleLayer={() => {}}
            onChangeOpacity={() => {}}
            className="h-[520px]"
          />
        </div>

        {/* Algorithm Specs & Legend Card (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                Spatial Model
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-2">
                {currentInfo.title}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">
                {currentInfo.subtitle}
              </p>
            </div>

            {/* Metric Pills */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Cluster Count</span>
                <span className="text-sm font-bold text-slate-800">{currentInfo.kpi1}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Calibration</span>
                <span className="text-xs font-bold text-slate-800 truncate">{currentInfo.kpi2}</span>
              </div>
            </div>

            {/* Algorithm Spatial Legend */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Algorithm Legend
              </h4>
              <div className="space-y-2">
                {currentInfo.legend.map((item) => (
                  <div key={item.label} className="flex items-center gap-2.5 text-xs text-slate-700">
                    <span
                      className="w-3.5 h-3.5 rounded-md shrink-0 shadow-xs"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Algorithm Description */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 leading-relaxed">
              <div className="flex items-center gap-1.5 font-semibold text-slate-800 mb-1">
                <Info className="w-3.5 h-3.5 text-indigo-600" />
                <span>Detection Mechanism</span>
              </div>
              {currentInfo.description}
            </div>

            <div className="pt-2 text-[10px] font-mono text-slate-400 text-right">
              {currentInfo.formula}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
