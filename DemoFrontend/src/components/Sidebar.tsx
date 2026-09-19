import React from 'react';
import {
  LayoutDashboard,
  MapPin,
  Compass,
  GitCompare,
  Users,
  Navigation,
  Crosshair,
  ShieldAlert,
  Flame,
  Layers,
  Sparkles,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Building2,
  Sliders,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
  badgeText?: string;
  isAction?: boolean;
  action?: () => void;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

interface SidebarProps {
  activeTab: string;
  setActiveTab?: (tab: string) => void;
  onTabChange?: (tab: string) => void;
  collapsed?: boolean;
  setCollapsed?: (collapsed: boolean) => void;
  openAiModal?: () => void;
  opportunityCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onTabChange,
  collapsed = false,
  setCollapsed,
  openAiModal,
  opportunityCount = 24,
}) => {
  const handleTabClick = (tabId: string) => {
    if (onTabChange) onTabChange(tabId);
    if (setActiveTab) setActiveTab(tabId);
  };

  const navSections: NavSection[] = [
    {
      title: 'MAIN',
      items: [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'site-analysis', label: 'Site Analysis', icon: MapPin },
        { id: 'opportunity-map', label: 'Opportunity Map', icon: Compass, badge: opportunityCount },
        { id: 'compare-sites', label: 'Compare Sites', icon: GitCompare },
      ],
    },
    {
      title: 'ANALYTICS',
      items: [
        { id: 'demographics', label: 'Demographics', icon: Users },
        { id: 'accessibility', label: 'Accessibility', icon: Navigation },
        { id: 'competition', label: 'Competition', icon: Crosshair },
        { id: 'risk-analysis', label: 'Risk Analysis', icon: ShieldAlert },
        { id: 'hotspots', label: 'Hotspots & Clusters', icon: Flame },
      ],
    },
    {
      title: 'TOOLS',
      items: [
        { id: 'data-layers', label: 'Data Layers', icon: Layers },
        {
          id: 'ai-assistant',
          label: 'AI Assistant',
          icon: Sparkles,
          isAction: true,
          action: openAiModal,
          badgeText: 'GPT-4o',
        },
        { id: 'reports', label: 'Reports', icon: FileText },
      ],
    },
    {
      title: 'SYSTEM',
      items: [{ id: 'settings', label: 'Settings', icon: Settings }],
    },
  ];

  return (
    <aside
      className={`relative flex flex-col h-screen bg-white border-r border-slate-100 transition-all duration-300 z-30 shrink-0 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-18 px-5 border-b border-slate-100/80">
        <div
          onClick={() => handleTabClick('overview')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          {/* Logo Pin Icon */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <svg
              className="w-5 h-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 19 21 12 17 5 21 12 2" fill="currentColor" fillOpacity="0.25" />
              <circle cx="12" cy="11" r="2.5" fill="#ffffff" stroke="none" />
            </svg>
          </div>

          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-lg text-slate-900 tracking-tight flex items-center gap-1.5">
                GeoReady
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                  GIS v2.4
                </span>
              </span>
              <span className="text-[11px] text-slate-400 font-medium tracking-wide">
                AI-powered site intelligence
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => setCollapsed?.(!collapsed)}
          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Selected Workspace badge */}
      {!collapsed && (
        <div className="mx-4 my-3 p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-6 h-6 rounded-lg bg-indigo-100/70 text-indigo-700 flex items-center justify-center text-xs font-semibold">
              <Building2 className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-slate-800 truncate">Surat Municipal Area</span>
              <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Spatial Model Live
              </span>
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        </div>
      )}

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-5 custom-scrollbar">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1">
            {!collapsed && (
              <p className="px-3 text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                {section.title}
              </p>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.isAction && item.action) {
                      item.action();
                    } else {
                      handleTabClick(item.id);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group relative ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive
                        ? 'text-indigo-600'
                        : 'text-slate-400 group-hover:text-indigo-600'
                    }`}
                  />
                  {!collapsed && (
                    <span className="flex-1 text-left truncate">{item.label}</span>
                  )}
                  {!collapsed && item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {!collapsed && item.badgeText && (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-purple-100 text-purple-700">
                      {item.badgeText}
                    </span>
                  )}

                  {/* Active Indicator Bar on Left */}
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-indigo-600 rounded-r-full" />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* User Profile Card at Bottom */}
      <div className="p-3 border-t border-slate-100/90 bg-slate-50/50">
        <div
          className={`flex items-center ${
            collapsed ? 'justify-center' : 'gap-3 px-2 py-1.5'
          } rounded-xl hover:bg-white transition-colors cursor-pointer`}
          onClick={() => handleTabClick('settings')}
        >
          <div className="relative shrink-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-500 text-white font-semibold flex items-center justify-center text-xs shadow-xs">
              RP
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
          </div>

          {!collapsed && (
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold text-slate-800 truncate">Rahul Patel</span>
              <span className="text-[11px] text-slate-400 truncate">GIS Analyst</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
