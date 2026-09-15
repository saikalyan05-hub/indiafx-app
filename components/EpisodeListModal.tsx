"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Bookmark,
  Check,
  Heart,
  Lock,
  Play,
  Share2,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import type { Drama } from "@/lib/data";
import { sound } from "@/lib/soundEffects";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

interface EpisodeListModalProps {
  drama: Drama | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectEpisode: (drama: Drama, episodeNumber: number) => void;
}

export function EpisodeListModal({
  drama,
  isOpen,
  onClose,
  onSelectEpisode,
}: EpisodeListModalProps) {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  useBodyScrollLock(isOpen && !!drama);

  useEffect(() => {
    setActiveTab(1);
    setIsBookmarked(false);
    setIsLiked(false);
    setCopied(false);
  }, [drama?.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!drama) return null;

  const episodes = drama.episodeList || [];
  const episodesPerPage = 12;
  const totalTabs = Math.ceil(episodes.length / episodesPerPage);
  const displayedEpisodes = episodes.slice(
    (activeTab - 1) * episodesPerPage,
    activeTab * episodesPerPage
  );

  const handleShare = () => {
    sound.playClick(900);
    const shareUrl = `${window.location.origin}/dramas/${drama.id}`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(() => {});
    }
  };

  const toggleBookmark = () => {
    sound.playClick(isBookmarked ? 500 : 850);
    setIsBookmarked(!isBookmarked);
  };

  const toggleLike = () => {
    sound.playLike();
    setIsLiked(!isLiked);
  };

  // 3D Physical Book-Opening Animation Variants
  const bookContainerVariants = {
    closed: {
      opacity: 0,
      scale: 0.85,
      y: 40,
      rotateX: 16,
      boxShadow: "0 15px 35px rgba(0,0,0,0.25)",
    },
    open: {
      opacity: 1,
      scale: 1,
      y: 0,
      rotateX: 0,
      boxShadow: "0 35px 110px rgba(0,0,0,0.55), 0 10px 30px rgba(0,0,0,0.2)",
      transition: {
        duration: 0.95,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
    exit: {
      opacity: 0,
      scale: 0.88,
      y: 25,
      rotateX: -10,
      transition: {
        duration: 0.65,
        ease: [0.25, 1, 0.5, 1] as [number, number, number, number],
      },
    },
  };

  // Spine-anchored 3D cover swing: rotates -180deg around the central vertical spine
  const coverSwingVariants = {
    closed: {
      rotateY: 0,
      z: 30,
    },
    open: {
      rotateY: -180,
      z: 0,
      transition: {
        duration: 1.05,
        ease: [0.18, 1, 0.32, 1] as [number, number, number, number],
        delay: 0.05,
      },
    },
    exit: {
      rotateY: 0,
      z: 30,
      transition: {
        duration: 0.75,
        ease: [0.25, 1, 0.5, 1] as [number, number, number, number],
      },
    },
  };

  // Intermediate paper leaf 1 (First page under cover)
  const pageLeaf1Variants = {
    closed: {
      rotateY: 0,
      z: 20,
    },
    open: {
      rotateY: -180,
      z: 0,
      transition: {
        duration: 0.98,
        ease: [0.18, 1, 0.32, 1] as [number, number, number, number],
        delay: 0.12,
      },
    },
    exit: {
      rotateY: 0,
      z: 20,
      transition: {
        duration: 0.7,
        ease: [0.25, 1, 0.5, 1] as [number, number, number, number],
      },
    },
  };

  // Intermediate paper leaf 2 (Second page)
  const pageLeaf2Variants = {
    closed: {
      rotateY: 0,
      z: 10,
    },
    open: {
      rotateY: -180,
      z: 0,
      transition: {
        duration: 0.92,
        ease: [0.18, 1, 0.32, 1] as [number, number, number, number],
        delay: 0.19,
      },
    },
    exit: {
      rotateY: 0,
      z: 10,
      transition: {
        duration: 0.65,
        ease: [0.25, 1, 0.5, 1] as [number, number, number, number],
      },
    },
  };

  // Intermediate paper leaf 3 (Third page)
  const pageLeaf3Variants = {
    closed: {
      rotateY: 0,
      z: 4,
    },
    open: {
      rotateY: -180,
      z: 0,
      transition: {
        duration: 0.86,
        ease: [0.18, 1, 0.32, 1] as [number, number, number, number],
        delay: 0.26,
      },
    },
    exit: {
      rotateY: 0,
      z: 4,
      transition: {
        duration: 0.6,
        ease: [0.25, 1, 0.5, 1] as [number, number, number, number],
      },
    },
  };

  // Dynamic sweeping shadow across the right page as leaves turn away
  const rightPageShadowVariants = {
    closed: { opacity: 0.45, x: 0 },
    open: {
      opacity: 0,
      x: 80,
      transition: {
        duration: 0.85,
        ease: [0.2, 1, 0.35, 1] as [number, number, number, number],
        delay: 0.15,
      },
    },
    exit: { opacity: 0.45, x: 0 },
  };

  // Dynamic landing shadow on left page as leaves settle
  const leftPageShadowVariants = {
    closed: { opacity: 0 },
    open: {
      opacity: [0, 0.3, 0.06],
      transition: {
        duration: 0.9,
        times: [0, 0.5, 1],
        ease: [0.2, 1, 0.35, 1] as [number, number, number, number],
        delay: 0.25,
      },
    },
    exit: { opacity: 0 },
  };

  // Content settling animation inside the opened pages
  const contentFadeVariants = {
    closed: {
      opacity: 0,
      y: 12,
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
        delay: 0.42,
      },
    },
    exit: {
      opacity: 0,
      y: 6,
      transition: { duration: 0.2 },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-2.5 sm:p-4 lg:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label={`${drama.title} episode dossier`}
        >
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Background Ambient Radial Glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.35, scale: 1.1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.7 }}
            className="pointer-events-none fixed h-[650px] w-[950px] rounded-[50%] blur-3xl -z-10"
            style={{
              background: `radial-gradient(circle, ${drama.accent || "#e31c3d"} 0%, transparent 70%)`,
            }}
          />

          {/* 3D Book Perspective Stage */}
          <div
            className="relative z-10 w-full max-w-[1160px] my-auto max-h-[92vh] lg:max-h-none overflow-y-auto lg:overflow-visible"
            style={{ perspective: 2600 }}
          >
            {/* Main Physical Book Shell Container */}
            <motion.div
              variants={bookContainerVariants}
              initial="closed"
              animate="open"
              exit="exit"
              className="relative w-full rounded-[24px] bg-[#fbf9f6] border border-[#e4dcce] border-b-[6px] border-r-[5px] border-l-[3px] shadow-[0_35px_110px_rgba(0,0,0,0.55)]"
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  sound.playClick(500);
                  onClose();
                }}
                className="focus-ring absolute right-3.5 top-3.5 sm:right-4 sm:top-4 z-40 grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-full bg-white text-[#111] shadow-[0_8px_20px_rgba(0,0,0,0.18)] ring-1 ring-black/10 transition hover:scale-110 active:scale-95"
                aria-label="Close modal"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>

              {/* Central Spine 3D Crease & Depth Gutter (Desktop 2-Page Spread) */}
              <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-16 -translate-x-1/2 bg-gradient-to-r from-black/5 via-black/35 to-black/5 lg:block z-30" />
              <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-[1.5px] -translate-x-1/2 bg-[#cfc3b0] lg:block z-30" />
              <div className="pointer-events-none absolute inset-y-0 left-[calc(50%-1px)] hidden w-[1px] bg-white/40 lg:block z-30" />

              {/* Physical Page Edge Depth Line on Left & Right Spreads */}
              <div className="pointer-events-none absolute bottom-0 inset-x-0 h-[5px] bg-[repeating-linear-gradient(90deg,#e5dccd_0_2px,transparent_2px_6px)] z-20 opacity-80" />

              {/* LAYERED 3D COVER & SEQUENTIAL TURNING PAGE LEAVES */}
              <div
                className="pointer-events-none absolute inset-0 hidden lg:block z-25 overflow-visible"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Dynamic Shadow on Right Page */}
                <motion.div
                  variants={rightPageShadowVariants}
                  initial="closed"
                  animate="open"
                  exit="exit"
                  className="absolute top-0 bottom-0 right-0 w-1/2 bg-gradient-to-r from-black/40 via-black/20 to-transparent pointer-events-none z-10"
                />

                {/* Dynamic Landing Shadow on Left Page */}
                <motion.div
                  variants={leftPageShadowVariants}
                  initial="closed"
                  animate="open"
                  exit="exit"
                  className="absolute top-0 bottom-0 left-0 w-1/2 bg-gradient-to-l from-black/35 via-black/15 to-transparent pointer-events-none z-10"
                />

                {/* 3. Intermediate Paper Leaf 3 */}
                <motion.div
                  variants={pageLeaf3Variants}
                  initial="closed"
                  animate="open"
                  exit="exit"
                  className="absolute top-0 bottom-0 right-0 w-1/2 shadow-[-12px_0_30px_rgba(0,0,0,0.12)]"
                  style={{
                    transformOrigin: "left center",
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Front Face of Leaf 3 */}
                  <div
                    className="absolute inset-0 rounded-r-[22px] bg-[#fbf8f2] border-l border-[#dfd2c0] p-8 flex flex-col justify-between overflow-hidden"
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                    }}
                  >
                    <div className="opacity-40 space-y-3">
                      <div className="h-3 w-28 bg-[#d8ccba] rounded" />
                      <div className="h-2 w-full bg-[#ece2d4] rounded" />
                      <div className="h-2 w-5/6 bg-[#ece2d4] rounded" />
                      <div className="h-2 w-4/6 bg-[#ece2d4] rounded" />
                    </div>
                    <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/15 to-transparent" />
                  </div>

                  {/* Back Face of Leaf 3 */}
                  <div
                    className="absolute inset-0 rounded-l-[22px] bg-[#fbf8f2] border-r border-[#dfd2c0] p-8 flex flex-col justify-between overflow-hidden"
                    style={{
                      transform: "rotateY(180deg)",
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                    }}
                  >
                    <div className="opacity-40 space-y-3">
                      <div className="h-3 w-32 bg-[#d8ccba] rounded" />
                      <div className="h-2 w-full bg-[#ece2d4] rounded" />
                      <div className="h-2 w-4/5 bg-[#ece2d4] rounded" />
                    </div>
                    <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/15 to-transparent" />
                  </div>
                </motion.div>

                {/* 2. Intermediate Paper Leaf 2 */}
                <motion.div
                  variants={pageLeaf2Variants}
                  initial="closed"
                  animate="open"
                  exit="exit"
                  className="absolute top-0 bottom-0 right-0 w-1/2 shadow-[-14px_0_35px_rgba(0,0,0,0.15)]"
                  style={{
                    transformOrigin: "left center",
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Front Face of Leaf 2 */}
                  <div
                    className="absolute inset-0 rounded-r-[22px] bg-[#faf6ee] border-l border-[#dccfb9] p-8 flex flex-col justify-between overflow-hidden"
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                    }}
                  >
                    <div className="flex gap-4 items-center">
                      <div className="h-16 w-16 rounded-xl bg-[#e3d7c5] shrink-0 opacity-60" />
                      <div className="flex-1 space-y-2 opacity-50">
                        <div className="h-3 w-3/4 bg-[#d5c7b3] rounded" />
                        <div className="h-2 w-full bg-[#ebdccb] rounded" />
                      </div>
                    </div>
                    <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/20 to-transparent" />
                  </div>

                  {/* Back Face of Leaf 2 */}
                  <div
                    className="absolute inset-0 rounded-l-[22px] bg-[#faf6ee] border-r border-[#dccfb9] p-8 flex flex-col justify-between overflow-hidden"
                    style={{
                      transform: "rotateY(180deg)",
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                    }}
                  >
                    <div className="opacity-40 space-y-3">
                      <div className="h-3 w-28 bg-[#d8ccba] rounded" />
                      <div className="h-2 w-full bg-[#ece2d4] rounded" />
                      <div className="h-2 w-3/4 bg-[#ece2d4] rounded" />
                    </div>
                    <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/20 to-transparent" />
                  </div>
                </motion.div>

                {/* 1. Intermediate Paper Leaf 1 */}
                <motion.div
                  variants={pageLeaf1Variants}
                  initial="closed"
                  animate="open"
                  exit="exit"
                  className="absolute top-0 bottom-0 right-0 w-1/2 shadow-[-16px_0_40px_rgba(0,0,0,0.18)]"
                  style={{
                    transformOrigin: "left center",
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Front Face of Leaf 1 */}
                  <div
                    className="absolute inset-0 rounded-r-[22px] bg-[#f8f3e8] border-l border-[#d8c9b2] p-8 flex flex-col justify-between overflow-hidden"
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                    }}
                  >
                    <div className="opacity-50 space-y-3">
                      <p className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#333]">
                        {drama.title}
                      </p>
                      <div className="h-2 w-full bg-[#e8dac7] rounded" />
                      <div className="h-2 w-5/6 bg-[#e8dac7] rounded" />
                      <div className="h-2 w-4/6 bg-[#e8dac7] rounded" />
                    </div>
                    <div className="absolute inset-y-0 left-0 w-9 bg-gradient-to-r from-black/25 to-transparent" />
                  </div>

                  {/* Back Face of Leaf 1 */}
                  <div
                    className="absolute inset-0 rounded-l-[22px] bg-[#f8f3e8] border-r border-[#d8c9b2] p-8 flex flex-col justify-between overflow-hidden"
                    style={{
                      transform: "rotateY(180deg)",
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                    }}
                  >
                    <div className="opacity-45 space-y-3">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-[#888]">
                        Production Notes
                      </p>
                      <div className="h-2 w-full bg-[#e8dac7] rounded" />
                      <div className="h-2 w-4/5 bg-[#e8dac7] rounded" />
                    </div>
                    <div className="absolute inset-y-0 right-0 w-9 bg-gradient-to-l from-black/25 to-transparent" />
                  </div>
                </motion.div>

                {/* 0. Main Front Cover swinging around the central spine */}
                <motion.div
                  variants={coverSwingVariants}
                  initial="closed"
                  animate="open"
                  exit="exit"
                  className="absolute top-0 bottom-0 right-0 w-1/2 shadow-[0_25px_70px_rgba(0,0,0,0.45)]"
                  style={{
                    transformOrigin: "left center",
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Front Face: High-Res Glossy Magazine Cover */}
                  <div
                    className="absolute inset-0 rounded-r-[22px] overflow-hidden bg-[#111]"
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                    }}
                  >
                    <img
                      src={drama.cover || drama.image}
                      alt={drama.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/40" />

                    {/* Spine Crease Highlight on Left Edge */}
                    <div className="absolute inset-y-0 left-0 w-7 bg-gradient-to-r from-black/85 via-black/35 to-transparent" />
                    <div className="absolute inset-y-0 left-[3px] w-[1px] bg-white/35" />

                    {/* Masthead Header on Cover */}
                    <div className="absolute left-6 top-6 right-6 flex items-start justify-between text-white">
                      <div>
                        <p className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-black leading-none tracking-tight">
                          India<span className="logo-fx">FX</span>
                        </p>
                        <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.24em] text-white/85">
                          Micro Drama
                        </p>
                      </div>
                      <span className="rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white border border-white/25">
                        {drama.volume}
                      </span>
                    </div>

                    {/* Title & Tagline on Cover */}
                    <div className="absolute inset-x-6 bottom-8 text-white">
                      <span className="inline-block rounded-full bg-[#e31c3d] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white mb-2">
                        {drama.genre[0]}
                      </span>
                      <h3 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold leading-tight drop-shadow-md">
                        {drama.title}
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-white/90 line-clamp-2">
                        {drama.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Back Face: Inside Front Cover Spread */}
                  <div
                    className="absolute inset-0 rounded-l-[22px] overflow-hidden bg-[#f4eee3] border-r border-[#d4c4ad] p-8 flex flex-col justify-between"
                    style={{
                      transform: "rotateY(180deg)",
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                    }}
                  >
                    <div>
                      <div className="flex items-center justify-between border-b border-[#e2d4c0] pb-3">
                        <p className="font-[family-name:var(--font-playfair)] text-2xl font-black text-[#111]">
                          India<span className="logo-fx">FX</span>
                        </p>
                        <span className="text-[11px] font-bold uppercase tracking-widest text-[#888]">
                          {drama.volume} Dossier
                        </span>
                      </div>
                      <p className="mt-6 font-[family-name:var(--font-caveat)] text-2xl text-[#333] leading-snug">
                        &ldquo;{drama.tagline}&rdquo;
                      </p>
                    </div>

                    <div className="text-[10px] text-[#888] uppercase tracking-widest">
                      Official IndiaFX Archival Spread
                    </div>

                    {/* Spine Gutter Shadow on Right Edge */}
                    <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/25 to-transparent pointer-events-none" />
                  </div>
                </motion.div>
              </div>

              {/* TWO-PAGE OPEN SPREAD (Left: Drama Dossier, Right: Episode Directory) */}
              <motion.div
                variants={contentFadeVariants}
                initial="closed"
                animate="open"
                exit="exit"
                className="grid lg:grid-cols-2 min-h-[590px] rounded-[24px] overflow-hidden"
              >
                {/* LEFT PAGE: Drama Dossier */}
                <div className="relative p-6 sm:p-8 lg:p-10 flex flex-col justify-between border-b border-[#e8e2d8] lg:border-b-0 lg:border-r bg-white/80">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-[#e31c3d] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm">
                        {drama.volume}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-semibold text-[#888]">
                        <Star className="h-3.5 w-3.5 fill-[#f59e0b] text-[#f59e0b]" />
                        {drama.rating}
                      </span>
                      <span className="text-xs font-medium text-[#888]">
                        {drama.releaseYear} • {drama.episodes} EP
                      </span>
                    </div>

                    <h2 className="mt-4 font-[family-name:var(--font-playfair)] text-[34px] sm:text-[42px] leading-[1.0] font-bold text-[#111]">
                      {drama.title}
                    </h2>

                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#e31c3d]">
                      {drama.genre.join(" • ")}
                    </p>

                    {/* Synopsis */}
                    <p className="mt-5 text-sm sm:text-[15px] leading-relaxed text-[#4a4a4a]">
                      {drama.description}
                    </p>

                    {/* Cast & Credits Dossier */}
                    <div className="mt-6 rounded-2xl bg-[#f7f4ee] p-4 border border-[#ece4d8]">
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <p className="font-bold text-[#888] uppercase tracking-wider text-[10px]">
                            Director
                          </p>
                          <p className="mt-0.5 font-semibold text-[#111]">{drama.director}</p>
                        </div>
                        <div>
                          <p className="font-bold text-[#888] uppercase tracking-wider text-[10px]">
                            Cast
                          </p>
                          <p className="mt-0.5 font-semibold text-[#111] truncate">
                            {drama.cast.join(", ")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Left Page Actions */}
                  <div className="mt-8 pt-6 border-t border-[#ece8e2] flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => {
                        sound.playPageFlip();
                        onSelectEpisode(drama, drama.lastEpisodeWatched || 1);
                      }}
                      className="focus-ring inline-flex items-center gap-2 rounded-full bg-[#111] px-6 py-3.5 text-sm font-bold text-white shadow-[0_12px_28px_rgba(0,0,0,0.2)] transition hover:bg-[#e31c3d] hover:scale-105 active:scale-95"
                    >
                      <Play className="h-4 w-4 fill-white" />
                      Play Episode {drama.lastEpisodeWatched || 1}
                    </button>

                    <motion.button
                      onClick={toggleLike}
                      whileTap={{ scale: 0.88 }}
                      animate={isLiked ? { scale: [1, 1.18, 1] } : { scale: 1 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className={`focus-ring grid h-11 w-11 place-items-center rounded-full border transition hover:scale-105 ${
                        isLiked
                          ? "bg-[#ffebee] border-[#e31c3d] text-[#e31c3d]"
                          : "bg-white border-[#ddd] text-[#555] hover:text-[#111]"
                      }`}
                      aria-label="Like drama"
                    >
                      <Heart className={`h-4 w-4 ${isLiked ? "fill-[#e31c3d]" : ""}`} />
                    </motion.button>

                    <motion.button
                      onClick={toggleBookmark}
                      whileTap={{ scale: 0.88 }}
                      animate={isBookmarked ? { scale: [1, 1.16, 1] } : { scale: 1 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className={`focus-ring grid h-11 w-11 place-items-center rounded-full border transition hover:scale-105 ${
                        isBookmarked
                          ? "bg-[#e8f5e9] border-[#2e7d32] text-[#2e7d32]"
                          : "bg-white border-[#ddd] text-[#555] hover:text-[#111]"
                      }`}
                      aria-label="Save to watchlist"
                    >
                      <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-[#2e7d32]" : ""}`} />
                    </motion.button>

                    <button
                      onClick={handleShare}
                      className="focus-ring grid h-11 w-11 place-items-center rounded-full bg-white border border-[#ddd] text-[#555] transition hover:text-[#111] hover:scale-105"
                      aria-label="Share drama link"
                    >
                      {copied ? <Check className="h-4 w-4 text-green-600" /> : <Share2 className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* RIGHT PAGE: Episode Directory */}
                <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-[#faf7f3]">
                  <div>
                    <div className="flex items-center justify-between pb-4 border-b border-[#ece6dc]">
                      <div>
                        <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#111]">
                          Episode Index
                        </h3>
                        <p className="text-xs text-[#888]">
                          Select any episode to begin watching immediately
                        </p>
                      </div>

                      {/* Episode Batch Tabs */}
                      {totalTabs > 1 && (
                        <div className="flex items-center gap-1 rounded-full bg-[#eae3d5] p-1 text-xs">
                          {Array.from({ length: totalTabs }, (_, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                sound.playClick(750);
                                setActiveTab(i + 1);
                              }}
                              className={`rounded-full px-2.5 py-1 font-semibold transition ${
                                activeTab === i + 1
                                  ? "bg-white text-[#111] shadow-sm"
                                  : "text-[#777] hover:text-[#111]"
                              }`}
                            >
                              {i * episodesPerPage + 1}-
                              {Math.min((i + 1) * episodesPerPage, episodes.length)}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Episodes List Grid */}
                    <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-2">
                      {displayedEpisodes.map((ep) => {
                        const isCurrent = (drama.lastEpisodeWatched || 1) === ep.number;
                        return (
                          <button
                            key={ep.number}
                            onClick={() => {
                              sound.playEpisodeSelect();
                              onSelectEpisode(drama, ep.number);
                            }}
                            aria-label={`Play episode ${ep.number}${ep.isLocked ? " (premium)" : ""}`}
                            className={`group relative flex items-start gap-3 rounded-2xl p-2.5 text-left transition border ${
                              isCurrent
                                ? "bg-white border-[#e31c3d] shadow-[0_6px_18px_rgba(227,28,61,0.12)]"
                                : "bg-white/80 border-[#e8e0d4] hover:bg-white hover:border-[#ccc] hover:shadow-sm"
                            }`}
                          >
                            {/* Thumbnail */}
                            <div className="relative aspect-[4/3] w-20 shrink-0 overflow-hidden rounded-xl bg-black">
                              <img
                                src={ep.thumbnail || drama.cover}
                                alt=""
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                                {ep.isLocked ? (
                                  <Lock className="h-4 w-4 text-white/90" />
                                ) : (
                                  <span className="grid h-6 w-6 place-items-center rounded-full bg-white/90 text-[#111] shadow">
                                    <Play className="h-3 w-3 fill-[#111] ml-0.5" />
                                  </span>
                                )}
                              </div>
                              <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 text-[8px] font-bold text-white">
                                {ep.duration}
                              </span>
                            </div>

                            {/* Episode Metadata */}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between">
                                <span
                                  className={`text-[11px] font-bold ${
                                    isCurrent ? "text-[#e31c3d]" : "text-[#777]"
                                  }`}
                                >
                                  EP {String(ep.number).padStart(2, "0")}
                                </span>
                                {isCurrent && (
                                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#e31c3d] bg-[#ffebee] px-1.5 py-0.5 rounded">
                                    Now Playing
                                  </span>
                                )}
                              </div>
                              <p className="mt-0.5 text-xs font-semibold text-[#111] truncate group-hover:text-[#e31c3d]">
                                {ep.title}
                              </p>
                              <p className="mt-1 text-[10px] text-[#888] line-clamp-2">
                                {ep.synopsis}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Bottom Footer Note */}
                  <div className="mt-6 pt-4 border-t border-[#ece6dc] flex items-center justify-between text-xs text-[#888]">
                    <p className="flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-[#e31c3d]" />
                      <span>Free episodes available. Premium unblocks full HD.</span>
                    </p>
                    <span className="font-semibold text-[#111]">IndiaFX Originals</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
