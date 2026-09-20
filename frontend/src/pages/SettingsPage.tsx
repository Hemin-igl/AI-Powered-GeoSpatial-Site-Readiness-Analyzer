import React, { useState } from 'react';
import {
  Settings,
  Globe,
  Sliders,
  Database,
  Cpu,
  ShieldCheck,
  Save,
  RotateCcw,
  CheckCircle2,
  Sun,
  Moon,
  Palette,
} from 'lucide-react';

import { City } from '../types';
import { useTheme } from '../context/ThemeContext';

interface SettingsPageProps {
  activeCity: City;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ activeCity }) => {
  const { theme, setTheme } = useTheme();
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [crs, setCrs] = useState('EPSG:4326');
  const [driveSpeed, setDriveSpeed] = useState(28);
  const [walkSpeed, setWalkSpeed] = useState(4.5);
  const [distanceDecayBeta, setDistanceDecayBeta] = useState(1.4);
  const [aiModel, setAiModel] = useState('gemini-2.5-flash');

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Settings className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">GIS & Platform Settings</h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Configure spatial reference systems, routing physics, distance-decay coefficients, theme mode, and AI parameters.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-sm cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Preferences</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Spatial configurations updated successfully. Catchment calculations recalculated.</span>
        </div>
      )}

      {/* Appearance & Theme Setting */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <Palette className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Appearance & Theme Mode</h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Customize high-visualization theme mode for optimal spatial contrast and map viewing.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            onClick={() => setTheme('light')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
              theme === 'light'
                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-slate-800 dark:text-slate-200">Light Mode</span>
                {theme === 'light' && <span className="w-2 h-2 rounded-full bg-indigo-600"></span>}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Bright, clean UI with daylight spatial contrast.
              </p>
            </div>
          </div>

          <div
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
              theme === 'dark'
                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-slate-800 dark:text-slate-200">Dark Mode</span>
                {theme === 'dark' && <span className="w-2 h-2 rounded-full bg-indigo-600"></span>}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Sleek dark theme with vibrant GIS data layers & glow.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Spatial Reference System */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <Globe className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Spatial Reference & Projections (CRS)</h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Coordinate projection used for distance buffers, area polygons, and geometry projections.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            onClick={() => setCrs('EPSG:4326')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              crs === 'EPSG:4326'
                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-800 dark:text-slate-200">WGS 84 (EPSG:4326)</span>
              {crs === 'EPSG:4326' && <span className="w-2 h-2 rounded-full bg-indigo-600"></span>}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Standard global GPS coordinates. Best for web mapping tiles and API interoperability.
            </p>
          </div>

          <div
            onClick={() => setCrs('EPSG:32643')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              crs === 'EPSG:32643'
                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-800 dark:text-slate-200">UTM Zone 43N (EPSG:32643)</span>
              {crs === 'EPSG:32643' && <span className="w-2 h-2 rounded-full bg-indigo-600"></span>}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Projected metric system for West India / Gujarat. Provides millimeter-level distance accuracy.
            </p>
          </div>
        </div>
      </div>

      {/* Network Travel & Routing Physics */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <Sliders className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Routing & Isochrone Travel Parameters</h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Empirical velocities utilized by Dijkstra / contraction hierarchies for catchment polygons in {activeCity.name}.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Urban Driving Speed (Avg)</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">{driveSpeed} km/h</span>
            </div>
            <input
              type="range"
              min="15"
              max="50"
              value={driveSpeed}
              onChange={(e) => setDriveSpeed(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <p className="text-[10px] text-slate-400 dark:text-slate-500">Calibrated for {activeCity.name} ring roads and signal delays.</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Pedestrian Walking Speed</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">{walkSpeed} km/h</span>
            </div>
            <input
              type="range"
              min="3"
              max="6"
              step="0.1"
              value={walkSpeed}
              onChange={(e) => setWalkSpeed(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <p className="text-[10px] text-slate-400 dark:text-slate-500">Standard pedestrian walking speed across sidewalks.</p>
          </div>
        </div>
      </div>

      {/* AI Reasoning Engine */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <Cpu className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Spatial AI Explanation Engine</h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Language model used to synthesize multi-factor GIS weights into executive trade-area summaries.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', latency: '< 300ms', desc: 'Fastest real-time synthesis' },
            { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', latency: '~ 800ms', desc: 'Deep regulatory spatial analysis' },
            { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', latency: '~ 1.1s', desc: 'Nuanced urban planning output' },
          ].map((m) => (
            <div
              key={m.id}
              onClick={() => setAiModel(m.id)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                aiModel === m.id
                  ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800 dark:text-slate-200">{m.name}</span>
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">{m.latency}</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
