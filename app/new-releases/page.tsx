"use client";

import { useMemo, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { DramaCard } from "@/components/DramaCard";
import { dramas, type Drama } from "@/lib/data";
import { EpisodeListModal } from "@/components/EpisodeListModal";
import { VerticalVideoPlayer } from "@/components/VerticalVideoPlayer";
import { sound } from "@/lib/soundEffects";
import { Sparkles, Play } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/Reveal";

export default function NewReleasesPage() {
  const [selectedDramaForModal, setSelectedDramaForModal] = useState<Drama | null>(null);
  const [selectedDramaForPlayer, setSelectedDramaForPlayer] = useState<Drama | null>(null);
  const [playerEpisodeNum, setPlayerEpisodeNum] = useState<number>(1);

  const freshDrops = useMemo(() => dramas, []);
  const spotlight = dramas.find((d) => d.id === "a-second-chance") || dramas[0];

  const handleOpenDossier = (drama: Drama) => {
    sound.playBookOpen();
    setSelectedDramaForModal(drama);
  };

  const handlePlayDirect = (drama: Drama, episodeNum: number = 1) => {
    sound.playPageFlip();
    setSelectedDramaForPlayer(drama);
    setPlayerEpisodeNum(episodeNum);
  };

  return (
    <PageShell
      eyebrow="Fresh Premieres"
      title="New Releases"
      subtitle="Freshly uploaded micro-dramas, new season premieres, and weekly drop schedules."
    >
      {/* Release Banner Spotlight */}
      <div className="mb-10 overflow-hidden rounded-[30px] bg-[#111] p-6 sm:p-10 text-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 bg-[radial-gradient(circle_at_top_right,#e31c3d,transparent_70%)] pointer-events-none" />
        <div className="relative z-10 max-w-xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e31c3d] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm">
            <Sparkles className="h-3.5 w-3.5" /> Just Premiered Tonight
          </span>
          <h2 className="mt-4 font-[family-name:var(--font-playfair)] text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            A Second Chance: The Finale
          </h2>
          <p className="mt-3 text-sm sm:text-base text-white/80 leading-relaxed">
            Episode 80 marks the explosive end to season one. Experience every shocking revelation in crystal clear 4K HDR.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => handlePlayDirect(spotlight, spotlight.episodes)}
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs sm:text-sm font-bold text-[#111] shadow-lg transition hover:bg-[#e31c3d] hover:text-white active:scale-95"
            >
              <Play className="h-4 w-4 fill-current" /> Watch Finale Now
            </button>
            <button
              onClick={() => handleOpenDossier(spotlight)}
              className="rounded-full bg-white/10 px-5 py-3 text-xs sm:text-sm font-semibold text-white border border-white/20 transition hover:bg-white/20"
            >
              Series Dossier
            </button>
          </div>
        </div>
      </div>

      {/* Grid of New Releases */}
      <Stagger className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5" stagger={0.045}>
        {freshDrops.map((d) => (
          <StaggerItem key={d.id}>
            <DramaCard
              drama={d}
              fluid
              onOpenModal={handleOpenDossier}
              onPlayDirect={handlePlayDirect}
            />
          </StaggerItem>
        ))}
      </Stagger>

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
        onSelectEpisode={(d, ep) => setPlayerEpisodeNum(ep)}
        onOpenEpisodeList={(d) => {
          setSelectedDramaForPlayer(null);
          setSelectedDramaForModal(d);
        }}
      />
    </PageShell>
  );
}
