import React, { useState, useMemo } from 'react';
import {
  Compass,
  Filter,
  ArrowUpRight,
  Sliders,
  CheckCircle2,
  Users,
  ShieldAlert,
  Building2,
  RotateCcw,
} from 'lucide-react';
import { BusinessType, CandidateSite, OpportunityZone } from '../types';
import { OPPORTUNITY_ZONES } from '../data/suratData';
import { MapView } from '../components/MapView';

interface OpportunityMapPageProps {
  sites: CandidateSite[];
  selectedSite: CandidateSite | null;
  onSelectSite: (site: CandidateSite) => void;
  onNavigateTab: (tab: string) => void;
}

export const OpportunityMapPage: React.FC<OpportunityMapPageProps> = ({
  sites,
  selectedSite,
  onSelectSite,
  onNavigateTab,
}) => {
  // Filters
  const [minScore, setMinScore] = useState<number>(70);
  const [selectedArchetype, setSelectedArchetype] = useState<string>('All');
  const [popFilter, setPopFilter] = useState<string>('All');
  const [compFilter, setCompFilter] = useState<string>('All');

  // Filtered zones
  const filteredZones = useMemo(() => {
    return OPPORTUNITY_ZONES.filter((z) => {
      if (z.readinessScore < minScore) return false;
      if (selectedArchetype !== 'All' && z.recommendedArchetype !== selectedArchetype)
        return false;
      if (popFilter !== 'All' && z.populationDensityTier !== popFilter) return false;
      if (compFilter !== 'All' && z.competitionTier !== compFilter) return false;
      return true;
    });
  }, [minScore, selectedArchetype, popFilter, compFilter]);

  const activeZone =
    filteredZones.find((z) => z.siteId === selectedSite?.id) || filteredZones[0];

  const handleZoneClick = (zone: OpportunityZone) => {
    const site = sites.find((s) => s.id === zone.siteId);
    if (site) {
      onSelectSite(site);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Surat Opportunity Zones & Candidate Ranking
            </h1>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
              {filteredZones.length} Prime Zones Qualified
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Discover and filter high-potential greenfield and brownfield site clusters matching target criteria.
          </p>
        </div>

        <button
          onClick={() => {
            setMinScore(70);
            setSelectedArchetype('All');
            setPopFilter('All');
            setCompFilter('All');
          }}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs">
        <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-800 uppercase tracking-wider">
          <Filter className="w-3.5 h-3.5 text-indigo-600" />
          <span>Opportunity Discovery Filters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Min Score Slider */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600">Min Readiness Score</span>
              <span className="font-mono font-bold text-indigo-700">{minScore} / 100</span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              value={minScore}
              onChange={(e) => setMinScore(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

          {/* Archetype Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Business Archetype
            </label>
            <select
              value={selectedArchetype}
              onChange={(e) => setSelectedArchetype(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:bg-white focus:border-indigo-500 outline-hidden"
            >
              <option value="All">All Archetypes</option>
              <option value="Retail Store">Retail Store</option>
              <option value="Warehouse">Warehouse</option>
              <option value="EV Charging Station">EV Charging Station</option>
              <option value="Telecom Tower">Telecom Tower</option>
              <option value="Renewable Energy">Renewable Energy</option>
            </select>
          </div>

          {/* Population Density */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Population Density Tier
            </label>
            <select
              value={popFilter}
              onChange={(e) => setPopFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:bg-white focus:border-indigo-500 outline-hidden"
            >
              <option value="All">All Density Tiers</option>
              <option value="High">High Density (&gt;10k/km²)</option>
              <option value="Medium">Medium Density (5-10k/km²)</option>
              <option value="Low">Low Density (&lt;5k/km²)</option>
            </select>
          </div>

          {/* Competition */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Competition Saturation
            </label>
            <select
              value={compFilter}
              onChange={(e) => setCompFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:bg-white focus:border-indigo-500 outline-hidden"
            >
              <option value="All">All Saturation Levels</option>
              <option value="Low">Low (Minimal Rivals)</option>
              <option value="Medium">Medium (Balanced)</option>
              <option value="High">High (Clustered)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Map & Candidate Ranking Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map Visualizer (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Spatial Distribution of Filtered Candidates
            </h3>
            <span className="text-xs text-indigo-600 font-semibold bg-indigo-50 px-2.5 py-1 rounded-xl">
              {filteredZones.length} Zones on Canvas
            </span>
          </div>

          <MapView
            sites={sites}
            selectedSite={selectedSite}
            onSelectSite={onSelectSite}
            competitors={[]}
            h3Cells={[]}
            layers={[
              {
                id: 'opportunity',
                name: 'Opportunity Zones',
                category: 'analysis',
                active: true,
                opacity: 0.9,
                featureCount: filteredZones.length,
                lastUpdated: 'Live',
                color: '#6366f1',
                description: 'Opportunities',
              },
            ]}
            onToggleLayer={() => {}}
            onChangeOpacity={() => {}}
            className="h-[520px]"
          />
        </div>

        {/* Candidate Zones List (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          {filteredZones.map((zone, idx) => {
            const isSelected = zone.id === activeZone?.id;
            return (
              <div
                key={zone.id}
                onClick={() => handleZoneClick(zone)}
                className={`p-4 rounded-3xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-50/70 border-indigo-200 shadow-xs ring-1 ring-indigo-500/20'
                    : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-white px-2 py-0.5 rounded-md border border-indigo-100 shadow-2xs">
                      {zone.recommendedArchetype}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">
                      {zone.name}
                    </h4>
                    <span className="text-xs text-slate-500">
                      Surat • Pop Density: {zone.populationDensityTier}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-2xl font-black text-indigo-700">
                      {zone.readinessScore}
                    </span>
                    <span className="text-xs text-slate-400 block -mt-1">/ 100</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500">
                      <strong className="text-slate-700 font-mono">{zone.estimatedFootfallDaily.toLocaleString()}</strong>/day footfall
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500">
                      Comp: <strong className="text-slate-700">{zone.competitionTier}</strong>
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleZoneClick(zone);
                      onNavigateTab('site-analysis');
                    }}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <span>Analyze</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}

          {filteredZones.length === 0 && (
            <div className="p-8 text-center bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400 text-xs">
              No zones match this exact filter combination. Try lowering the minimum readiness score threshold.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
