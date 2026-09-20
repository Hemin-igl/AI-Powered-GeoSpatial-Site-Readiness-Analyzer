import React, { useState } from 'react';
import {
  MapPin,
  Sparkles,
  TrendingUp,
  Clock,
  ChevronDown,
  Building2,
  Users,
  Compass,
  ShieldAlert,
  ArrowUpRight,
  RefreshCw,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { CandidateSite, CompetitorPoint, H3CellData, MapLayerConfig } from '../types';
import { KpiCard } from '../components/KpiCard';
import { MapView } from '../components/MapView';

interface OverviewPageProps {
  sites: CandidateSite[];
  selectedSite: CandidateSite | null;
  onSelectSite: (site: CandidateSite) => void;
  competitors: CompetitorPoint[];
  h3Cells: H3CellData[];
  layers: MapLayerConfig[];
  onToggleLayer: (layerId: string) => void;
  onChangeOpacity: (layerId: string, opacity: number) => void;
  onNavigateTab: (tab: string) => void;
  onOpenNewSiteModal: () => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  sites,
  selectedSite,
  onSelectSite,
  competitors,
  h3Cells,
  layers,
  onToggleLayer,
  onChangeOpacity,
  onNavigateTab,
  onOpenNewSiteModal,
}) => {
  const [lastUpdated, setLastUpdated] = useState('2 min ago');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedMetro, setSelectedMetro] = useState('Surat Metropolitan Area');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastUpdated('Just now');
      setIsRefreshing(false);
    }, 600);
  };

  const activeSite = selectedSite || sites[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner / Location Selector & Timestamp */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Site Intelligence Dashboard
            </h1>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              <Sparkles className="w-3 h-3" />
              AI Grounded
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Analyze geographic opportunities and evaluate site readiness across municipal catchments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Location Selector */}
          <div className="relative">
            <select
              value={selectedMetro}
              onChange={(e) => setSelectedMetro(e.target.value)}
              className="appearance-none pl-9 pr-8 py-2 text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-xl border border-slate-200 cursor-pointer outline-hidden focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="Surat Metropolitan Area">Surat Metropolitan Area</option>
              <option value="Vesu & Dumas Corridor">Vesu & Dumas Corridor</option>
              <option value="Adajan & Rander Zone">Adajan & Rander Zone</option>
              <option value="Varachha Diamond Belt">Varachha Diamond Belt</option>
              <option value="Hazira Industrial Node">Hazira Industrial Node</option>
            </select>
            <MapPin className="w-4 h-4 text-indigo-600 absolute left-3 top-2.5 pointer-events-none" />
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
          </div>

          {/* Time indicator & refresh */}
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200/80 text-slate-500 text-xs font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline text-[11px] text-slate-400">Analysis updated:</span>
            <span className="font-semibold text-slate-700">{lastUpdated}</span>
            <button
              onClick={handleRefresh}
              className={`p-1 hover:text-indigo-600 rounded-md transition-transform ${
                isRefreshing ? 'animate-spin text-indigo-600' : ''
              }`}
              title="Refresh spatial data feed"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* 5 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard
          title="Sites Analyzed"
          value="128"
          change="+18.4%"
          isPositive={true}
          icon={Building2}
          iconBgColor="bg-indigo-50"
          iconColor="text-indigo-600"
          sparklineData={[80, 92, 104, 110, 118, 122, 128]}
          onClick={() => onNavigateTab('site-analysis')}
        />
        <KpiCard
          title="Average Readiness"
          value="76.8"
          subValue="/ 100"
          change="+6.2%"
          isPositive={true}
          icon={TrendingUp}
          iconBgColor="bg-purple-50"
          iconColor="text-purple-600"
          sparklineData={[68, 70, 71, 74, 73, 75, 76.8]}
          onClick={() => onNavigateTab('site-analysis')}
        />
        <KpiCard
          title="Opportunity Zones"
          value="24"
          change="+12.5%"
          isPositive={true}
          icon={Compass}
          iconBgColor="bg-sky-50"
          iconColor="text-sky-600"
          sparklineData={[14, 16, 17, 19, 21, 22, 24]}
          onClick={() => onNavigateTab('opportunity-map')}
        />
        <KpiCard
          title="Population Covered"
          value="2.64M"
          change="+8.6%"
          isPositive={true}
          icon={Users}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-600"
          sparklineData={[2.1, 2.2, 2.35, 2.45, 2.52, 2.58, 2.64]}
          onClick={() => onNavigateTab('demographics')}
        />
        <KpiCard
          title="High-Risk Areas"
          value="17"
          change="-4.2%"
          isPositive={false}
          icon={ShieldAlert}
          iconBgColor="bg-rose-50"
          iconColor="text-rose-600"
          sparklineData={[23, 22, 20, 19, 19, 18, 17]}
          onClick={() => onNavigateTab('risk-analysis')}
        />
      </div>

      {/* Main Centerpiece: Geographic Map View */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Compass className="w-4 h-4 text-indigo-600" />
              Surat GeoSpatial Readiness Heatmap
            </h2>
            <p className="text-xs text-slate-500">
              Interactive multi-criteria GIS canvas centered on Surat, Gujarat. Drag to pan, scroll to zoom, click hexagons or site pins.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200/70">
              DEMO DATA — For visualization and prototype purposes
            </span>
          </div>
        </div>

        {/* Map Canvas */}
        <MapView
          sites={sites}
          selectedSite={activeSite}
          onSelectSite={onSelectSite}
          competitors={competitors}
          h3Cells={h3Cells}
          layers={layers}
          onToggleLayer={onToggleLayer}
          onChangeOpacity={onChangeOpacity}
          showIsochrones={true}
          className="h-[520px]"
        />
      </div>

      {/* Two-Column Grid: Active Site Quick Inspector & Top Opportunity Candidates */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: Selected Site Quick Inspector */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                  Active Site
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {activeSite.name}
                </h3>
                <span className="text-xs text-slate-500">
                  {activeSite.area} • {activeSite.businessType}
                </span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-indigo-700">
                  {activeSite.readinessScore}
                </span>
                <span className="text-xs text-slate-400 block -mt-1">/ 100</span>
              </div>
            </div>

            {/* Quick Factors Bar */}
            <div className="space-y-3 py-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">Population Catchment</span>
                <span className="font-bold text-slate-900">{activeSite.factors.population}/100</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full"
                  style={{ width: `${activeSite.factors.population}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-600 font-medium">Road Accessibility</span>
                <span className="font-bold text-slate-900">{activeSite.factors.accessibility}/100</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-500 rounded-full"
                  style={{ width: `${activeSite.factors.accessibility}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-600 font-medium">Commercial Land Use</span>
                <span className="font-bold text-slate-900">{activeSite.factors.landUse}/100</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${activeSite.factors.landUse}%` }}
                />
              </div>
            </div>

            {/* AI Narrative Preview */}
            <div className="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100/60 text-xs text-slate-600 leading-relaxed">
              <div className="flex items-center gap-1.5 font-bold text-indigo-700 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Spatial Assessment</span>
              </div>
              <p className="line-clamp-3 text-[11px]">{activeSite.summary}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
            <button
              onClick={() => onNavigateTab('site-analysis')}
              className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
            >
              <span>Detailed Score Analysis</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigateTab('accessibility')}
              className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200/70 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
            >
              Isochrones
            </button>
          </div>
        </div>

        {/* Right 7 Cols: Top Opportunity Candidates Table */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Candidate Sites Ranking
                </h3>
                <p className="text-xs text-slate-400">
                  Sorted by multi-criteria spatial readiness algorithm
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('opportunity-map')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <span>View all ({sites.length})</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {sites.slice(0, 4).map((site, idx) => (
                <div
                  key={site.id}
                  onClick={() => onSelectSite(site)}
                  className="py-3 flex items-center justify-between hover:bg-slate-50/80 px-2 rounded-xl cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 truncate">
                        {site.name}
                      </h4>
                      <span className="text-[11px] text-slate-400">
                        {site.area} • {site.businessType}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right hidden sm:block">
                      <span className="text-xs font-semibold text-slate-700 block">
                        {(site.metrics.populationWithin5km / 1000).toFixed(0)}k Pop
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {site.metrics.competitorsWithin3km} Competitors
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                          site.readinessScore >= 85
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {site.readinessScore}
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Showing top potential sites in Surat</span>
            <button
              onClick={onOpenNewSiteModal}
              className="text-indigo-600 font-semibold hover:underline"
            >
              + Evaluate custom latitude/longitude
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
