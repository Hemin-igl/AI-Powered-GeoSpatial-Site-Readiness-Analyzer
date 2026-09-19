import React, { useState } from 'react';
import {
  Navigation,
  Car,
  Footprints,
  Users,
  MapPin,
  Clock,
  Milestone,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { CandidateSite } from '../types';
import { ISOCHRONE_DATA } from '../data/suratData';
import { MapView } from '../components/MapView';

interface AccessibilityPageProps {
  currentSite: CandidateSite;
  sites: CandidateSite[];
  onSelectSite: (site: CandidateSite) => void;
}

export const AccessibilityPage: React.FC<AccessibilityPageProps> = ({
  currentSite,
  sites,
  onSelectSite,
}) => {
  const [mode, setMode] = useState<'drive' | 'walk'>('drive');

  const catchment = ISOCHRONE_DATA[mode];

  // Dynamic statistics based on travel mode
  const metrics =
    mode === 'drive'
      ? {
          pop10: 18400,
          pop20: 64200,
          pop30: 142700,
          roadScore: 87,
          nearestHighway: '1.4 km',
          nearestMajorRoad: '420 m',
          avgTravelSpeed: '32 km/h',
        }
      : {
          pop10: 4200,
          pop20: 11800,
          pop30: 26500,
          roadScore: 78,
          nearestHighway: '1.4 km (Pedestrian overpass)',
          nearestMajorRoad: '50 m (Direct crosswalk)',
          avgTravelSpeed: '4.8 km/h',
        };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner with Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Accessibility & Isochrone Catchment
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-100">
              Multi-Modal Travel Time
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Reachable demographic catchment for <strong className="text-slate-800">{currentSite.name}</strong> across 10, 20, and 30-minute zones.
          </p>
        </div>

        {/* Drive vs Walk Toggle */}
        <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80">
          <button
            onClick={() => setMode('drive')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              mode === 'drive'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>Drive (Vehicular)</span>
          </button>
          <button
            onClick={() => setMode('walk')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              mode === 'walk'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Footprints className="w-4 h-4" />
            <span>Walk (Pedestrian)</span>
          </button>
        </div>
      </div>

      {/* Top 3 Isochrone Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {catchment.map((iso, idx) => (
          <div
            key={iso.minutes}
            className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-full text-white"
                style={{ backgroundColor: iso.strokeColor }}
              >
                {iso.minutes} Minutes {mode === 'drive' ? 'Drive' : 'Walk'}
              </span>
              <Clock className="w-4 h-4 text-slate-400" />
            </div>

            <div className="my-4">
              <span className="text-xs text-slate-400 block font-medium">Reachable Population</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {iso.reachablePopulation.toLocaleString()}
                </span>
                <span className="text-xs text-slate-400 font-semibold">residents</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-50 flex items-center justify-between text-xs text-slate-500">
              <span>Catchment Area:</span>
              <span className="font-mono font-bold text-slate-700">{iso.areaSqKm} km²</span>
            </div>
          </div>
        ))}
      </div>

      {/* Map with Isochrone Polygons & Road Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map (8 Cols) */}
        <div className="lg:col-span-8 bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Interactive Catchment Visualizer ({mode.toUpperCase()})
            </h3>
            <span className="text-xs text-slate-400">
              Center: {currentSite.lat.toFixed(4)}, {currentSite.lng.toFixed(4)}
            </span>
          </div>

          <MapView
            sites={[currentSite]}
            selectedSite={currentSite}
            onSelectSite={onSelectSite}
            competitors={[]}
            h3Cells={[]}
            layers={[
              {
                id: 'road_access',
                name: 'Road Accessibility',
                category: 'core',
                active: true,
                opacity: 0.9,
                featureCount: 864,
                lastUpdated: 'Live',
                color: '#0ea5e9',
                description: 'Roads',
              },
            ]}
            onToggleLayer={() => {}}
            onChangeOpacity={() => {}}
            showIsochrones={true}
            isochroneMode={mode}
            className="h-[460px]"
          />
        </div>

        {/* Road & Transit Infrastructure Metrics (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-xs">
              Transit & Road Network Metrics
            </h3>

            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-400 block font-medium">
                  Average Road Accessibility Score
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-2xl font-black text-indigo-700">
                    {metrics.roadScore}
                  </span>
                  <span className="text-xs text-slate-400">/ 100</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${metrics.roadScore}%` }} />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-400 block font-medium">Nearest Highway</span>
                <span className="text-base font-bold text-slate-800">{metrics.nearestHighway}</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-400 block font-medium">Nearest Major Road</span>
                <span className="text-base font-bold text-slate-800">{metrics.nearestMajorRoad}</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-400 block font-medium">Calculated Peak Velocity</span>
                <span className="text-base font-bold text-slate-800">{metrics.avgTravelSpeed}</span>
              </div>
            </div>
          </div>

          <div className="bg-indigo-50/60 p-5 rounded-3xl border border-indigo-100 text-xs text-slate-600 leading-relaxed">
            <span className="font-bold text-indigo-800 block mb-1">Catchment Analysis Summary</span>
            {mode === 'drive'
              ? 'Vehicular throughput benefits from dual multi-lane arterial feeders. Over 64,200 prospective customers are within easy 20-minute commuter reach.'
              : 'Pedestrian access is reinforced by well-lit paved footpaths and traffic signals at the nearby arterial crossing.'}
          </div>
        </div>
      </div>
    </div>
  );
};
