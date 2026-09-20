import React, { useState } from 'react';
import { X, MapPin, Sparkles, Building2, Compass, Loader2, Navigation, Map } from 'lucide-react';
import { BusinessType, City } from '../types';
import { MapPinPickerModal } from './MapPinPickerModal';

interface NewSiteModalProps {
  activeCity: City;
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
  activeCity,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState(`${activeCity.name} Central Gateway`);
  const [lat, setLat] = useState(activeCity.lat.toString());
  const [lng, setLng] = useState(activeCity.lng.toString());
  const [businessType, setBusinessType] = useState<BusinessType>('Retail Store');
  const [loading, setLoading] = useState(false);
  const [isPinPickerOpen, setIsPinPickerOpen] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    if (isNaN(latNum) || isNaN(lngNum)) return;

    setLoading(true);
    try {
      await onSubmit({
        name: name.trim() || `Custom ${activeCity.name} Location`,
        lat: latNum,
        lng: lngNum,
        businessType,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  // Quick preset locations in City
  const presets = [
    { label: 'Vesu VIP Road', lat: '21.1448', lng: '72.7758' },
    { label: 'Adajan Palika', lat: '21.1920', lng: '72.7950' },
    { label: 'Dumas Airport', lat: '21.1210', lng: '72.7480' },
    { label: 'Hazira Expressway', lat: '21.1750', lng: '72.6850' },
  ];

  const handlePinSelected = (coords: { lat: number; lng: number }) => {
    setLat(coords.lat.toString());
    setLng(coords.lng.toString());
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
        <div
          className="fixed inset-0"
          onClick={onClose}
        />

        <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 max-w-lg w-full overflow-hidden z-10 animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-indigo-50/60 to-purple-50/40 dark:from-indigo-950/40 dark:to-purple-950/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">New Site Spatial Analysis</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Input coordinates or drop a geo pin on the interactive map
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Site Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Site Identifier or Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={`e.g. ${activeCity.name} Commercial Hub`}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-hidden transition-all"
              />
            </div>

            {/* Coordinates Header & Geo Drop Pin Action */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Geographic Coordinates
                </label>
                <button
                  type="button"
                  onClick={() => setIsPinPickerOpen(true)}
                  className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800/50 text-indigo-600 dark:text-indigo-400 text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer hover:scale-102"
                >
                  <MapPin className="w-3.5 h-3.5 text-indigo-500 animate-bounce" />
                  <span>📍 Drop Pin on Map</span>
                </button>
              </div>

              {/* Coordinates Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    Latitude (°N)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    placeholder="21.1702"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 font-mono focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-hidden transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    Longitude (°E)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    placeholder="72.8311"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 font-mono focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-hidden transition-all"
                  />
                </div>
              </div>
            </div>

          {/* Quick Coordinate Presets */}
          <div>
            <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 block mb-1.5">
              Quick {activeCity.name} presets:
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
                  className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg text-[11px] text-slate-600 dark:text-slate-300 font-medium transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Business Type Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Business Archetype
            </label>
            <select
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value as BusinessType)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 font-medium focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-hidden transition-all"
            >
              <option value="Retail Store" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Retail Store (High footfall & catchment)</option>
              <option value="Warehouse" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Warehouse (Logistics & freight arteries)</option>
              <option value="EV Charging Station" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">EV Charging Station (Transit throughput)</option>
              <option value="Telecom Tower" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Telecom Tower (Elevation & subscriber density)</option>
              <option value="Renewable Energy" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Renewable Energy (Grid interconnection & solar)</option>
            </select>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold transition-colors"
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

    {/* Interactive Geo Pin Picker Modal */}
    <MapPinPickerModal
      isOpen={isPinPickerOpen}
      initialLat={parseFloat(lat) || activeCity.lat}
      initialLng={parseFloat(lng) || activeCity.lng}
      activeCity={activeCity}
      onClose={() => setIsPinPickerOpen(false)}
      onConfirm={handlePinSelected}
      title={`Pick Coordinates in ${activeCity.name}`}
    />
  </>
  );
};
