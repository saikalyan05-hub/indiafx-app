"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  List,
  MessageCircle,
  Pause,
  Play,
  Share2,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import type { Drama } from "@/lib/data";
import { comments } from "@/lib/data";
import { sound } from "@/lib/soundEffects";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

interface VerticalVideoPlayerProps {
  drama: Drama | null;
  episodeNumber: number;
  isOpen: boolean;
  onClose: () => void;
  onSelectEpisode: (drama: Drama, epNum: number) => void;
  onOpenEpisodeList: (drama: Drama) => void;
  onUpdateProgress?: (dramaId: string, episodeNum: number, progressPct: number) => void;
}

const dialogueScript = [
  "You really thought I wouldn't recognize you after all these years?",
  "The contract says one year, Reyansh. No feelings. No exceptions.",
  "Then why are you holding my hand like you're afraid I'll disappear?",
  "Because this time... I'm not the one walking away.",
  "Look at me and tell me you feel nothing.",
  "I gave you my word. Don't make me break it tonight.",
  "Every secret in this room ends when the rain stops.",
  "We both know there is no going back after this.",
];

export function VerticalVideoPlayer({
  drama,
  episodeNumber,
  isOpen,
  onClose,
  onSelectEpisode,
  onOpenEpisodeList,
  onUpdateProgress,
}: VerticalVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(14);
  const totalDuration = 288; // 4m 48s in seconds
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(14280);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [activeSubtitleIndex, setActiveSubtitleIndex] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  useBodyScrollLock(isOpen && !!drama);

  // Playback timer ticker
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen && isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 1 * playbackSpeed;
          if (next >= totalDuration) {
            setIsPlaying(false);
            return totalDuration;
          }
          return next;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isOpen, isPlaying, playbackSpeed, totalDuration]);

  // Update subtitle dialogue index periodically
  useEffect(() => {
    const subIdx = Math.floor((currentTime / 18) % dialogueScript.length);
    setActiveSubtitleIndex(subIdx);
  }, [currentTime]);

  // Save progress on close or change
  useEffect(() => {
    if (!isOpen || !drama) return;
    const pct = Math.min(100, Math.round((currentTime / totalDuration) * 100));
    onUpdateProgress?.(drama.id, episodeNumber, pct);
  }, [isOpen, drama, episodeNumber, currentTime, totalDuration, onUpdateProgress]);

  useEffect(() => {
    setCurrentTime(0);
    setIsPlaying(true);
    setShowComments(false);
  }, [episodeNumber, drama?.id]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        if (showComments) {
          setShowComments(false);
          return;
        }
        onClose();
      } else if (e.key === " " || e.key === "k") {
        const tag = (e.target as HTMLElement | null)?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        e.preventDefault();
        setIsPlaying((p) => !p);
      } else if (e.key === "m") {
        setIsMuted((m) => !m);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setCurrentTime((t) => Math.min(totalDuration, t + 10));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setCurrentTime((t) => Math.max(0, t - 10));
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose, showComments, totalDuration]);

  useEffect(() => {
    if (!isOpen || !drama) return;
    if (currentTime < totalDuration || isPlaying) return;
    if (episodeNumber < (drama.episodes || 80)) {
      const timer = window.setTimeout(() => {
        sound.playPageFlip();
        onSelectEpisode(drama, episodeNumber + 1);
      }, 650);
      return () => window.clearTimeout(timer);
    }
  }, [currentTime, isOpen, isPlaying, drama, episodeNumber, onSelectEpisode, totalDuration]);

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  // Hide controls on inactivity
  const handleUserActivity = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3500);
  };

  if (!drama) return null;

  const episodes = drama.episodeList || [];
  const currentEp = episodes.find((e) => e.number === episodeNumber) || {
    number: episodeNumber,
    title: `Episode ${episodeNumber}`,
    duration: "4:48",
    thumbnail: drama.cover,
    synopsis: drama.description,
  };

  const hasNext = episodeNumber < (drama.episodes || 80);
  const hasPrev = episodeNumber > 1;

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const handleNextEp = () => {
    if (!drama || !hasNext) return;
    sound.playPageFlip();
    setCurrentTime(0);
    onSelectEpisode(drama, episodeNumber + 1);
  };

  const handlePrevEp = () => {
    if (hasPrev) {
      sound.playPageFlip();
      setCurrentTime(0);
      onSelectEpisode(drama, episodeNumber - 1);
    }
  };

  const toggleLike = () => {
    sound.playLike();
    setIsLiked(!isLiked);
    setLikeCount((c) => (isLiked ? c - 1 : c + 1));
  };

  const toggleBookmark = () => {
    sound.playClick(isBookmarked ? 500 : 850);
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = () => {
    sound.playClick(900);
    const shareUrl = `${window.location.origin}/dramas/${drama.id}`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(() => {});
    }
  };

  const cycleSpeed = () => {
    sound.playClick(800);
    const speeds = [1, 1.25, 1.5, 2];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIdx]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-2 sm:p-4 md:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={`${drama.title} player`}
          onMouseMove={handleUserActivity}
          onClick={handleUserActivity}
        >
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl"
          />

          {/* 9:16 Vertical Smartphone / Reel Theatre Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-[420px] aspect-[9/16] max-h-[92vh] overflow-hidden rounded-[28px] bg-black shadow-[0_25px_80px_rgba(0,0,0,0.85)] border border-white/10 flex flex-col justify-between select-none"
          >
            {/* Simulated Live Video Scene Background */}
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={drama.cover || drama.image}
                alt=""
                className={`h-full w-full object-cover transition-transform duration-[4000ms] ease-out ${
                  isPlaying ? "scale-110 translate-y-[-2%]" : "scale-100"
                }`}
              />

              {/* Dynamic Vignette & Lighting Filter */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-black/80" />
              <div
                className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 50% 40%, ${drama.accent}, transparent 70%)`,
                }}
              />
            </div>

            {/* Click to Pause / Play Overlay (Center Canvas) */}
            <button
              onClick={() => {
                sound.playClick(600);
                setIsPlaying(!isPlaying);
              }}
              className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer"
              aria-label={isPlaying ? "Pause video" : "Play video"}
            >
              {!isPlaying && (
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="grid h-20 w-20 place-items-center rounded-full bg-black/60 backdrop-blur-md text-white border border-white/30 shadow-2xl"
                >
                  <Play className="h-9 w-9 fill-white ml-1 text-white" />
                </motion.div>
              )}
            </button>

            {/* TOP BAR OVERLAY */}
            <div
              className={`relative z-20 p-3 sm:p-4 transition-opacity duration-300 ${
                showControls ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[#e31c3d] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    EP {String(episodeNumber).padStart(2, "0")}
                  </span>
                  <span className="rounded-full bg-white/20 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white border border-white/20">
                    1080P HD
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      sound.playClick(500);
                      onOpenEpisodeList(drama);
                    }}
                    className="grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full bg-black/40 backdrop-blur-md text-white border border-white/20 hover:bg-black/60"
                    title="Episode Index"
                  >
                    <List className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => {
                      sound.playClick(500);
                      onClose();
                    }}
                    className="grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full bg-black/40 backdrop-blur-md text-white border border-white/20 hover:bg-[#e31c3d]"
                    aria-label="Close player"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Drama Title in Header */}
              <div className="mt-1.5 sm:mt-2 text-white">
                <h3 className="font-[family-name:var(--font-playfair)] text-sm sm:text-base font-bold truncate drop-shadow">
                  {drama.title}
                </h3>
                <p className="text-[10px] sm:text-[11px] text-white/75 truncate">{currentEp.title}</p>
              </div>
            </div>

            {/* RIGHT FLOATING SOCIAL ENGAGEMENT DOCK (Reels / TikTok style) */}
            <div className="absolute right-2.5 sm:right-3.5 bottom-24 sm:bottom-28 z-20 flex flex-col items-center gap-2.5 sm:gap-4 text-white">
              {/* Like Button */}
              <button
                onClick={toggleLike}
                className="group flex flex-col items-center gap-0.5 sm:gap-1 focus-ring"
              >
                <div
                  className={`grid h-9 w-9 sm:h-11 sm:w-11 place-items-center rounded-full backdrop-blur-md transition group-hover:scale-110 active:scale-95 ${
                    isLiked
                      ? "bg-[#e31c3d] text-white shadow-[0_0_20px_rgba(227,28,61,0.6)]"
                      : "bg-black/40 text-white border border-white/20"
                  }`}
                >
                  <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${isLiked ? "fill-white" : ""}`} />
                </div>
                <span className="text-[9px] sm:text-[10px] font-bold text-white drop-shadow">
                  {(likeCount / 1000).toFixed(1)}k
                </span>
              </button>

              {/* Watchlist Bookmark */}
              <button
                onClick={toggleBookmark}
                className="group flex flex-col items-center gap-0.5 sm:gap-1 focus-ring"
              >
                <div
                  className={`grid h-9 w-9 sm:h-11 sm:w-11 place-items-center rounded-full backdrop-blur-md transition group-hover:scale-110 active:scale-95 ${
                    isBookmarked
                      ? "bg-[#2e7d32] text-white shadow-[0_0_20px_rgba(46,125,50,0.6)]"
                      : "bg-black/40 text-white border border-white/20"
                  }`}
                >
                  <Bookmark className={`h-4 w-4 sm:h-5 sm:w-5 ${isBookmarked ? "fill-white" : ""}`} />
                </div>
                <span className="text-[9px] sm:text-[10px] font-bold text-white drop-shadow">Save</span>
              </button>

              {/* Comments */}
              <button
                onClick={() => {
                  sound.playClick(700);
                  setShowComments(true);
                }}
                className="group flex flex-col items-center gap-0.5 sm:gap-1 focus-ring"
                aria-label="Open comments"
              >
                <div className="grid h-9 w-9 sm:h-11 sm:w-11 place-items-center rounded-full bg-black/40 backdrop-blur-md text-white border border-white/20 transition group-hover:scale-110 active:scale-95">
                  <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <span className="text-[9px] sm:text-[10px] font-bold text-white drop-shadow">2.4k</span>
              </button>

              {/* Share */}
              <button
                onClick={handleShare}
                className="group flex flex-col items-center gap-0.5 sm:gap-1 focus-ring"
              >
                <div className="grid h-9 w-9 sm:h-11 sm:w-11 place-items-center rounded-full bg-black/40 backdrop-blur-md text-white border border-white/20 transition group-hover:scale-110 active:scale-95">
                  {copied ? <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" /> : <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />}
                </div>
                <span className="text-[9px] sm:text-[10px] font-bold text-white drop-shadow">
                  {copied ? "Copied" : "Share"}
                </span>
              </button>
            </div>

            {/* BOTTOM CONTROLS & SUBTITLE OVERLAYS */}
            <div className="relative z-20 p-3 sm:p-4 pt-0">
              {/* Dynamic Synchronized Dialogue Subtitle */}
              <div className="mb-2 sm:mb-3 px-2 text-center pointer-events-none">
                <span className="inline-block rounded-lg bg-black/70 backdrop-blur-sm px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-[13px] font-medium text-white shadow-lg border border-white/10 leading-snug">
                  &ldquo;{dialogueScript[activeSubtitleIndex]}&rdquo;
                </span>
              </div>

              {/* Controls Wrapper */}
              <div
                className={`transition-opacity duration-300 ${
                  showControls ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                {/* Timeline Progress Bar */}
                <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-white/90 mb-2">
                  <span>{formatTime(currentTime)}</span>
                  <div
                    className="relative flex-1 h-1.5 rounded-full bg-white/25 cursor-pointer group/timeline overflow-hidden"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickPos = (e.clientX - rect.left) / rect.width;
                      setCurrentTime(Math.round(clickPos * totalDuration));
                    }}
                  >
                    <div
                      className="absolute inset-y-0 left-0 bg-[#e31c3d] rounded-full transition-all duration-150"
                      style={{
                        width: `${(currentTime / totalDuration) * 100}%`,
                      }}
                    />
                  </div>
                  <span>{formatTime(totalDuration)}</span>
                </div>

                {/* Player Bottom Actions Dock */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {/* Previous Episode */}
                    <button
                      disabled={!hasPrev}
                      onClick={handlePrevEp}
                      className="grid h-8 w-8 place-items-center rounded-full bg-white/15 text-white disabled:opacity-30 hover:bg-white/30"
                      title="Previous Episode"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>

                    {/* Play/Pause */}
                    <button
                      onClick={() => {
                        sound.playClick(600);
                        setIsPlaying(!isPlaying);
                      }}
                      className="grid h-8 w-8 place-items-center rounded-full bg-white text-[#111] hover:scale-105"
                    >
                      {isPlaying ? (
                        <Pause className="h-4 w-4 fill-[#111]" />
                      ) : (
                        <Play className="h-4 w-4 fill-[#111] ml-0.5" />
                      )}
                    </button>

                    {/* Next Episode */}
                    <button
                      disabled={!hasNext}
                      onClick={handleNextEp}
                      className="grid h-8 w-8 place-items-center rounded-full bg-white/15 text-white disabled:opacity-30 hover:bg-white/30"
                      title="Next Episode"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {/* Playback Speed Pill */}
                    <button
                      onClick={cycleSpeed}
                      className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold text-white hover:bg-white/30"
                    >
                      {playbackSpeed}x
                    </button>

                    {/* Mute Button */}
                    <button
                      onClick={() => {
                        sound.playClick(500);
                        setIsMuted(!isMuted);
                      }}
                      className="grid h-8 w-8 place-items-center rounded-full bg-white/15 text-white hover:bg-white/30"
                    >
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {showComments && (
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-x-0 bottom-0 z-30 rounded-t-[24px] bg-white p-4 shadow-[0_-12px_40px_rgba(0,0,0,0.35)]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between border-b border-[#ece6dc] pb-3">
                    <p className="text-sm font-bold text-[#111]">Episode comments</p>
                    <button
                      onClick={() => setShowComments(false)}
                      className="grid h-8 w-8 place-items-center rounded-full bg-[#f4efe8] text-[#555] hover:bg-[#ece6dc]"
                      aria-label="Close comments"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-3 max-h-[220px] space-y-3 overflow-y-auto pr-1">
                    {comments.slice(0, 3).map((c) => (
                      <div key={c.id} className="rounded-2xl bg-[#faf7f3] p-3">
                        <p className="text-xs font-bold text-[#111]">{c.user}</p>
                        <p className="mt-1 text-xs leading-relaxed text-[#555]">{c.text}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
