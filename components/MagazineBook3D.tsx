"use client";

import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { Drama } from "@/lib/data";
import { sound } from "@/lib/soundEffects";
import { Sparkles } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface MagazineBook3DProps {
  dramas: Drama[];
  activeIndex: number;
  direction: number;
  onSelectIndex: (index: number, dir?: number) => void;
  onOpenBook: (drama: Drama) => void;
  onPlayDirect: (drama: Drama, episodeNum?: number) => void;
  className?: string;
}

export function MagazineBook3D({
  dramas,
  activeIndex,
  direction,
  onSelectIndex,
  onOpenBook,
  onPlayDirect: _onPlayDirect,
  className = "",
}: MagazineBook3DProps) {
  const reduced = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const rafRef = useRef<number | null>(null);
  const didDragRef = useRef(false);

  const activeDrama = dramas[activeIndex] || dramas[0];
  const nextDrama1 = dramas[(activeIndex + 1) % dramas.length];
  const nextDrama2 = dramas[(activeIndex + 2) % dramas.length];

  // Interactive mouse tilt tracking for the top active magazine
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth, high-performance spring locked to refresh rate
  const springConfig = { stiffness: 70, damping: 22, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // 3D rotations & parallax translations
  const rotateY = useTransform(smoothX, [-220, 220], [-14, 14]);
  const rotateX = useTransform(smoothY, [-260, 260], [14, -14]);

  // Dynamic light sheen highlight
  const sheenX = useTransform(smoothX, [-220, 220], ["15%", "85%"]);
  const sheenY = useTransform(smoothY, [-260, 260], ["15%", "85%"]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced || !containerRef.current) return;
    if (window.innerWidth < 1024) return; // Completely idle on mobile/tablet

    if (rafRef.current !== null) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.clientX;
    const clientY = e.clientY;

    rafRef.current = requestAnimationFrame(() => {
      const x = clientX - rect.left - rect.width / 2;
      const y = clientY - rect.top - rect.height / 2;
      mouseX.set(x);
      mouseY.set(y);
      rafRef.current = null;
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    sound.playClick(600);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleClickActiveBook = () => {
    if (didDragRef.current) {
      didDragRef.current = false;
      return;
    }
    sound.playBookOpen();
    onOpenBook(activeDrama);
  };

  // Physical card stack: outgoing card recedes behind, incoming card steps forward
  const stackVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 52 : -72,
      y: dir > 0 ? 18 : 10,
      scale: 0.9,
      rotate: dir > 0 ? 5 : -6.5,
      opacity: 0.55,
      zIndex: 18,
    }),
    center: {
      x: 0,
      y: 0,
      scale: 1,
      rotate: 0,
      opacity: 1,
      zIndex: 30,
      transition: {
        duration: reduced ? 0.22 : 0.68,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -64 : 78,
      y: dir > 0 ? 16 : 12,
      scale: 0.92,
      rotate: dir > 0 ? -6 : 5.5,
      opacity: 0.42,
      zIndex: 12,
      transition: {
        duration: reduced ? 0.2 : 0.58,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    }),
  };

  // Touch Swipe Gesture Handling for Mobile
  const handleDragEnd = (_: unknown, info: { offset: { x: number; y: number }; velocity: { x: number; y: number } }) => {
    const swipeThreshold = 40;
    const velocityThreshold = 0.2;
    if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
      sound.playPageFlip();
      onSelectIndex((activeIndex + 1) % dramas.length, 1);
    } else if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      sound.playPageFlip();
      onSelectIndex((activeIndex - 1 + dramas.length) % dramas.length, -1);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative flex items-center justify-center select-none py-4 sm:py-6 will-change-transform ${className}`}
      style={{ perspective: 1800 }}
    >
      {/* Background ambient radial glow matching active drama theme color */}
      <motion.div
        aria-hidden
        animate={{
          scale: isHovered ? 1.15 : 1,
          opacity: isHovered ? 0.35 : 0.2,
        }}
        transition={{ duration: 0.4 }}
        className="pointer-events-none absolute h-[320px] w-[260px] sm:h-[520px] sm:w-[440px] rounded-[50%] blur-3xl -z-10 will-change-transform"
        style={{
          background: `radial-gradient(circle, ${activeDrama.accent} 0%, transparent 70%)`,
        }}
      />

      {/* Main Stack Dimension Frame - Responsively Scaled Across All Screen Sizes */}
      <div className="relative h-[360px] w-[250px] min-[360px]:h-[400px] min-[360px]:w-[275px] min-[390px]:h-[430px] min-[390px]:w-[295px] min-[430px]:h-[460px] min-[430px]:w-[315px] sm:h-[560px] sm:w-[385px] lg:h-[660px] lg:w-[460px] xl:h-[700px] xl:w-[490px]">

        {/* LAYER 5: Deepest base paper sheet of the magazine stack */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-[-8px] min-[360px]:left-[-12px] sm:left-[-18px] lg:left-[-26px] top-[10px] sm:top-[16px] lg:top-[26px] h-[92%] w-[94%] rotate-[-8.5deg] rounded-[12px] bg-[#e4dcd0] shadow-[0_25px_60px_rgba(0,0,0,0.18)] border border-[#d0c4b4] z-0 transform-gpu"
        >
          <div className="h-full w-full opacity-40 bg-[repeating-linear-gradient(90deg,#cbbead_0_1px,transparent_1px_16px)]" />
        </div>

        {/* LAYER 4: Secondary underlying paper stack page */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-[-8px] min-[360px]:right-[-10px] sm:right-[-14px] lg:right-[-20px] top-[8px] sm:top-[12px] lg:top-[18px] h-[94%] w-[96%] rotate-[6deg] rounded-[12px] bg-[#ede5da] shadow-[0_20px_45px_rgba(0,0,0,0.15)] border border-[#d9cebf] z-0 transform-gpu"
        >
          <div className="h-full w-full opacity-35 bg-[repeating-linear-gradient(90deg,#cbbead_0_1px,transparent_1px_14px)]" />
        </div>

        {/* LAYER 3: 2nd Magazine behind the front cover (Next + 2) */}
        {nextDrama2 && (
          <div
            onClick={() => {
              sound.playPageFlip();
              onSelectIndex((activeIndex + 2) % dramas.length, 1);
            }}
            title={`Switch to ${nextDrama2.title}`}
            className="group/layer3 absolute left-[-6px] min-[360px]:left-[-8px] sm:left-[-12px] lg:left-[-18px] top-[6px] sm:top-[10px] lg:top-[14px] h-[96%] w-[97%] rotate-[-5.5deg] rounded-[12px] bg-[#111] shadow-[0_24px_55px_rgba(0,0,0,0.25)] border border-black/20 overflow-hidden cursor-pointer transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02] hover:rotate-[-6.5deg] active:scale-[0.99] z-10 transform-gpu"
          >
            <img
              src={nextDrama2.cover || nextDrama2.image}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover opacity-60 brightness-75 transition duration-500 group-hover/layer3:opacity-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
            <div className="absolute left-2.5 sm:left-4 top-2.5 sm:top-4">
              <span className="rounded-full bg-black/60 backdrop-blur-md px-1.5 sm:px-2.5 py-0.5 text-[7px] min-[360px]:text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-white border border-white/20">
                {nextDrama2.volume}
              </span>
            </div>
          </div>
        )}

        {/* LAYER 2: 1st Magazine directly behind the front cover (Next + 1) */}
        {nextDrama1 && (
          <div
            onClick={() => {
              sound.playPageFlip();
              onSelectIndex((activeIndex + 1) % dramas.length, 1);
            }}
            title={`Switch to ${nextDrama1.title}`}
            className="group/layer2 absolute right-[-5px] min-[360px]:right-[-7px] sm:right-[-10px] lg:right-[-14px] top-[5px] sm:top-[8px] lg:top-[10px] h-[98%] w-[98%] rotate-[3.8deg] rounded-[12px] bg-[#111] shadow-[0_28px_65px_rgba(0,0,0,0.28)] border border-black/20 overflow-hidden cursor-pointer transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02] hover:rotate-[4.8deg] active:scale-[0.99] z-20 transform-gpu"
          >
            <img
              src={nextDrama1.cover || nextDrama1.image}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover opacity-75 brightness-85 transition duration-500 group-hover/layer2:opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/15" />
            <div className="absolute right-2.5 sm:right-4 top-2.5 sm:top-4">
              <span className="rounded-full bg-black/60 backdrop-blur-md px-1.5 sm:px-2.5 py-0.5 text-[7px] min-[360px]:text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-white border border-white/20">
                {nextDrama1.volume}
              </span>
            </div>
            {/* Spine Fold Visual Indicator */}
            <div className="absolute inset-y-0 left-0 w-2.5 sm:w-4 bg-gradient-to-r from-black/60 to-transparent" />
          </div>
        )}

        {/* LAYER 1: Top Interactive Front Magazine with 3D Mouse Tilt & Touch Gestures */}
        <AnimatePresence mode="popLayout" custom={direction} initial={false}>
          <motion.div
            key={activeDrama.id}
            custom={direction}
            variants={stackVariants}
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onPointerDown={() => {
              didDragRef.current = false;
            }}
            onDragStart={() => {
              didDragRef.current = false;
            }}
            onDrag={(_, info) => {
              if (Math.abs(info.offset.x) > 8) didDragRef.current = true;
            }}
            onDragEnd={handleDragEnd}
            style={
              reduced
                ? undefined
                : {
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                    willChange: "transform",
                  }
            }
            onClick={handleClickActiveBook}
            className="relative h-full w-full cursor-pointer group rounded-[12px] overflow-hidden bg-[#111] shadow-[0_36px_90px_rgba(0,0,0,0.42)] ring-1 ring-black/20 touch-pan-y transform-gpu"
          >
            {/* High-Resolution Poster Artwork Image */}
            <img
              src={activeDrama.cover || activeDrama.image}
              alt={activeDrama.title}
              loading="eager"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
            />

            {/* Book Spine Crease Gradient on Left Edge */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-4 sm:w-8 bg-gradient-to-r from-black/65 via-black/25 to-transparent z-20" />
            <div className="pointer-events-none absolute inset-y-0 left-[3px] sm:left-[6px] w-[1px] bg-white/25 z-20" />

            {/* Vignette & Contrast Overlays */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-black/40 z-10" />

            {/* Dynamic Light Sheen on mouse hover */}
            {!reduced && (
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay"
                style={{
                  background: `radial-gradient(circle at ${sheenX} ${sheenY}, rgba(255,255,255,0.48) 0%, transparent 60%)`,
                }}
              />
            )}

            {/* Masthead Header */}
            <div className="absolute left-3.5 sm:left-7 top-3.5 sm:top-7 right-3.5 sm:right-7 z-20 flex items-start justify-between">
              <div>
                <p className="font-[family-name:var(--font-playfair)] text-[24px] min-[360px]:text-[26px] sm:text-[44px] font-black leading-none text-white tracking-tight drop-shadow-md">
                  India<span className="logo-fx">FX</span>
                </p>
                <p className="mt-0.5 sm:mt-1.5 text-[8px] min-[360px]:text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.24em] text-white/85">
                  Micro Drama Series
                </p>
              </div>
              <div className="text-right">
                <span className="inline-block rounded-full bg-white/20 backdrop-blur-md px-2 sm:px-3 py-0.5 sm:py-1 text-[8px] min-[360px]:text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-white border border-white/25 shadow-sm">
                  {activeDrama.volume}
                </span>
                <p className="mt-0.5 sm:mt-1 text-[8px] min-[360px]:text-[9px] sm:text-[10px] font-semibold text-white/70 uppercase tracking-widest">
                  {activeDrama.genre[0]}
                </p>
              </div>
            </div>

            {/* Bottom Drama Info */}
            <div className="absolute inset-x-3.5 sm:inset-x-7 bottom-4 sm:bottom-8 z-20 text-white">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#e31c3d] px-2.5 sm:px-3 py-0.5 sm:py-1 text-[8px] min-[360px]:text-[9px] sm:text-[11px] font-bold uppercase tracking-wider text-white mb-1.5 sm:mb-2.5 shadow-sm">
                <Sparkles className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" /> Trending #1
              </div>

              <h2 className="font-[family-name:var(--font-playfair)] text-[22px] min-[360px]:text-[25px] min-[390px]:text-[28px] sm:text-[48px] lg:text-[54px] leading-[0.94] font-bold tracking-tight text-white drop-shadow-lg line-clamp-2">
                {activeDrama.title}
              </h2>

              <div className="mt-1.5 sm:mt-3 flex items-start gap-1.5 sm:gap-2.5">
                <span className="mt-1 sm:mt-2 h-[2px] w-4 sm:w-8 bg-[#e31c3d] shrink-0" />
                <p className="text-[11px] min-[360px]:text-[12px] sm:text-[15px] leading-snug text-white/95 line-clamp-2 drop-shadow">
                  {activeDrama.tagline}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}
