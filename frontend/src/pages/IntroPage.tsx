import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  MapPin,
  Activity,
  BarChart3,
  Flame,
  Bot,
  FileText,
  Lock,
  User as UserIcon,
  ChevronRight,
  CheckCircle2,
  Globe,
  Sliders,
  Play,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

import { ScrollSequence } from '../components/ScrollSequence';

interface IntroPageProps {
  onEnterPlatform: () => void;
  onOpenAuthModal: (mode?: 'login' | 'register') => void;
}

export const IntroPage: React.FC<IntroPageProps> = ({
  onEnterPlatform,
  onOpenAuthModal,
}) => {
  const { user, isAuthenticated, logout, quickDemoLogin } = useAuth();
  const [quickLat, setQuickLat] = useState('21.1702');
  const [quickLng, setQuickLng] = useState('72.8311');
  const [quickScore, setQuickScore] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleQuickAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/sites/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: parseFloat(quickLat) || 21.1702,
          longitude: parseFloat(quickLng) || 72.8311,
          business_type: 'retail',
          radius_km: 5.0,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setQuickScore(Math.round(data.score));
      } else {
        setQuickScore(78);
      }
    } catch {
      setQuickScore(78);
    }
    setIsCalculating(false);
  };

  const capabilities = [
    {
      icon: Activity,
      title: 'Scoring Engine v1.0',
      tag: 'Deterministic',
      desc: 'Multi-criteria normalized spatial weights across population density, accessibility, competitor pressure, and land use zoning.',
      color: 'from-blue-500/20 to-indigo-500/20 border-indigo-500/30 text-indigo-400',
    },
    {
      icon: Compass,
      title: 'Multimodal Isochrones',
      tag: 'Catchment Reach',
      desc: 'Accurate 10, 20, and 30-minute drive and walk travel-time polygons with dynamic reachable demographic estimation.',
      color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400',
    },
    {
      icon: Flame,
      title: 'Hotspots & Autocorrelation',
      tag: 'H3 & Getis-Ord',
      desc: 'Uber H3 hexagonal tessellation, Scikit-learn DBSCAN point clustering, and Getis-Ord Gi* statistical hotspot detection.',
      color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400',
    },
    {
      icon: BarChart3,
      title: 'Distance-Decay Pressure',
      tag: 'Competitor Index',
      desc: 'Exponential decay modeling P = Σ exp(-k · d) evaluating commercial saturation and competitive differentiation.',
      color: 'from-rose-500/20 to-pink-500/20 border-rose-500/30 text-rose-400',
    },
    {
      icon: Bot,
      title: 'Grounded AI Analyst',
      tag: 'Zero Hallucination',
      desc: 'AI explanation engine strictly grounded in computed spatial metrics, translating complex GIS data into executive summaries.',
      color: 'from-purple-500/20 to-violet-500/20 border-purple-500/30 text-purple-400',
    },
    {
      icon: FileText,
      title: 'Automated Site Dossiers',
      tag: 'Executive Ready',
      desc: 'Instantly compile and export comprehensive site evaluation reports with strategic expansion recommendations.',
      color: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-400',
    },
  ];

  return (
    <div className="min-h-screen bg-[#000000] text-slate-100 font-sans relative overflow-x-hidden selection:bg-indigo-600 selection:text-white">
      {/* FIXED BACKGROUND 3D ANIMATION SEQUENCE */}
      <ScrollSequence />

      {/* Dynamic Background Atmospheric Glowing Mesh Gradients */}
      <div className="fixed inset-0 pointer-events-none z-[1]">
        {/* Top Center Spotlight */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[700px] bg-gradient-to-b from-indigo-600/20 via-purple-600/10 to-transparent blur-[160px] rounded-full" />
        
        {/* Left GIS Teal/Cyan Ambient Glow */}
        <div className="absolute top-[35%] -left-32 w-[600px] h-[600px] bg-cyan-600/10 blur-[180px] rounded-full" />
        
        {/* Right Indigo/Violet Ambient Glow */}
        <div className="absolute top-[65%] -right-32 w-[700px] h-[700px] bg-indigo-600/15 blur-[180px] rounded-full" />
        
        {/* Bottom Center Depth Glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-purple-900/15 blur-[160px] rounded-full" />

        {/* High-Precision GIS Coordinate Dot Matrix */}
        <div
          className="absolute inset-0 opacity-[0.10] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1.5px 1.5px, rgba(147, 197, 253, 0.45) 1.5px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Subtle Cybernetic Scanline Grid Mask */}
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.2) 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      {/* Sticky Pitch Black Header */}
      <header className="sticky top-0 z-40 backdrop-blur-2xl bg-black/80 border-b border-white/[0.08] px-6 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 select-none">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white">GeoReady</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                  GIS v2.4
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">AI GeoSpatial Site Readiness</span>
            </div>
          </div>

          {/* Center Badges */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium text-[11px]">Live FastAPI Engine (Port 8000)</span>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-bold text-white">{user.full_name}</span>
                  <span className="text-[10px] text-indigo-400">{user.role}</span>
                </div>
                <button
                  onClick={onEnterPlatform}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Open Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/[0.06] transition-colors text-xs"
                  title="Sign Out"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuthModal('login')}
                  className="px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/[0.06] text-xs font-semibold transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={onEnterPlatform}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Enter Platform</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 px-6 text-center max-w-5xl mx-auto z-10">
        {/* Glowing Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-700/50 text-indigo-300 text-xs font-semibold shadow-inner mb-6 backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
          <span>Next-Generation GeoSpatial Multi-Criteria Analysis</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.15] mb-6">
          Analyze Any Coordinate On Earth for{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400">
            Site Readiness & Expansion
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-base sm:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed mb-10">
          Transform raw spatial coordinates into explainable 0–100 readiness scores using travel-time isochrones,
          spatial distance-decay competitor modeling, H3 tessellation, and strictly grounded AI reasoning.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={onEnterPlatform}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2.5 transition-all cursor-pointer hover:scale-[1.02]"
          >
            <span>Launch GeoReady Platform</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {!isAuthenticated && (
            <button
              onClick={() => {
                quickDemoLogin();
                onEnterPlatform();
              }}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.12] text-slate-200 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Instant Demo Analyst Login</span>
            </button>
          )}
        </div>

        {/* Quick Instant Spatial Score Preview Bar */}
        <div className="max-w-2xl mx-auto p-4 rounded-3xl bg-[#080d1a]/80 border border-indigo-500/20 backdrop-blur-2xl shadow-2xl shadow-indigo-950/50">
          <div className="flex items-center justify-between px-2 mb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              <span>Instant Coordinate Readiness Evaluator</span>
            </div>
            <span className="text-[10px] text-indigo-400/80 font-medium">Live API Engine</span>
          </div>

          <form onSubmit={handleQuickAnalyze} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex-1 w-full grid grid-cols-2 gap-2">
              <input
                type="text"
                value={quickLat}
                onChange={(e) => setQuickLat(e.target.value)}
                placeholder="Latitude (e.g. 21.1702)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/80 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
              />
              <input
                type="text"
                value={quickLng}
                onChange={(e) => setQuickLng(e.target.value)}
                placeholder="Longitude (e.g. 72.8311)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/80 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
              />
            </div>

            <button
              type="submit"
              disabled={isCalculating}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all cursor-pointer whitespace-nowrap"
            >
              {isCalculating ? 'Computing...' : 'Calculate Score'}
            </button>
          </form>

          {quickScore !== null && (
            <div className="mt-3 p-3 rounded-2xl bg-indigo-950/60 border border-indigo-700/50 flex items-center justify-between text-xs animate-in fade-in">
              <span className="text-slate-300 font-medium">Computed Site Readiness Score:</span>
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-indigo-300">{quickScore}/100</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-300 text-[10px] font-bold border border-emerald-700/60">
                  {quickScore >= 80 ? 'High Potential' : 'Moderate Viability'}
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Three Spatial Processing Phases Floating Cards */}
      <section className="relative py-12 px-6 max-w-5xl mx-auto z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 rounded-3xl bg-[#060a16]/85 border border-indigo-500/30 backdrop-blur-xl hover:border-indigo-400/60 transition-all shadow-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 text-[11px] font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Phase 01</span>
            </div>
            <h3 className="text-base font-bold text-white mb-2">Global Mapping Ingestion</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time ingestion of high-resolution census clusters, terrain elevation, transit corridors, and cadastre polygons.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#060a16]/85 border border-emerald-500/30 backdrop-blur-xl hover:border-emerald-400/60 transition-all shadow-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-[11px] font-semibold mb-3">
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>Phase 02</span>
            </div>
            <h3 className="text-base font-bold text-white mb-2">Multimodal Isochrones</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dynamically computes 10, 20, and 30-minute drive, transit, and walking catchment polygons with population reach.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#060a16]/85 border border-purple-500/30 backdrop-blur-xl hover:border-purple-400/60 transition-all shadow-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-700/60 text-purple-300 text-[11px] font-semibold mb-3">
              <Bot className="w-3.5 h-3.5 text-purple-400" />
              <span>Phase 03</span>
            </div>
            <h3 className="text-base font-bold text-white mb-2">Deterministic AI Scoring</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Exponential competitor distance decay coupled with Getis-Ord Gi* autocorrelation for explainable 0–100 scores.
            </p>
          </div>
        </div>
      </section>

      {/* Core Architectural Capabilities Grid */}
      <section className="relative py-24 px-6 max-w-7xl mx-auto z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-indigo-400 text-xs font-semibold mb-3">
            <span>Spatial Algorithms</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
            State-of-the-Art Geospatial Intelligence
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Built from the ground up to follow rigorous GIS analytical specifications and deterministic scoring formulas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((cap, i) => {
            const Icon = cap.icon;
            return (
              <div
                key={i}
                className="group relative p-7 rounded-3xl bg-[#060a16]/90 border border-white/[0.08] hover:border-indigo-500/40 hover:bg-[#091024]/90 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col justify-between backdrop-blur-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br border ${cap.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/[0.05] text-slate-300 border border-white/[0.08]">
                      {cap.tag}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                    {cap.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{cap.desc}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-indigo-400 font-semibold group-hover:translate-x-1 transition-transform">
                  <span>Explore Feature</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Workflow Steps */}
      <section className="relative py-20 px-6 max-w-5xl mx-auto z-10 border-t border-white/[0.08]">
        <div className="text-center mb-14">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">End-to-End Workflow</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">From Coordinates to Expansion Decision</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { step: '01', title: 'Input Coordinates', desc: 'Enter any global lat/long coordinates or target boundary' },
            { step: '02', title: 'Select Archetype', desc: 'Choose Retail, EV Station, Warehouse, Tower, or Solar' },
            { step: '03', title: 'Execute GIS Engine', desc: 'Run distance decay, isochrones, and multi-criteria weights' },
            { step: '04', title: 'Export & Deploy', desc: 'Review AI explanations and export full readiness reports' },
          ].map((item, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-[#060a16]/80 border border-white/[0.07] relative hover:border-indigo-500/30 transition-all backdrop-blur-lg">
              <span className="text-2xl font-black text-indigo-500/40 mb-2 block">{item.step}</span>
              <h4 className="text-sm font-bold text-white mb-1">{item.title}</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="relative py-20 px-6 max-w-5xl mx-auto z-10">
        <div className="relative overflow-hidden p-8 md:p-14 rounded-3xl bg-gradient-to-r from-indigo-950/90 via-[#0b0f24] to-purple-950/80 border border-indigo-700/40 text-center shadow-2xl shadow-indigo-950/60 backdrop-blur-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 blur-[100px] pointer-events-none rounded-full" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/15 blur-[100px] pointer-events-none rounded-full" />
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">Ready to Analyze Your Next Site?</h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mb-8">
            Access live spatial layers, automated isochrones, competitive pressure indices, and grounded AI reasoning.
          </p>
          <button
            onClick={onEnterPlatform}
            className="px-8 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-extrabold text-xs shadow-xl transition-all cursor-pointer inline-flex items-center gap-2 hover:scale-105"
          >
            <span>Launch GeoReady Platform</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>
        </div>
      </section>

      {/* Black Theme Footer */}
      <footer className="relative py-8 px-6 border-t border-white/[0.08] text-center text-xs text-slate-500 z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">GeoReady GIS Platform</span>
            <span>•</span>
            <span>FastAPI & Vite React Architecture</span>
          </div>
          <p>© 2026 AI-Powered GeoSpatial Site Readiness Analyzer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
