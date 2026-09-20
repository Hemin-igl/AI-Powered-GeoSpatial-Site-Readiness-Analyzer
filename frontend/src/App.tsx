import React, { useState } from 'react';
import { Sparkles, Bot } from 'lucide-react';
import { BusinessType, CandidateSite, MapLayerConfig } from './types';
import { CITIES, CITY_DATA, DEFAULT_MAP_LAYERS, DEFAULT_CANDIDATE_SITES } from './data/mockData';
import { City } from './types';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { SiteDrawer } from './components/SiteDrawer';
import { NewSiteModal } from './components/NewSiteModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { AuthModal } from './components/AuthModal';

// Pages
import { IntroPage } from './pages/IntroPage';
import { HomePage } from './pages/HomePage';
import { OverviewPage } from './pages/OverviewPage';
import { SiteAnalysisPage } from './pages/SiteAnalysisPage';
import { AccessibilityPage } from './pages/AccessibilityPage';
import { CompetitionPage } from './pages/CompetitionPage';
import { DemographicsPage } from './pages/DemographicsPage';
import { HotspotsPage } from './pages/HotspotsPage';
import { OpportunityMapPage } from './pages/OpportunityMapPage';
import { CompareSitesPage } from './pages/CompareSitesPage';
import { DataLayersPage } from './pages/DataLayersPage';
import { ReportsPage } from './pages/ReportsPage';
import { RiskAnalysisPage } from './pages/RiskAnalysisPage';
import { SettingsPage } from './pages/SettingsPage';
import { analyzeSite } from './services/gisService';

export default function App() {
  const [showIntroPage, setShowIntroPage] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  const [activeTab, setActiveTab] = useState<string>('home');
  const [activeCity, setActiveCity] = useState<City>(CITIES[0]);
  const activeCityData = CITY_DATA[activeCity.id] || {
    city: activeCity,
    candidateSites: DEFAULT_CANDIDATE_SITES,
    competitors: [],
    h3Cells: [],
    demographics: { totalMetropolitanPopulation: 4850000, averageDensityPerSqKm: 14200, medianMonthlyIncomeINR: 64000, activeHouseholds: 1180000, ageDistribution: [], incomeBrackets: [] },
    opportunityZones: [],
    riverCoordinates: [],
    roads: [],
  };

  const [sites, setSites] = useState<CandidateSite[]>(DEFAULT_CANDIDATE_SITES);
  const [selectedSite, setSelectedSite] = useState<CandidateSite>(DEFAULT_CANDIDATE_SITES[0]);
  const [layers, setLayers] = useState<MapLayerConfig[]>(DEFAULT_MAP_LAYERS);
  const [comparisonSiteIds, setComparisonSiteIds] = useState<string[]>([]);

  // Handle city switch gracefully
  const handleCityChange = (cityId: string) => {
    const newCity = CITIES.find(c => c.id === cityId);
    if (!newCity) return;
    setActiveCity(newCity);
    const cData = CITY_DATA[newCity.id];
    if (cData && cData.candidateSites.length > 0) {
      setSites(cData.candidateSites);
      setSelectedSite(cData.candidateSites[0]);
    }
    setActiveTab('overview');
  };

  // Modals & Panels
  const [isSiteDrawerOpen, setIsSiteDrawerOpen] = useState(false);
  const [isNewSiteModalOpen, setIsNewSiteModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Layer handlers
  const handleToggleLayer = (layerId: string) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === layerId ? { ...l, active: !l.active } : l))
    );
  };

  const handleChangeOpacity = (layerId: string, opacity: number) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === layerId ? { ...l, opacity } : l))
    );
  };

  const handleAddLayer = (newLayer: MapLayerConfig) => {
    setLayers((prev) => [newLayer, ...prev]);
  };

  // Site selection from map or list
  const handleSelectSite = (site: CandidateSite) => {
    setSelectedSite(site);
    setIsSiteDrawerOpen(true);
  };

  // Compare toggle
  const handleToggleSiteComparison = (site: CandidateSite) => {
    setComparisonSiteIds((prev) => {
      if (prev.includes(site.id)) {
        return prev.filter((id) => id !== site.id);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), site.id];
      }
      return [...prev, site.id];
    });
  };

  // Analyze new custom site from modal
  const handleAnalyzeNewSite = async (data: {
    name: string;
    lat: number;
    lng: number;
    businessType: BusinessType;
  }) => {
    const analyzed = await analyzeSite({
      lat: data.lat,
      lng: data.lng,
      businessType: data.businessType,
      weights: {
        population: 0.3,
        accessibility: 0.25,
        competition: 0.15,
        landUse: 0.15,
        environmentalRisk: 0.15,
      },
      radiusKm: 5,
    });

    const newCandidate: CandidateSite = {
      ...analyzed,
      name: data.name,
    };

    setSites((prev) => [newCandidate, ...prev]);
    setSelectedSite(newCandidate);
    setActiveTab('site-analysis');
  };

  // 1. INTRO PAGE VIEW (Black Background on Website Load)
  if (showIntroPage) {
    return (
      <>
        <IntroPage
          onEnterPlatform={() => setShowIntroPage(false)}
          onOpenAuthModal={(mode) => {
            setAuthModalMode(mode || 'login');
            setIsAuthModalOpen(true);
          }}
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialMode={authModalMode}
          onSuccess={() => setShowIntroPage(false)}
        />
      </>
    );
  }

  // 2. MAIN APPLICATION WORKSPACE
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f8fafc] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased transition-colors">
      {/* 1. PERSISTENT SIDEBAR NAVIGATION */}
      <Sidebar
        activeCity={activeCity}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        openAiModal={() => setIsAiModalOpen(true)}
      />

      {/* 2. MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Navbar */}
        <Navbar
          activeCity={activeCity}
          onOpenNewSiteModal={() => setIsNewSiteModalOpen(true)}
          activeTab={activeTab}
          candidateSites={sites}
          onSelectSite={handleSelectSite}
          onNavigateTab={setActiveTab}
          onOpenAuthModal={() => {
            setAuthModalMode('login');
            setIsAuthModalOpen(true);
          }}
          onOpenIntroPage={() => setShowIntroPage(true)}
          onSearchSelect={(siteId) => {
            const found = sites.find((s) => s.id === siteId);
            if (found) {
              setSelectedSite(found);
              setIsSiteDrawerOpen(true);
            }
          }}
        />

        {/* Dynamic Page Workspace (Scrollable) */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-6">
            {activeTab === 'home' && (
              <HomePage
                activeCity={activeCity}
                onNavigateTab={setActiveTab}
                onOpenNewSiteModal={() => setIsNewSiteModalOpen(true)}
                onOpenAiModal={() => setIsAiModalOpen(true)}
              />
            )}

            {activeTab === 'overview' && (
              <OverviewPage
                activeCity={activeCity}
                availableCities={CITIES}
                onCityChange={handleCityChange}
                sites={sites}
                selectedSite={selectedSite}
                onSelectSite={handleSelectSite}
                competitors={activeCityData.competitors}
                h3Cells={activeCityData.h3Cells}
                layers={layers}
                onToggleLayer={handleToggleLayer}
                onChangeOpacity={handleChangeOpacity}
                onNavigateTab={setActiveTab}
                onOpenNewSiteModal={() => setIsNewSiteModalOpen(true)}
              />
            )}

            {activeTab === 'site-analysis' && (
              <SiteAnalysisPage
                activeCity={activeCity}
                currentSite={selectedSite}
                onUpdateSite={(updated) => {
                  setSelectedSite(updated);
                  setSites((prev) =>
                    prev.map((s) => (s.id === updated.id ? updated : s))
                  );
                }}
                onAddToCompare={handleToggleSiteComparison}
                isInCompare={comparisonSiteIds.includes(selectedSite.id)}
                onNavigateTab={setActiveTab}
              />
            )}

            {activeTab === 'opportunity-map' && (
              <OpportunityMapPage
                activeCity={activeCity}
                opportunityZones={activeCityData.opportunityZones}
                sites={sites}
                selectedSite={selectedSite}
                onSelectSite={handleSelectSite}
                onNavigateTab={setActiveTab}
              />
            )}

            {activeTab === 'accessibility' && (
              <AccessibilityPage
                activeCity={activeCity}
                currentSite={selectedSite}
                sites={sites}
                onSelectSite={handleSelectSite}
              />
            )}

            {activeTab === 'competition' && (
              <CompetitionPage
                activeCity={activeCity}
                currentSite={selectedSite}
                competitors={activeCityData.competitors}
                onSelectSite={handleSelectSite}
              />
            )}

            {activeTab === 'demographics' && (
              <DemographicsPage
                activeCity={activeCity}
                demographics={activeCityData.demographics}
                currentSite={selectedSite}
                onSelectSite={handleSelectSite}
              />
            )}

            {activeTab === 'hotspots' && (
              <HotspotsPage
                activeCity={activeCity}
                currentSite={selectedSite}
                sites={sites}
                competitors={activeCityData.competitors}
                h3Cells={activeCityData.h3Cells}
                onSelectSite={handleSelectSite}
              />
            )}

            {activeTab === 'compare-sites' && (
              <CompareSitesPage
                activeCity={activeCity}
                sites={sites}
                comparisonSiteIds={comparisonSiteIds}
                onToggleCompare={handleToggleSiteComparison}
                onSelectSite={handleSelectSite}
                onNavigateTab={setActiveTab}
              />
            )}

            {activeTab === 'data-layers' && (
              <DataLayersPage
                layers={layers}
                onToggleLayer={handleToggleLayer}
                onChangeOpacity={handleChangeOpacity}
                onAddLayer={handleAddLayer}
              />
            )}

            {activeTab === 'reports' && (
              <ReportsPage
                activeCity={activeCity}
                currentSite={selectedSite}
                sites={sites}
                onSelectSite={handleSelectSite}
                onNavigateTab={setActiveTab}
              />
            )}

            {activeTab === 'risk-analysis' && (
              <RiskAnalysisPage
                activeCity={activeCity}
                currentSite={selectedSite}
                sites={sites}
                onSelectSite={handleSelectSite}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsPage activeCity={activeCity} />
            )}
          </div>
        </main>
      </div>

      {/* 3. SITE DETAIL DRAWER */}
      {isSiteDrawerOpen && (
        <SiteDrawer
          activeCity={activeCity}
          site={selectedSite}
          onClose={() => setIsSiteDrawerOpen(false)}
          onGoToAnalysis={(site) => {
            setSelectedSite(site);
            setIsSiteDrawerOpen(false);
            setActiveTab('site-analysis');
          }}
          onAddToCompare={handleToggleSiteComparison}
          isInComparison={comparisonSiteIds.includes(selectedSite.id)}
        />
      )}

      {/* 4. NEW SITE MODAL */}
      <NewSiteModal
        activeCity={activeCity}
        isOpen={isNewSiteModalOpen}
        onClose={() => setIsNewSiteModalOpen(false)}
        onSubmit={handleAnalyzeNewSite}
      />

      {/* 5. FLOATING AI ASSISTANT CHAT PANEL */}
      <AiAssistantModal
        activeCity={activeCity}
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        activeSite={selectedSite}
        onNavigateTab={setActiveTab}
      />

      {/* 6. FLOATING AI ASSISTANT TRIGGER BUTTON */}
      {!isAiModalOpen && (
        <button
          onClick={() => setIsAiModalOpen(true)}
          className="fixed bottom-6 right-6 z-30 flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-bold text-xs rounded-2xl shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/40 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
          title="Open GeoReady AI Copilot"
        >
          <div className="relative">
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full ring-2 ring-indigo-600"></span>
          </div>
          <span>GeoReady AI</span>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-md font-mono text-white/90">
            Ask GIS
          </span>
        </button>
      )}

      {/* 7. AUTH MODAL */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </div>
  );
}
