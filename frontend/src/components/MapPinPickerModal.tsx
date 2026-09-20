import React, { useState, useEffect, useRef } from 'react';
import { Map as MapLibreMap, Marker } from 'maplibre-gl';
import { X, MapPin, Check, Navigation, ZoomIn, ZoomOut } from 'lucide-react';
import { City } from '../types';

interface MapPinPickerModalProps {
  isOpen: boolean;
  initialLat: number;
  initialLng: number;
  activeCity?: City;
  onClose: () => void;
  onConfirm: (coords: { lat: number; lng: number }) => void;
  title?: string;
}

export const MapPinPickerModal: React.FC<MapPinPickerModalProps> = ({
  isOpen,
  initialLat,
  initialLng,
  activeCity,
  onClose,
  onConfirm,
  title = 'Drop Geo Pin to Pick Coordinates',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markerRef = useRef<Marker | null>(null);

  const [pickedLat, setPickedLat] = useState<number>(initialLat || (activeCity?.lat ?? 21.1702));
  const [pickedLng, setPickedLng] = useState<number>(initialLng || (activeCity?.lng ?? 72.8311));
  const [isLocating, setIsLocating] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Sync initial coordinates on open
  useEffect(() => {
    if (isOpen) {
      const lat = !isNaN(initialLat) && initialLat !== 0 ? initialLat : (activeCity?.lat ?? 21.1702);
      const lng = !isNaN(initialLng) && initialLng !== 0 ? initialLng : (activeCity?.lng ?? 72.8311);
      setPickedLat(lat);
      setPickedLng(lng);
    }
  }, [isOpen, initialLat, initialLng, activeCity]);

  // Initialize MapLibre on open
  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    const lat = !isNaN(initialLat) && initialLat !== 0 ? initialLat : (activeCity?.lat ?? 21.1702);
    const lng = !isNaN(initialLng) && initialLng !== 0 ? initialLng : (activeCity?.lng ?? 72.8311);

    const map = new MapLibreMap({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          'esri-dark': {
            type: 'raster',
            tiles: [
              'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
            ],
            tileSize: 256,
            maxzoom: 18,
            attribution: '&copy; Esri, DeLorme, NAVTEQ',
          },
          'esri-dark-labels': {
            type: 'raster',
            tiles: [
              'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
            ],
            tileSize: 256,
            maxzoom: 18,
            attribution: '&copy; Esri',
          },
        },
        layers: [
          {
            id: 'esri-dark-base',
            type: 'raster',
            source: 'esri-dark',
            minzoom: 0,
            maxzoom: 22,
          },
          {
            id: 'esri-dark-labels-layer',
            type: 'raster',
            source: 'esri-dark-labels',
            minzoom: 0,
            maxzoom: 22,
          },
        ],
      },
      center: [lng, lat],
      zoom: 13,
      maxZoom: 20,
      minZoom: 4,
    });

    mapRef.current = map;

    // Create Pin Element
    const el = document.createElement('div');
    el.className = 'geo-drop-pin-marker';
    el.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; cursor: grab;">
        <div style="width: 36px; height: 36px; background: linear-gradient(135deg, #6366f1, #a855f7); border: 2.5px solid #ffffff; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 25px rgba(99, 102, 241, 0.6); animation: bounce 1s infinite alternate;">
          <div style="width: 12px; height: 12px; background: #ffffff; border-radius: 50%; transform: rotate(45deg);"></div>
        </div>
        <div style="width: 14px; height: 4px; background: rgba(0,0,0,0.4); border-radius: 50%; filter: blur(1px); margin-top: 2px;"></div>
      </div>
    `;

    const marker = new Marker({
      element: el,
      draggable: true,
      anchor: 'bottom',
    })
      .setLngLat([lng, lat])
      .addTo(map);

    markerRef.current = marker;

    // Drag marker event
    marker.on('dragend', () => {
      const lngLat = marker.getLngLat();
      const nLat = Number(lngLat.lat.toFixed(6));
      const nLng = Number(lngLat.lng.toFixed(6));
      setPickedLat(nLat);
      setPickedLng(nLng);
    });

    // Click map to reposition pin
    map.on('click', (e) => {
      const nLat = Number(e.lngLat.lat.toFixed(6));
      const nLng = Number(e.lngLat.lng.toFixed(6));
      setPickedLat(nLat);
      setPickedLng(nLng);
      marker.setLngLat([nLng, nLat]);
      map.easeTo({ center: [nLng, nLat], duration: 400 });
    });

    map.on('load', () => {
      setMapLoaded(true);
      map.resize();
    });

    return () => {
      marker.remove();
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
      setMapLoaded(false);
    };
  }, [isOpen]);

  // Handle GPS location detection
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));
        setPickedLat(lat);
        setPickedLng(lng);
        if (mapRef.current && markerRef.current) {
          markerRef.current.setLngLat([lng, lat]);
          mapRef.current.flyTo({ center: [lng, lat], zoom: 15, duration: 1000 });
        }
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation failed:', err.message);
        // Fallback to activeCity if GPS fails
        if (activeCity && mapRef.current && markerRef.current) {
          setPickedLat(activeCity.lat);
          setPickedLng(activeCity.lng);
          markerRef.current.setLngLat([activeCity.lng, activeCity.lat]);
          mapRef.current.flyTo({ center: [activeCity.lng, activeCity.lat], zoom: 13 });
        }
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleConfirm = () => {
    onConfirm({ lat: pickedLat, lng: pickedLng });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-[#090d1f] border border-indigo-500/30 rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden z-10 flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-white/5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{title}</span>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-mono">
                  Interactive GIS Picker
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Click anywhere on the map or drag the pin marker to pick exact site coordinates
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Map Canvas Area */}
        <div className="relative w-full h-[380px] bg-[#050814] overflow-hidden">
          <div ref={mapContainerRef} className="w-full h-full cursor-crosshair" />

          {/* Floating Instructions Banner */}
          <div className="absolute top-3 left-3 z-10 bg-black/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl text-[11px] text-slate-200 shadow-xl flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Click map to drop pin • Drag marker to adjust</span>
          </div>

          {/* Floating Action Controls */}
          <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
            {/* GPS Locate Button */}
            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={isLocating}
              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-600/30 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              title="Detect my GPS location"
            >
              <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isLocating ? 'Locating...' : 'My Location'}</span>
            </button>

            {/* Zoom In/Out */}
            <div className="flex flex-col gap-1 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl p-1 shadow-lg">
              <button
                type="button"
                onClick={() => mapRef.current?.zoomIn()}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => mapRef.current?.zoomOut()}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Live Picked Coordinates HUD Badge */}
          <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-2xl bg-[#090d1f]/90 backdrop-blur-md border border-indigo-500/40 text-xs text-white shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-medium text-[11px]">Lat:</span>
                <span className="font-mono font-bold text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded-lg border border-indigo-500/30">
                  {pickedLat.toFixed(6)}°N
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-medium text-[11px]">Lng:</span>
                <span className="font-mono font-bold text-violet-300 bg-violet-950/60 px-2 py-0.5 rounded-lg border border-violet-500/30">
                  {pickedLng.toFixed(6)}°E
                </span>
              </div>
            </div>

            {activeCity && (
              <span className="text-[10px] text-slate-400 hidden sm:inline">
                Target City: <b>{activeCity.name}</b>
              </span>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 bg-white/5 flex items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400">
            Selected coordinate will be transferred directly into the spatial analyzer.
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Apply Pin Coordinates</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
