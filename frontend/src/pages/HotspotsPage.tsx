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
import { CandidateSite, CompetitorPoint, H3CellData, City } from '../types';
import { MapView } from '../components/MapView';

interface HotspotsPageProps {
  activeCity: City;
  currentSite: CandidateSite;
  sites: CandidateSite[];
  competitors: CompetitorPoint[];
  h3Cells: H3CellData[];
  onSelectSite: (site: CandidateSite) => void;
}

export const HotspotsPage: React.FC<HotspotsPageProps> = ({
  activeCity,
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
      subtitle: 'Discrete Global Grid System (Resolution 8 - ~0.78 km² Hexagons)',
      description:
        `H3 divides the ${activeCity.name} Metropolitan Area into uniform, invariant hexagons. It minimizes shape distortion and computes composite suitability indices with seamless adjacent spatial tessellation.`,
      legend: [
        { label: 'Prime Hexagon (≥ 90)', color: '#4338ca' },
        { label: 'High Hexagon (80 - 89)', color: '#7c3aed' },
        { label: 'Growth Hexagon (70 - 79)', color: '#e11d48' },
        { label: 'Moderate Hexagon (60 - 69)', color: '#f59e0b' },
        { label: 'Fringe Hexagon (< 60)', color: '#fde047' },
      ],
      kpi1: '185 Hex Cells',
      kpi2: '38 Prime Cells',
      formula: 'Hex Area = 0.78 km²',
    },
    DBSCAN: {
      title: 'Density-Based Spatial Clustering of Applications with Noise (DBSCAN)',
      subtitle: 'Spatial Agglomeration & Noise Elimination (Eps = 1.2km, MinPts = 4)',
      description:
        'DBSCAN automatically isolates dense commercial agglomerations and clusters of arbitrary shapes while classifying non-clustered outer areas as spatial noise/outliers.',
      legend: [
        { label: 'Core Commercial Hub (>10,000 pts/km²)', color: '#dc2626' },
        { label: 'Tech & Expressway Corridor (5,001 - 10,000)', color: '#ea580c' },
        { label: 'Logistics & Industrial Belt (1,001 - 5,000)', color: '#f59e0b' },
        { label: 'Suburban Growth Node (100 - 1,000)', color: '#eab308' },
        { label: 'Spatial Noise / Outliers (< 100)', color: '#64748b' },
      ],
      kpi1: '4 Active Clusters',
      kpi2: '91% Clustered Pop',
      formula: 'Eps: 1.2 km | MinPts: 4',
    },
    'Getis-Ord Gi*': {
      title: 'Getis-Ord Gi* Local Spatial Statistics',
      subtitle: 'Statistical Significance of Spatial Clustering (z-score & p-value)',
      description:
        `Getis-Ord Gi* compares local sums of opportunity readiness against expected citywide values across ${activeCity.name}, identifying statistically significant Hot Spots (high surrounded by high) and Cold Spots.`,
      legend: [
        { label: 'Hot Spot - 99% Confidence (z ≥ +2.58)', color: '#b91c1c' },
        { label: 'Hot Spot - 95% Confidence (z ≥ +1.96)', color: '#ea580c' },
        { label: 'Hot Spot - 90% Confidence (z ≥ +1.65)', color: '#f59e0b' },
        { label: 'Not Significant (-1.65 < z < +1.65)', color: '#fef08a' },
        { label: 'Cold Spot - 90% Confidence (z ≤ -1.65)', color: '#38bdf8' },
        { label: 'Cold Spot - 95% Confidence (z ≤ -1.96)', color: '#0284c7' },
        { label: 'Cold Spot - 99% Confidence (z ≤ -2.58)', color: '#1e3a8a' },
      ],
      kpi1: '24 Hot Spots (99%)',
      kpi2: '16 Cold Spots',
      formula: 'Gi* = (∑wijxj - X̄∑wij) / S√...',
    },
  };

  const currentInfo = algorithmInfo[algorithm];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner & Algorithm Selector Tabs */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Hotspots & Spatial Clustering Algorithms
            </h1>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-800/60">
              Spatial Data Science
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Toggle between discrete global grids, density clustering, and local spatial autocorrelation statistics.
          </p>
        </div>

        {/* 3 Algorithm Tabs */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
          {(['H3 Grid', 'DBSCAN', 'Getis-Ord Gi*'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setAlgorithm(tab)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                algorithm === tab
                  ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
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
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {activeCity.name} Spatial Hotspot Shader: {algorithm}
              </h3>
            </div>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
              Projection: EPSG:4326
            </span>
          </div>

          <MapView
            sites={sites}
            selectedSite={currentSite}
            onSelectSite={onSelectSite}
            competitors={algorithm === 'DBSCAN' ? competitors : []}
            h3Cells={h3Cells}
            spatialAlgorithm={algorithm === 'H3 Grid' ? 'h3' : algorithm === 'DBSCAN' ? 'dbscan' : 'gi_star'}
            layers={[
              {
                id: 'h3_grid',
                name: 'H3 Grid',
                category: 'analysis',
                active: true,
                opacity: 0.85,
                featureCount: 185,
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
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md">
                Spatial Model
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-2">
                {currentInfo.title}
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 font-medium">
                {currentInfo.subtitle}
              </p>
            </div>

            {/* Metric Pills */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-semibold uppercase">Cluster Count</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{currentInfo.kpi1}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-semibold uppercase">Calibration</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{currentInfo.kpi2}</span>
              </div>
            </div>

            {/* Algorithm Spatial Legend */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Algorithm Legend
              </h4>
              <div className="space-y-2">
                {currentInfo.legend.map((item) => (
                  <div key={item.label} className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
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
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200 mb-1">
                <Info className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Detection Mechanism</span>
              </div>
              {currentInfo.description}
            </div>

            <div className="pt-2 text-[10px] font-mono text-slate-400 dark:text-slate-500 text-right">
              {currentInfo.formula}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
