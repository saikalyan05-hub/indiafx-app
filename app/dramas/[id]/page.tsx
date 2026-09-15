"use client";

import { notFound, useParams } from "next/navigation";
import { BookOpen, ChevronLeft, Play, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { dramas, getDrama, type Drama } from "@/lib/data";
import { DramaCard } from "@/components/DramaCard";
import { Stagger, StaggerItem } from "@/components/Reveal";
import { EpisodeListModal } from "@/components/EpisodeListModal";
import { VerticalVideoPlayer } from "@/components/VerticalVideoPlayer";
import { sound } from "@/lib/soundEffects";

export default function DramaDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [selectedDramaForModal, setSelectedDramaForModal] = useState<Drama | null>(null);
  const [selectedDramaForPlayer, setSelectedDramaForPlayer] = useState<Drama | null>(null);
  const [playerEpisodeNum, setPlayerEpisodeNum] = useState<number>(1);

  const drama = id ? getDrama(id) : undefined;
  if (!drama) notFound();

  const related = dramas.filter((d) => d.id !== drama.id).slice(0, 6);

  const handlePlayDirect = (d: Drama, epNum: number = 1) => {
    sound.playPageFlip();
    setSelectedDramaForPlayer(d);
    setPlayerEpisodeNum(epNum);
  };

  const handleOpenDossier = (d: Drama) => {
    sound.playBookOpen();
    setSelectedDramaForModal(d);
  };

  return (
    <div className="mx-auto max-w-[1480px] px-4 py-6 sm:px-6 lg:px-10 select-none">
      {/* Top Back Navigation Bar */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/dramas"
          className="inline-flex items-center gap-2 rounded-full bg-white border border-[#d8d0c4] px-4 py-2 text-xs sm:text-sm font-bold text-[#111] shadow-sm transition hover:bg-[#111] hover:text-white hover:border-[#111] active:scale-95"
        >
          <ChevronLeft className="h-4 w-4" /> Back to All Dramas
        </Link>
        <span className="text-xs font-semibold text-[#777] hidden sm:inline-block">
          Editorial Catalog • {drama.genre[0]}
        </span>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="group overflow-hidden rounded-[28px] shadow-[0_24px_60px_rgba(0,0,0,0.18)] bg-black border border-black/10">
          <img
            src={drama.cover || drama.image}
            alt={drama.title}
            className="fx-img aspect-[16/11] w-full object-cover"
          />
        </div>

        <div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-[#e31c3d] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
              {drama.volume}
            </span>
            <span className="flex items-center gap-1 text-xs font-bold text-[#888]">
              <Star className="h-3.5 w-3.5 fill-[#f59e0b] text-[#f59e0b]" />
              {drama.rating}
            </span>
            <span className="text-xs font-semibold text-[#888]">
              {drama.releaseYear} • {drama.episodes} EP
            </span>
          </div>

          <h1 className="mt-4 font-[family-name:var(--font-playfair)] text-[32px] min-[360px]:text-[40px] sm:text-[54px] leading-[0.98] font-black text-[#111]">
            {drama.title}
          </h1>

          <p className="mt-2 text-xs font-bold uppercase tracking-[0.24em] text-[#e31c3d]">
            {drama.genre.join(" • ")}
          </p>

          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-[#444] font-medium">
            {drama.description}
          </p>

          {/* Director & Cast Dossier */}
          <div className="mt-5 rounded-2xl bg-[#f7f4ee] p-4 border border-[#ece4d8] max-w-lg">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="font-bold text-[#888] uppercase tracking-wider text-[10px]">
                  Director
                </p>
                <p className="mt-0.5 font-bold text-[#111]">{drama.director}</p>
              </div>
              <div>
                <p className="font-bold text-[#888] uppercase tracking-wider text-[10px]">
                  Starring
                </p>
                <p className="mt-0.5 font-bold text-[#111] truncate">
                  {drama.cast.join(", ")}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
            <button
              onClick={() => handlePlayDirect(drama, drama.lastEpisodeWatched || 1)}
              className="focus-ring justify-center inline-flex items-center gap-2.5 rounded-full bg-[#111] px-7 py-3.5 text-xs sm:text-sm font-bold text-white shadow-[0_12px_28px_rgba(0,0,0,0.2)] transition hover:bg-[#e31c3d] hover:scale-105 active:scale-95"
            >
              <Play className="h-4 w-4 fill-white" /> Watch Episode {drama.lastEpisodeWatched || 1}
            </button>

            <button
              onClick={() => handleOpenDossier(drama)}
              className="focus-ring justify-center inline-flex items-center gap-2 rounded-full bg-white border border-[#d8d0c4] px-6 py-3.5 text-xs sm:text-sm font-bold text-[#222] shadow-sm transition hover:bg-[#f8f5ee] hover:scale-105 active:scale-95"
            >
              <BookOpen className="h-4 w-4 text-[#e31c3d]" />
              Explore All Episodes
            </button>

            <Link
              href="/dramas"
              className="rounded-full bg-[#f4eee6] border border-[#dcd4c7] px-6 py-3.5 text-center text-xs sm:text-sm font-bold text-[#111] shadow-sm transition hover:bg-[#111] hover:text-white active:scale-95"
            >
              ← Back to Catalog
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-16 border-t border-[#ece6dc] pt-8">
        <h2 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl font-bold text-[#111]">
          More Like This
        </h2>
        <Stagger className="mt-6 flex gap-4 overflow-x-auto pb-4 hide-scrollbar" stagger={0.05}>
          {related.map((d) => (
            <StaggerItem key={d.id}>
              <DramaCard
                drama={d}
                onOpenModal={handleOpenDossier}
                onPlayDirect={handlePlayDirect}
              />
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      {/* Episode Dossier Modal */}
      <EpisodeListModal
        drama={selectedDramaForModal}
        isOpen={!!selectedDramaForModal}
        onClose={() => setSelectedDramaForModal(null)}
        onSelectEpisode={(d, ep) => {
          setSelectedDramaForModal(null);
          handlePlayDirect(d, ep);
        }}
      />

      {/* Vertical Video Player */}
      <VerticalVideoPlayer
        drama={selectedDramaForPlayer}
        episodeNumber={playerEpisodeNum}
        isOpen={!!selectedDramaForPlayer}
        onClose={() => setSelectedDramaForPlayer(null)}
        onSelectEpisode={(d, ep) => {
          setSelectedDramaForPlayer(d);
          setPlayerEpisodeNum(ep);
        }}
        onSelectDrama={(d, ep = 1) => {
          setSelectedDramaForPlayer(d);
          setPlayerEpisodeNum(ep);
        }}
        onOpenEpisodeList={(d) => {
          setSelectedDramaForPlayer(null);
          setSelectedDramaForModal(d);
        }}
      />
    </div>
  );
}
