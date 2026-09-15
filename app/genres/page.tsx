"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { DramaCard } from "@/components/DramaCard";
import { MoodSection } from "@/components/MoodSection";
import { EpisodeListModal } from "@/components/EpisodeListModal";
import { VerticalVideoPlayer } from "@/components/VerticalVideoPlayer";
import { dramas, genres, type Drama, type Genre } from "@/lib/data";
import { sound } from "@/lib/soundEffects";
import { Stagger, StaggerItem } from "@/components/Reveal";

function GenresInner() {
  const params = useSearchParams();
  const mood = params.get("mood");

  const moodMap: Record<string, Genre> = {
    romance: "Romance",
    comedy: "Comedy",
    thriller: "Thriller",
    drama: "Drama",
    fantasy: "Fantasy",
    ceo: "CEO",
  };

  const initialGenre = mood ? (moodMap[mood] || "Romance") : "All";
  const [selectedGenre, setSelectedGenre] = useState<Genre>(initialGenre);
  const [selectedDramaForModal, setSelectedDramaForModal] = useState<Drama | null>(null);
  const [selectedDramaForPlayer, setSelectedDramaForPlayer] = useState<Drama | null>(null);
  const [playerEpisodeNum, setPlayerEpisodeNum] = useState<number>(1);

  useEffect(() => {
    setSelectedGenre(mood ? moodMap[mood] || "Romance" : "All");
  }, [mood]);

  const filteredDramas = dramas.filter(
    (d) => selectedGenre === "All" || d.genre.includes(selectedGenre)
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
      eyebrow="Curated Genres"
      title="Pick Your Next Addiction"
      subtitle="Romance, revenge, billionaire deals, and fantasy realms — choose your genre and dive in."
    >
      <Stagger className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06} delay={0.04}>
        {genres
          .filter((g) => g.id !== "All")
          .map((g) => {
            const count = dramas.filter((d) => d.genre.includes(g.id)).length;
            const isCurrent = selectedGenre === g.id;
            return (
              <StaggerItem key={g.id}>
              <button
                onClick={() => {
                  sound.playClick(isCurrent ? 500 : 700);
                  setSelectedGenre(isCurrent ? "All" : g.id);
                }}
                className={`group relative overflow-hidden rounded-[24px] p-5 text-left transition-all duration-300 ${
                  isCurrent
                    ? "bg-[#111] text-white shadow-[0_16px_36px_rgba(0,0,0,0.25)] ring-2 ring-[#e31c3d]"
                    : "bg-white text-[#222] shadow-[0_10px_28px_rgba(0,0,0,0.04)] ring-1 ring-black/5 hover:-translate-y-1 hover:shadow-lg"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${
                      isCurrent ? "bg-[#e31c3d] text-white" : "bg-[#ffebee] text-[#e31c3d]"
                    }`}
                  >
                    {g.label}
                  </span>
                  <span className="text-xs font-bold text-[#888]">
                    {count} stories
                  </span>
                </div>
                <p
                  className={`mt-4 font-[family-name:var(--font-playfair)] text-2xl font-bold ${
                    isCurrent ? "text-white" : "text-[#111]"
                  }`}
                >
                  {g.label} Series
                </p>
                <p
                  className={`mt-1 text-xs font-medium ${
                    isCurrent ? "text-white/70" : "text-[#777]"
                  }`}
                >
                  {count > 0 ? "Top-rated 5-minute episodes" : "Coming soon"}
                </p>
              </button>
              </StaggerItem>
            );
          })}
      </Stagger>

      <div className="mt-12">
        <div className="flex items-center justify-between border-b border-[#ece6dc] pb-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#e31c3d]">
              {selectedGenre === "All" ? "Full Catalog" : `${selectedGenre} Selection`}
            </span>
            <h2 className="mt-1 font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl font-bold text-[#111]">
              {selectedGenre === "All" ? "All Series" : `${selectedGenre} Dramas`}
            </h2>
          </div>
          {selectedGenre !== "All" && (
            <button
              onClick={() => {
                sound.playClick(500);
                setSelectedGenre("All");
              }}
              className="text-xs font-bold text-[#e31c3d] hover:underline"
            >
              Reset to All
            </button>
          )}
        </div>

        {filteredDramas.length === 0 ? (
          <div className="mt-6 rounded-[28px] bg-white p-12 text-center border border-[#ece6dc]">
            <p className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#111]">
              No {selectedGenre} dramas yet
            </p>
            <p className="mt-2 text-xs text-[#666]">
              Try another genre or reset to the full catalog.
            </p>
          </div>
        ) : (
          <Stagger key={selectedGenre} immediate className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5" stagger={0.035} delay={0.02}>
            {filteredDramas.map((d) => (
              <StaggerItem key={`${selectedGenre}-${d.id}`}>
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
      </div>

      <div className="mt-14">
        <MoodSection flush />
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
        onSelectEpisode={(d, ep) => setPlayerEpisodeNum(ep)}
        onOpenEpisodeList={(d) => {
          setSelectedDramaForPlayer(null);
          setSelectedDramaForModal(d);
        }}
      />
    </PageShell>
  );
}

export default function GenresPage() {
  return (
    <Suspense>
      <GenresInner />
    </Suspense>
  );
}
