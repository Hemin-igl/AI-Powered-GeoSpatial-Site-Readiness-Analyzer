import React, { useState } from 'react';
import {
  Layers,
  Upload,
  Eye,
  EyeOff,
  Sliders,
  Calendar,
  FileCode,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { City, MapLayerConfig } from '../types';

interface DataLayersPageProps {
  activeCity: City;
  layers: MapLayerConfig[];
  onToggleLayer: (layerId: string) => void;
  onChangeOpacity: (layerId: string, opacity: number) => void;
  onAddLayer: (layer: MapLayerConfig) => void;
}

export const DataLayersPage: React.FC<DataLayersPageProps> = ({
  activeCity,
  layers,
  onToggleLayer,
  onChangeOpacity,
  onAddLayer,
}) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [datasetName, setDatasetName] = useState(`${activeCity.name} Phase 2 Corridors`);
  const [fileFormat, setFileFormat] = useState('GeoJSON');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleSimulateUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      const newLayer: MapLayerConfig = {
        id: `layer_user_${Date.now()}`,
        name: datasetName,
        category: 'core',
        active: true,
        opacity: 0.85,
        featureCount: 342,
        lastUpdated: 'Just now',
        color: '#f59e0b',
        description: `User uploaded spatial vector geometry for ${activeCity.name} transit arteries.`,
      };
      onAddLayer(newLayer);
      setTimeout(() => {
        setShowUploadModal(false);
        setUploadSuccess(false);
      }, 1000);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Spatial Data Layers & Catalog
            </h1>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/60">
              {layers.filter((l) => l.active).length} Active Layers
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage vector datasets, raster overlays, opacity blending, and ingest external GeoJSON or Shapefiles.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Dataset (GeoJSON/SHP)</span>
        </button>
      </div>

      {/* Layers Catalog Table / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {layers.map((layer) => (
          <div
            key={layer.id}
            className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs"
                    style={{ backgroundColor: layer.color }}
                  >
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{layer.name}</h3>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 capitalize">
                      {layer.category} Layer • {layer.featureCount.toLocaleString()} features
                    </span>
                  </div>
                </div>

                {/* Active Switch */}
                <button
                  onClick={() => onToggleLayer(layer.id)}
                  className={`p-2 rounded-xl transition-colors cursor-pointer ${
                    layer.active
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/80'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                  title={layer.active ? 'Hide layer' : 'Show layer'}
                >
                  {layer.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
                {layer.description}
              </p>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-50 dark:border-slate-800">
              {/* Opacity Slider */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600 dark:text-slate-300">Layer Opacity</span>
                  <span className="font-mono text-slate-700 dark:text-slate-200 font-bold">
                    {Math.round(layer.opacity * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={layer.opacity}
                  disabled={!layer.active}
                  onChange={(e) => onChangeOpacity(layer.id, parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600 disabled:opacity-40"
                />
              </div>

              {/* Footer Meta */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Updated: {layer.lastUpdated}
                </span>
                <span className="font-mono bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                  EPSG:4326
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Simulated Upload Dataset Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Upload Spatial Dataset</h3>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 text-xs font-semibold"
              >
                Close
              </button>
            </div>

            {uploadSuccess ? (
              <div className="p-6 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto animate-bounce" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Dataset Ingested Successfully!</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Imported 342 features into {activeCity.name} spatial runtime. Layer is now available on map.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSimulateUpload} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Dataset Title / Layer Identifier
                  </label>
                  <input
                    type="text"
                    value={datasetName}
                    onChange={(e) => setDatasetName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Spatial Vector Format
                  </label>
                  <select
                    value={fileFormat}
                    onChange={(e) => setFileFormat(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 font-medium focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 outline-hidden"
                  >
                    <option value="GeoJSON" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">GeoJSON (.geojson, .json)</option>
                    <option value="Shapefile" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">ESRI Shapefile Archive (.zip)</option>
                    <option value="KML" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Keyhole Markup Language (.kml, .kmz)</option>
                    <option value="CSV" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Geocoded Points CSV (Lat, Long)</option>
                  </select>
                </div>

                {/* Drag and drop mock dropzone */}
                <div className="p-6 border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-center cursor-pointer transition-colors">
                  <FileCode className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                  <span className="font-semibold text-slate-700 dark:text-slate-200 block">
                    Click to browse or drop spatial files here
                  </span>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 block mt-1">
                    Max file size 50 MB • Coordinate system WGS84 auto-projected
                  </span>
                </div>

                <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-xs flex items-center gap-1.5"
                  >
                    {isUploading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Validating Geometry...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>Ingest Dataset</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
