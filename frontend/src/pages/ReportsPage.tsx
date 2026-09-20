import React, { useState } from 'react';
import {
  FileText,
  Download,
  Share2,
  CheckCircle2,
  Sparkles,
  Printer,
  Calendar,
  ShieldCheck,
  Building,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { CandidateSite, City } from '../types';

interface ReportsPageProps {
  activeCity: City;
  currentSite: CandidateSite;
  sites: CandidateSite[];
  onSelectSite: (site: CandidateSite) => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({
  activeCity,
  currentSite,
  sites,
  onSelectSite,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [generatedSuccess, setGeneratedSuccess] = useState(false);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setDownloadProgress(10);
    setGeneratedSuccess(false);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev === null) return 10;
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          setGeneratedSuccess(true);
          setTimeout(() => setGeneratedSuccess(false), 3500);
          return null;
        }
        return prev + 25;
      });
    }, 250);
  };

  const handleExportGeoJSON = () => {
    const geojson = {
      type: 'FeatureCollection',
      features: sites.map((s) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [s.lng, s.lat],
        },
        properties: {
          id: s.id,
          name: s.name,
          readinessScore: s.readinessScore,
          businessType: s.businessType,
          populationScore: s.factors.population,
          accessibilityScore: s.factors.accessibility,
        },
      })),
    };

    const blob = new Blob([JSON.stringify(geojson, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GeoReady_${activeCity.name.replace(/\s+/g, '_')}_Sites_${Date.now()}.geojson`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Reports & Spatial Intelligence Exports
            </h1>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800/60">
              Audit-Ready PDF & GeoJSON
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate executive site readiness dossiers, spatial catchment packages, and GIS vector exports.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportGeoJSON}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export GeoJSON</span>
          </button>

          <button
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-70"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Compiling Dossier ({downloadProgress}%)...</span>
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                <span>Generate Executive Report</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generation Status Toast */}
      {generatedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-200 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>
              Executive Dossier for <strong>{currentSite.name}</strong> successfully generated and simulated as PDF download!
            </span>
          </div>
          <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-300">PDF-{activeCity.name.toUpperCase().substring(0,5)}-2026-X8</span>
        </div>
      )}

      {/* Target Site Selector & Report Document Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 4 Cols: Report Options & Target Site */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Select Subject Candidate
            </h3>

            <div className="space-y-2">
              {sites.map((s) => (
                <div
                  key={s.id}
                  onClick={() => onSelectSite(s)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                    s.id === currentSite.id
                      ? 'bg-indigo-50/70 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 font-bold'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="truncate">{s.name}</span>
                    <span className="font-mono text-indigo-700 dark:text-indigo-400">{s.readinessScore}/100</span>
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-normal mt-0.5">
                    {s.area} • {s.businessType}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Available Export Formats
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between text-slate-700 dark:text-slate-300">
                <span>Executive Dossier (PDF)</span>
                <span className="font-mono text-slate-400 dark:text-slate-500">A4 • Color</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between text-slate-700 dark:text-slate-300">
                <span>Spatial Features (GeoJSON)</span>
                <span className="font-mono text-slate-400 dark:text-slate-500">WGS84</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between text-slate-700 dark:text-slate-300">
                <span>Census Catchment (CSV)</span>
                <span className="font-mono text-slate-400 dark:text-slate-500">Tabular</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 8 Cols: Realistic Printable Document Preview */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg space-y-6 text-slate-800 dark:text-slate-200">
          {/* Document Header */}
          <div className="flex items-start justify-between pb-6 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                  G
                </span>
                <span className="text-sm font-black tracking-tight text-slate-900 dark:text-slate-100">
                  GeoReady Spatial Dossier
                </span>
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 mt-2">
                Site Feasibility & Readiness Assessment
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {activeCity.name} Metropolitan Development Authority Area • Ref: {activeCity.name.substring(0,3).toUpperCase()}-{currentSite.id.toUpperCase()}
              </span>
            </div>

            <div className="text-right">
              <span className="text-xs font-mono text-slate-400 dark:text-slate-500 block">Date Generated</span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {new Date().toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              <span className="inline-block text-[10px] text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded mt-1">
                Confidential
              </span>
            </div>
          </div>

          {/* Core Candidate Identification */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-bold">Site Name</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">{currentSite.name}</span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-bold">Coordinates</span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                {currentSite.lat.toFixed(4)}°N, {currentSite.lng.toFixed(4)}°E
              </span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-bold">Archetype</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">{currentSite.businessType}</span>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-bold">Municipal Ward</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">{currentSite.area} Ward</span>
            </div>
          </div>

          {/* Readiness Score Banner */}
          <div className="p-5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider">
                Overall Spatial Readiness Score
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-4xl font-black text-indigo-700 dark:text-indigo-400">
                  {currentSite.readinessScore}
                </span>
                <span className="text-sm font-semibold text-slate-400 dark:text-slate-500">/ 100</span>
              </div>
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                Status: {currentSite.status} (Exceeds deployment hurdle threshold)
              </span>
            </div>

            <div className="text-right text-xs space-y-1">
              <span className="text-slate-500 dark:text-slate-400 block">5 km Population: <strong className="text-slate-800 dark:text-slate-200">{currentSite.metrics.populationWithin5km.toLocaleString()}</strong></span>
              <span className="text-slate-500 dark:text-slate-400 block">Nearest Highway: <strong className="text-slate-800 dark:text-slate-200">{currentSite.metrics.nearestHighwayKm} km</strong></span>
              <span className="text-slate-500 dark:text-slate-400 block">Zoning Code: <strong className="text-slate-800 dark:text-slate-200">{currentSite.metrics.zoningCode}</strong></span>
            </div>
          </div>

          {/* Factor Breakdown Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Factor Evaluation Summary
            </h4>
            <div className="grid grid-cols-5 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Population</span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{currentSite.factors.population}/100</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Accessibility</span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{currentSite.factors.accessibility}/100</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Competition</span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{currentSite.factors.competition}/100</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Land Use</span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{currentSite.factors.landUse}/100</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Env Risk</span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{currentSite.factors.environmentalRisk}/100</span>
              </div>
            </div>
          </div>

          {/* AI Executive Recommendations */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Strategic Executive Recommendations
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
              {currentSite.summary} Priority recommendation: Proceed with commercial lease negotiation, ensure ingress easement along the primary frontage, and configure rooftop solar to leverage local irradiance profiles.
            </p>
          </div>

          {/* Signature & Disclaimer */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Verified Spatial Model Algorithm v3.4</span>
            </div>
            <div className="text-right">
              <span className="block font-mono text-slate-600 dark:text-slate-300">GeoReady Automated Spatial Engine</span>
              <span className="text-[10px]">For simulation and evaluation purposes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
