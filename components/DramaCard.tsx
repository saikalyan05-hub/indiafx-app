"use client";

import { useRouter } from "next/navigation";
import { Play } from "lucide-react";
import type { Drama } from "@/lib/data";
import { sound } from "@/lib/soundEffects";

interface DramaCardProps {
  drama: Drama;
  compact?: boolean;
  fluid?: boolean;
  variant?: "portrait" | "landscape";
  onOpenModal?: (drama: Drama) => void;
  onPlayDirect?: (drama: Drama, episodeNum?: number) => void;
}

export function DramaCard({
  drama,
  compact = false,
  fluid = false,
  variant = "landscape",
  onOpenModal,
  onPlayDirect,
}: DramaCardProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    sound.playBookOpen();
    if (onOpenModal) {
      onOpenModal(drama);
    } else {
      router.push(`/dramas/${drama.id}`);
    }
  };

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playPageFlip();
    if (onPlayDirect) {
      onPlayDirect(drama, drama.lastEpisodeWatched || 1);
    } else if (onOpenModal) {
      onOpenModal(drama);
    } else {
      router.push(`/dramas/${drama.id}`);
    }
  };

  if (variant === "landscape") {
    return (
      <div
        className={`transform-gpu ${
          fluid ? "h-full w-full select-none" : "shrink-0 select-none"
        }`}
      >
        <div
          role="button"
          tabIndex={0}
          onClick={handleClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleClick(e as unknown as React.MouseEvent);
            }
          }}
          className={`group relative block cursor-pointer transition-all duration-300 active:scale-[0.985] ${
            fluid ? "w-full" : "w-[240px] min-[380px]:w-[270px] sm:w-[310px] lg:w-[340px] xl:w-[360px]"
          }`}
        >
          {/* Landscape Thumbnail Box */}
          <div className="relative aspect-[16/10.5] overflow-hidden rounded-[18px] bg-[#111] shadow-[0_8px_24px_rgba(0,0,0,0.1)] ring-1 ring-black/5 transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.18)]">
            <img
              src={drama.trendingImage || drama.image}
              alt={drama.title}
              className="fx-img h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

            {/* Square Rank Badge at Bottom-Left */}
            <div className="absolute bottom-2.5 left-2.5 flex h-7 min-w-[28px] items-center justify-center rounded-lg bg-black/85 px-2 text-xs font-black text-white shadow-md ring-1 ring-white/10 backdrop-blur-md">
              {drama.rank}
            </div>

            {/* Volume Badge at Top-Right */}
            <span className="absolute right-2.5 top-2.5 rounded-full bg-black/55 px-2.5 py-0.5 text-[9px] font-bold text-white backdrop-blur-md border border-white/20">
              {drama.volume}
            </span>

            {/* Quick Play Trigger Hover Overlay */}
            <button
              onClick={handlePlay}
              className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 scale-90 place-items-center rounded-full bg-white text-[#111] opacity-90 shadow-xl backdrop-blur-md transition-all duration-300 md:scale-75 md:opacity-0 group-hover:scale-100 group-hover:opacity-100 hover:bg-[#e31c3d] hover:text-white"
              title="Play Now"
              aria-label={`Play ${drama.title}`}
            >
              <Play className="ml-0.5 h-5 w-5 fill-current" />
            </button>
          </div>

          {/* Metadata Below Image */}
          <div className="mt-2.5 px-0.5">
            <h3 className="font-[family-name:var(--font-playfair)] text-[16px] sm:text-[17px] font-bold leading-snug text-[#111] transition-colors group-hover:text-[#e31c3d] truncate">
              {drama.title}
            </h3>
            <p className="mt-0.5 text-xs text-[#777] font-medium flex items-center gap-1.5">
              <span>{drama.episodes} Episodes</span>
              <span>•</span>
              <span>{drama.genre[0]}</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Portrait Variant for Full Catalogs / Grids
  return (
    <div
      className={`transform-gpu ${
        fluid ? "h-full w-full select-none" : "shrink-0 select-none"
      }`}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick(e as unknown as React.MouseEvent);
          }
        }}
        className={`group relative block cursor-pointer overflow-hidden rounded-[20px] bg-[#111] shadow-[0_12px_28px_rgba(0,0,0,0.14)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_rgba(0,0,0,0.22)] active:scale-[0.985] border border-black/10 ${
          fluid ? "w-full" : "w-[145px] min-[380px]:w-[160px] sm:w-[185px]"
        }`}
      >
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={drama.image}
            alt={drama.title}
            className="fx-img h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />

          {/* Vignette Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/35" />

          {/* Rank Badge */}
          <span className="absolute left-3 top-3 grid h-7 w-7 place-items-center rounded-full bg-[#e31c3d] text-[11px] font-extrabold text-white shadow-md">
            {drama.rank}
          </span>

          {/* Volume Badge */}
          <span className="absolute right-3 top-3 rounded-full bg-black/50 backdrop-blur-md px-2 py-0.5 text-[9px] font-bold text-white border border-white/20">
            {drama.volume}
          </span>

          {/* Quick Play Trigger Hover Overlay */}
          <button
            onClick={handlePlay}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full bg-white text-[#111] opacity-90 scale-90 backdrop-blur-md shadow-xl transition-all duration-300 md:opacity-0 md:scale-75 group-hover:opacity-100 group-hover:scale-100 hover:bg-[#e31c3d] hover:text-white"
            title="Play Now"
            aria-label={`Play ${drama.title}`}
          >
            <Play className="h-5 w-5 fill-current ml-0.5" />
          </button>

          {/* Bottom Drama Card Metadata */}
          <div className="absolute inset-x-0 bottom-0 p-3.5 text-white">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#e31c3d]">
              {drama.genre[0]}
            </p>
            <p
              className={`mt-0.5 font-[family-name:var(--font-playfair)] font-bold leading-tight ${
                compact ? "text-[13px]" : "text-[15px]"
              } truncate group-hover:text-[#e31c3d] transition-colors`}
            >
              {drama.title}
            </p>
            <p className="mt-1 text-[10px] font-semibold text-white/75 flex items-center justify-between">
              <span>{drama.episodes} EP</span>
              <span>{drama.rating.split(" ")[0]} ★</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
