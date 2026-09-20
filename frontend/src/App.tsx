import React, { useState } from 'react';
import { Sparkles, Bot } from 'lucide-react';
import { BusinessType, CandidateSite, MapLayerConfig } from './types';
import {
  MOCK_CANDIDATE_SITES,
  MOCK_COMPETITORS,
  SURAT_H3_GRID,
  DEFAULT_MAP_LAYERS,
} from './data/suratData';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { SiteDrawer } from './components/SiteDrawer';
import { NewSiteModal } from './components/NewSiteModal';
import { AiAssistantModal } from './components/AiAssistantModal';

// Pages
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
  const [activeTab, setActiveTab] = useState<string>('home');
  const [sites, setSites] = useState<CandidateSite[]>(MOCK_CANDIDATE_SITES);
  const [selectedSite, setSelectedSite] = useState<CandidateSite>(MOCK_CANDIDATE_SITES[0]);
  const [layers, setLayers] = useState<MapLayerConfig[]>(DEFAULT_MAP_LAYERS);
  const [comparisonSiteIds, setComparisonSiteIds] = useState<string[]>([
    MOCK_CANDIDATE_SITES[0].id,
    MOCK_CANDIDATE_SITES[1].id,
  ]);

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

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f8fafc] text-slate-900 font-sans antialiased">
      {/* 1. PERSISTENT SIDEBAR NAVIGATION */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        openAiModal={() => setIsAiModalOpen(true)}
      />

      {/* 2. MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Navbar */}
        <Navbar
          onOpenNewSiteModal={() => setIsNewSiteModalOpen(true)}
          activeTab={activeTab}
          candidateSites={sites}
          onSelectSite={handleSelectSite}
          onNavigateTab={setActiveTab}
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
                onNavigateTab={setActiveTab}
                onOpenNewSiteModal={() => setIsNewSiteModalOpen(true)}
                onOpenAiModal={() => setIsAiModalOpen(true)}
              />
            )}

            {activeTab === 'overview' && (
              <OverviewPage
                sites={sites}
                selectedSite={selectedSite}
                onSelectSite={handleSelectSite}
                competitors={MOCK_COMPETITORS}
                h3Cells={SURAT_H3_GRID}
                layers={layers}
                onToggleLayer={handleToggleLayer}
                onChangeOpacity={handleChangeOpacity}
                onNavigateTab={setActiveTab}
                onOpenNewSiteModal={() => setIsNewSiteModalOpen(true)}
              />
            )}

            {activeTab === 'site-analysis' && (
              <SiteAnalysisPage
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
                sites={sites}
                selectedSite={selectedSite}
                onSelectSite={handleSelectSite}
                onNavigateTab={setActiveTab}
              />
            )}

            {activeTab === 'accessibility' && (
              <AccessibilityPage
                currentSite={selectedSite}
                sites={sites}
                onSelectSite={handleSelectSite}
              />
            )}

            {activeTab === 'competition' && (
              <CompetitionPage
                currentSite={selectedSite}
                competitors={MOCK_COMPETITORS}
                onSelectSite={handleSelectSite}
              />
            )}

            {activeTab === 'demographics' && (
              <DemographicsPage
                currentSite={selectedSite}
                onSelectSite={handleSelectSite}
              />
            )}

            {activeTab === 'hotspots' && (
              <HotspotsPage
                currentSite={selectedSite}
                sites={sites}
                competitors={MOCK_COMPETITORS}
                h3Cells={SURAT_H3_GRID}
                onSelectSite={handleSelectSite}
              />
            )}

            {activeTab === 'compare-sites' && (
              <CompareSitesPage
                sites={sites}
                comparisonSiteIds={comparisonSiteIds}
                onToggleSiteComparison={handleToggleSiteComparison}
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
                currentSite={selectedSite}
                sites={sites}
                onSelectSite={handleSelectSite}
              />
            )}

            {activeTab === 'risk-analysis' && (
              <RiskAnalysisPage
                currentSite={selectedSite}
                sites={sites}
                onSelectSite={handleSelectSite}
              />
            )}

            {activeTab === 'settings' && <SettingsPage />}
          </div>
        </main>
      </div>

      {/* 3. SITE DETAIL DRAWER (Slides in from right when site clicked) */}
      {isSiteDrawerOpen && (
        <SiteDrawer
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
        isOpen={isNewSiteModalOpen}
        onClose={() => setIsNewSiteModalOpen(false)}
        onSubmit={handleAnalyzeNewSite}
      />

      {/* 5. FLOATING AI ASSISTANT CHAT PANEL */}
      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        activeSite={selectedSite}
        onNavigateTab={setActiveTab}
      />

      {/* 6. FLOATING AI ASSISTANT TRIGGER BUTTON (Bottom-Right) */}
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
    </div>
  );
}
