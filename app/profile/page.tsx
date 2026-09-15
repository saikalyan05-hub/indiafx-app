"use client";

import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { ContinueWatching } from "@/components/ContinueWatching";
import { DramaCard } from "@/components/DramaCard";
import { EpisodeListModal } from "@/components/EpisodeListModal";
import { VerticalVideoPlayer } from "@/components/VerticalVideoPlayer";
import { dramas, type Drama } from "@/lib/data";
import { sound } from "@/lib/soundEffects";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { Stagger, StaggerItem } from "@/components/Reveal";

export default function ProfilePage() {
  const [selectedDramaForModal, setSelectedDramaForModal] = useState<Drama | null>(null);
  const [selectedDramaForPlayer, setSelectedDramaForPlayer] = useState<Drama | null>(null);
  const [playerEpisodeNum, setPlayerEpisodeNum] = useState<number>(1);

  const [continueDrama, setContinueDrama] = useState<Drama>(dramas[0]);
  const [continueEpisodeNum, setContinueEpisodeNum] = useState<number>(4);
  const [continueProgress, setContinueProgress] = useState<number>(42);

  const handleOpenDossier = (drama: Drama) => {
    sound.playBookOpen();
    setSelectedDramaForModal(drama);
  };

  const handlePlayDirect = (drama: Drama, episodeNum: number = 1) => {
    sound.playPageFlip();
    setSelectedDramaForPlayer(drama);
    setPlayerEpisodeNum(episodeNum);
    setContinueDrama(drama);
    setContinueEpisodeNum(episodeNum);
  };

  return (
    <PageShell
      eyebrow="Viewer Profile"
      title="Your IndiaFX Hub"
      subtitle="Pick up where you left off, manage your watchlist, and explore your drama history."
    >
      {/* Profile Header Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-[28px] bg-white p-5 sm:p-8 shadow-[0_14px_40px_rgba(0,0,0,0.06)] border border-[#ece6dc]">
        <div className="flex items-center gap-3.5 sm:gap-5">
          <div className="relative shrink-0">
            <img
              src="/assets/avatar.png"
              alt="Profile"
              className="h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover ring-4 ring-[#ffebee]"
            />
            <span className="absolute bottom-0 right-0 grid h-5 w-5 sm:h-6 sm:w-6 place-items-center rounded-full bg-[#e31c3d] text-white ring-2 ring-white">
              <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            </span>
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg sm:text-2xl font-bold text-[#111]">Keerthi</h2>
              <span className="rounded-full bg-[#ffebee] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#e31c3d]">
                VIP Member
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-[#888] font-medium truncate">
              Daily Drama Devotee • 128 Episodes Watched
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2.5 sm:gap-4 sm:gap-6 w-full md:w-auto">
          <div className="rounded-2xl bg-[#faf7f2] p-2.5 sm:px-4 sm:py-3 text-center border border-[#ece6dc]">
            <p className="font-[family-name:var(--font-playfair)] text-lg sm:text-xl font-bold text-[#111]">14</p>
            <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#888]">In Watchlist</p>
          </div>
          <div className="rounded-2xl bg-[#faf7f2] p-2.5 sm:px-4 sm:py-3 text-center border border-[#ece6dc]">
            <p className="font-[family-name:var(--font-playfair)] text-lg sm:text-xl font-bold text-[#111]">48h</p>
            <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#888]">Watch Time</p>
          </div>
          <div className="rounded-2xl bg-[#faf7f2] p-2.5 sm:px-4 sm:py-3 text-center border border-[#ece6dc]">
            <p className="font-[family-name:var(--font-playfair)] text-lg sm:text-xl font-bold text-[#e31c3d]">Level 8</p>
            <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#888]">Superfan</p>
          </div>
        </div>
      </div>

      {/* Continue Watching Section */}
      <div className="mt-10">
        <ContinueWatching
          drama={continueDrama}
          episodeNumber={continueEpisodeNum}
          progress={continueProgress}
          onPlayEpisode={handlePlayDirect}
          onOpenModal={handleOpenDossier}
          flush
        />
      </div>

      {/* Saved / Bookmarked Section */}
      <div className="mt-14 border-t border-[#ece6dc] pt-8">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#e31c3d]">
              Saved For Later
            </span>
            <h2 className="mt-1 font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl font-bold text-[#111]">
              Your Personal Watchlist
            </h2>
          </div>
          <Link
            href="/watchlist"
            onClick={() => sound.playClick(600)}
            className="text-xs font-bold text-[#e31c3d] hover:text-[#111] transition"
          >
            See All <span className="fx-arrow inline-block" aria-hidden>›</span>
          </Link>
        </div>

        <Stagger className="mt-6 flex gap-4 overflow-x-auto pb-4 hide-scrollbar" stagger={0.05}>
          {dramas.slice(0, 6).map((d) => (
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
          setPlayerEpisodeNum(ep);
          setContinueEpisodeNum(ep);
        }}
        onOpenEpisodeList={(d) => {
          setSelectedDramaForPlayer(null);
          setSelectedDramaForModal(d);
        }}
        onUpdateProgress={(id, ep, pct) => {
          setContinueEpisodeNum(ep);
          setContinueProgress(pct);
        }}
      />
    </PageShell>
  );
}
