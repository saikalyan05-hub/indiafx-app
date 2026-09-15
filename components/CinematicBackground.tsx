"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export function CinematicBackground() {
  const [mounted, setMounted] = useState(false);

  // Mouse position values for subtle, premium parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth lightweight spring for 60fps/120fps fluid response
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 25, mass: 0.5 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 25, mass: 0.5 });

  // Layer 1: Ambient Lighting Glows
  const layer1X = useTransform(smoothX, [-1, 1], [-6, 6]);
  const layer1Y = useTransform(smoothY, [-1, 1], [-6, 6]);

  // Layer 2: Film Strip & Editorial Frames
  const layer2X = useTransform(smoothX, [-1, 1], [-12, 12]);
  const layer2Y = useTransform(smoothY, [-1, 1], [-12, 12]);

  // Layer 3: Floating Polaroid & Badges
  const layer3X = useTransform(smoothX, [-1, 1], [-18, 18]);
  const layer3Y = useTransform(smoothY, [-1, 1], [-18, 18]);

  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);

    // High-performance requestAnimationFrame throttled mouse tracker (locks to monitor refresh rate)
    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 1024) return; // Completely idle on mobile/tablet

      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        const normX = (e.clientX / window.innerWidth) * 2 - 1;
        const normY = (e.clientY / window.innerHeight) * 2 - 1;
        mouseX.set(normX);
        mouseY.set(normY);
        rafRef.current = null;
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [mouseX, mouseY]);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* ========================================================================= */}
      {/* 1. CINEMATIC EDITORIAL DOT GRID PATTERN (Desktop & Mobile Matrix)          */}
      {/* ========================================================================= */}
      <div
        className="fx-dot-pattern absolute inset-0 pointer-events-none opacity-[0.70] sm:opacity-[0.82] transform-gpu"
        style={{
          maskImage: "radial-gradient(ellipse 95% 85% at 50% 35%, black 45%, rgba(0,0,0,0.7) 80%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 95% 85% at 50% 35%, black 45%, rgba(0,0,0,0.7) 80%, transparent 100%)",
        }}
      />

      {/* ========================================================================= */}
      {/* 2. HIGH-PERFORMANCE GPU AMBIENT LIGHTING (Desktop & Mobile Ambient Glows) */}
      {/* ========================================================================= */}

      {/* Top Warm Spotlight (Hero Ambient Lighting for Mobile & Desktop) */}
      <motion.div
        style={{
          x: mounted ? layer1X : 0,
          y: mounted ? layer1Y : 0,
          background: "radial-gradient(ellipse at center, rgba(227,28,61,0.042) 0%, rgba(245,158,11,0.024) 45%, transparent 70%)",
        }}
        className="fx-glow-breathe absolute -top-[120px] sm:-top-[150px] left-1/2 -translate-x-1/2 w-[110vw] sm:w-[90vw] max-w-[1200px] h-[380px] sm:h-[550px] rounded-full opacity-80 pointer-events-none transform-gpu"
      />

      {/* Top Left Rose Studio Glow (Responsive for Mobile & Desktop) */}
      <motion.div
        style={{
          x: mounted ? layer1X : 0,
          y: mounted ? layer1Y : 0,
          background: "radial-gradient(circle at center, rgba(227,28,61,0.035) 0%, transparent 65%)",
        }}
        className="absolute top-[8%] -left-[100px] sm:-left-[80px] w-[340px] sm:w-[500px] h-[340px] sm:h-[500px] rounded-full pointer-events-none opacity-80 transform-gpu"
      />

      {/* Right Studio Accent Spotlight (Responsive for Mobile & Desktop) */}
      <motion.div
        style={{
          x: mounted ? layer1X : 0,
          y: mounted ? layer1Y : 0,
          background: "radial-gradient(circle at center, rgba(245,158,11,0.03) 0%, rgba(227,28,61,0.015) 40%, transparent 70%)",
        }}
        className="absolute top-[32%] -right-[100px] w-[360px] sm:w-[600px] h-[360px] sm:h-[600px] rounded-full pointer-events-none opacity-80 transform-gpu"
      />

      {/* Mid-Page Warm Atmosphere Glow (Responsive for Mobile & Desktop) */}
      <div
        className="absolute top-[62%] -left-[60px] sm:left-[5%] w-[340px] sm:w-[550px] h-[340px] sm:h-[550px] rounded-full pointer-events-none opacity-70 transform-gpu"
        style={{
          background: "radial-gradient(circle at center, rgba(227,28,61,0.024) 0%, transparent 70%)",
        }}
      />

      {/* Edge Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 65%, rgba(0,0,0,0.025) 100%)",
        }}
      />

      {/* ========================================================================= */}
      {/* 3. MOBILE EDITORIAL MICRO ACCENTS (Tailored for Mobile Viewports)          */}
      {/* ========================================================================= */}

      {/* Mobile Top-Right Subtle Film Stamp */}
      <div className="block xl:hidden absolute top-[70px] right-3.5 opacity-[0.20] pointer-events-none select-none">
        <div className="flex items-center gap-1.5 rounded-full bg-black/5 px-2.5 py-0.5 border border-black/5 text-[8px] font-mono font-bold tracking-widest text-[#222] uppercase">
          <span className="h-1 w-1 rounded-full bg-[#e31c3d]" />
          <span>35MM • 24FPS</span>
        </div>
      </div>

      {/* Mobile Bottom-Left Atmospheric Reel Stamp */}
      <div className="block xl:hidden absolute bottom-[84px] left-3.5 opacity-[0.16] pointer-events-none select-none">
        <p className="text-[7.5px] font-mono font-bold tracking-[0.28em] text-[#333] uppercase">
          INDIAFX REEL • CINEMA ARCHIVE
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 4. 35MM CINEMATIC FILM STRIP (Desktop Right Edge / Gutter)               */}
      {/* ========================================================================= */}
      <motion.div
        style={{ x: mounted ? layer2X : 0, y: mounted ? layer2Y : 0 }}
        className="fx-ambient-drift hidden 2xl:block absolute top-[140px] -right-[12px] w-[130px] opacity-[0.28] transition-opacity duration-500 transform-gpu"
      >
        <div className="relative rounded-2xl bg-[#181615] p-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.14)] border border-black/10 rotate-[2.5deg]">
          {/* Top Film Leader Metadata */}
          <div className="flex items-center justify-between px-1 pb-1.5 border-b border-white/10 text-[7px] font-mono font-bold tracking-widest text-white/50">
            <span>35MM • KODAK</span>
            <span>24 FPS</span>
          </div>

          {/* Film Frame 1 */}
          <div className="mt-2 relative rounded-lg overflow-hidden bg-black/60 border border-white/15 aspect-[9/13]">
            <img
              src="/assets/featured-01-a-second-chance.png"
              alt="Film Still 1"
              className="w-full h-full object-cover filter grayscale contrast-125 opacity-80"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute top-1 left-1 bg-black/70 px-1 py-0.5 rounded text-[7px] font-mono text-white/70 font-semibold">
              01 A
            </div>
            {/* Film Sprocket Holes */}
            <div className="absolute -left-1.5 top-0 bottom-0 flex flex-col justify-around py-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="w-2 h-1.5 bg-[#f7f5f2] rounded-xs opacity-90" />
              ))}
            </div>
            <div className="absolute -right-1.5 top-0 bottom-0 flex flex-col justify-around py-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="w-2 h-1.5 bg-[#f7f5f2] rounded-xs opacity-90" />
              ))}
            </div>
          </div>

          {/* Film Frame 2 */}
          <div className="mt-2.5 relative rounded-lg overflow-hidden bg-black/60 border border-white/15 aspect-[9/13]">
            <img
              src="/assets/featured-02-his-revenge.png"
              alt="Film Still 2"
              className="w-full h-full object-cover filter grayscale contrast-125 opacity-80"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute top-1 left-1 bg-black/70 px-1 py-0.5 rounded text-[7px] font-mono text-white/70 font-semibold">
              02 A
            </div>
            {/* Sprocket Holes */}
            <div className="absolute -left-1.5 top-0 bottom-0 flex flex-col justify-around py-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="w-2 h-1.5 bg-[#f7f5f2] rounded-xs opacity-90" />
              ))}
            </div>
            <div className="absolute -right-1.5 top-0 bottom-0 flex flex-col justify-around py-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="w-2 h-1.5 bg-[#f7f5f2] rounded-xs opacity-90" />
              ))}
            </div>
          </div>

          {/* Film Bottom Metadata */}
          <div className="mt-2 pt-1 border-t border-white/10 flex items-center justify-between px-1 text-[7px] font-mono text-white/40">
            <span>SAFETY FILM</span>
            <span>INDIAFX REEL</span>
          </div>
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* 5. FLOATING EDITORIAL PHOTO CARDS (Desktop Left & Mid Margins)            */}
      {/* ========================================================================= */}

      {/* Left Margin: Polaroid Editorial Snapshot */}
      <motion.div
        style={{
          x: mounted ? layer3X : 0,
          y: mounted ? layer3Y : 0,
        }}
        className="fx-ambient-drift hidden xl:block absolute top-[280px] -left-[18px] w-[145px] opacity-[0.24] transition-opacity duration-500 transform-gpu"
      >
        <div className="rounded-xl bg-white p-2 pb-3 shadow-[0_12px_30px_rgba(0,0,0,0.08)] border border-[#e5dfd5] rotate-[-2.5deg]">
          <div className="rounded-lg overflow-hidden aspect-[4/5] bg-[#ebe4da] relative">
            <img
              src="/assets/featured-03-my-college-crush.png"
              alt="Editorial Snapshot"
              className="w-full h-full object-cover filter contrast-[1.1] brightness-[0.95]"
              loading="lazy"
              decoding="async"
            />
            {/* Viewfinder Crosshair */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 border border-white/40 rounded-full flex items-center justify-center">
                <div className="w-1 h-1 bg-white/60 rounded-full" />
              </div>
            </div>
          </div>
          <div className="mt-2 px-0.5 flex items-center justify-between text-[8px] font-mono text-[#777]">
            <span className="font-bold tracking-wider">SCENE 04</span>
            <span>TAKE 02</span>
          </div>
        </div>
      </motion.div>

      {/* Left Mid-Margin: Contact Sheet Strip Frame */}
      <motion.div
        style={{ x: mounted ? layer2X : 0, y: mounted ? layer2Y : 0 }}
        className="hidden 2xl:block absolute top-[920px] left-[15px] opacity-[0.20] transform-gpu"
      >
        <div className="flex items-center gap-2 rounded-lg bg-white/80 px-3 py-1.5 border border-[#e5dfd5] shadow-xs rotate-[1.5deg]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#e31c3d]" />
          <span className="text-[9px] font-mono font-bold tracking-[0.25em] text-[#555] uppercase">
            STUDIO ARCHIVE • 2026
          </span>
        </div>
      </motion.div>

      {/* Right Mid-Margin: Floating Editorial Cutout Badge */}
      <motion.div
        style={{ x: mounted ? layer3X : 0, y: mounted ? layer3Y : 0 }}
        className="hidden xl:block absolute top-[1180px] right-[24px] opacity-[0.22] rotate-[-2deg] transform-gpu"
      >
        <div className="rounded-2xl bg-white/90 p-2.5 shadow-[0_10px_24px_rgba(0,0,0,0.06)] border border-[#e5dfd5] max-w-[150px]">
          <div className="flex items-center justify-between text-[8px] font-mono text-[#888] pb-1 border-b border-[#ece6dc]">
            <span className="font-bold text-[#e31c3d]">#03 TRENDING</span>
            <span>4K HDR</span>
          </div>
          <p className="mt-1 text-[10px] font-bold text-[#222] truncate font-[family-name:var(--font-playfair)]">
            A Second Chance
          </p>
          <p className="text-[8px] text-[#777] font-sans">80 Episodes • Finale</p>
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* 6. EDITORIAL TYPOGRAPHY DETAILS & VERTICAL MARGIN TEXT                    */}
      {/* ========================================================================= */}

      {/* Left Screen Vertical Margin Tracking Text */}
      <div className="hidden lg:block absolute left-4 top-[480px] -translate-y-1/2 opacity-[0.16]">
        <p
          className="text-[9px] font-mono font-bold tracking-[0.45em] text-[#111] uppercase"
          style={{ writingMode: "vertical-rl" }}
        >
          35MM CELLULOID • CINEMATIC ARCHIVE • 24 FPS
        </p>
      </div>

      {/* Right Screen Vertical Margin Tracking Text */}
      <div className="hidden lg:block absolute right-4 top-[620px] -translate-y-1/2 opacity-[0.16]">
        <p
          className="text-[9px] font-mono font-bold tracking-[0.42em] text-[#111] uppercase"
          style={{ writingMode: "vertical-rl" }}
        >
          STORIES THAT STAY WITH YOU • INDIAFX
        </p>
      </div>

      {/* Lower Background Storytelling Watermark */}
      <div className="hidden 2xl:block absolute top-[1650px] left-12 opacity-[0.12]">
        <p className="font-[family-name:var(--font-playfair)] italic text-lg tracking-wide text-[#222]">
          &ldquo;Small Episodes. Big Emotions. Every Frame Crafted with Heart.&rdquo;
        </p>
      </div>
    </div>
  );
}
