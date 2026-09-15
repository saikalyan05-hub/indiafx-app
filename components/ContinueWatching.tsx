"use client";

import Link from "next/link";
import { ChevronRight, Play, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { dramas, type Drama } from "@/lib/data";
import { sound } from "@/lib/soundEffects";
import { Reveal } from "@/components/Reveal";

interface ContinueWatchingProps {
  drama?: Drama;
  episodeNumber?: number;
  progress?: number;
  onPlayEpisode?: (drama: Drama, epNum: number) => void;
  onOpenModal?: (drama: Drama) => void;
  flush?: boolean;
}

export function ContinueWatching({
  drama: propDrama,
  episodeNumber: propEp,
  progress: propProgress,
  onPlayEpisode,
  onOpenModal,
  flush = false,
}: ContinueWatchingProps) {
  const drama = propDrama || dramas[0];
  const progress = propProgress !== undefined ? propProgress : (drama.progress ?? 42);
  const currentEp = propEp !== undefined ? propEp : (drama.lastEpisodeWatched || 4);

  const handlePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sound.playPageFlip();
    if (onPlayEpisode) {
      onPlayEpisode(drama, currentEp);
    }
  };

  const handleOpenDossier = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playBookOpen();
    if (onOpenModal) {
      onOpenModal(drama);
    }
  };

  return (
    <section className={flush ? "mt-2 select-none" : "mx-auto mt-6 sm:mt-10 w-full max-w-[1600px] px-3.5 sm:px-8 lg:px-12 xl:px-16 select-none"}>
      {/* Section Header */}
      {!flush && (
        <Reveal>
          <div className="flex items-center justify-between gap-4 border-b border-[#ece6dc] pb-3 sm:pb-4 mb-4">
            <h2 className="font-[family-name:var(--font-playfair)] text-[22px] min-[360px]:text-[24px] sm:text-[32px] font-bold tracking-tight text-[#111]">
              Continue Watching
            </h2>

            <Link
              href="/profile"
              onClick={() => sound.playClick(600)}
              className="group inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#e31c3d] hover:text-[#b3142e] transition"
            >
              <span>See All</span>
              <ChevronRight className="fx-arrow h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Link>
          </div>
        </Reveal>
      )}

      <Reveal delay={0.06}>
      <motion.div
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.22 }}
        onClick={handlePlay}
        className="group relative cursor-pointer overflow-hidden rounded-[22px] bg-white p-3 sm:p-4 shadow-[0_8px_30px_rgba(0,0,0,0.04)] ring-1 ring-black/5 border border-[#ece6dc] transition-all hover:shadow-[0_12px_36px_rgba(227,28,61,0.08)] hover:border-[#e31c3d]/30"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4">

          {/* Left: Thumbnail & Drama Info */}
          <div className="flex items-center gap-3 sm:gap-5 min-w-0 flex-1">
            {/* 16:9 Thumbnail with Play Badge */}
            <div className="relative h-16 w-28 min-[360px]:h-18 min-[360px]:w-32 sm:h-20 sm:w-36 shrink-0 overflow-hidden rounded-xl bg-black shadow-sm">
              <img
                src={drama.cover || drama.image}
                alt={drama.title}
                loading="lazy"
                decoding="async"
                className="fx-img h-full w-full object-cover object-top opacity-90"
              />
              <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors" />

              {/* Play Badge Overlay */}
              <span className="absolute left-1/2 top-1/2 grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-[#111] shadow-md transition group-hover:scale-110 group-hover:bg-[#e31c3d] group-hover:text-white">
                <Play className="ml-0.5 h-3.5 w-3.5 fill-current" />
              </span>

              {/* Volume tag */}
              <span className="absolute bottom-1 right-1 rounded bg-black/75 backdrop-blur-xs px-1.5 py-0.5 text-[8px] min-[360px]:text-[9px] font-bold text-white">
                {drama.volume}
              </span>
            </div>

            {/* Info & Progress */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-[#e31c3d]">
                  <Sparkles className="h-3 w-3" /> Live Progress
                </span>
                <span className="text-[#ccc]">•</span>
                <span className="text-[10px] min-[360px]:text-[11px] font-semibold text-[#888]">
                  EP {currentEp} of {drama.episodes}
                </span>
              </div>

              <h3 className="mt-0.5 font-[family-name:var(--font-playfair)] text-sm min-[360px]:text-base sm:text-lg font-bold text-[#111] truncate transition-colors group-hover:text-[#e31c3d]">
                {drama.title}
              </h3>

              {/* Compact Progress Bar */}
              <div className="mt-1 sm:mt-1.5 flex items-center gap-2.5 sm:gap-3 max-w-md">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#ece6dc]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full bg-[#e31c3d]"
                  />
                </div>
                <span className="text-[10px] min-[360px]:text-[11px] font-bold text-[#666] shrink-0">
                  {progress}%
                </span>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#f0eae0]">
            <button
              onClick={handleOpenDossier}
              className="hidden md:inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold text-[#666] hover:text-[#111] hover:bg-[#f4efe8] transition"
              title="View Episodes Dossier"
            >
              Episodes Dossier
            </button>

            <button
              onClick={handlePlay}
              className="w-full sm:w-auto justify-center inline-flex items-center gap-2 rounded-full bg-[#111] px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm transition hover:bg-[#e31c3d] group-hover:scale-102 active:scale-95"
            >
              <Play className="h-3.5 w-3.5 fill-white transition-transform duration-200 group-hover:scale-110" />
              <span>Resume EP {currentEp}</span>
              <ChevronRight className="fx-arrow h-3.5 w-3.5 text-white/70" />
            </button>
          </div>

        </div>
      </motion.div>
      </Reveal>
    </section>
  );
}
