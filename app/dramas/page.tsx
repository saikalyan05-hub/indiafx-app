"use client";

import { useMemo, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { DramaCard } from "@/components/DramaCard";
import { GenrePills } from "@/components/GenrePills";
import { dramas, type Drama, type Genre } from "@/lib/data";
import { EpisodeListModal } from "@/components/EpisodeListModal";
import { VerticalVideoPlayer } from "@/components/VerticalVideoPlayer";
import { sound } from "@/lib/soundEffects";
import { Stagger, StaggerItem } from "@/components/Reveal";

export default function DramasPage() {
  const [genre, setGenre] = useState<Genre>("All");
  const [selectedDramaForModal, setSelectedDramaForModal] = useState<Drama | null>(null);
  const [selectedDramaForPlayer, setSelectedDramaForPlayer] = useState<Drama | null>(null);
  const [playerEpisodeNum, setPlayerEpisodeNum] = useState<number>(1);

  const items = useMemo(
    () => dramas.filter((d) => genre === "All" || d.genre.includes(genre)),
    [genre]
  );

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
      eyebrow="Editorial Catalog"
      title="All Dramas"
      subtitle="Short episodes. Bigger feelings. Every version of you has a story waiting."
    >
      <GenrePills value={genre} onChange={setGenre} flush />
      {items.length === 0 ? (
        <div className="mt-8 rounded-[28px] bg-white p-12 text-center border border-[#ece6dc]">
          <p className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#111]">
            No {genre} dramas in the catalog
          </p>
          <p className="mt-2 text-xs text-[#666]">Reset the genre filter to browse the full collection.</p>
        </div>
      ) : (
        <Stagger key={genre} immediate className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5" stagger={0.035} delay={0.02}>
          {items.map((d) => (
            <StaggerItem key={`${genre}-${d.id}`}>
              <DramaCard
                drama={d}
                fluid
                onOpenModal={handleOpenDossier}
                onPlayDirect={handlePlayDirect}
              />
            </StaggerItem>
          ))}
        </Stagger>
      )}

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
