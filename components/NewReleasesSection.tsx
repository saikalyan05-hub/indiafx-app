"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, Play, Star, Flame } from "lucide-react";
import { dramas, type Drama } from "@/lib/data";
import { sound } from "@/lib/soundEffects";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";

interface NewReleasesSectionProps {
  onOpenModal?: (drama: Drama) => void;
  onPlayDirect?: (drama: Drama, episodeNum?: number) => void;
}

export function NewReleasesSection({ onOpenModal, onPlayDirect }: NewReleasesSectionProps) {
  // Take dramas that represent new drops
  const newDramas = dramas.slice(0, 4);

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
    <section id="new-releases" className="mx-auto mt-16 w-full max-w-[1600px] px-4 sm:px-8 lg:px-12 xl:px-16 select-none">
      {/* Header */}
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#ece6dc] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-[#fff4e5] text-[#f59e0b]">
                <Flame className="h-3.5 w-3.5 fill-[#f59e0b]" />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#e31c3d]">
                Fresh Drops
              </span>
            </div>
            <h2 className="mt-1 font-[family-name:var(--font-playfair)] text-[30px] sm:text-[36px] font-bold tracking-tight text-[#111]">
              New Releases
            </h2>
          </div>

          <Link
            href="/new-releases"
            onClick={() => sound.playClick(650)}
            className="group inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#e31c3d] hover:text-[#111] transition"
          >
            <span>View All 500+ Dramas</span>
            <ArrowRight className="fx-arrow h-4 w-4" />
          </Link>
        </div>
      </Reveal>

      {/* Grid of New Releases Cards */}
      <Stagger className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" stagger={0.08}>
        {newDramas.map((drama) => (
          <StaggerItem key={drama.id}>
          <div
            onClick={() => handleOpenDossier(drama)}
            className="group relative flex flex-col justify-between overflow-hidden rounded-[24px] bg-white border border-[#ece6dc] shadow-[0_12px_32px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_48px_rgba(0,0,0,0.12)] cursor-pointer active:scale-[0.99]"
          >
            {/* Top Poster Art */}
            <div className="relative aspect-[16/10] sm:aspect-[4/3] w-full overflow-hidden bg-black">
              <img
                src={drama.cover || drama.image}
                alt={drama.title}
                className="fx-img h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

              {/* Badges */}
              <div className="absolute left-3 top-3 flex items-center gap-2">
                <span className="rounded-full bg-[#e31c3d] px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-md">
                  NEW
                </span>
                <span className="rounded-full bg-black/50 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white border border-white/20">
                  {drama.volume}
                </span>
              </div>

              {/* Rating */}
              <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white border border-white/20">
                <Star className="h-3 w-3 fill-[#f59e0b] text-[#f59e0b]" />
                {drama.rating.split(" ")[0]}
              </span>

              {/* Hover Quick Play button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlay(drama, 1);
                }}
                className="absolute right-4 bottom-4 grid h-11 w-11 place-items-center rounded-full bg-[#e31c3d] text-white opacity-100 scale-100 shadow-xl transition-all duration-300 md:opacity-0 md:scale-75 group-hover:opacity-100 group-hover:scale-100 hover:bg-[#c91835] active:scale-95"
                title="Play Episode 1"
              >
                <Play className="h-4 w-4 fill-white ml-0.5" />
              </button>

              {/* Metadata over image */}
              <div className="absolute left-3.5 bottom-3.5 text-white pr-14">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#e31c3d]">
                  {drama.genre.slice(0, 2).join(" • ")}
                </p>
                <p className="text-xs font-medium text-white/80 mt-0.5">
                  {drama.episodes} Episodes
                </p>
              </div>
            </div>

            {/* Bottom Details */}
            <div className="p-5 flex flex-col justify-between flex-1">
              <div>
                <h3 className="font-[family-name:var(--font-playfair)] text-lg font-bold text-[#111] group-hover:text-[#e31c3d] transition-colors leading-snug line-clamp-1">
                  {drama.title}
                </h3>
                <p className="mt-2 text-xs text-[#666] leading-relaxed line-clamp-2">
                  {drama.description}
                </p>
              </div>

              <div className="mt-4 pt-3.5 border-t border-[#f0eae0] flex items-center justify-between text-xs font-semibold text-[#888]">
                <span className="flex items-center gap-1 text-[#e31c3d]">
                  <Sparkles className="h-3.5 w-3.5" /> Just Added
                </span>
                <span className="text-[#333] group-hover:underline">Explore Dossier →</span>
              </div>
            </div>
          </div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
