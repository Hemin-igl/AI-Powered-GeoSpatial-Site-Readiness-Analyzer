import React, { useState } from 'react';
import { X, MapPin, Sparkles, Building2, Compass, Loader2 } from 'lucide-react';
import { BusinessType } from '../types';

interface NewSiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    lat: number;
    lng: number;
    businessType: BusinessType;
  }) => Promise<void>;
}

export const NewSiteModal: React.FC<NewSiteModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('Surat Central Gateway');
  const [lat, setLat] = useState('21.1702');
  const [lng, setLng] = useState('72.8311');
  const [businessType, setBusinessType] = useState<BusinessType>('Retail Store');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    if (isNaN(latNum) || isNaN(lngNum)) return;

    setLoading(true);
    try {
      await onSubmit({
        name: name.trim() || 'Custom Surat Location',
        lat: latNum,
        lng: lngNum,
        businessType,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  // Quick preset locations in Surat
  const presets = [
    { label: 'Vesu VIP Road', lat: '21.1448', lng: '72.7758' },
    { label: 'Adajan Palika', lat: '21.1920', lng: '72.7950' },
    { label: 'Dumas Airport', lat: '21.1210', lng: '72.7480' },
    { label: 'Hazira Expressway', lat: '21.1750', lng: '72.6850' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-gradient-to-r from-indigo-50/60 to-purple-50/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">New Site Spatial Analysis</h2>
              <p className="text-xs text-slate-500">
                Input coordinates to evaluate site readiness & catchment
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Site Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Site Identifier or Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Vesu Commercial Hub"
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-hidden transition-all"
            />
          </div>

          {/* Coordinates Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Latitude (°N)
              </label>
              <input
                type="number"
                step="any"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                placeholder="21.1702"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-hidden transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Longitude (°E)
              </label>
              <input
                type="number"
                step="any"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                placeholder="72.8311"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-hidden transition-all"
              />
            </div>
          </div>

          {/* Quick Coordinate Presets */}
          <div>
            <span className="text-[11px] font-medium text-slate-400 block mb-1.5">
              Quick Surat presets:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((p) => (
                <button
                  type="button"
                  key={p.label}
                  onClick={() => {
                    setName(p.label);
                    setLat(p.lat);
                    setLng(p.lng);
                  }}
                  className="px-2 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-[11px] text-slate-600 font-medium transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Business Type Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Business Archetype
            </label>
            <select
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value as BusinessType)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-hidden transition-all"
            >
              <option value="Retail Store">Retail Store (High footfall & catchment)</option>
              <option value="Warehouse">Warehouse (Logistics & freight arteries)</option>
              <option value="EV Charging Station">EV Charging Station (Transit throughput)</option>
              <option value="Telecom Tower">Telecom Tower (Elevation & subscriber density)</option>
              <option value="Renewable Energy">Renewable Energy (Grid interconnection & solar)</option>
            </select>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold shadow-md shadow-indigo-600/25 flex items-center gap-2 transition-all disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Computing GIS Factors...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Analyze Site</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
