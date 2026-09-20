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
import { CandidateSite } from '../types';
import { MapView } from '../components/MapView';
import { DEFAULT_MAP_LAYERS } from '../data/suratData';

interface RiskAnalysisPageProps {
  currentSite: CandidateSite;
  sites: CandidateSite[];
  onSelectSite: (site: CandidateSite) => void;
}

export const RiskAnalysisPage: React.FC<RiskAnalysisPageProps> = ({
  currentSite,
  sites,
  onSelectSite,
}) => {
  const [selectedRiskCategory, setSelectedRiskCategory] = useState<string>('all');

  const riskFactors = [
    {
      id: 'flood',
      title: 'Tapi River Flood Plains & Tidal Surge',
      severity: 'Medium',
      description:
        '100-year and 25-year flood inundation buffer zones around Tapi River embankments and Ukai Dam discharge corridors.',
      statusColor: 'text-amber-600 bg-amber-50 border-amber-200',
      affectedSites: 4,
      mitigation: 'Elevated plinth requirement (>4.5m MSL) and backflow prevention valves.',
    },
    {
      id: 'seismic',
      title: 'Seismic Zone III (Moderate Damage Risk)',
      severity: 'Low',
      description:
        'Surat metropolitan basin rests on alluvial strata classified as Zone III per IS 1893:2016 building design norms.',
      statusColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      affectedSites: 0,
      mitigation: 'Standard ductile detailing of reinforced concrete frames required.',
    },
    {
      id: 'industrial',
      title: 'Hazira & Pandesara Hazardous Chemical Buffers',
      severity: 'Medium',
      description:
        'Statutory 500m safety clearance buffer around petrochemical pipelines and bulk storage tanks.',
      statusColor: 'text-amber-600 bg-amber-50 border-amber-200',
      affectedSites: 2,
      mitigation: 'Strict compliance with Factory Inspectorate setback regulations.',
    },
    {
      id: 'crz',
      title: 'Coastal Regulation Zone (CRZ-II & CRZ-III)',
      severity: 'Low',
      description:
        '500m high-tide line constraints along Dumas and Suvali coastlines limiting high-density vertical development.',
      statusColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      affectedSites: 1,
      mitigation: 'Prior clearance from State Coastal Zone Management Authority (SCZMA).',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              Environmental & Hazard Risk Matrix
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Multi-hazard screening including hydrological flood risks, seismic zoning, chemical buffer setbacks, and coastal regulations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-semibold text-slate-700">Surat Disaster Cell Data: Active</span>
          </div>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-xs">
          <span className="text-xs font-semibold text-slate-400">Current Site Flood Risk</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className={`text-2xl font-bold ${
              currentSite.metrics.floodRiskLevel === 'Low'
                ? 'text-emerald-600'
                : currentSite.metrics.floodRiskLevel === 'Medium'
                ? 'text-amber-600'
                : 'text-rose-600'
            }`}>
              {currentSite.metrics.floodRiskLevel} Risk
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 truncate">{currentSite.name}</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-xs">
          <span className="text-xs font-semibold text-slate-400">Environmental Score</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-slate-900">
              {currentSite.factors.environmentalRisk}
            </span>
            <span className="text-xs text-slate-400 font-medium">/ 100</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Weighted risk-resilience factor</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-xs">
          <span className="text-xs font-semibold text-slate-400">High Risk Sites in Portfolio</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-rose-600">
              {sites.filter((s) => s.metrics.floodRiskLevel === 'High').length}
            </span>
            <span className="text-xs text-slate-400 font-medium">of {sites.length} total</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Requires architectural mitigation</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-xs">
          <span className="text-xs font-semibold text-slate-400">Tapi Buffer Distance</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-indigo-600">1.8 km</span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center">
              Safe buffer
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Outside statutory flood basin</p>
        </div>
      </div>

      {/* Main Grid: Hazard Map & Hazard Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: Spatial Risk Map */}
        <div className="lg:col-span-7 bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Spatial Risk Inundation & Buffer Map</h2>
              <p className="text-xs text-slate-500">
                Visualizing Tapi river trajectory, low-elevation catchment areas, and site risk flags.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                <Waves className="w-3 h-3" /> Tapi River Hydrology
              </span>
            </div>
          </div>

          <div className="h-[420px] rounded-2xl overflow-hidden border border-slate-100 bg-slate-50">
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
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900">Hazard Catalog & Policy Regulations</h2>
            <div className="space-y-3">
              {riskFactors.map((risk) => (
                <div
                  key={risk.id}
                  className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xs font-bold text-slate-800">{risk.title}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${risk.statusColor}`}>
                      {risk.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {risk.description}
                  </p>
                  <div className="pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Impacted Sites: <strong className="text-slate-700">{risk.affectedSites}</strong></span>
                    <span className="text-indigo-600 font-medium cursor-pointer hover:underline">View Guidelines</span>
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
