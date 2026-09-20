import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Compass, Flame, Bot, ArrowDown, Activity } from 'lucide-react';

const TOTAL_FRAMES = 87;

export const ScrollSequence: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);

  // Preload all 87 frames on mount
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

  // Draw current frame on canvas
  const drawFrame = (frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imagesRef.current[frameIndex];
    if (!img || !img.complete) return;

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
  };

  // Resize canvas to match display size
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = canvas.clientWidth * (window.devicePixelRatio || 1);
      canvas.height = canvas.clientHeight * (window.devicePixelRatio || 1);
      drawFrame(Math.round(currentFrameRef.current));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isLoaded]);

  // Handle scroll and lerp interpolation loop for ultra-smooth 60fps rendering
  useEffect(() => {
    let animationFrameId: number;

    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const scrollHeight = container.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;

      const progress = Math.min(Math.max(-rect.top / scrollHeight, 0), 1);
      targetFrameRef.current = progress * (TOTAL_FRAMES - 1);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Smooth lerp render loop
    const renderLoop = () => {
      // Lerp smoothing
      const diff = targetFrameRef.current - currentFrameRef.current;
      if (Math.abs(diff) > 0.01) {
        currentFrameRef.current += diff * 0.18; // smooth easing
        drawFrame(Math.round(currentFrameRef.current));
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isLoaded]);

  // Calculate current progress for stage captions (0 to 1)
  const currentProgress = targetFrameRef.current / (TOTAL_FRAMES - 1);

  return (
    <div ref={containerRef} className="relative h-[300vh] w-full bg-black">
      {/* Pinned Sticky Window (100vh) */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Canvas Background */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Ambient Dark Overlay with Seamless Top/Bottom Feathering & Radial Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/25 to-black pointer-events-none z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/30 to-black/95 pointer-events-none z-10" />
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-black via-black/80 to-transparent pointer-events-none z-15" />
        <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none z-15" />

        {/* Loading Indicator when preloading frames */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-black flex flex-col items-center justify-center gap-3 z-30">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 animate-pulse">
              <Activity className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-slate-300">
              Loading GeoSpatial Animation ({loadedCount}/{TOTAL_FRAMES})...
            </p>
            <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 transition-all duration-150"
                style={{ width: `${(loadedCount / TOTAL_FRAMES) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Floating Dynamic Storytelling Milestones based on Scroll Progress */}
        <div className="relative z-20 max-w-4xl mx-auto px-6 text-center pointer-events-none select-none">
          {currentProgress < 0.28 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 text-xs font-semibold backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Phase 01 • Global Terrain & Geospatial Ingestion</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight drop-shadow-2xl">
                Continuous Global High-Resolution Mapping
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto drop-shadow-md">
                Ingesting high-density census clusters, topography, transit corridors, and municipal cadastre boundaries.
              </p>
            </div>
          )}

          {currentProgress >= 0.28 && currentProgress < 0.62 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs font-semibold backdrop-blur-md">
                <Compass className="w-3.5 h-3.5 text-emerald-400" />
                <span>Phase 02 • Multimodal Catchments & Isochrones</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight drop-shadow-2xl">
                Dynamic Travel-Time Catchment Modeling
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto drop-shadow-md">
                Evaluating reachable customer populations across 10, 20, and 30-minute transit polygons in real-time.
              </p>
            </div>
          )}

          {currentProgress >= 0.62 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-950/80 border border-purple-700/60 text-purple-300 text-xs font-semibold backdrop-blur-md">
                <Bot className="w-3.5 h-3.5 text-purple-400" />
                <span>Phase 03 • AI-Powered Site Readiness Score</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight drop-shadow-2xl">
                Deterministic Scoring & Grounded Intelligence
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto drop-shadow-md">
                Combining competitor distance decay with normalized spatial factors for data-backed expansion decisions.
              </p>
            </div>
          )}
        </div>

        {/* Scroll Down Prompt Indicator (Bottom) */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-slate-400 text-[11px] font-semibold animate-bounce pointer-events-none">
          <span>Scroll to explore geospatial engine</span>
          <ArrowDown className="w-3.5 h-3.5 text-indigo-400" />
        </div>
      </div>
    </div>
  );
};
