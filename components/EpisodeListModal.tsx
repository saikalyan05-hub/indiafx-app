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
    const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/dramas/${drama.id}`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => {});
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
      scale: 0.92,
      y: 20,
    },
    open: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.55,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
    exit: {
      opacity: 0,
      scale: 0.94,
      y: 14,
      transition: {
        duration: 0.25,
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
        duration: 0.85,
        ease: [0.18, 1, 0.32, 1] as [number, number, number, number],
        delay: 0.05,
      },
    },
    exit: {
      rotateY: 0,
      z: 30,
      transition: {
        duration: 0.45,
        ease: [0.25, 1, 0.5, 1] as [number, number, number, number],
      },
    },
  };

  // Intermediate paper leaf 1
  const pageLeaf1Variants = {
    closed: {
      rotateY: 0,
      z: 20,
    },
    open: {
      rotateY: -180,
      z: 0,
      transition: {
        duration: 0.8,
        ease: [0.18, 1, 0.32, 1] as [number, number, number, number],
        delay: 0.1,
      },
    },
    exit: {
      rotateY: 0,
      z: 20,
      transition: {
        duration: 0.4,
        ease: [0.25, 1, 0.5, 1] as [number, number, number, number],
      },
    },
  };

  // Intermediate paper leaf 2
  const pageLeaf2Variants = {
    closed: {
      rotateY: 0,
      z: 10,
    },
    open: {
      rotateY: -180,
      z: 0,
      transition: {
        duration: 0.75,
        ease: [0.18, 1, 0.32, 1] as [number, number, number, number],
        delay: 0.16,
      },
    },
    exit: {
      rotateY: 0,
      z: 10,
      transition: {
        duration: 0.35,
        ease: [0.25, 1, 0.5, 1] as [number, number, number, number],
      },
    },
  };

  // Intermediate paper leaf 3
  const pageLeaf3Variants = {
    closed: {
      rotateY: 0,
      z: 4,
    },
    open: {
      rotateY: -180,
      z: 0,
      transition: {
        duration: 0.7,
        ease: [0.18, 1, 0.32, 1] as [number, number, number, number],
        delay: 0.22,
      },
    },
    exit: {
      rotateY: 0,
      z: 4,
      transition: {
        duration: 0.3,
        ease: [0.25, 1, 0.5, 1] as [number, number, number, number],
      },
    },
  };

  // Dynamic sweeping shadow across the right page
  const rightPageShadowVariants = {
    closed: { opacity: 0.45, x: 0 },
    open: {
      opacity: 0,
      x: 80,
      transition: {
        duration: 0.7,
        ease: [0.2, 1, 0.35, 1] as [number, number, number, number],
        delay: 0.12,
      },
    },
    exit: { opacity: 0.45, x: 0 },
  };

  // Dynamic landing shadow on left page as leaves settle
  const leftPageShadowVariants = {
    closed: { opacity: 0 },
    open: {
      opacity: [0, 0.25, 0.05],
      transition: {
        duration: 0.75,
        times: [0, 0.5, 1],
        ease: [0.2, 1, 0.35, 1] as [number, number, number, number],
        delay: 0.2,
      },
    },
    exit: { opacity: 0 },
  };

  // Content settling animation inside the opened pages
  const contentFadeVariants = {
    closed: {
      opacity: 0,
      y: 10,
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
        delay: 0.3,
      },
    },
    exit: {
      opacity: 0,
      y: 6,
      transition: { duration: 0.18 },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-2 min-[360px]:p-3 sm:p-4 lg:p-6 overflow-y-auto overflow-x-hidden"
          role="dialog"
          aria-modal="true"
          aria-label={`${drama.title} episode dossier`}
        >
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Background Ambient Radial Glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.3, scale: 1.05 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6 }}
            className="pointer-events-none fixed h-[500px] w-[800px] rounded-[50%] blur-3xl -z-10"
            style={{
              background: `radial-gradient(circle, ${drama.accent || "#e31c3d"} 0%, transparent 70%)`,
            }}
          />

          {/* 3D Book Container Boundary Wrapper */}
          <div
            className="relative z-10 w-full max-w-[1140px] my-auto max-h-[calc(100dvh-16px)] sm:max-h-[92vh] flex flex-col"
            style={{ perspective: 2400 }}
          >
            {/* Main Physical Book Shell Container */}
            <motion.div
              variants={bookContainerVariants}
              initial="closed"
              animate="open"
              exit="exit"
              className="relative w-full rounded-[20px] sm:rounded-[24px] bg-[#fbf9f6] border border-[#e4dcce] border-b-[5px] border-r-[4px] border-l-[3px] shadow-[0_25px_90px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[calc(100dvh-16px)] sm:max-h-[92vh]"
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              {/* Sticky/Fixed Close Button on Mobile & Desktop */}
              <button
                onClick={() => {
                  sound.playClick(500);
                  onClose();
                }}
                className="focus-ring absolute right-3 top-3 sm:right-4 sm:top-4 z-50 grid h-8 w-8 min-[360px]:h-9 min-[360px]:w-9 sm:h-10 sm:w-10 place-items-center rounded-full bg-white/95 text-[#111] shadow-[0_4px_16px_rgba(0,0,0,0.18)] ring-1 ring-black/10 transition-transform duration-200 hover:scale-110 active:scale-95"
                aria-label="Close modal"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>

              {/* Central Spine 3D Crease & Depth Gutter (Desktop 2-Page Spread) */}
              <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-16 -translate-x-1/2 bg-gradient-to-r from-black/5 via-black/30 to-black/5 lg:block z-30" />
              <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-[1.5px] -translate-x-1/2 bg-[#cfc3b0] lg:block z-30" />
              <div className="pointer-events-none absolute inset-y-0 left-[calc(50%-1px)] hidden w-[1px] bg-white/40 lg:block z-30" />

              {/* Physical Page Edge Depth Line on Left & Right Spreads */}
              <div className="pointer-events-none absolute bottom-0 inset-x-0 h-[4px] bg-[repeating-linear-gradient(90deg,#e5dccd_0_2px,transparent_2px_6px)] z-20 opacity-80" />

              {/* LAYERED 3D COVER & SEQUENTIAL TURNING PAGE LEAVES (Desktop only, bounded) */}
              <div
                className="pointer-events-none absolute inset-0 hidden lg:block z-25 overflow-hidden rounded-[24px]"
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
                  {/* Front of Cover */}
                  <div
                    className="absolute inset-0 rounded-r-[24px] overflow-hidden bg-[#141414] border border-black/20"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <img
                      src={drama.cover || drama.image}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/30" />
                    <div className="absolute top-6 left-6 right-6 flex items-center justify-between text-white">
                      <span className="font-[family-name:var(--font-playfair)] text-xl font-bold tracking-tight">
                        India<span className="text-[#e31c3d]">FX</span>
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-md">
                        {drama.volume}
                      </span>
                    </div>
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#e31c3d]">
                        {drama.genre[0]}
                      </p>
                      <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold leading-tight mt-1">
                        {drama.title}
                      </h2>
                    </div>
                  </div>

                  {/* Back of Cover (Inside Front Cover) */}
                  <div
                    className="absolute inset-0 rounded-l-[24px] bg-[#f5f1eb] p-8 flex flex-col justify-between border-l border-[#dfd6c8]"
                    style={{
                      transform: "rotateY(180deg)",
                      backfaceVisibility: "hidden",
                    }}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 border-b border-[#e5dccd] pb-3">
                        <Sparkles className="h-4 w-4 text-[#e31c3d]" />
                        <span className="font-[family-name:var(--font-playfair)] text-base font-bold text-[#111]">
                          Editor&apos;s Preface
                        </span>
                      </div>
                      <p className="text-xs italic leading-relaxed text-[#555] font-serif">
                        &ldquo;A gripping vertical cinema marvel crafted for modern drama connoisseurs.&rdquo;
                      </p>
                    </div>
                    <div className="text-[10px] text-[#888] uppercase tracking-widest">
                      IndiaFX Archival Edition
                    </div>
                  </div>
                </motion.div>

                {/* 1. Turning Page Leaf 1 */}
                <motion.div
                  variants={pageLeaf1Variants}
                  initial="closed"
                  animate="open"
                  exit="exit"
                  className="absolute top-0 bottom-0 right-0 w-1/2"
                  style={{
                    transformOrigin: "left center",
                    transformStyle: "preserve-3d",
                  }}
                >
                  <div
                    className="absolute inset-0 rounded-r-[24px] bg-[#fbf9f6] border border-[#e5dccd] p-8 shadow-[0_15px_35px_rgba(0,0,0,0.15)]"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <div className="h-full w-full rounded-xl border border-dashed border-[#e0d6c6] p-4 flex flex-col justify-between opacity-80">
                      <p className="font-[family-name:var(--font-playfair)] text-sm font-bold text-[#333]">
                        Act I • The Awakening
                      </p>
                      <p className="text-[11px] text-[#777] leading-relaxed">
                        Every betrayal begins with an unbroken promise...
                      </p>
                      <span className="text-[9px] text-[#999] text-right font-mono">01</span>
                    </div>
                  </div>
                  <div
                    className="absolute inset-0 rounded-l-[24px] bg-[#f8f5ee] border border-[#e5dccd] p-8"
                    style={{
                      transform: "rotateY(180deg)",
                      backfaceVisibility: "hidden",
                    }}
                  >
                    <div className="h-full w-full rounded-xl border border-dashed border-[#e0d6c6] p-4 flex flex-col justify-between opacity-80">
                      <p className="font-[family-name:var(--font-playfair)] text-sm font-bold text-[#333]">
                        Character Compendium
                      </p>
                      <span className="text-[9px] text-[#999] text-right font-mono">02</span>
                    </div>
                  </div>
                </motion.div>

                {/* 2. Turning Page Leaf 2 */}
                <motion.div
                  variants={pageLeaf2Variants}
                  initial="closed"
                  animate="open"
                  exit="exit"
                  className="absolute top-0 bottom-0 right-0 w-1/2"
                  style={{
                    transformOrigin: "left center",
                    transformStyle: "preserve-3d",
                  }}
                >
                  <div
                    className="absolute inset-0 rounded-r-[24px] bg-[#fcfbfa] border border-[#e5dccd] p-8 shadow-[0_10px_25px_rgba(0,0,0,0.1)]"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <div className="h-full w-full rounded-xl border border-dashed border-[#e0d6c6] p-4 flex flex-col justify-between opacity-75">
                      <p className="font-[family-name:var(--font-playfair)] text-sm font-bold text-[#333]">
                        Behind The Scenes
                      </p>
                      <span className="text-[9px] text-[#999] text-right font-mono">03</span>
                    </div>
                  </div>
                  <div
                    className="absolute inset-0 rounded-l-[24px] bg-[#f7f3eb] border border-[#e5dccd] p-8"
                    style={{
                      transform: "rotateY(180deg)",
                      backfaceVisibility: "hidden",
                    }}
                  >
                    <div className="h-full w-full rounded-xl border border-dashed border-[#e0d6c6] p-4 flex flex-col justify-between opacity-75">
                      <p className="font-[family-name:var(--font-playfair)] text-sm font-bold text-[#333]">
                        Cinematography Notes
                      </p>
                      <span className="text-[9px] text-[#999] text-right font-mono">04</span>
                    </div>
                  </div>
                </motion.div>

                {/* 3. Turning Page Leaf 3 */}
                <motion.div
                  variants={pageLeaf3Variants}
                  initial="closed"
                  animate="open"
                  exit="exit"
                  className="absolute top-0 bottom-0 right-0 w-1/2"
                  style={{
                    transformOrigin: "left center",
                    transformStyle: "preserve-3d",
                  }}
                >
                  <div
                    className="absolute inset-0 rounded-r-[24px] bg-[#fffdfa] border border-[#e5dccd] p-8 shadow-[0_8px_20px_rgba(0,0,0,0.08)]"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <div className="h-full w-full rounded-xl border border-dashed border-[#e0d6c6] p-4 flex flex-col justify-between opacity-70">
                      <p className="font-[family-name:var(--font-playfair)] text-sm font-bold text-[#333]">
                        Episode Index Loading...
                      </p>
                      <span className="text-[9px] text-[#999] text-right font-mono">05</span>
                    </div>
                  </div>
                  <div
                    className="absolute inset-0 rounded-l-[24px] bg-[#f5f0e6] border border-[#e5dccd] p-8"
                    style={{
                      transform: "rotateY(180deg)",
                      backfaceVisibility: "hidden",
                    }}
                  >
                    <div className="text-[10px] text-[#888] uppercase tracking-widest">
                      Official IndiaFX Archival Spread
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* TWO-PAGE OPEN SPREAD (Responsive: Stack on Mobile, 2-Col on Desktop) */}
              <motion.div
                variants={contentFadeVariants}
                initial="closed"
                animate="open"
                exit="exit"
                className="grid lg:grid-cols-2 overflow-y-auto lg:overflow-hidden max-h-[calc(100dvh-16px)] sm:max-h-[92vh] w-full"
              >
                {/* LEFT PAGE: Drama Dossier */}
                <div className="relative p-4 min-[360px]:p-5 sm:p-7 lg:p-8 xl:p-9 flex flex-col justify-between border-b border-[#e8e2d8] lg:border-b-0 lg:border-r bg-white/85 lg:overflow-y-auto hide-scrollbar">
                  <div>
                    {/* Top Badges & Ratings */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pr-8 sm:pr-10">
                      <span className="rounded-full bg-[#e31c3d] px-2.5 sm:px-3 py-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white shadow-sm">
                        {drama.volume}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-[#666] bg-[#f5efe6] px-2.5 py-0.5 rounded-full">
                        <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-[#f59e0b] text-[#f59e0b]" />
                        {drama.rating}
                      </span>
                      <span className="text-[11px] sm:text-xs font-medium text-[#777] bg-[#f5efe6] px-2.5 py-0.5 rounded-full">
                        {drama.releaseYear} • {drama.episodes} EP
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="mt-3 sm:mt-4 font-[family-name:var(--font-playfair)] text-[24px] min-[360px]:text-[28px] sm:text-[34px] lg:text-[36px] xl:text-[40px] leading-[1.05] font-bold text-[#111] break-words">
                      {drama.title}
                    </h2>

                    {/* Genre Tagline */}
                    <p className="mt-1.5 sm:mt-2 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#e31c3d]">
                      {drama.genre.join(" • ")}
                    </p>

                    {/* Synopsis */}
                    <p className="mt-3 sm:mt-4 text-xs sm:text-[14px] leading-relaxed text-[#4a4a4a]">
                      {drama.description}
                    </p>

                    {/* Cast & Credits Dossier */}
                    <div className="mt-4 sm:mt-5 rounded-2xl bg-[#f7f4ee] p-3 sm:p-4 border border-[#ece4d8]">
                      <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs">
                        <div className="min-w-0">
                          <p className="font-bold text-[#888] uppercase tracking-wider text-[10px]">
                            Director
                          </p>
                          <p className="mt-0.5 font-semibold text-[#111] truncate">
                            {drama.director}
                          </p>
                        </div>
                        <div className="min-w-0">
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
                  <div className="mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-[#ece8e2] flex flex-wrap items-center gap-2 sm:gap-3">
                    <button
                      onClick={() => {
                        sound.playPageFlip();
                        onSelectEpisode(drama, drama.lastEpisodeWatched || 1);
                      }}
                      className="focus-ring flex-1 min-w-[150px] sm:flex-initial inline-flex items-center justify-center gap-2 rounded-full bg-[#111] px-5 sm:px-6 py-2.5 sm:py-3.5 text-xs sm:text-sm font-bold text-white shadow-[0_8px_20px_rgba(0,0,0,0.18)] transition-all hover:bg-[#e31c3d] hover:scale-105 active:scale-95"
                    >
                      <Play className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-white" />
                      Play Episode {drama.lastEpisodeWatched || 1}
                    </button>

                    <motion.button
                      onClick={toggleLike}
                      whileTap={{ scale: 0.88 }}
                      animate={isLiked ? { scale: [1, 1.18, 1] } : { scale: 1 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className={`focus-ring grid h-9 w-9 sm:h-11 sm:w-11 place-items-center rounded-full border transition hover:scale-105 shrink-0 ${
                        isLiked
                          ? "bg-[#ffebee] border-[#e31c3d] text-[#e31c3d]"
                          : "bg-white border-[#ddd] text-[#555] hover:text-[#111]"
                      }`}
                      aria-label="Like drama"
                    >
                      <Heart className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isLiked ? "fill-[#e31c3d]" : ""}`} />
                    </motion.button>

                    <motion.button
                      onClick={toggleBookmark}
                      whileTap={{ scale: 0.88 }}
                      animate={isBookmarked ? { scale: [1, 1.16, 1] } : { scale: 1 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className={`focus-ring grid h-9 w-9 sm:h-11 sm:w-11 place-items-center rounded-full border transition hover:scale-105 shrink-0 ${
                        isBookmarked
                          ? "bg-[#e8f5e9] border-[#2e7d32] text-[#2e7d32]"
                          : "bg-white border-[#ddd] text-[#555] hover:text-[#111]"
                      }`}
                      aria-label="Save to watchlist"
                    >
                      <Bookmark className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isBookmarked ? "fill-[#2e7d32]" : ""}`} />
                    </motion.button>

                    <button
                      onClick={handleShare}
                      className="focus-ring grid h-9 w-9 sm:h-11 sm:w-11 place-items-center rounded-full bg-white border border-[#ddd] text-[#555] transition hover:text-[#111] hover:scale-105 shrink-0"
                      aria-label="Share drama link"
                    >
                      {copied ? (
                        <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600" />
                      ) : (
                        <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* RIGHT PAGE: Episode Directory */}
                <div className="p-4 min-[360px]:p-5 sm:p-7 lg:p-8 xl:p-9 flex flex-col justify-between bg-[#faf7f3] lg:overflow-y-auto hide-scrollbar">
                  <div>
                    {/* Header + Episode Tabs (Responsive Header) */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 sm:pb-4 border-b border-[#ece6dc]">
                      <div className="min-w-0">
                        <h3 className="font-[family-name:var(--font-playfair)] text-xl sm:text-2xl font-bold text-[#111]">
                          Episode Index
                        </h3>
                        <p className="text-[11px] sm:text-xs text-[#888] truncate">
                          Select any episode to begin watching immediately
                        </p>
                      </div>

                      {/* Episode Batch Tabs - Horizontally scrollable on mobile */}
                      {totalTabs > 1 && (
                        <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar max-w-full rounded-full bg-[#eae3d5] p-1 text-xs shrink-0">
                          {Array.from({ length: totalTabs }, (_, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                sound.playClick(750);
                                setActiveTab(i + 1);
                              }}
                              className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
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
                    <div className="mt-4 sm:mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[320px] sm:max-h-[360px] lg:max-h-[380px] xl:max-h-[420px] overflow-y-auto pr-1">
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
                            className={`group relative flex items-start gap-2.5 rounded-xl sm:rounded-2xl p-2 sm:p-2.5 text-left transition border ${
                              isCurrent
                                ? "bg-white border-[#e31c3d] shadow-[0_4px_14px_rgba(227,28,61,0.12)]"
                                : "bg-white/80 border-[#e8e0d4] hover:bg-white hover:border-[#ccc] hover:shadow-sm"
                            }`}
                          >
                            {/* Thumbnail */}
                            <div className="relative aspect-[4/3] w-16 sm:w-20 shrink-0 overflow-hidden rounded-lg sm:rounded-xl bg-black">
                              <img
                                src={ep.thumbnail || drama.cover}
                                alt=""
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                                {ep.isLocked ? (
                                  <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white/90" />
                                ) : (
                                  <span className="grid h-5 w-5 sm:h-6 sm:w-6 place-items-center rounded-full bg-white/90 text-[#111] shadow">
                                    <Play className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-[#111] ml-0.5" />
                                  </span>
                                )}
                              </div>
                              <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 text-[8px] font-bold text-white">
                                {ep.duration}
                              </span>
                            </div>

                            {/* Episode Metadata */}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-1">
                                <span
                                  className={`text-[10px] sm:text-[11px] font-bold ${
                                    isCurrent ? "text-[#e31c3d]" : "text-[#777]"
                                  }`}
                                >
                                  EP {String(ep.number).padStart(2, "0")}
                                </span>
                                {isCurrent && (
                                  <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-[#e31c3d] bg-[#ffebee] px-1.5 py-0.5 rounded">
                                    Playing
                                  </span>
                                )}
                              </div>
                              <p className="mt-0.5 text-[11px] sm:text-xs font-semibold text-[#111] truncate group-hover:text-[#e31c3d]">
                                {ep.title}
                              </p>
                              <p className="mt-0.5 sm:mt-1 text-[9px] sm:text-[10px] text-[#888] line-clamp-2">
                                {ep.synopsis}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Bottom Footer Note */}
                  <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-[#ece6dc] flex items-center justify-between text-[11px] sm:text-xs text-[#888]">
                    <p className="flex items-center gap-1.5 truncate">
                      <Sparkles className="h-3.5 w-3.5 text-[#e31c3d] shrink-0" />
                      <span className="truncate">Free episodes available. Premium unblocks 4K HDR.</span>
                    </p>
                    <span className="font-semibold text-[#111] shrink-0 ml-2">IndiaFX Originals</span>
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
