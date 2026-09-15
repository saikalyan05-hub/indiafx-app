"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { HeroSection } from "@/components/HeroSection";
import { FeaturedSection } from "@/components/FeaturedSection";
import { GenrePills } from "@/components/GenrePills";
import { TrendingSection } from "@/components/TrendingSection";
import { ContinueWatching } from "@/components/ContinueWatching";
import { NewReleasesSection } from "@/components/NewReleasesSection";
import { MoodSection } from "@/components/MoodSection";
import { CommunitySection } from "@/components/CommunitySection";
import { WatchAnywhere } from "@/components/WatchAnywhere";
import { dramas, type Drama, type Genre } from "@/lib/data";

// Dynamically import heavy overlay modals on-demand for lightning-fast initial load & server response
const EpisodeListModal = dynamic(
  () => import("@/components/EpisodeListModal").then((mod) => mod.EpisodeListModal),
  { ssr: false }
);

const VerticalVideoPlayer = dynamic(
  () => import("@/components/VerticalVideoPlayer").then((mod) => mod.VerticalVideoPlayer),
  { ssr: false }
);

export default function HomePage() {
  const [genre, setGenre] = useState<Genre>("All");

  // Modal & Video Player State
  const [selectedDramaForModal, setSelectedDramaForModal] = useState<Drama | null>(null);
  const [selectedDramaForPlayer, setSelectedDramaForPlayer] = useState<Drama | null>(null);
  const [playerEpisodeNum, setPlayerEpisodeNum] = useState<number>(1);

  // Continue Watching Dynamic State
  const [continueDrama, setContinueDrama] = useState<Drama>(dramas[0]);
  const [continueEpisodeNum, setContinueEpisodeNum] = useState<number>(4);
  const [continueProgress, setContinueProgress] = useState<number>(42);

  // Trigger Episode Dossier Modal (3D Book Spread)
  const handleOpenDossier = (drama: Drama) => {
    setSelectedDramaForModal(drama);
  };

  // Trigger Vertical 9:16 Video Player directly
  const handlePlayDirect = (drama: Drama, episodeNum: number = 1) => {
    setSelectedDramaForPlayer(drama);
    setPlayerEpisodeNum(episodeNum);
    setContinueDrama(drama);
    setContinueEpisodeNum(episodeNum);
  };

  // Select episode from inside the Dossier Modal -> launches player
  const handleSelectEpisodeFromModal = (drama: Drama, episodeNum: number) => {
    setSelectedDramaForModal(null);
    setSelectedDramaForPlayer(drama);
    setPlayerEpisodeNum(episodeNum);
    setContinueDrama(drama);
    setContinueEpisodeNum(episodeNum);
  };

  // Open episode index from inside the Video Player
  const handleOpenEpisodeIndexFromPlayer = (drama: Drama) => {
    setSelectedDramaForPlayer(null);
    setSelectedDramaForModal(drama);
  };

  // Progress update callback from video player
  const handleUpdateProgress = (dramaId: string, episodeNum: number, progressPct: number) => {
    setContinueProgress(progressPct);
    setContinueEpisodeNum(episodeNum);
  };

  return (
    <>
      <div>
        {/* 1. Panoramic Hero Section with 3D Magazine Carousel */}
        <HeroSection
          onOpenBook={handleOpenDossier}
          onPlayDirect={handlePlayDirect}
        />

        {/* 2. Featured This Week Horizontal Row */}
        <FeaturedSection
          onOpenModal={handleOpenDossier}
          onPlayDirect={handlePlayDirect}
        />

        {/* 3. Seamless Continue Watching Bar */}
        <ContinueWatching
          drama={continueDrama}
          episodeNumber={continueEpisodeNum}
          progress={continueProgress}
          onPlayEpisode={handlePlayDirect}
          onOpenModal={handleOpenDossier}
        />

        {/* 4. Category & Mood Quick Pills */}
        <div className="mt-6 sm:mt-10">
          <GenrePills value={genre} onChange={setGenre} />
        </div>

        {/* 5. Trending Now Landscape Charts */}
        <div id="trending">
          <TrendingSection
            genre={genre}
            onOpenModal={handleOpenDossier}
            onPlayDirect={handlePlayDirect}
          />
        </div>

        {/* 6. Curated Mood Exploration */}
        <MoodSection />

        {/* 7. New Releases & Fresh Drops */}
        <NewReleasesSection
          onOpenModal={handleOpenDossier}
          onPlayDirect={handlePlayDirect}
        />

        {/* 8. Live Community & Viewer Reactions */}
        <CommunitySection />

        {/* 9. Multi-device Watch Anywhere Banner */}
        <WatchAnywhere />
      </div>

      {/* 3D Open-Book Two-Page Dossier & Episode Modal (Dynamically Imported) */}
      {selectedDramaForModal && (
        <EpisodeListModal
          drama={selectedDramaForModal}
          isOpen={!!selectedDramaForModal}
          onClose={() => setSelectedDramaForModal(null)}
          onSelectEpisode={handleSelectEpisodeFromModal}
        />
      )}

      {/* 9:16 Smartphone Vertical Cinema Video Player Modal (Dynamically Imported) */}
      {selectedDramaForPlayer && (
        <VerticalVideoPlayer
          drama={selectedDramaForPlayer}
          episodeNumber={playerEpisodeNum}
          isOpen={!!selectedDramaForPlayer}
          onClose={() => setSelectedDramaForPlayer(null)}
          onSelectEpisode={(d, ep) => {
            setSelectedDramaForPlayer(d);
            setPlayerEpisodeNum(ep);
            setContinueEpisodeNum(ep);
          }}
          onSelectDrama={(d, ep = 1) => {
            setSelectedDramaForPlayer(d);
            setPlayerEpisodeNum(ep);
            setContinueEpisodeNum(ep);
          }}
          onOpenEpisodeList={handleOpenEpisodeIndexFromPlayer}
          onUpdateProgress={handleUpdateProgress}
        />
      )}
    </>
  );
}
