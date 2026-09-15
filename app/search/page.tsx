"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { DramaCard } from "@/components/DramaCard";
import { EpisodeListModal } from "@/components/EpisodeListModal";
import { VerticalVideoPlayer } from "@/components/VerticalVideoPlayer";
import { searchDramas, type Drama } from "@/lib/data";
import { sound } from "@/lib/soundEffects";
import { Search, X, Sparkles } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/Reveal";

function SearchInner() {
  const params = useSearchParams();
  const router = useRouter();
  const qParam = params.get("q") || "";
  const [query, setQuery] = useState(qParam);
  const [selectedDramaForModal, setSelectedDramaForModal] = useState<Drama | null>(null);
  const [selectedDramaForPlayer, setSelectedDramaForPlayer] = useState<Drama | null>(null);
  const [playerEpisodeNum, setPlayerEpisodeNum] = useState<number>(1);

  useEffect(() => {
    setQuery(qParam);
  }, [qParam]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const next = query.trim();
      if (next === qParam) return;
      router.replace(next ? `/search?q=${encodeURIComponent(next)}` : "/search", { scroll: false });
    }, 280);
    return () => window.clearTimeout(timer);
  }, [query, qParam, router]);

  const searchResults = useMemo(() => searchDramas(query), [query]);

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
      eyebrow="Catalog Search"
      title="Discover Micro Dramas"
      subtitle="Search across 500+ Indian micro drama series, genres, plots, and characters."
    >
      {/* Search Input Bar */}
      <div className="relative mb-8 max-w-2xl">
        <div className="flex items-center gap-3 rounded-full bg-white px-5 py-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-[#ece6dc] ring-1 ring-black/5 focus-within:border-[#e31c3d] focus-within:ring-2 focus-within:ring-[#e31c3d]/20 transition-all">
          <Search className="h-5 w-5 text-[#888] shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search titles, genres (Romance, CEO, Thriller)..."
            className="w-full bg-transparent text-sm sm:text-base outline-none text-[#111] placeholder:text-[#999]"
            autoFocus
          />
          {query && (
            <button
              onClick={() => {
                sound.playClick(500);
                setQuery("");
              }}
              className="grid h-6 w-6 place-items-center rounded-full bg-[#f0eae0] text-[#666] hover:bg-[#e31c3d] hover:text-white transition"
              aria-label="Clear search query"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Quick Tag Suggestions */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[#888] flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-[#e31c3d]" /> Suggested:
          </span>
          {["Romance", "Billionaire", "Priya", "Comedy", "Thriller"].map((tag) => (
            <button
              key={tag}
              onClick={() => {
                sound.playClick(600);
                setQuery(tag);
              }}
              className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#444] border border-[#ece6dc] hover:border-[#e31c3d] hover:text-[#e31c3d] transition shadow-xs"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between border-b border-[#ece6dc] pb-3 mb-6">
        <p className="text-xs sm:text-sm font-bold text-[#666]">
          Showing {searchResults.length} {searchResults.length === 1 ? "drama" : "dramas"} {query && `for "${query}"`}
        </p>
      </div>

      {/* Results Grid */}
      {searchResults.length === 0 ? (
        <div className="rounded-[28px] bg-white p-12 text-center border border-[#ece6dc]">
          <p className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#111]">
            No matching dramas found
          </p>
          <p className="mt-2 text-xs text-[#666]">
            Try searching for another keyword, actor name, or select one of the suggested genre tags above.
          </p>
        </div>
      ) : (
        <Stagger className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5" stagger={0.045}>
          {searchResults.map((d) => (
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
        onSelectEpisode={(d, ep) => setPlayerEpisodeNum(ep)}
        onOpenEpisodeList={(d) => {
          setSelectedDramaForPlayer(null);
          setSelectedDramaForModal(d);
        }}
      />
    </PageShell>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchInner />
    </Suspense>
  );
}
