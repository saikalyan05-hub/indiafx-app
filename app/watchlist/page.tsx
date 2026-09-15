"use client";

import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { ContinueWatching } from "@/components/ContinueWatching";
import { DramaCard } from "@/components/DramaCard";
import { EpisodeListModal } from "@/components/EpisodeListModal";
import { VerticalVideoPlayer } from "@/components/VerticalVideoPlayer";
import { dramas, type Drama } from "@/lib/data";
import { sound } from "@/lib/soundEffects";
import { Bookmark, Trash2 } from "lucide-react";
import Link from "next/link";
import { Stagger, StaggerItem } from "@/components/Reveal";

export default function WatchlistPage() {
  const [watchlistItems, setWatchlistItems] = useState<Drama[]>(dramas.slice(0, 6));
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

  const handleRemoveFromWatchlist = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    sound.playClick(500);
    setWatchlistItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <PageShell
      eyebrow="My Collection"
      title="Saved Watchlist"
      subtitle="Your curated queue of micro dramas, bookmarked episodes, and series to binge next."
    >
      {/* Continue Watching Focus Bar */}
      <div className="mb-10">
        <ContinueWatching
          drama={continueDrama}
          episodeNumber={continueEpisodeNum}
          progress={continueProgress}
          onPlayEpisode={handlePlayDirect}
          onOpenModal={handleOpenDossier}
          flush
        />
      </div>

      <div className="flex items-center justify-between border-b border-[#ece6dc] pb-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-[#ffebee] text-[#e31c3d]">
            <Bookmark className="h-4 w-4" />
          </span>
          <h2 className="font-[family-name:var(--font-playfair)] text-xl sm:text-2xl font-bold text-[#111]">
            Bookmarked Series ({watchlistItems.length})
          </h2>
        </div>
        {watchlistItems.length > 0 && (
          <button
            onClick={() => {
              sound.playClick(500);
              setWatchlistItems([]);
            }}
            className="text-xs font-semibold text-[#888] hover:text-[#e31c3d] transition"
          >
            Clear All
          </button>
        )}
      </div>

      {watchlistItems.length === 0 ? (
        <div className="rounded-[30px] bg-white p-12 text-center border border-[#ece6dc] shadow-sm">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#faf7f2] text-[#888]">
            <Bookmark className="h-8 w-8" />
          </div>
          <h3 className="mt-4 font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#111]">
            Your Watchlist is Empty
          </h3>
          <p className="mt-2 text-sm text-[#666] max-w-md mx-auto">
            Explore hundreds of Indian micro dramas and bookmark your favorite series to watch anytime.
          </p>
          <div className="mt-6">
            <Link
              href="/dramas"
              onClick={() => sound.playClick(650)}
              className="inline-flex items-center gap-2 rounded-full bg-[#e31c3d] px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-[#c41230] transition"
            >
              Browse Dramas Catalog
            </Link>
          </div>
        </div>
      ) : (
        <Stagger className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5" stagger={0.045}>
          {watchlistItems.map((d) => (
            <StaggerItem key={d.id} className="relative group">
              <DramaCard
                drama={d}
                fluid
                onOpenModal={handleOpenDossier}
                onPlayDirect={handlePlayDirect}
              />
              <button
                onClick={(e) => handleRemoveFromWatchlist(e, d.id)}
                title="Remove from watchlist"
                aria-label="Remove from watchlist"
                className="absolute top-2 right-2 z-20 grid h-7 w-7 place-items-center rounded-full bg-black/60 backdrop-blur-md text-white/80 opacity-100 md:opacity-0 group-hover:opacity-100 transition hover:bg-[#e31c3d] hover:text-white"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
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
          setPlayerEpisodeNum(ep);
          setContinueEpisodeNum(ep);
        }}
        onOpenEpisodeList={(d) => {
          setSelectedDramaForPlayer(null);
          setSelectedDramaForModal(d);
        }}
        onUpdateProgress={(_id, ep, pct) => {
          setContinueEpisodeNum(ep);
          setContinueProgress(pct);
        }}
      />
    </PageShell>
  );
}
