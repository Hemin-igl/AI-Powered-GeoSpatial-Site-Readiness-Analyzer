import React from 'react';
import { X, ExternalLink, GitCompare, Sparkles, Navigation, Users, ShieldAlert, CheckCircle2, ChevronRight } from 'lucide-react';
import { CandidateSite } from '../types';

interface SiteDrawerProps {
  site: CandidateSite | null;
  onClose: () => void;
  onGoToAnalysis: (site: CandidateSite) => void;
  onAddToCompare: (site: CandidateSite) => void;
  isInComparison: boolean;
}

export const SiteDrawer: React.FC<SiteDrawerProps> = ({
  site,
  onClose,
  onGoToAnalysis,
  onAddToCompare,
  isInComparison,
}) => {
  if (!site) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full max-w-md bg-white shadow-2xl border-l border-slate-100 flex flex-col transition-all duration-300 animate-in slide-in-from-right">
      {/* Header */}
      <div className="flex items-start justify-between p-5 border-b border-slate-100 bg-slate-50/50">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
            {site.businessType}
          </span>
          <h2 className="text-base font-bold text-slate-900 mt-1.5">{site.name}</h2>
          <span className="text-xs text-slate-500">{site.area}, Surat • Lat: {site.lat.toFixed(4)}, Lng: {site.lng.toFixed(4)}</span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
        {/* Readiness Score Big Box */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 via-purple-50/30 to-white border border-indigo-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Site Readiness Score
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-3xl font-black text-indigo-700">{site.readinessScore}</span>
              <span className="text-sm font-semibold text-slate-400">/ 100</span>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {site.status}
            </span>
          </div>

          {/* Mini Circular Ring Progress */}
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle cx="32" cy="32" r="26" stroke="#e0e7ff" strokeWidth="5" fill="none" />
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="#6366f1"
                strokeWidth="5"
                fill="none"
                strokeDasharray="163.3"
                strokeDashoffset={163.3 - (163.3 * site.readinessScore) / 100}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            </svg>
            <span className="absolute text-xs font-bold text-indigo-900">{site.readinessScore}%</span>
          </div>
        </div>

        {/* Spatial Factor Sliders */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Factor Evaluations
          </h3>

          <div className="space-y-2">
            {[
              { label: 'Population Density', score: site.factors.population, icon: Users, color: 'bg-indigo-600' },
              { label: 'Accessibility Index', score: site.factors.accessibility, icon: Navigation, color: 'bg-sky-500' },
              { label: 'Competition Isolation', score: site.factors.competition, icon: ShieldAlert, color: 'bg-amber-500' },
              { label: 'Commercial Land Use', score: site.factors.landUse, icon: Sparkles, color: 'bg-emerald-500' },
              { label: 'Environmental Risk Safety', score: site.factors.environmentalRisk, icon: ShieldAlert, color: 'bg-rose-500' },
            ].map((f) => (
              <div key={f.label} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium text-slate-700">{f.label}</span>
                  <span className="font-bold text-slate-900 font-mono">{f.score}/100</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${f.color}`} style={{ width: `${f.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Catchment Metrics */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Key Catchment Metrics
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Population (5km)</span>
              <span className="font-bold text-slate-800">
                {site.metrics.populationWithin5km.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Direct Competitors</span>
              <span className="font-bold text-slate-800">
                {site.metrics.competitorsWithin3km} within 3 km
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Nearest Highway</span>
              <span className="font-bold text-slate-800">
                {site.metrics.nearestHighwayKm} km
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Median Income</span>
              <span className="font-bold text-slate-800">
                ₹{site.metrics.medianIncomeMonthly.toLocaleString()}/mo
              </span>
            </div>
          </div>
        </div>

        {/* AI Insight Summary */}
        <div className="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100/70 text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 text-indigo-700 font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Quick Assessment</span>
          </div>
          <p className="text-slate-600 leading-relaxed text-[11px]">
            {site.summary}
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 border-t border-slate-100 bg-white flex items-center gap-3">
        <button
          onClick={() => onAddToCompare(site)}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
            isInComparison
              ? 'bg-purple-50 text-purple-700 border-purple-200'
              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
          }`}
        >
          <GitCompare className="w-3.5 h-3.5" />
          <span>{isInComparison ? 'In Comparison' : 'Add to Compare'}</span>
        </button>

        <button
          onClick={() => onGoToAnalysis(site)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <span>Full Site Analysis</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
