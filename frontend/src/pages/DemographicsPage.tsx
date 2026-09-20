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
import { CandidateSite, DemographicData, City } from '../types';
import { MapView } from '../components/MapView';

interface DemographicsPageProps {
  activeCity: City;
  demographics: DemographicData;
  currentSite: CandidateSite;
  onSelectSite: (site: CandidateSite) => void;
}

export const DemographicsPage: React.FC<DemographicsPageProps> = ({
  activeCity,
  demographics,
  currentSite,
  onSelectSite,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              {activeCity.name} Census & Mobile Traces
            </h1>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/60">
              {activeCity.name} Census & Mobile Traces
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Demographic profile, age demographics, and purchasing power index around <strong className="text-slate-800 dark:text-slate-200">{currentSite.name}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Target Urban Corridor:</span>
          <span className="text-xs font-bold px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
            {currentSite.area} Ward
          </span>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider block">
            Population Density
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {demographics.averageDensityPerSqKm.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">/ km²</span>
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold block mt-2">
            High Density Urban Core
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider block">
            Population (5 km Catchment)
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-400">
              {(demographics.totalMetropolitanPopulation / 1000000).toFixed(2)}M
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">residents</span>
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium block mt-2">
            58,200 active households
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider block">
            Median Estimated Income
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
              ₹{demographics.medianMonthlyIncomeINR.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">/ month</span>
          </div>
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold block mt-2">
            Top 15% disposable bracket
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider block">
            Workforce Ratio
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              68.4%
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">active</span>
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold block mt-2">
            Prime earning demographic
          </span>
        </div>
      </div>

      {/* Age Distribution and Income Tiers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Age Distribution Horizontal Chart (6 Cols) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Age Demographic Breakdown
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Census age distribution within the primary 5 km buffer
              </p>
            </div>
            <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>

          <div className="space-y-3.5 py-2">
            {demographics.ageDistribution.map((item, idx) => (
              <div key={item.range || item.group || idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200 font-mono w-14">
                      {item.range || item.group}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">{item.label}</span>
                  </div>
                  <span className="font-bold text-indigo-700 dark:text-indigo-400 font-mono text-xs">
                    {item.percentage}%
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage * 2.8}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-100/60 dark:border-indigo-900/50 text-xs text-slate-600 dark:text-slate-300">
            <strong className="text-indigo-900 dark:text-indigo-300">Key Takeaway: </strong>
            Over 55% of the catchment is between 18 and 34 years old, offering exceptional footfall elasticity for retail, lifestyle dining, and fast charging infrastructure.
          </div>
        </div>

        {/* Income Distribution (6 Cols) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Household Income Brackets
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Monthly income stratification across {activeCity.name} households
              </p>
            </div>
            <Banknote className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>

          <div className="space-y-3.5 py-2">
            {demographics.incomeBrackets.map((item, idx) => (
              <div key={item.tier || item.bracket || idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{item.tier || item.bracket}</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">
                    {item.share ?? item.count}%
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(item.share ?? item.count ?? 0) * 2.6}%`,
                      backgroundColor: item.color || '#6366f1',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
            <strong className="text-slate-900 dark:text-slate-100">High Affluence Pocket: </strong>
            48% of households earn above ₹60,000/month, positioning this corridor for high average transaction values (ATV).
          </div>
        </div>
      </div>

      {/* Population Density Heatmap Overlay */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {activeCity.name} Population Density Heatmap Grid
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Aggregated residential & commuter density layers
            </p>
          </div>
          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-xl">
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
