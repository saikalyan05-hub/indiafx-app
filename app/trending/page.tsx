"use client";

import { useMemo, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { DramaCard } from "@/components/DramaCard";
import { GenrePills } from "@/components/GenrePills";
import { dramas, type Drama, type Genre } from "@/lib/data";
import { EpisodeListModal } from "@/components/EpisodeListModal";
import { VerticalVideoPlayer } from "@/components/VerticalVideoPlayer";
import { sound } from "@/lib/soundEffects";
import { Play, Star } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/Reveal";

export default function TrendingPage() {
  const [genre, setGenre] = useState<Genre>("All");
  const [selectedDramaForModal, setSelectedDramaForModal] = useState<Drama | null>(null);
  const [selectedDramaForPlayer, setSelectedDramaForPlayer] = useState<Drama | null>(null);
  const [playerEpisodeNum, setPlayerEpisodeNum] = useState<number>(1);

  const filteredDramas = useMemo(() => {
    return dramas.filter((d) => genre === "All" || d.genre.includes(genre));
  }, [genre]);

  const top3 = dramas.slice(0, 3);

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
      eyebrow="Real-Time Leaderboard"
      title="Trending This Week"
      subtitle="What millions of viewers are binge-watching right now. Top-charting twists and viral moments."
    >
      {/* Top 3 Podium Cards */}
      <Stagger className="mb-10 grid gap-4 sm:grid-cols-3" stagger={0.08} delay={0.04}>
        {top3.map((item, idx) => {
          const rankLabels = ["#1 Most Streamed", "#2 Viral Sensation", "#3 Audience Favorite"];
          const rankColors = ["bg-[#e31c3d]", "bg-[#f59e0b]", "bg-[#111]"];
          return (
            <StaggerItem key={item.id}>
            <div
              onClick={() => handleOpenDossier(item)}
              className="group relative cursor-pointer overflow-hidden rounded-[26px] bg-white p-4 shadow-[0_12px_36px_rgba(0,0,0,0.06)] border border-[#ece6dc] transition-all hover:-translate-y-1 hover:shadow-xl active:scale-[0.99]"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-black">
                <img
                  src={item.cover || item.image}
                  alt={item.title}
                  className="fx-img h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <span
                  className={`absolute top-2.5 left-2.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-md ${rankColors[idx]}`}
                >
                  {rankLabels[idx]}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayDirect(item, 1);
                  }}
                  className="absolute bottom-2.5 right-2.5 grid h-9 w-9 place-items-center rounded-full bg-white text-[#111] shadow-lg transition hover:scale-110 hover:bg-[#e31c3d] hover:text-white"
                  aria-label={`Play ${item.title}`}
                >
                  <Play className="h-3.5 w-3.5 fill-current ml-0.5" />
                </button>
              </div>
              <div className="mt-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#e31c3d]">
                    {item.genre.join(" • ")}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-bold text-[#f59e0b]">
                    <Star className="h-3 w-3 fill-current" /> {item.rating.split(" ")[0]}
                  </span>
                </div>
                <h3 className="mt-1 font-[family-name:var(--font-playfair)] text-lg font-bold text-[#111] truncate group-hover:text-[#e31c3d] transition">
                  {item.title}
                </h3>
                <p className="mt-0.5 text-xs text-[#666] line-clamp-1">{item.tagline}</p>
              </div>
            </div>
            </StaggerItem>
          );
        })}
      </Stagger>

      {/* Genre Filter */}
      <GenrePills value={genre} onChange={setGenre} flush />

      {/* Full Trending Grid */}
      {filteredDramas.length === 0 ? (
        <div className="mt-8 rounded-[28px] bg-white p-12 text-center border border-[#ece6dc]">
          <p className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#111]">
            No {genre} titles on the chart
          </p>
          <p className="mt-2 text-xs text-[#666]">Try another genre to see what’s trending.</p>
        </div>
      ) : (
        <Stagger className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5" stagger={0.045}>
          {filteredDramas.map((d) => (
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
    </PageShell>
  );
}
