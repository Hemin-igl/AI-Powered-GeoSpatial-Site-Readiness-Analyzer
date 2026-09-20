import React, { useState, useEffect, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import { X, MapPin, Check, Navigation, Crosshair, Sparkles, Layers } from 'lucide-react';
import { City } from '../types';

interface MapCoordinatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCoordinates: (lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
  activeCity: City;
}

export const MapCoordinatePickerModal: React.FC<MapCoordinatePickerModalProps> = ({
  isOpen,
  onClose,
  onSelectCoordinates,
  initialLat,
  initialLng,
  activeCity,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);

  const startLat = initialLat || activeCity.lat || 21.1702;
  const startLng = initialLng || activeCity.lng || 72.8311;

  const [selectedLat, setSelectedLat] = useState<number>(startLat);
  const [selectedLng, setSelectedLng] = useState<number>(startLng);
  const [isLocating, setIsLocating] = useState(false);
  const [mapMode, setMapMode] = useState<'streets' | 'dark' | 'satellite'>('streets');

  useEffect(() => {
    if (isOpen) {
      setSelectedLat(initialLat || activeCity.lat || 21.1702);
      setSelectedLng(initialLng || activeCity.lng || 72.8311);
    }
  }, [isOpen, initialLat, initialLng, activeCity]);

  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    const styleSources: Record<string, any> = {
      streets: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '&copy; OpenStreetMap contributors',
          },
        },
        layers: [{ id: 'osm-tiles', type: 'raster', source: 'osm', minzoom: 0, maxzoom: 19 }],
      },
      dark: {
        version: 8,
        sources: {
          dark: {
            type: 'raster',
            tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}'],
            tileSize: 256,
            attribution: '&copy; Esri',
          },
        },
        layers: [{ id: 'dark-tiles', type: 'raster', source: 'dark', minzoom: 0, maxzoom: 19 }],
      },
      satellite: {
        version: 8,
        sources: {
          satellite: {
            type: 'raster',
            tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
            tileSize: 256,
            attribution: '&copy; Esri',
          },
        },
        layers: [{ id: 'sat-tiles', type: 'raster', source: 'satellite', minzoom: 0, maxzoom: 19 }],
      },
    };

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: styleSources[mapMode],
      center: [selectedLng, selectedLat],
      zoom: 13,
      attributionControl: false,
    });

    mapRef.current = map;

    // Custom Draggable Pin Marker
    const markerEl = document.createElement('div');
    markerEl.className = 'geo-drop-pin-wrapper';
    markerEl.innerHTML = `
      <div style="
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: grab;
        transform: translate(-50%, -100%);
      ">
        <div style="
          width: 38px;
          height: 38px;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 8px 16px rgba(79, 70, 229, 0.45), 0 0 0 3px #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            width: 14px;
            height: 14px;
            background: #ffffff;
            border-radius: 50%;
            transform: rotate(45deg);
          "></div>
        </div>
        <div style="
          position: absolute;
          bottom: -4px;
          width: 8px;
          height: 8px;
          background: rgba(0,0,0,0.3);
          border-radius: 50%;
          filter: blur(2px);
        "></div>
      </div>
    `;

    const marker = new maplibregl.Marker({
      element: markerEl,
      draggable: true,
      anchor: 'bottom',
    })
      .setLngLat([selectedLng, selectedLat])
      .addTo(map);

    markerRef.current = marker;

    marker.on('dragend', () => {
      const lngLat = marker.getLngLat();
      const newLat = parseFloat(lngLat.lat.toFixed(6));
      const newLng = parseFloat(lngLat.lng.toFixed(6));
      setSelectedLat(newLat);
      setSelectedLng(newLng);
    });

    // Drop Pin on Click
    map.on('click', (e) => {
      const newLat = parseFloat(e.lngLat.lat.toFixed(6));
      const newLng = parseFloat(e.lngLat.lng.toFixed(6));
      setSelectedLat(newLat);
      setSelectedLng(newLng);
      marker.setLngLat([newLng, newLat]);
      map.easeTo({ center: [newLng, newLat], duration: 400 });
    });

    map.on('load', () => {
      map.resize();
    });

    return () => {
      map.remove();
    };
  }, [isOpen, mapMode]);

  // Update marker position when state changes
  useEffect(() => {
    if (markerRef.current && mapRef.current) {
      markerRef.current.setLngLat([selectedLng, selectedLat]);
    }
  }, [selectedLat, selectedLng]);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const newLat = parseFloat(pos.coords.latitude.toFixed(6));
        const newLng = parseFloat(pos.coords.longitude.toFixed(6));
        setSelectedLat(newLat);
        setSelectedLng(newLng);
        if (mapRef.current) {
          mapRef.current.flyTo({ center: [newLng, newLat], zoom: 15, duration: 1000 });
        }
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation error:', err);
        alert('Could not retrieve current location: ' + err.message);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleConfirm = () => {
    onSelectCoordinates(selectedLat, selectedLng);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-3xl w-full overflow-hidden z-10 flex flex-col h-[640px] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Geo Drop Pin • Interactive Coordinate Picker
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Click anywhere on the map or drag the pin to set your exact site location
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Map Canvas Container */}
        <div className="relative flex-1 bg-slate-950 overflow-hidden">
          <div ref={mapContainerRef} className="w-full h-full" />

          {/* Top Floating Controls on Map */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg text-xs">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Layer:
            </span>
            <button
              type="button"
              onClick={() => setMapMode('streets')}
              className={`px-2.5 py-1 rounded-xl font-medium transition-all ${
                mapMode === 'streets'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Streets
            </button>
            <button
              type="button"
              onClick={() => setMapMode('dark')}
              className={`px-2.5 py-1 rounded-xl font-medium transition-all ${
                mapMode === 'dark'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Dark GIS
            </button>
            <button
              type="button"
              onClick={() => setMapMode('satellite')}
              className={`px-2.5 py-1 rounded-xl font-medium transition-all ${
                mapMode === 'satellite'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Satellite
            </button>
          </div>

          {/* Top Right GPS Locator */}
          <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
            <button
              type="button"
              onClick={handleGetCurrentLocation}
              disabled={isLocating}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-900 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-semibold text-indigo-600 dark:text-indigo-400 shadow-lg transition-all active:scale-95 disabled:opacity-50"
            >
              <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Locating...' : 'Use My GPS Location'}</span>
            </button>
          </div>

          {/* Bottom Floating Coordinate Tooltip */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-slate-900/90 text-white backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-700 shadow-xl flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Lat:</span>
              <span className="text-emerald-400 font-bold">{selectedLat.toFixed(6)}°N</span>
            </div>
            <div className="h-3 w-px bg-slate-700" />
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Lng:</span>
              <span className="text-indigo-400 font-bold">{selectedLng.toFixed(6)}°E</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>Clicking anywhere on the canvas drops the pin instantly</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold shadow-md shadow-indigo-600/25 flex items-center gap-2 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Use Selected Coordinates</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
