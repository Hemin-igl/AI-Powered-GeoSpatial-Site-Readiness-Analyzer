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
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
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
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Settings className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">GIS & Platform Settings</h1>
          </div>
          <p className="text-xs text-slate-500">
            Configure spatial reference systems, routing physics, distance-decay coefficients, and AI reasoning parameters.
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
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Spatial configurations updated successfully. Catchment calculations recalculated.</span>
        </div>
      )}

      {/* Spatial Reference System */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <Globe className="w-4 h-4 text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-900">Spatial Reference & Projections (CRS)</h2>
        </div>
        <p className="text-xs text-slate-500">
          Coordinate projection used for distance buffers, area polygons, and geometry projections.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            onClick={() => setCrs('EPSG:4326')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              crs === 'EPSG:4326'
                ? 'border-indigo-600 bg-indigo-50/50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-800">WGS 84 (EPSG:4326)</span>
              {crs === 'EPSG:4326' && <span className="w-2 h-2 rounded-full bg-indigo-600"></span>}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Standard global GPS coordinates. Best for web mapping tiles and API interoperability.
            </p>
          </div>

          <div
            onClick={() => setCrs('EPSG:32643')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              crs === 'EPSG:32643'
                ? 'border-indigo-600 bg-indigo-50/50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-800">UTM Zone 43N (EPSG:32643)</span>
              {crs === 'EPSG:32643' && <span className="w-2 h-2 rounded-full bg-indigo-600"></span>}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Projected metric system for West India / Gujarat. Provides millimeter-level distance accuracy.
            </p>
          </div>
        </div>
      </div>

      {/* Network Travel & Routing Physics */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <Sliders className="w-4 h-4 text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-900">Routing & Isochrone Travel Parameters</h2>
        </div>
        <p className="text-xs text-slate-500">
          Empirical velocities utilized by Dijkstra / contraction hierarchies for catchment polygons in Surat.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Urban Driving Speed (Avg)</span>
              <span className="font-bold text-indigo-600">{driveSpeed} km/h</span>
            </div>
            <input
              type="range"
              min="15"
              max="50"
              value={driveSpeed}
              onChange={(e) => setDriveSpeed(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <p className="text-[10px] text-slate-400">Calibrated for Surat ring roads and signal delays.</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Pedestrian Walking Speed</span>
              <span className="font-bold text-indigo-600">{walkSpeed} km/h</span>
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
            <p className="text-[10px] text-slate-400">Standard pedestrian walking speed across sidewalks.</p>
          </div>
        </div>
      </div>

      {/* AI Reasoning Engine */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <Cpu className="w-4 h-4 text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-900">Spatial AI Explanation Engine</h2>
        </div>
        <p className="text-xs text-slate-500">
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
                  ? 'border-indigo-600 bg-indigo-50/50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800">{m.name}</span>
                <span className="text-[10px] font-mono text-slate-400">{m.latency}</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
