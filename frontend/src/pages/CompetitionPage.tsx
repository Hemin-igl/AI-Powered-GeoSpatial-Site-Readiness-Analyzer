import React, { useState } from 'react';
import {
  Crosshair,
  ShieldAlert,
  Info,
  TrendingDown,
  Building,
  Store,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { CandidateSite, CompetitorPoint, City } from '../types';
import { DISTANCE_DECAY_DATA } from '../data/mockData';
import { MapView } from '../components/MapView';

interface CompetitionPageProps {
  activeCity: City;
  currentSite: CandidateSite;
  competitors: CompetitorPoint[];
  onSelectSite: (site: CandidateSite) => void;
}

export const CompetitionPage: React.FC<CompetitionPageProps> = ({
  activeCity,
  currentSite,
  competitors,
  onSelectSite,
}) => {
  const [radiusKm, setRadiusKm] = useState(3);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Competition Analysis & Distance Decay
            </h1>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-100 dark:border-rose-800/60">
              Spatial Density Index
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Analyzing spatial competitor distribution and cannibalization risk around <strong className="text-slate-800 dark:text-slate-200">{currentSite.name}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Overall Competition Density:</span>
          <span className="text-xs font-bold px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
            Medium Density
          </span>
        </div>
      </div>

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider block">
            Within 1 km
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-extrabold text-rose-600 dark:text-rose-400">
              {currentSite.metrics.competitorsWithin1km}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">competitors</span>
          </div>
          <span className="text-[11px] text-rose-600 dark:text-rose-400 font-medium block mt-2">
            Severe proximity impact
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider block">
            Within 3 km
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
              {currentSite.metrics.competitorsWithin3km}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">competitors</span>
          </div>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium block mt-2">
            Moderate market competition
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider block">
            Within 5 km
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
              {currentSite.metrics.competitorsWithin5km}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">competitors</span>
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium block mt-2">
            Broader catchment buffer
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider block">
            Isolation Score
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
              {currentSite.factors.competition}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">/ 100</span>
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium block mt-2">
            Above municipal average
          </span>
        </div>
      </div>

      {/* Map & Distance Decay Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Competitor Map (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-rose-500 dark:text-rose-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Competitor Spatial Scatter ({activeCity.name})
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="text-slate-500 dark:text-slate-400">Competitor Pin</span>
            </div>
          </div>

          <MapView
            sites={[currentSite]}
            selectedSite={currentSite}
            onSelectSite={onSelectSite}
            competitors={competitors}
            h3Cells={[]}
            layers={[
              {
                id: 'competitors',
                name: 'Competitors',
                category: 'analysis',
                active: true,
                opacity: 0.95,
                featureCount: competitors.length,
                lastUpdated: 'Live',
                color: '#f43f5e',
                description: 'Competitors',
              },
            ]}
            onToggleLayer={() => {}}
            onChangeOpacity={() => {}}
            className="h-[460px]"
          />
        </div>

        {/* Distance Decay Curve Chart (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Spatial Distance-Decay Model
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                Impact score decreases exponentially as geographic distance increases
              </p>
            </div>

            {/* Distance-Decay Bars */}
            <div className="space-y-3 py-2">
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Showing competition within {radiusKm}km of selected site</span>
              </div>
              {DISTANCE_DECAY_DATA.map((item) => (
                <div key={item.distance} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{item.distance}</span>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-slate-400 dark:text-slate-500">{item.competitors} sites</span>
                      <span className="font-bold text-rose-600 dark:text-rose-400">{item.impact}% impact</span>
                    </div>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full transition-all"
                      style={{ width: `${item.impact}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Spatial Decay Explanation */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed flex gap-2.5 items-start">
              <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                  Gravity Model Calibration
                </span>
                Nearby competitors have greater influence on the site score than distant competitors. The exponential decay formula penalizes rivals within 1 km heavily while tapering off beyond 3 km.
              </div>
            </div>
          </div>

          {/* Nearest Registered Competitors List */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{currentSite.name}</h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">{currentSite.area}, {activeCity.name}</span>
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Nearest Flagged Competitors
            </h4>
            <div className="space-y-2">
              {competitors.slice(0, 3).map((comp) => (
                <div
                  key={comp.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs"
                >
                  <div className="min-w-0">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block truncate">{comp.name}</span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">{comp.brand}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">{comp.distanceKm} km</span>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">{comp.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
