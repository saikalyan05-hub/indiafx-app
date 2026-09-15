"use client";

import Link from "next/link";
import { Play, ChevronRight, Star } from "lucide-react";
import { heroSlides, type Drama } from "@/lib/data";
import { sound } from "@/lib/soundEffects";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";

interface FeaturedSectionProps {
  onOpenModal?: (drama: Drama) => void;
  onPlayDirect?: (drama: Drama, episodeNum?: number) => void;
}

export function FeaturedSection({ onOpenModal, onPlayDirect }: FeaturedSectionProps) {
  const handleOpenDossier = (drama: Drama) => {
    sound.playBookOpen();
    if (onOpenModal) onOpenModal(drama);
  };

  const handlePlay = (drama: Drama, episodeNum?: number) => {
    sound.playPageFlip();
    if (onPlayDirect) {
      onPlayDirect(drama, episodeNum || drama.lastEpisodeWatched || 1);
    }
  };

  return (
    <section className="mx-auto mt-6 sm:mt-10 max-w-[1600px] px-3.5 sm:px-8 lg:px-12 xl:px-16 select-none">
      {/* Header */}
      <Reveal>
        <div className="flex items-center justify-between gap-4 border-b border-[#ece6dc] pb-3 sm:pb-4">
          <div>
            <h2 className="font-[family-name:var(--font-playfair)] text-[22px] min-[360px]:text-[24px] sm:text-[32px] font-bold tracking-tight text-[#111]">
              Featured This Week
            </h2>
          </div>

          <Link
            href="/dramas"
            onClick={() => sound.playClick(600)}
            className="group inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#e31c3d] hover:text-[#b3142e] transition"
          >
            <span>See All</span>
            <ChevronRight className="fx-arrow h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Link>
        </div>
      </Reveal>

      {/* Horizontal Cards Scroll Row */}
      <Stagger className="mt-4 sm:mt-6 -mx-3.5 px-3.5 sm:mx-0 sm:px-0 flex gap-3 sm:gap-4.5 overflow-x-auto pb-3 pt-1 hide-scrollbar snap-x snap-mandatory" stagger={0.08} delay={0.06}>
        {heroSlides.map((item, idx) => {
          const formattedNum = `0${idx + 1}`;
          // Card #04 (idx === 3, "The CEO's Deal") has the red border highlight in reference image
          const isHighlighted = idx === 3;

          return (
            <StaggerItem key={item.id} className="flex-none snap-start">
            <div
              onClick={() => handleOpenDossier(item)}
              className={`group relative w-[170px] min-[360px]:w-[195px] min-[390px]:w-[215px] sm:w-[240px] lg:w-[275px] rounded-[20px] bg-white p-2.5 sm:p-3 shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-300 cursor-pointer active:scale-[0.985] ${
                isHighlighted
                  ? "ring-2 ring-[#e31c3d] shadow-[0_12px_32px_rgba(227,28,61,0.22)] hover:-translate-y-1"
                  : "ring-1 ring-black/5 hover:ring-black/15 hover:shadow-[0_12px_28px_rgba(0,0,0,0.1)] hover:-translate-y-1"
              }`}
            >
              {/* Card Poster Artwork */}
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-black">
                <img
                  src={item.featuredImage || item.cover || item.image}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  className="fx-img h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/10" />

                {/* Top Number Rank Badge */}
                <div className="absolute left-2.5 top-2.5 flex items-center gap-1.5">
                  <span
                    className={`grid h-7 w-7 place-items-center rounded-lg text-xs font-black shadow-sm ${
                      isHighlighted
                        ? "bg-[#e31c3d] text-white"
                        : "bg-white/90 backdrop-blur-md text-[#111]"
                    }`}
                  >
                    {formattedNum}
                  </span>
                  <span className="rounded-full bg-black/60 backdrop-blur-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white border border-white/20">
                    {item.volume}
                  </span>
                </div>

                {/* Rating Badge */}
                <span className="absolute right-2.5 top-2.5 flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-md px-2 py-0.5 text-[9px] font-bold text-white border border-white/20">
                  <Star className="h-2.5 w-2.5 fill-[#f59e0b] text-[#f59e0b]" />
                  {item.rating.split(" ")[0]}
                </span>

                {/* Play Button Overlay */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlay(item, 1);
                  }}
                  className="focus-ring absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-white text-[#111] shadow-lg transition-transform duration-300 group-hover:scale-110 hover:bg-[#e31c3d] hover:text-white"
                  title="Play Episode 1"
                  aria-label={`Play ${item.title}`}
                >
                  <Play className="h-4 w-4 fill-current ml-0.5" />
                </button>
              </div>

              {/* Card Meta Details */}
              <div className="mt-2.5 px-1">
                <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#e31c3d]">
                  <span className="truncate">{item.genre[0]}</span>
                  <span>•</span>
                  <span className="text-[#777]">{item.episodes} Eps</span>
                </div>

                <h3 className="mt-0.5 font-[family-name:var(--font-playfair)] text-sm sm:text-base font-bold text-[#111] truncate transition group-hover:text-[#e31c3d]">
                  {item.title}
                </h3>

                <p className="mt-0.5 text-[10px] sm:text-xs text-[#666] line-clamp-1">
                  {item.tagline}
                </p>
              </div>
            </div>
            </StaggerItem>
          );
        })}
      </Stagger>
    </section>
  );
}
