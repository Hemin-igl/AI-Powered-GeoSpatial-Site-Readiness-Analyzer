import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Sparkles,
  Compass,
  Flame,
  Bot,
  ArrowDown,
  Activity,
  Layers,
  Crosshair,
  Maximize2,
  ShieldCheck,
  Zap,
  Globe,
  Radio,
  ChevronDown,
} from 'lucide-react';

const TOTAL_FRAMES = 87;

interface ScrollSequenceProps {
  onEnterPlatform?: () => void;
  onOpenAuthModal?: (mode?: 'login' | 'register') => void;
}

export const ScrollSequence: React.FC<ScrollSequenceProps> = ({
  onEnterPlatform,
  onOpenAuthModal,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);

  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);

  // Preload all 87 frames in high definition
  useEffect(() => {
    let count = 0;
    const imgs: HTMLImageElement[] = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(3, '0');
      img.src = `/frames/ezgif-frame-${frameNum}.jpg`;

      img.onload = () => {
        count++;
        setLoadedCount(count);
        if (count === TOTAL_FRAMES) {
          setIsLoaded(true);
        }
      };
      imgs.push(img);
    }
    imagesRef.current = imgs;
  }, []);

  // Draw current frame on canvas with high-dpi scaling and aspect ratio cover
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const clampedIndex = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(frameIndex)));
    const img = imagesRef.current[clampedIndex];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Cover scale image into canvas
    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    const ratio = Math.max(hRatio, vRatio);

    const centerShiftX = (canvas.width - img.width * ratio) / 2;
    const centerShiftY = (canvas.height - img.height * ratio) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      centerShiftX,
      centerShiftY,
      img.width * ratio,
      img.height * ratio
    );
  }, []);

  // Resize canvas according to display DPI
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      drawFrame(currentFrameRef.current);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isLoaded, drawFrame]);

  // Handle scroll position and lerp interpolation loop for ultra-fluid 60fps playback
  useEffect(() => {
    let animationFrameId: number;

    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const scrollHeight = container.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;

      // Calculate progress from 0.0 to 1.0
      const progress = Math.min(Math.max(-rect.top / scrollHeight, 0), 1);
      targetFrameRef.current = progress * (TOTAL_FRAMES - 1);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initial sync

    // Smooth physics lerp loop
    const renderLoop = () => {
      const diff = targetFrameRef.current - currentFrameRef.current;
      if (Math.abs(diff) > 0.001) {
        // Easing constant (0.12 = responsive yet silky smooth)
        currentFrameRef.current += diff * 0.12;
        drawFrame(currentFrameRef.current);
        setRenderProgress(currentFrameRef.current / (TOTAL_FRAMES - 1));
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isLoaded, drawFrame]);

  // Jump to specific milestone on click
  const scrollToProgress = (progress: number) => {
    const container = containerRef.current;
    if (!container) return;
    const scrollHeight = container.scrollHeight - window.innerHeight;
    const targetScrollTop = container.offsetTop + progress * scrollHeight;
    window.scrollTo({ top: targetScrollTop, behavior: 'smooth' });
  };

  // Helper for ultra-smooth fluid slide opacity & transform
  const getSlideStyle = (start: number, end: number) => {
    const fadeIn = 0.06;
    const fadeOut = 0.06;

    if (renderProgress < start - fadeIn || renderProgress > end + fadeOut) {
      return {
        opacity: 0,
        transform: 'translateY(30px) scale(0.96)',
        pointerEvents: 'none' as const,
        display: 'none',
      };
    }

    let opacity = 1;
    let translateY = 0;

    if (renderProgress < start) {
      const t = (renderProgress - (start - fadeIn)) / fadeIn;
      opacity = t;
      translateY = (1 - t) * 30;
    } else if (renderProgress > end) {
      const t = (renderProgress - end) / fadeOut;
      opacity = 1 - t;
      translateY = -t * 30;
    }

    return {
      opacity: Math.max(0, Math.min(1, opacity)),
      transform: `translateY(${translateY}px) scale(1)`,
      transition: 'opacity 0.08s linear, transform 0.08s linear',
      pointerEvents: opacity > 0.3 ? ('auto' as const) : ('none' as const),
    };
  };

  const currentFrameNumber = Math.min(
    TOTAL_FRAMES,
    Math.max(1, Math.round(renderProgress * (TOTAL_FRAMES - 1)) + 1)
  );

  return (
    <div ref={containerRef} className="relative h-[480vh] w-full bg-[#000000]">
      {/* Sticky Fullscreen Viewport */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-[#000000]">
        {/* Hardware Accelerated HTML5 Canvas Background */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Multi-tier Cinematic Vignette & Radial Contrast Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-transparent to-black/90 pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 35%, rgba(0, 0, 0, 0.65) 75%, rgba(0, 0, 0, 0.95) 100%)',
          }}
        />

        {/* Subtle Cyber Spatial Grid Overlay */}
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.2) 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }}
        />

        {/* Center Target GIS Reticle (Subtle) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-20">
          <div className="w-[320px] h-[320px] sm:w-[480px] sm:h-[480px] rounded-full border border-indigo-400/40 flex items-center justify-center">
            <div className="w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] rounded-full border border-dashed border-cyan-400/30" />
            <div className="absolute w-8 h-8 border-t-2 border-l-2 border-indigo-400 -top-1 -left-1" />
            <div className="absolute w-8 h-8 border-t-2 border-r-2 border-indigo-400 -top-1 -right-1" />
            <div className="absolute w-8 h-8 border-b-2 border-l-2 border-indigo-400 -bottom-1 -left-1" />
            <div className="absolute w-8 h-8 border-b-2 border-r-2 border-indigo-400 -bottom-1 -right-1" />
          </div>
        </div>

        {/* Top-Right Futuristic GIS Telemetry HUD */}
        <div className="absolute top-20 right-6 z-30 hidden md:flex flex-col gap-2 p-3.5 rounded-2xl bg-black/70 border border-white/10 backdrop-blur-xl text-left shadow-2xl font-mono select-none">
          <div className="flex items-center justify-between gap-4 border-b border-white/[0.08] pb-2">
            <div className="flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="text-[11px] font-bold text-white tracking-wider">GIS TELEMETRY</span>
            </div>
            <span className="text-[10px] text-indigo-400 font-bold px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-800/60">
              FRAME {String(currentFrameNumber).padStart(3, '0')} / {TOTAL_FRAMES}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-slate-400">
            <span>ZOOM LEVEL:</span>
            <span className="text-white font-semibold text-right">
              {(1.0 + renderProgress * 18.5).toFixed(1)}x
            </span>
            <span>PROCESSING:</span>
            <span className="text-emerald-400 font-semibold text-right">REAL-TIME</span>
            <span>AUTOCORRELATION:</span>
            <span className="text-cyan-400 font-semibold text-right">Getis-Ord Gi*</span>
            <span>ENGINE STATUS:</span>
            <span className="text-indigo-300 font-semibold text-right">NOMINAL</span>
          </div>
        </div>

        {/* Left Side Chapter Milestone Scrubber */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col gap-3 p-3 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-xl select-none">
          {[
            { label: '01 Ingestion', progress: 0.10, icon: Globe },
            { label: '02 Catchments', progress: 0.38, icon: Compass },
            { label: '03 Hotspots', progress: 0.65, icon: Flame },
            { label: '04 AI Verdict', progress: 0.90, icon: Bot },
          ].map((item, idx) => {
            const Icon = item.icon;
            const isActive =
              Math.abs(renderProgress - item.progress) < 0.16 ||
              (idx === 0 && renderProgress < 0.22) ||
              (idx === 3 && renderProgress > 0.78);

            return (
              <button
                key={idx}
                onClick={() => scrollToProgress(item.progress)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600/30 border border-indigo-500/60 text-white shadow-lg shadow-indigo-600/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                    isActive ? 'bg-indigo-500 text-white' : 'bg-white/10 text-slate-400'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-bold tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Loading Overlay */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-black flex flex-col items-center justify-center gap-4 z-40">
            <div className="relative">
              <div className="w-16 h-16 rounded-3xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 animate-pulse">
                <Activity className="w-8 h-8 text-indigo-400" />
              </div>
              <div className="absolute -inset-1 rounded-3xl bg-indigo-500/20 blur-lg animate-ping opacity-30" />
            </div>
            <div className="text-center space-y-1.5">
              <p className="text-sm font-extrabold text-white tracking-wide">
                Initializing GeoSpatial Canvas
              </p>
              <p className="text-xs text-slate-400 font-mono">
                Streaming HD Satellite Frames ({loadedCount}/{TOTAL_FRAMES})
              </p>
            </div>
            <div className="w-64 h-2 bg-slate-900 border border-white/10 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-full transition-all duration-150 shadow-md shadow-indigo-500/50"
                style={{ width: `${(loadedCount / TOTAL_FRAMES) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* DYNAMIC SCROLL MILESTONES (Continuous Smooth Fade/Translation) */}
        <div className="relative z-20 max-w-4xl mx-auto px-6 text-center select-none">
          {/* Milestone 01: Global Ingestion (0.00 - 0.24) */}
          <div style={getSlideStyle(0.02, 0.22)} className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-950/90 border border-indigo-600/60 text-indigo-300 text-xs font-bold backdrop-blur-xl shadow-lg shadow-indigo-950/80">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
              <span>Phase 01 • Planetary Terrain & Cadastre Ingestion</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)]">
              Continuous High-Resolution{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400">
                Earth Scanning
              </span>
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              Ingesting elevation topography, parcel boundaries, zoning registries, and municipal infrastructure across millions of square kilometers in sub-second response times.
            </p>
            <div className="pt-2 flex items-center justify-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/60 border border-white/10 backdrop-blur-md">
                <Layers className="w-3.5 h-3.5 text-indigo-400" /> Multi-Layer Vector Tiling
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/60 border border-white/10 backdrop-blur-md">
                <Crosshair className="w-3.5 h-3.5 text-cyan-400" /> Geodesic Haversine Math
              </span>
            </div>
          </div>

          {/* Milestone 02: Catchments & Isochrones (0.26 - 0.48) */}
          <div style={getSlideStyle(0.28, 0.48)} className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/90 border border-emerald-600/60 text-emerald-300 text-xs font-bold backdrop-blur-xl shadow-lg shadow-emerald-950/80">
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>Phase 02 • Multimodal Travel-Time Isochrones</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)]">
              Accurate 10, 20 & 30-Min{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300">
                Catchment Reach
              </span>
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              Computing real-world road networks and walking transit polygons to accurately quantify reachable customer demographics, footfall density, and corridor access.
            </p>
            <div className="pt-2 flex items-center justify-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/60 border border-white/10 backdrop-blur-md">
                <Activity className="w-3.5 h-3.5 text-emerald-400" /> Dynamic Road Speed Profiling
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/60 border border-white/10 backdrop-blur-md">
                <Zap className="w-3.5 h-3.5 text-teal-400" /> Demographic Spatial Overlay
              </span>
            </div>
          </div>

          {/* Milestone 03: Hotspots & Distance Decay (0.52 - 0.74) */}
          <div style={getSlideStyle(0.54, 0.74)} className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/90 border border-amber-600/60 text-amber-300 text-xs font-bold backdrop-blur-xl shadow-lg shadow-amber-950/80">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Phase 03 • H3 Tessellation & Distance-Decay Pressure</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)]">
              Exponential Competitor{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-300 to-rose-400">
                Decay Modeling
              </span>
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              Leveraging Uber H3 hexagonal bins, Scikit-learn DBSCAN clustering, and Getis-Ord Gi* statistics to detect commercial saturation and underserviced white-space.
            </p>
            <div className="pt-2 flex items-center justify-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/60 border border-white/10 backdrop-blur-md">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Getis-Ord Gi* Autocorrelation
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/60 border border-white/10 backdrop-blur-md">
                <Flame className="w-3.5 h-3.5 text-rose-400" /> Cannibalization Risk Index
              </span>
            </div>
          </div>

          {/* Milestone 04: Grounded AI Readiness Score (0.78 - 1.00) */}
          <div style={getSlideStyle(0.80, 0.98)} className="space-y-5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/90 border border-purple-600/60 text-purple-300 text-xs font-bold backdrop-blur-xl shadow-lg shadow-purple-950/80">
              <Bot className="w-4 h-4 text-purple-400" />
              <span>Phase 04 • Deterministic Score & Grounded AI Intelligence</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)]">
              Instant 0–100{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-300 to-indigo-300">
                Site Readiness
              </span>
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              Synthesizing multi-criteria weights into a transparent score with hallucination-free AI executive rationales and automated dossier compilation.
            </p>

            {onEnterPlatform && (
              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={onEnterPlatform}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 transition-all cursor-pointer hover:scale-105 flex items-center gap-2"
                >
                  <span>Launch GeoReady Platform</span>
                  <Sparkles className="w-4 h-4" />
                </button>
                {onOpenAuthModal && (
                  <button
                    onClick={() => onOpenAuthModal('login')}
                    className="px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-sm backdrop-blur-md transition-all cursor-pointer"
                  >
                    <span>Sign In to Account</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Interactive Scroll Progress Bar & Indicator */}
        <div className="absolute bottom-6 inset-x-6 z-30 flex items-center justify-between pointer-events-none select-none max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
            <span className="hidden sm:inline">SCROLL TO ADVANCE GEOSPATIAL SEQUENCE</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-36 sm:w-56 h-1.5 bg-white/10 rounded-full overflow-hidden border border-white/10 backdrop-blur-md">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-full transition-all duration-75"
                style={{ width: `${renderProgress * 100}%` }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-white">
              {Math.round(renderProgress * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
