import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Waves,
  CheckCircle2,
  ExternalLink,
  Info,
  MapPin,
  ChevronRight,
  TrendingDown,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { CandidateSite, City } from '../types';
import { MapView } from '../components/MapView';
import { DEFAULT_MAP_LAYERS } from '../data/mockData';

interface RiskAnalysisPageProps {
  activeCity: City;
  currentSite: CandidateSite;
  sites: CandidateSite[];
  onSelectSite: (site: CandidateSite) => void;
}

export const RiskAnalysisPage: React.FC<RiskAnalysisPageProps> = ({
  activeCity,
  currentSite,
  sites,
  onSelectSite,
}) => {
  const [selectedRiskCategory, setSelectedRiskCategory] = useState<string>('all');

  const riskFactors = [
    {
      id: 'flood',
      title: 'Hydrological Flood Plains & Inundation Risk',
      severity: 'Medium',
      description:
        '100-year and 25-year flood inundation buffer zones around regional drainage basins and watercourse discharge corridors.',
      statusColor: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800/60',
      affectedSites: 0,
      mitigation: 'Elevated plinth requirement (>4.5m MSL) and backflow prevention valves.',
    },
    {
      id: 'seismic',
      title: 'Seismic Zone III (Moderate Damage Risk)',
      severity: 'Low',
      description:
        `The ${activeCity.name} metropolitan basin rests on alluvial strata classified as Zone III per IS 1893:2016 building design norms.`,
      statusColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800/60',
      affectedSites: 0,
      mitigation: 'Standard ductile detailing of reinforced concrete frames required.',
    },
    {
      id: 'industrial',
      title: 'Hazira & Pandesara Hazardous Chemical Buffers',
      severity: 'Medium',
      description:
        'Statutory 500m safety clearance buffer around petrochemical pipelines and bulk storage tanks.',
      statusColor: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800/60',
      affectedSites: 2,
      mitigation: 'Strict compliance with Factory Inspectorate setback regulations.',
    },
    {
      id: 'crz',
      title: 'Coastal Regulation Zone (CRZ-II & CRZ-III)',
      severity: 'Low',
      description:
        '500m high-tide line constraints along Dumas and Suvali coastlines limiting high-density vertical development.',
      statusColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800/60',
      affectedSites: 1,
      mitigation: 'Prior clearance from State Coastal Zone Management Authority (SCZMA).',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Environmental & Hazard Risk Matrix
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Multi-hazard screening including hydrological flood risks, seismic zoning, chemical buffer setbacks, and coastal regulations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{activeCity.name} Disaster Cell Data: Active</span>
          </div>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">Current Site Flood Risk</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className={`text-2xl font-bold ${
              currentSite.metrics.floodRiskLevel === 'Low'
                ? 'text-emerald-600 dark:text-emerald-400'
                : currentSite.metrics.floodRiskLevel === 'Medium'
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}>
              {currentSite.metrics.floodRiskLevel} Risk
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">{currentSite.name}</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">Environmental Score</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {currentSite.factors.environmentalRisk}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">/ 100</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Weighted risk-resilience factor</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">High Risk Sites in Portfolio</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-rose-600 dark:text-rose-400">
              {sites.filter((s) => s.metrics.floodRiskLevel === 'High').length}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">of {sites.length} total</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Requires architectural mitigation</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">Hydrological Buffer</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">1.8 km</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center">
              Safe buffer
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Outside statutory flood basin</p>
        </div>
      </div>

      {/* Main Grid: Hazard Map & Hazard Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: Spatial Risk Map */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Spatial Risk Inundation & Buffer Map</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Visualizing regional drainage trajectory, low-elevation catchment areas, and site risk flags.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
                <Waves className="w-3 h-3" /> Watercourse Hydrology
              </span>
            </div>
          </div>

          <div className="h-[420px] rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
            <MapView
              sites={sites}
              selectedSite={currentSite}
              onSelectSite={onSelectSite}
              layers={DEFAULT_MAP_LAYERS.map(l => l.id === 'risk_zones' ? { ...l, active: true } : l)}
            />
          </div>
        </div>

        {/* Right 5 cols: Hazard Categories */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Hazard Catalog & Policy Regulations</h2>
            <div className="space-y-3">
              {riskFactors.map((risk) => (
                <div
                  key={risk.id}
                  className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">{risk.title}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${risk.statusColor}`}>
                      {risk.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {risk.description}
                  </p>
                  <div className="pt-1.5 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 dark:text-slate-500">Impacted Sites: <strong className="text-slate-700 dark:text-slate-300">{risk.affectedSites}</strong></span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-medium cursor-pointer hover:underline">View Guidelines</span>
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
