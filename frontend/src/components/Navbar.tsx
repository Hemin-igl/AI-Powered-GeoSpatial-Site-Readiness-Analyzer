import React, { useState } from 'react';
import {
  Search,
  Bell,
  HelpCircle,
  Plus,
  Compass,
  MapPin,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  Home,
  LayoutDashboard,
  ArrowRight,
  Sun,
  Moon,
} from 'lucide-react';
import { CandidateSite, City } from '../types';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  activeCity: City;
  activeTab: string;
  onOpenNewSiteModal: () => void;
  onSelectSite?: (site: CandidateSite) => void;
  onSearchSelect?: (siteId: string) => void;
  onNavigateTab?: (tab: string) => void;
  candidateSites?: CandidateSite[];
}

export const Navbar: React.FC<NavbarProps> = ({
  activeCity,
  activeTab,
  onOpenNewSiteModal,
  onSelectSite,
  onSearchSelect,
  onNavigateTab,
  candidateSites = [],
}) => {
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Format tab label nicely
  const tabTitles: Record<string, { title: string; subtitle: string }> = {
    home: { title: 'Welcome & System Guide', subtitle: 'Start' },
    overview: { title: 'Site Intelligence Dashboard', subtitle: 'Overview' },
    'site-analysis': { title: 'Site Readiness Analyzer', subtitle: 'Site Analysis' },
    'opportunity-map': { title: 'Opportunity Discovery Map', subtitle: 'Opportunity Map' },
    'compare-sites': { title: 'Multi-Site Comparison Matrix', subtitle: 'Compare Sites' },
    demographics: { title: 'Demographics & Population Density', subtitle: 'Analytics' },
    accessibility: { title: 'Accessibility & Isochrone Catchments', subtitle: 'Analytics' },
    competition: { title: 'Competition & Spatial Decay Index', subtitle: 'Analytics' },
    'risk-analysis': { title: 'Environmental & Hazard Risk Matrix', subtitle: 'Analytics' },
    hotspots: { title: 'Spatial Hotspots & Cluster Algorithms', subtitle: 'Analytics' },
    'data-layers': { title: 'Spatial Data Layer Management', subtitle: 'Tools' },
    reports: { title: 'Automated Site Readiness Reports', subtitle: 'Tools' },
    settings: { title: 'GIS Engine Preferences & Settings', subtitle: 'System' },
  };

  const currentTabInfo = tabTitles[activeTab] || { title: 'Dashboard', subtitle: 'GeoReady' };

  // Filter candidate sites for search dropdown
  const filteredSites = searchQuery.trim()
    ? candidateSites
        .filter(
          (s) =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.businessType.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  return (
    <header className="sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100/90 dark:border-slate-800/90 px-6 py-3.5 flex items-center justify-between gap-4 transition-colors">
      {/* Breadcrumbs & Title */}
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 font-medium">
          <button
            onClick={() => onNavigateTab?.('home')}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold transition-colors cursor-pointer flex items-center gap-1"
          >
            <Home className="w-3.5 h-3.5" />
            <span>GeoReady</span>
          </button>
          <span>/</span>
          <span className="text-slate-600 dark:text-slate-300 font-medium">{currentTabInfo.subtitle}</span>
          <span>/</span>
          <span className="text-indigo-600 dark:text-indigo-400 font-semibold truncate">{activeCity.name} Metro</span>
        </div>
        <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight truncate mt-0.5">
          {currentTabInfo.title}
        </h1>
      </div>

      {/* Right Controls: Search + Actions + Avatar */}
      <div className="flex items-center gap-3">
        {/* Search Box */}
        <div className="relative">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              placeholder="Search locations, sites, or areas..."
              className="w-64 lg:w-80 pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/90 hover:bg-slate-100/70 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl border border-slate-200/80 dark:border-slate-700/80 focus:border-indigo-500 focus:outline-hidden focus:ring-3 focus:ring-indigo-500/10 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setShowSearchResults(false);
                }}
                className="absolute right-2.5 text-slate-400 hover:text-slate-600 text-xs px-1"
              >
                ×
              </button>
            )}
          </div>

          {/* Search Autocomplete Results */}
          {showSearchResults && filteredSites.length > 0 && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowSearchResults(false)}
              />
              <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Candidate Sites ({filteredSites.length})
                </div>
                <div className="space-y-1">
                  {filteredSites.map((site) => (
                    <div
                      key={site.id}
                      onClick={() => {
                        if (onSelectSite) onSelectSite(site);
                        if (onSearchSelect) onSearchSelect(site.id);
                        setShowSearchResults(false);
                        setSearchQuery('');
                      }}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-indigo-50/70 cursor-pointer group transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                          <MapPin className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-semibold text-slate-800 group-hover:text-indigo-700 truncate">
                            {site.name}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {site.area} • {site.businessType}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-indigo-600 bg-white px-2 py-0.5 rounded-md border border-indigo-100 shadow-xs">
                        {site.readinessScore}/100
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-xl border border-slate-200/70 transition-colors relative"
            title="Spatial Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-900">Spatial Intelligence Alerts</span>
                  <span className="text-[10px] text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded-full">
                    3 New
                  </span>
                </div>
                <div className="space-y-3 pt-3">
                  <div className="flex gap-2.5 items-start">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-slate-800">New High-Readiness Zone</span>
                      <span className="text-[11px] text-slate-500 leading-snug">
                        Vesu VIP Cross Road exceeded 82/100 threshold after census update.
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1">2 mins ago</span>
                    </div>
                  </div>
                  <div className="flex gap-2.5 items-start">
                    <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-slate-800">Competitor Detected</span>
                      <span className="text-[11px] text-slate-500 leading-snug">
                        Jio-bp pulse station registered within 2.1km of Dumas Tech Corridor.
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1">18 mins ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-amber-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl border border-slate-200/70 dark:border-slate-700/80 transition-colors relative cursor-pointer group"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 transition-transform group-hover:rotate-45" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600 transition-transform group-hover:-rotate-12" />
          )}
        </button>

        {/* Help Button */}
        <div className="relative">
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl border border-slate-200/70 dark:border-slate-700/80 transition-colors"
            title="Help & GIS Documentation"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {showHelp && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowHelp(false)} />
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-4 z-50">
                <div className="flex items-center gap-2 mb-2 text-indigo-700 dark:text-indigo-400 font-bold text-xs">
                  <Info className="w-4 h-4" />
                  GeoReady Platform Guide
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  GeoReady combines multi-criteria GIS spatial evaluation with machine learning. Click any candidate site or H3 hexagon on the map to evaluate readiness scores, configure factor weights, or run catchment analysis.
                </p>
                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 dark:text-slate-500">
                  Target Coordinate System: EPSG:4326 (WGS84)
                </div>
              </div>
            </>
          )}
        </div>

        {/* Quick Home / Workspace Toggle */}
        {activeTab !== 'home' ? (
          <button
            onClick={() => onNavigateTab?.('home')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all cursor-pointer"
            title="Return to Home & Operating Guide"
          >
            <Home className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Home & Guide</span>
          </button>
        ) : (
          <button
            onClick={() => onNavigateTab?.('overview')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <span>Open Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Primary Action Button: + New Site Analysis */}
        <button
          onClick={onOpenNewSiteModal}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white text-xs font-semibold shadow-xs transition-all hover:scale-[1.01]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden md:inline">New Site Analysis</span>
          <span className="md:hidden">New</span>
        </button>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200/70 dark:border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-500 text-white font-semibold flex items-center justify-center text-xs shadow-xs">
            RP
          </div>
          <div className="hidden xl:flex flex-col">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">Rahul Patel</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">Analyst</span>
          </div>
        </div>
      </div>
    </header>
  );
};
