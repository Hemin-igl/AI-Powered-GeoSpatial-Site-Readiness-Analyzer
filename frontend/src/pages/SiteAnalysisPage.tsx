import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  MapPin,
  CheckCircle2,
  Sliders,
  RotateCcw,
  Bot,
  AlertCircle,
  TrendingUp,
  Download,
  Share2,
  GitCompare,
  ArrowRight,
  ShieldAlert,
  Navigation,
  Users,
  Building,
  TreePine,
  Play,
  Loader2,
} from 'lucide-react';
import { BusinessType, CandidateSite, ScoringWeights, City } from '../types';
import { PRESET_WEIGHTS } from '../data/mockData';
import { calculateReadinessScore, generateAiExplanation, analyzeSite } from '../services/gisService';
import { MapCoordinatePickerModal } from '../components/MapCoordinatePickerModal';

interface SiteAnalysisPageProps {
  currentSite: CandidateSite;
  activeCity: City;
  onUpdateSite: (updated: CandidateSite) => void;
  onAddToCompare: (site: CandidateSite) => void;
  isInCompare: boolean;
  onNavigateTab: (tab: string) => void;
}

export const SiteAnalysisPage: React.FC<SiteAnalysisPageProps> = ({
  currentSite,
  activeCity,
  onUpdateSite,
  onAddToCompare,
  isInCompare,
  onNavigateTab,
}) => {
  const cityName = activeCity ? activeCity.name : 'Target Analysis Region';

  // Input fields
  const [latInput, setLatInput] = useState(currentSite.lat.toString());
  const [lngInput, setLngInput] = useState(currentSite.lng.toString());
  const [businessType, setBusinessType] = useState<BusinessType>(currentSite.businessType);
  const [radiusKm, setRadiusKm] = useState('5');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isGettingGps, setIsGettingGps] = useState(false);

  const handleGetCurrentGps = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsGettingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsGettingGps(false);
        setLatInput(pos.coords.latitude.toFixed(6));
        setLngInput(pos.coords.longitude.toFixed(6));
      },
      (err) => {
        setIsGettingGps(false);
        alert('Could not get GPS coordinates: ' + err.message);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Configurable weights (default 30%, 25%, 15%, 15%, 15%)
  const [weights, setWeights] = useState<ScoringWeights>({
    population: 0.30,
    accessibility: 0.25,
    competition: 0.15,
    landUse: 0.15,
    environmentalRisk: 0.15,
  });

  // AI Explanation mode
  const [aiMode, setAiMode] = useState<'explain' | 'weaknesses' | 'recommendations'>('explain');

  // Recalculate score reactively when weights or factors change
  const { finalScore, contributions } = useMemo(() => {
    return calculateReadinessScore(currentSite.factors, weights);
  }, [currentSite.factors, weights]);

  // Dynamic AI explanation based on current site, factors & weights
  const aiExplanationText = useMemo(() => {
    const updatedSite: CandidateSite = {
      ...currentSite,
      readinessScore: finalScore,
    };
    return generateAiExplanation(updatedSite, aiMode);
  }, [currentSite, finalScore, aiMode]);

  // Handle Weight Slider change with auto-normalization
  const handleWeightChange = (factorKey: keyof ScoringWeights, newValuePercent: number) => {
    const targetVal = newValuePercent / 100;
    const remainingVal = 1 - targetVal;

    const otherKeys = (Object.keys(weights) as (keyof ScoringWeights)[]).filter(
      (k) => k !== factorKey
    );
    const otherSum = otherKeys.reduce((acc, k) => acc + weights[k], 0);

    const updated = { ...weights, [factorKey]: targetVal };

    if (otherSum > 0) {
      otherKeys.forEach((k) => {
        updated[k] = (weights[k] / otherSum) * remainingVal;
      });
    } else {
      otherKeys.forEach((k) => {
        updated[k] = remainingVal / otherKeys.length;
      });
    }

    setWeights(updated);
  };

  // Apply Preset
  const handleApplyPreset = (presetName: string) => {
    if (PRESET_WEIGHTS[presetName]) {
      setWeights(PRESET_WEIGHTS[presetName]);
    }
  };

  // Run Analysis on new coordinates
  const handleRunAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(latInput);
    const lng = parseFloat(lngInput);
    if (isNaN(lat) || isNaN(lng)) return;

    setIsAnalyzing(true);
    try {
      const analyzed = await analyzeSite({
        lat,
        lng,
        businessType,
        weights,
        radiusKm: parseFloat(radiusKm) || 5,
      });
      onUpdateSite(analyzed);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const statusColor =
    finalScore >= 80 ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-100 dark:border-emerald-800' :
    finalScore >= 65 ? 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border-amber-100 dark:border-amber-800' :
    'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 border-rose-100 dark:border-rose-800';

  const statusText =
    finalScore >= 80 ? 'High Potential' :
    finalScore >= 65 ? 'Moderate Potential' :
    'Needs Review';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. TOP ANALYZE LOCATION FORM */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Analyze a Location</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Input geographic coordinates in {cityName} to compute multi-criteria spatial readiness across 5 configurable pillars
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleGetCurrentGps}
              disabled={isGettingGps}
              className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Navigation className={`w-3.5 h-3.5 ${isGettingGps ? 'animate-spin' : ''}`} />
              <span>{isGettingGps ? 'Locating...' : 'Use My GPS'}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsPickerOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-indigo-600/30 transition-all active:scale-95"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Drop Pin on Map</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleRunAnalysis} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-end">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Latitude (°N)
            </label>
            <input
              type="number"
              step="any"
              value={latInput}
              onChange={(e) => setLatInput(e.target.value)}
              placeholder="21.1702"
              className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 outline-hidden"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Longitude (°E)
            </label>
            <input
              type="number"
              step="any"
              value={lngInput}
              onChange={(e) => setLngInput(e.target.value)}
              placeholder="72.8311"
              className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 outline-hidden"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Business Type
            </label>
            <select
              value={businessType}
              onChange={(e) => {
                const newType = e.target.value as BusinessType;
                setBusinessType(newType);
                if (PRESET_WEIGHTS[newType]) {
                  setWeights(PRESET_WEIGHTS[newType]);
                }
              }}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 outline-hidden"
            >
              <option value="Retail Store" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Retail Store</option>
              <option value="Warehouse" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Warehouse</option>
              <option value="EV Charging Station" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">EV Charging Station</option>
              <option value="Telecom Tower" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Telecom Tower</option>
              <option value="Renewable Energy" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Renewable Energy</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Catchment Radius
            </label>
            <select
              value={radiusKm}
              onChange={(e) => setRadiusKm(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 outline-hidden"
            >
              <option value="3" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">3 km Catchment</option>
              <option value="5" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">5 km Standard Radius</option>
              <option value="10" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">10 km Regional Belt</option>
            </select>
          </div>

          <div>
            <button
              type="submit"
              disabled={isAnalyzing}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold rounded-xl shadow-xs shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Computing...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run Analysis</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* 2. MAIN RESULTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Main Score Card & Sub-Factors (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Score Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Target Candidate Evaluation
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">{currentSite.name}</h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">{currentSite.area}, {cityName} • {currentSite.businessType}</span>
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${statusColor}`}>
                {statusText}
              </span>
            </div>

            {/* Circular Progress Ring */}
            <div className="my-6 flex flex-col items-center justify-center">
              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg className="w-44 h-44 transform -rotate-90">
                  <circle
                    cx="88"
                    cy="88"
                    r="72"
                    stroke="#f1f5f9"
                    strokeWidth="12"
                    fill="none"
                    className="dark:stroke-slate-800"
                  />
                  <circle
                    cx="88"
                    cy="88"
                    r="72"
                    stroke="#6366f1"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray="452.4"
                    strokeDashoffset={452.4 - (452.4 * finalScore) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-700 ease-out"
                  />
                </svg>

                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                    SITE READINESS
                  </span>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                      {finalScore}
                    </span>
                    <span className="text-sm font-semibold text-slate-400 dark:text-slate-500">/ 100</span>
                  </div>
                  <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                    {statusText}
                  </span>
                </div>
              </div>
            </div>

            {/* 5 Core Sub-Factors */}
            <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
                Raw Component Scores
              </span>

              {[
                { label: 'Population Density', score: currentSite.factors.population, color: 'bg-indigo-600', icon: Users },
                { label: 'Accessibility', score: currentSite.factors.accessibility, color: 'bg-sky-500', icon: Navigation },
                { label: 'Competition', score: currentSite.factors.competition, color: 'bg-amber-500', icon: ShieldAlert },
                { label: 'Land Use', score: currentSite.factors.landUse, color: 'bg-emerald-500', icon: Building },
                { label: 'Environmental Risk', score: currentSite.factors.environmentalRisk, color: 'bg-rose-500', icon: TreePine },
              ].map((factor) => (
                <div key={factor.label} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs">
                  <div className="flex items-center gap-2">
                    <factor.icon className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                    <span className="font-medium text-slate-700 dark:text-slate-300">{factor.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">{factor.score} / 100</span>
                    <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${factor.color}`} style={{ width: `${factor.score}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Bar */}
            <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <button
                onClick={() => onAddToCompare(currentSite)}
                className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                  isInCompare
                    ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <GitCompare className="w-3.5 h-3.5" />
                <span>{isInCompare ? 'In Comparison' : 'Add to Compare'}</span>
              </button>

              <button
                onClick={() => onNavigateTab('accessibility')}
                className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
              >
                Catchment
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Score Breakdown & Configurable Weights (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Score Breakdown Horizontal Chart */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Score Breakdown & Contributions</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Weighted linear combination model: Raw Score × Factor Weight = Final Contribution
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-lg">
                Sum: {finalScore} / 100
              </span>
            </div>

            {/* Horizontal Contribution Bars */}
            <div className="space-y-4 py-4">
              {contributions.map((c) => (
                <div key={c.factor} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{c.factor}</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono">
                        {Math.round(c.weight * 100)}% weight
                      </span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="text-slate-500 dark:text-slate-400">{c.rawScore} × {(c.weight * 100).toFixed(0)}%</span>
                      <span className="font-bold text-indigo-700 dark:text-indigo-400">+{c.contribution} pts</span>
                    </div>
                  </div>

                  <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-300"
                      style={{ width: `${(c.contribution / 35) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Breakdown Formula Summary Box */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs flex items-center justify-between font-mono">
              <span className="text-slate-500 dark:text-slate-400">
                Formula: ∑(RawScore × Weight)
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {contributions.map((c) => c.contribution).join(' + ')} = {finalScore}
              </span>
            </div>
          </div>

          {/* Configurable Weights Panel */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Scoring Configuration</h3>
              </div>
              <span className="text-xs text-slate-400 dark:text-slate-500">
                Sliders auto-normalize to keep total at 100%
              </span>
            </div>

            {/* Presets */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-2">
                Industry Presets
              </span>
              <div className="flex flex-wrap gap-2">
                {Object.keys(PRESET_WEIGHTS).map((preset) => (
                  <button
                    key={preset}
                    onClick={() => handleApplyPreset(preset)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      businessType === preset
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-3.5 pt-2">
              {[
                { key: 'population', label: 'Population Density', value: weights.population },
                { key: 'accessibility', label: 'Accessibility', value: weights.accessibility },
                { key: 'competition', label: 'Competition Isolation', value: weights.competition },
                { key: 'landUse', label: 'Land Use Favourability', value: weights.landUse },
                { key: 'environmentalRisk', label: 'Environmental Risk Safety', value: weights.environmentalRisk },
              ].map((w) => (
                <div key={w.key} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{w.label}</span>
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {Math.round(w.value * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="65"
                    step="1"
                    value={Math.round(w.value * 100)}
                    onChange={(e) =>
                      handleWeightChange(
                        w.key as keyof ScoringWeights,
                        parseInt(e.target.value, 10)
                      )
                    }
                    className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. AI SITE ANALYST CARD */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">AI Site Analyst</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Spatial reasoning engine synthesized for {currentSite.name}
              </p>
            </div>
          </div>

          {/* AI Mode Selector Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAiMode('explain')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                aiMode === 'explain'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              Why this site?
            </button>
            <button
              onClick={() => setAiMode('weaknesses')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                aiMode === 'weaknesses'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              Find Weaknesses
            </button>
            <button
              onClick={() => setAiMode('recommendations')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                aiMode === 'recommendations'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              Generate Recommendations
            </button>
          </div>
        </div>

        {/* Narrative Box */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-purple-50/20 to-white dark:from-indigo-950/40 dark:via-purple-950/20 dark:to-slate-900 border border-indigo-100 dark:border-indigo-900/50 text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
          {aiExplanationText}
        </div>
      </div>

      {/* Interactive Geo Drop Pin Modal */}
      <MapCoordinatePickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        activeCity={activeCity}
        initialLat={parseFloat(latInput) || activeCity?.lat}
        initialLng={parseFloat(lngInput) || activeCity?.lng}
        onSelectCoordinates={(pickedLat, pickedLng) => {
          setLatInput(pickedLat.toString());
          setLngInput(pickedLng.toString());
        }}
      />
    </div>
  );
};
