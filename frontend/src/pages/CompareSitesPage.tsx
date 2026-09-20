import React, { useState } from 'react';
import {
  GitCompare,
  Trophy,
  Sparkles,
  CheckCircle2,
  X,
  Plus,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { CandidateSite, City } from '../types';

interface CompareSitesPageProps {
  activeCity: City;
  sites: CandidateSite[];
  comparisonSiteIds: string[];
  onToggleSiteComparison?: (site: CandidateSite) => void;
  onToggleCompare?: (site: CandidateSite) => void;
  onSelectSite: (site: CandidateSite) => void;
  onNavigateTab: (tab: string) => void;
}

export const CompareSitesPage: React.FC<CompareSitesPageProps> = ({
  activeCity,
  sites,
  comparisonSiteIds,
  onToggleSiteComparison,
  onToggleCompare,
  onSelectSite,
  onNavigateTab,
}) => {
  const toggleFn = onToggleSiteComparison || onToggleCompare || (() => {});
  // Candidate sites currently selected for comparison (default first 2 if none selected)
  const compareSites =
    comparisonSiteIds.length >= 2
      ? sites.filter((s) => comparisonSiteIds.includes(s.id)).slice(0, 3)
      : sites.slice(0, 2);

  // Colors for up to 3 candidate sites
  const siteColors = [
    { stroke: '#6366f1', fill: '#6366f1', name: 'Site 1 (Indigo)' },
    { stroke: '#0ea5e9', fill: '#0ea5e9', name: 'Site 2 (Sky)' },
    { stroke: '#10b981', fill: '#10b981', name: 'Site 3 (Emerald)' },
  ];

  // Prepare radar chart data
  const radarData = [
    {
      factor: 'Population',
      ...compareSites.reduce(
        (acc, s, idx) => ({ ...acc, [s.name]: s.factors.population }),
        {}
      ),
    },
    {
      factor: 'Accessibility',
      ...compareSites.reduce(
        (acc, s, idx) => ({ ...acc, [s.name]: s.factors.accessibility }),
        {}
      ),
    },
    {
      factor: 'Competition',
      ...compareSites.reduce(
        (acc, s, idx) => ({ ...acc, [s.name]: s.factors.competition }),
        {}
      ),
    },
    {
      factor: 'Land Use',
      ...compareSites.reduce(
        (acc, s, idx) => ({ ...acc, [s.name]: s.factors.landUse }),
        {}
      ),
    },
    {
      factor: 'Env Risk Safety',
      ...compareSites.reduce(
        (acc, s, idx) => ({ ...acc, [s.name]: s.factors.environmentalRisk }),
        {}
      ),
    },
  ];

  // Determine winners
  const highestReadiness = Math.max(...compareSites.map((s) => s.readinessScore));
  const highestPopulation = Math.max(...compareSites.map((s) => s.metrics.populationWithin5km));
  const lowestCompetitors = Math.min(...compareSites.map((s) => s.metrics.competitorsWithin3km));
  const closestHighway = Math.min(...compareSites.map((s) => s.metrics.nearestHighwayKm));
  const highestIncome = Math.max(...compareSites.map((s) => s.metrics.medianIncomeMonthly));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Multi-Site Spatial Comparison Matrix
            </h1>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-800/60">
              Side-by-Side Spatial Benchmarking
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Compare up to 3 shortlisted candidates in {activeCity.name} across multi-criteria factors and catchment attributes.
          </p>
        </div>

        {/* Site picker pills */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Selected:</span>
          {compareSites.map((s, idx) => (
            <span
              key={s.id}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: siteColors[idx].stroke }}
              />
              <span className="truncate max-w-[120px]">{s.name}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Top Score Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {compareSites.map((site, idx) => {
          const isWinner = site.readinessScore === highestReadiness;
          return (
            <div
              key={site.id}
              className={`bg-white dark:bg-slate-900 p-6 rounded-3xl border transition-all flex flex-col justify-between ${
                isWinner
                  ? 'border-indigo-200 dark:border-indigo-800 ring-2 ring-indigo-500/20 shadow-xs'
                  : 'border-slate-100 dark:border-slate-800 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <span
                    className="text-xs font-bold px-2.5 py-0.5 rounded-md text-white"
                    style={{ backgroundColor: siteColors[idx].stroke }}
                  >
                    Candidate {idx + 1}
                  </span>
                  {isWinner && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800/60">
                      <Trophy className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      Highest Score
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-3">{site.name}</h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {site.area}, {activeCity.name} • {site.businessType}
                </span>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-baseline justify-between">
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Readiness Index:</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900 dark:text-slate-100">
                      {site.readinessScore}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">/ 100</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-50 dark:border-slate-800 flex items-center gap-2">
                <button
                  onClick={() => {
                    onSelectSite(site);
                    onNavigateTab('site-analysis');
                  }}
                  className="w-full py-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors"
                >
                  Inspect Site
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Radar Chart & AI Synthesis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recharts Radar Chart (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Factor Balance Radar Chart
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Comparing 5 spatial criteria across selected candidates
              </p>
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis
                  dataKey="factor"
                  tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                {compareSites.map((s, idx) => (
                  <Radar
                    key={s.id}
                    name={s.name}
                    dataKey={s.name}
                    stroke={siteColors[idx].stroke}
                    fill={siteColors[idx].fill}
                    fillOpacity={0.25}
                  />
                ))}
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '11px',
                    border: '1px solid #334155',
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Comparison Recommendation Summary (5 Cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  GeoReady Comparative Verdict
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500">Automated spatial recommendation</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-100/70 dark:border-indigo-900/50 text-xs text-slate-700 dark:text-slate-300 leading-relaxed mt-4 space-y-2">
              <p>
                <strong className="text-indigo-900 dark:text-indigo-300 font-bold">{compareSites[0]?.name}</strong> is best for immediate deployment due to superior population catchment and established commercial footfall.
              </p>
              {compareSites[1] && (
                <p>
                  <strong className="text-sky-900 dark:text-sky-300 font-bold">{compareSites[1]?.name}</strong> offers highest accessibility and frictionless transit connections, making it optimal for regional logistics or high-throughput formats.
                </p>
              )}
            </div>

            {/* Quick Strengths Summary */}
            <div className="space-y-2.5 pt-4">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Relative Advantages
              </h4>
              {compareSites.map((s, idx) => (
                <div key={s.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: siteColors[idx].stroke }}
                    />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{s.name}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    {s.factors.population > 85 ? 'High Density Anchor' : 'Logistics Corridor'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => onNavigateTab('reports')}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>Export Comparison PDF Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Comparison Detailed Metric Table */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
          Spatial Attribute Benchmark Table
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4 font-bold">Metric / Attribute</th>
                {compareSites.map((s, idx) => (
                  <th key={s.id} className="py-3 px-4 font-bold">
                    <span
                      className="inline-block w-2 h-2 rounded-full mr-1.5"
                      style={{ backgroundColor: siteColors[idx].stroke }}
                    />
                    {s.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800 font-medium">
              <tr>
                <td className="py-3 px-4 text-slate-600 dark:text-slate-400">Readiness Score</td>
                {compareSites.map((s) => {
                  const isW = s.readinessScore === highestReadiness;
                  return (
                    <td key={s.id} className={`py-3 px-4 font-bold font-mono text-sm ${isW ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/40' : 'text-slate-800 dark:text-slate-200'}`}>
                      {s.readinessScore} / 100 {isW && '★ (Winner)'}
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-600 dark:text-slate-400">Population (5 km Catchment)</td>
                {compareSites.map((s) => {
                  const isW = s.metrics.populationWithin5km === highestPopulation;
                  return (
                    <td key={s.id} className={`py-3 px-4 font-mono ${isW ? 'text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50/30 dark:bg-emerald-950/30' : 'text-slate-700 dark:text-slate-300'}`}>
                      {s.metrics.populationWithin5km.toLocaleString()} {isW && '★'}
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-600 dark:text-slate-400">Competitors (3 km Radius)</td>
                {compareSites.map((s) => {
                  const isW = s.metrics.competitorsWithin3km === lowestCompetitors;
                  return (
                    <td key={s.id} className={`py-3 px-4 font-mono ${isW ? 'text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50/30 dark:bg-emerald-950/30' : 'text-slate-700 dark:text-slate-300'}`}>
                      {s.metrics.competitorsWithin3km} rivals {isW && '★ (Least Rivalry)'}
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-600 dark:text-slate-400">Nearest Major Highway</td>
                {compareSites.map((s) => {
                  const isW = s.metrics.nearestHighwayKm === closestHighway;
                  return (
                    <td key={s.id} className={`py-3 px-4 font-mono ${isW ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50/30 dark:bg-indigo-950/30' : 'text-slate-700 dark:text-slate-300'}`}>
                      {s.metrics.nearestHighwayKm} km {isW && '★ (Closest)'}
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-600 dark:text-slate-400">Median Household Income</td>
                {compareSites.map((s) => {
                  const isW = s.metrics.medianIncomeMonthly === highestIncome;
                  return (
                    <td key={s.id} className={`py-3 px-4 font-mono ${isW ? 'text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50/30 dark:bg-emerald-950/30' : 'text-slate-700 dark:text-slate-300'}`}>
                      ₹{s.metrics.medianIncomeMonthly.toLocaleString()}/mo {isW && '★'}
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-600 dark:text-slate-400">Municipal Zoning Code</td>
                {compareSites.map((s) => (
                  <td key={s.id} className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300">
                    {s.metrics.zoningCode}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-600 dark:text-slate-400">Environmental Flood Risk</td>
                {compareSites.map((s) => (
                  <td key={s.id} className="py-3 px-4 text-slate-700 dark:text-slate-300">
                    <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {s.metrics.floodRiskLevel}
                    </span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
