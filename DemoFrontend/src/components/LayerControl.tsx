import React, { useState } from 'react';
import { Layers, ChevronDown, ChevronUp, Eye, EyeOff, Sliders } from 'lucide-react';
import { MapLayerConfig } from '../types';

interface LayerControlProps {
  layers: MapLayerConfig[];
  onToggleLayer: (layerId: string) => void;
  onChangeOpacity: (layerId: string, opacity: number) => void;
  activeLayerId: string;
  setActiveLayerId: (layerId: string) => void;
}

export const LayerControl: React.FC<LayerControlProps> = ({
  layers,
  onToggleLayer,
  onChangeOpacity,
  activeLayerId,
  setActiveLayerId,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const selectedLayer = layers.find((l) => l.id === activeLayerId) || layers[0];

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200/80 p-3.5 w-64 md:w-72 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-slate-800">Map Layers</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md">
            {layers.filter((l) => l.active).length} Active
          </span>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100"
          >
            {collapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {!collapsed && (
        <>
          {/* Layer Checkboxes */}
          <div className="space-y-1.5 py-2.5 max-h-52 overflow-y-auto custom-scrollbar">
            {layers.map((layer) => {
              const isSelected = activeLayerId === layer.id;

              return (
                <div
                  key={layer.id}
                  onClick={() => setActiveLayerId(layer.id)}
                  className={`flex items-center justify-between p-1.5 rounded-xl cursor-pointer text-xs transition-colors ${
                    isSelected ? 'bg-indigo-50/70' : 'hover:bg-slate-50'
                  }`}
                >
                  <label className="flex items-center gap-2.5 cursor-pointer select-none flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={layer.active}
                      onChange={(e) => {
                        e.stopPropagation();
                        onToggleLayer(layer.id);
                      }}
                      className="w-3.5 h-3.5 rounded-sm text-indigo-600 focus:ring-indigo-500 border-slate-300 accent-indigo-600"
                    />
                    <div className="flex items-center gap-1.5 truncate">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: layer.color }}
                      />
                      <span
                        className={`truncate font-medium ${
                          layer.active ? 'text-slate-800' : 'text-slate-400'
                        }`}
                      >
                        {layer.name}
                      </span>
                    </div>
                  </label>

                  <span className="text-[10px] text-slate-400 font-mono ml-2 shrink-0">
                    {layer.featureCount}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Opacity Slider for Selected Layer */}
          {selectedLayer && (
            <div className="pt-2.5 border-t border-slate-100 space-y-1.5 bg-slate-50/80 -mx-3.5 -mb-3.5 p-3 rounded-b-2xl">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-700 truncate">
                  {selectedLayer.name} Opacity
                </span>
                <span className="font-mono text-indigo-600 font-bold text-[10px]">
                  {Math.round(selectedLayer.opacity * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={selectedLayer.opacity}
                onChange={(e) =>
                  onChangeOpacity(selectedLayer.id, parseFloat(e.target.value))
                }
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};
