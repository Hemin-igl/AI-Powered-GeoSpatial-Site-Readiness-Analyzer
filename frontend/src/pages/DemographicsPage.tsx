import React from 'react';
import {
  Users,
  TrendingUp,
  Banknote,
  PieChart as PieChartIcon,
  Layers,
  MapPin,
  Building2,
} from 'lucide-react';
import { CandidateSite } from '../types';
import { SURAT_DEMOGRAPHICS } from '../data/suratData';
import { MapView } from '../components/MapView';

interface DemographicsPageProps {
  currentSite: CandidateSite;
  onSelectSite: (site: CandidateSite) => void;
}

export const DemographicsPage: React.FC<DemographicsPageProps> = ({
  currentSite,
  onSelectSite,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Demographics & Population Density
            </h1>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              Surat Census & Mobile Traces
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Demographic profile, age demographics, and purchasing power index around <strong className="text-slate-800">{currentSite.name}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Target Urban Corridor:</span>
          <span className="text-xs font-bold px-3 py-1 rounded-xl bg-slate-100 text-slate-800">
            {currentSite.area} Ward
          </span>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
            Population Density
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-extrabold text-slate-900">
              12,480
            </span>
            <span className="text-xs text-slate-400">/ km²</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold block mt-2">
            High Density Urban Core
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
            Population (5 km Catchment)
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-extrabold text-indigo-600">
              186,400
            </span>
            <span className="text-xs text-slate-400">residents</span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium block mt-2">
            58,200 active households
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
            Median Estimated Income
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-extrabold text-slate-900">
              ₹68,500
            </span>
            <span className="text-xs text-slate-400">/ month</span>
          </div>
          <span className="text-[11px] text-indigo-600 font-semibold block mt-2">
            Top 15% disposable bracket
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
            Workforce Ratio
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-extrabold text-slate-900">
              68.4%
            </span>
            <span className="text-xs text-slate-400">active</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold block mt-2">
            Prime earning demographic
          </span>
        </div>
      </div>

      {/* Age Distribution and Income Tiers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Age Distribution Horizontal Chart (6 Cols) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Age Demographic Breakdown
              </h3>
              <p className="text-xs text-slate-400">
                Census age distribution within the primary 5 km buffer
              </p>
            </div>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>

          <div className="space-y-3.5 py-2">
            {SURAT_DEMOGRAPHICS.ageDistribution.map((item) => (
              <div key={item.range} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 font-mono w-14">
                      {item.range}
                    </span>
                    <span className="text-[11px] text-slate-500">{item.label}</span>
                  </div>
                  <span className="font-bold text-indigo-700 font-mono text-xs">
                    {item.percentage}%
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage * 2.8}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100/60 text-xs text-slate-600">
            <strong className="text-indigo-900">Key Takeaway: </strong>
            Over 55% of the catchment is between 18 and 34 years old, offering exceptional footfall elasticity for retail, lifestyle dining, and fast charging infrastructure.
          </div>
        </div>

        {/* Income Distribution (6 Cols) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Household Income Brackets
              </h3>
              <p className="text-xs text-slate-400">
                Monthly income stratification across Surat households
              </p>
            </div>
            <Banknote className="w-4 h-4 text-emerald-600" />
          </div>

          <div className="space-y-3.5 py-2">
            {SURAT_DEMOGRAPHICS.incomeBrackets.map((item) => (
              <div key={item.tier} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{item.tier}</span>
                  <span className="font-bold text-slate-900 font-mono">
                    {item.share}%
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.share * 2.6}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
            <strong className="text-slate-900">High Affluence Pocket: </strong>
            48% of households earn above ₹60,000/month, positioning this corridor for high average transaction values (ATV).
          </div>
        </div>
      </div>

      {/* Population Density Heatmap Overlay */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Surat Population Density Heatmap Grid
            </h3>
            <p className="text-xs text-slate-400">
              Aggregated residential & commuter density layers
            </p>
          </div>
          <span className="text-xs text-indigo-600 font-semibold bg-indigo-50 px-3 py-1 rounded-xl">
            Heatmap Layer Active
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
              id: 'pop_density',
              name: 'Population Density',
              category: 'core',
              active: true,
              opacity: 0.9,
              featureCount: 1420,
              lastUpdated: 'Live',
              color: '#6366f1',
              description: 'Density',
            },
          ]}
          onToggleLayer={() => {}}
          onChangeOpacity={() => {}}
          className="h-[400px]"
        />
      </div>
    </div>
  );
};
