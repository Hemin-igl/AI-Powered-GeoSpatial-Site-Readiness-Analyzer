import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Compass,
  MapPin,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Building2,
  Navigation,
  FileText,
  Mail,
  Send,
  HelpCircle,
  TrendingUp,
  Map as MapIcon,
  ChevronRight,
  Info,
  Clock,
  Phone,
  Crosshair,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import { BusinessType, City } from '../types';

interface HomePageProps {
  onNavigateTab: (tab: string) => void;
  onOpenNewSiteModal?: () => void;
  onOpenAiModal?: () => void;
  activeCity?: City;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigateTab,
  onOpenNewSiteModal,
  onOpenAiModal,
  activeCity,
}) => {
  const cityName = activeCity ? activeCity.name : 'Your Target Region';
  const cityRegion = activeCity ? activeCity.state : 'Metropolitan Area';

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    topic: 'Site Consultation',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email) return;
    setSubmitted(true);
    setTimeout(() => {
      // keep success feedback visible
    }, 4000);
  };

  const steps = [
    {
      step: '01',
      title: 'Select Business Archetype',
      shortDesc: 'Choose what you want to build',
      desc: 'Pick your specific venture: Retail Store, EV Charging Station, Distribution Warehouse, Telecom Tower, or Renewable Solar installation. Each archetype triggers tailored spatial logic.',
      actionLabel: 'Launch Site Analysis',
      tabTarget: 'site-analysis',
      icon: Building2,
      tip: 'Weights automatically adjust based on whether footfall or road access matters most.',
    },
    {
      step: '02',
      title: `Explore & Pin Target Locations`,
      shortDesc: 'Scan candidate zones or add custom coordinates',
      desc: `Browse prime localities across ${cityName} or input any custom coordinates to evaluate readiness.`,
      actionLabel: 'Open Opportunity Map',
      tabTarget: 'opportunity-map',
      icon: MapPin,
      tip: 'Filter candidate sites by potential tier: High Potential, Moderate, or Under Review.',
    },
    {
      step: '03',
      title: 'Fine-Tune Multi-Criteria Weights',
      shortDesc: 'Balance population, competition, and risk',
      desc: 'Use dynamic sliders to adjust the relative importance of Population Density, Road Accessibility, Competitor Distance Decay, Land Zoning, and Environmental Hazard.',
      actionLabel: 'Adjust Weights & Layers',
      tabTarget: 'data-layers',
      icon: Sliders,
      tip: 'Readiness scores update instantly in real time using GIS normalization algorithms.',
    },
    {
      step: '04',
      title: 'Inspect Catchments & AI Reasoning',
      shortDesc: 'Drive/walk isochrones & executive summaries',
      desc: 'View 10, 20, and 30-minute travel catchment polygons. The built-in GeoReady AI analyzes spatial vulnerabilities and generates actionable strategic recommendations.',
      actionLabel: 'View Accessibility Catchments',
      tabTarget: 'accessibility',
      icon: Navigation,
      tip: `Isochrones reflect ${cityName} urban street grid speeds and bottlenecks.`,
    },
    {
      step: '05',
      title: 'Compare Sites & Export Reports',
      shortDesc: 'Multi-site benchmarking & PDF dossiers',
      desc: 'Select up to 3 candidate locations to benchmark on radar charts, examine head-to-head metrics, and generate audit-ready PDF/CSV site dossiers for leadership and investors.',
      actionLabel: 'Compare Candidate Sites',
      tabTarget: 'compare-sites',
      icon: FileText,
      tip: 'Reports include demographic summaries, competitor lists, and hazard clearances.',
    },
  ];

  const quickPillars = [
    {
      title: 'Uber H3 Hexagonal Grid',
      desc: `Resolution-8 spatial indexing across ${cityName} provides uniform cell-level demographic comparisons without arbitrary boundary bias.`,
      icon: Layers,
    },
    {
      title: 'Isochrone Catchment Physics',
      desc: `Accurate drive-time and walk-time polygons calibrated to ${cityName} mobility patterns.`,
      icon: Crosshair,
    },
    {
      title: 'Environmental Resilience',
      desc: 'Integrates local environmental risk factors and industrial hazard setbacks.',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="min-h-full space-y-16 pb-16 animate-in fade-in duration-300">
      {/* 1. MINIMALIST HERO SECTION */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-8 sm:p-12 lg:p-16 shadow-xs"
      >
        {/* Subtle decorative background gradient */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 rounded-full bg-gradient-to-br from-indigo-50/80 via-blue-50/40 to-transparent dark:from-indigo-950/40 dark:via-blue-950/20 dark:to-transparent blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-16 w-80 h-80 rounded-full bg-gradient-to-tr from-slate-50 to-indigo-50/30 dark:from-slate-900 dark:to-indigo-950/30 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50/80 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse" />
            <span>{cityName} Spatial Intelligence Platform</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
            Find the optimal site for your next venture in {cityName}.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            GeoReady removes the guesswork from commercial site selection. Combine real-time
            demographics, road catchments, competitor clustering, and flood risk models into
            a single, intuitive decision platform.
          </p>

          {/* Main Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('overview')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 transition-all cursor-pointer group"
            >
              <span>Launch GIS Workspace</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={() => onNavigateTab('site-analysis')}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 text-slate-700 dark:text-slate-200 font-semibold text-sm border border-slate-200/80 dark:border-slate-700 transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Explore Site Analysis</span>
            </button>

            <a
              href="#how-it-works"
              className="inline-flex items-center gap-1.5 px-4 py-3.5 rounded-2xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium text-sm transition-colors"
            >
              <span>How it works</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">45+</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{cityName} Candidate Sites</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">5</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Industry Presets</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">H3 Hex</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Resolution-8 Tessellation</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">Local GIS</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Environmental Screening</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 2. INSTRUCTIONS SECTION: HOW TO OPERATE THIS WEBSITE */}
      <section id="how-it-works" className="space-y-6 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-wide uppercase mb-1">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>User Guide & Instructions</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              How to operate this platform
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              Follow these simple sequential steps to evaluate location suitability, customize
              weights, and obtain actionable geospatial recommendations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('overview')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Skip to live dashboard</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Step-by-Step Interactive Workflow Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left list of steps (clickable) */}
          <div className="lg:col-span-5 space-y-3">
            {steps.map((s, index) => {
              const Icon = s.icon;
              const isSelected = activeStep === index;
              return (
                <div
                  key={s.step}
                  onClick={() => setActiveStep(index)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    isSelected
                      ? 'bg-white dark:bg-slate-900 border-indigo-500 dark:border-indigo-500 shadow-md ring-1 ring-indigo-500/10'
                      : 'bg-white/70 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div
                    className={`p-2.5 rounded-xl shrink-0 ${
                      isSelected
                        ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        STEP {s.step}
                      </span>
                      {isSelected && (
                        <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold px-2 py-0.5 rounded-full border border-indigo-100 dark:border-indigo-800/60">
                          Active Step
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5 truncate">
                      {s.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{s.shortDesc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right step details & direct launcher */}
          <div className="lg:col-span-7">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 flex flex-col justify-between shadow-xs"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">
                    PHASE {steps[activeStep].step} OF 05
                  </span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                    {steps[activeStep].shortDesc}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {steps[activeStep].title}
                </h3>

                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {steps[activeStep].desc}
                </p>

                {/* Practical Tip Box */}
                <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100/80 dark:border-indigo-900/50 flex items-start gap-3">
                  <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-indigo-900 dark:text-indigo-300">Practical Operational Tip</p>
                    <p className="text-xs text-indigo-700/90 dark:text-indigo-300/90 mt-0.5">
                      {steps[activeStep].tip}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action trigger button */}
              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                  <span>Navigation target:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300 font-medium">
                    /{steps[activeStep].tabTarget}
                  </span>
                </div>

                <button
                  onClick={() => onNavigateTab(steps[activeStep].tabTarget)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm cursor-pointer transition-all"
                >
                  <span>{steps[activeStep].actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Quick Navigation Cards to reduce messiness */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div
            onClick={() => onNavigateTab('overview')}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <MapIcon className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Main Map & Overview</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Visual map layer with sites and live suitability scoring.
            </p>
          </div>

          <div
            onClick={() => onNavigateTab('opportunity-map')}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Compass className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Opportunity Zones</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Discover underserved pockets with high footfall and low competitor presence.
            </p>
          </div>

          <div
            onClick={() => onNavigateTab('reports')}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Executive Reports</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Download comprehensive PDF & CSV spatial audit dossiers.
            </p>
          </div>
        </div>
      </section>

      {/* 3. ABOUT US SECTION */}
      <section id="about-us" className="space-y-6 scroll-mt-20">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-wide uppercase mb-1">
            <Users className="w-3.5 h-3.5" />
            <span>About Us</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Built for high-velocity urban expansion
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            {cityName} is recognized globally for its dynamic economic growth. GeoReady bridges academic GIS research with real-world enterprise site selection for the {cityRegion} region.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {quickPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3"
              >
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{pillar.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{pillar.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Story / Mission narrative */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 text-slate-700 dark:text-slate-300 space-y-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Our Mission</h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Traditional feasibility studies take weeks, cost thousands of dollars, and rely on
            static spreadsheets. We created GeoReady to empower business founders, logistics planners,
            and retail operators with instant spatial intelligence. By pairing Uber H3 indexing,
            demographic catchments, and automated Gemini reasoning, we make complex GIS intuitive and
            accessible for every decision maker in {cityName}.
          </p>
          <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Grounded in Local Municipal Data
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Non-destructive Multi-criteria Weighting
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Zero GIS Degree Required
            </span>
          </div>
        </div>
      </section>

      {/* 4. CONTACT US SECTION */}
      <section id="contact-us" className="space-y-6 scroll-mt-20">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-wide uppercase mb-1">
            <Mail className="w-3.5 h-3.5" />
            <span>Contact Us</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Get in touch with our spatial team
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Have questions about custom datasets, corporate site evaluations, or zoning rules?
            Send us a message and our GIS analysts will respond within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Contact Info & Address */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Office & Direct Channels</h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{cityName} Operations Hub</p>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      Main Commercial Ring Road, {cityName}, {cityRegion}, {activeCity?.country || 'India'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">Inquiry & Datasets</p>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5 font-mono">contact@geoready.local</p>
                    <p className="text-slate-500 dark:text-slate-400 font-mono">spatial-team@geoready.in</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">Operational Hours</p>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5">Monday – Friday: 9:00 AM – 6:00 PM IST</p>
                    <p className="text-slate-400 dark:text-slate-500 mt-0.5">Saturday: 10:00 AM – 2:00 PM IST</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed">
                  Note: For confidential enterprise site audits or private land parcels, you can
                  request NDA-protected custom data layers.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              {submitted ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Message Received!</h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    Thank you, <strong className="text-slate-800 dark:text-slate-200">{contactForm.name}</strong>. Our
                    GIS analyst will review your inquiry regarding{' '}
                    <strong className="text-slate-800 dark:text-slate-200">{contactForm.topic}</strong> and email you back
                    shortly at <strong className="text-slate-800 dark:text-slate-200">{contactForm.email}</strong>.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setContactForm({
                        name: '',
                        email: '',
                        topic: 'Site Consultation',
                        message: '',
                      });
                    }}
                    className="mt-4 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Send an Inquiry</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) =>
                          setContactForm({ ...contactForm, name: e.target.value })
                        }
                        placeholder="e.g. Ramesh Patel"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Work Email *</label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) =>
                          setContactForm({ ...contactForm, email: e.target.value })
                        }
                        placeholder="name@company.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Inquiry Topic</label>
                    <select
                      value={contactForm.topic}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, topic: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer"
                    >
                      <option value="Site Consultation" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Commercial Site Consultation</option>
                      <option value="Custom Data Integration" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Custom Data Layer Integration</option>
                      <option value="Zoning Guidance" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Local Zoning & Flood Regulations</option>
                      <option value="Enterprise Platform Access" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Enterprise / Government License</option>
                      <option value="Other Feedback" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">General Question or Feedback</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Message</label>
                    <textarea
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, message: e.target.value })
                      }
                      placeholder="Describe your location requirements, intended industry archetype, or questions..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">Response time: &lt; 24 hours</span>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm cursor-pointer transition-all active:scale-95"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Inquiry</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 5. MINIMALIST FOOTER */}
      <footer className="pt-12 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 dark:text-slate-500">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">
            G
          </div>
          <span className="font-semibold text-slate-700 dark:text-slate-300">GeoReady {cityName}</span>
          <span>© {new Date().getFullYear()} All rights reserved.</span>
        </div>

        <div className="flex items-center gap-6">
          <a href="#how-it-works" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
            Instructions
          </a>
          <a href="#about-us" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
            About Us
          </a>
          <a href="#contact-us" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
            Contact
          </a>
          <button
            onClick={() => onNavigateTab('overview')}
            className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium cursor-pointer"
          >
            Launch Map
          </button>
        </div>
      </footer>
    </div>
  );
};
