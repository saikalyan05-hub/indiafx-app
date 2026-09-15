"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  Info,
  List,
  Maximize,
  MessageCircle,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Settings,
  Share2,
  Sparkles,
  Star,
  Subtitles,
  Volume2,
  VolumeX,
  Volume1,
  X,
  Languages,
  Film,
  Clock,
  ShieldAlert,
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

type SubtitleLang = "en" | "hi" | "te" | "ta" | "off";
type VideoQuality = "auto" | "4k" | "1080p" | "720p" | "480p";

const subtitleScripts: Record<Exclude<SubtitleLang, "off">, string[]> = {
  en: [
    "You really thought I wouldn't recognize you after all these years?",
    "The contract says one year, Reyansh. No feelings. No exceptions.",
    "Then why are you holding my hand like you're afraid I'll disappear?",
    "Because this time... I'm not the one walking away.",
    "Look into my eyes and tell me you feel absolutely nothing.",
    "I gave you my word. Don't make me break it tonight.",
    "Every secret in this room unravels when the rain stops.",
    "We both know there is no going back after this moment.",
  ],
  hi: [
    "क्या सच में तुम्हें लगा कि इतने सालों बाद भी मैं तुम्हें नहीं पहचान पाऊँगा?",
    "कॉन्ट्रैक्ट सिर्फ एक साल का है, रेयांश। कोई भावनाएँ नहीं। कोई अपवाद नहीं।",
    "तो फिर मेरा हाथ ऐसे क्यों पकड़ा है जैसे डर हो कि मैं गायब हो जाऊँगी?",
    "क्योंकि इस बार... मैं पीछे हटने वालों में से नहीं हूँ।",
    "मेरी आँखों में देखकर कहो कि तुम्हें कुछ भी महसूस नहीं हो रहा।",
    "मैंने तुम्हें वचन दिया था। आज रात मुझे उसे तोड़ने पर मजबूर मत करो।",
    "बारिश थमते ही इस कमरे का हर राज़ सामने आ जाएगा।",
    "हम दोनों जानते हैं कि इस मोड़ के बाद वापस जाने का कोई रास्ता नहीं है।",
  ],
  te: [
    "ఇన్ని సంవత్సరాల తర్వాత కూడా నేను నిన్ను గుర్తించలేనని నిజంగా అనుకున్నావా?",
    "ఒప్పందం కేవలం ఒక సంవత్సరం మాత్రమే, రేయాన్ష్. ఎటువంటి భావోద్వేగాలు ఉండకూడదు.",
    "మరి నేను ఎక్కడ దూరమైపోతానో అన్న భయంతో నా చేతిని ఎందుకు పట్టుకున్నావు?",
    "ఎందుకంటే ఈసారి... వదిలి వెళ్ళేది నేను కాదు.",
    "నా కళ్ళల్లోకి చూసి నీకేమీ అనిపించడం లేదని చెప్పు.",
    "నేను నీకు మాట ఇచ్చాను. ఈ రాత్రి దాన్ని దాటేలా చేయకు.",
    "వర్షం తగ్గగానే ఈ గదిలోని ప్రతి రహస్యం బయటపడుతుంది.",
    "ఈ క్షణం తర్వాత వెనక్కి తిరిగే మార్గం లేదని మన ఇద్దరికీ తెలుసు.",
  ],
  ta: [
    "இத்தனை வருடங்களுக்குப் பிறகும் நான் உன்னை அடையாளம் காண மாட்டேன் என்று நினைத்தாயா?",
    "ஒப்பந்தம் ஒரு வருடத்திற்கு மட்டுமே, ரேயான்ஷ். எந்த உணர்வுகளும் இல்லை.",
    "அப்படியானால் நான் மறைந்துவிடுவேன் என்ற பயத்தில் ஏன் என் கையைப் பிடித்திருக்கிறாய்?",
    "ஏனெனில் இந்த முறை... விலகிச் செல்பவன் நான் இல்லை.",
    "என் கண்களைப் பார்த்து உனக்கு எதுவும் தோன்றவில்லை என்று சொல்.",
    "நான் உனக்கு வாக்குக் கொடுத்துள்ளேன். இன்றிரவு அதை உடைக்க வைக்காதே.",
    "மழை நின்றவுடன் இந்த அறையின் அனைத்து ரகசியங்களும் வெளிப்படும்.",
    "இந்த தருணத்திற்குப் பிறகு பின்வாங்குவதற்கு வழியில்லை என்று நம் இருவருக்கும் தெரியும்.",
  ],
};

const qualityOptions: { id: VideoQuality; label: string; badge: string; desc: string }[] = [
  { id: "auto", label: "Auto", badge: "Adaptive", desc: "Best quality for your network" },
  { id: "4k", label: "4K Ultra HDR", badge: "2160p", desc: "Dolby Vision & Pure Color" },
  { id: "1080p", label: "1080p Full HD", badge: "1080p", desc: "Crystal clear micro-cinema" },
  { id: "720p", label: "720p HD", badge: "720p", desc: "High definition streaming" },
  { id: "480p", label: "480p SD", badge: "480p", desc: "Data saver mode" },
];

const subtitleOptions: { id: SubtitleLang; label: string; native: string }[] = [
  { id: "en", label: "English", native: "English (CC)" },
  { id: "hi", label: "Hindi", native: "हिंदी (CC)" },
  { id: "te", label: "Telugu", native: "తెలుగు (CC)" },
  { id: "ta", label: "Tamil", native: "தமிழ் (CC)" },
  { id: "off", label: "Off", native: "Subtitles Off" },
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
  // Player state
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const totalDuration = 288; // 4m 48s in seconds
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [quality, setQuality] = useState<VideoQuality>("1080p");
  const [subtitleLang, setSubtitleLang] = useState<SubtitleLang>("en");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Social & UI states
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(14280);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [activeSubtitleIndex, setActiveSubtitleIndex] = useState(0);

  // Modals & Drawers
  const [showComments, setShowComments] = useState(false);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [showSubtitleMenu, setShowSubtitleMenu] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  // End-of-Episode & Countdown state
  const [isCompleted, setIsCompleted] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  // Double-tap ripple indicators
  const [doubleTapSide, setDoubleTapSide] = useState<"left" | "right" | null>(null);
  const lastTapTimeRef = useRef<{ left: number; right: number }>({ left: 0, right: 0 });

  // Refs
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useBodyScrollLock(isOpen && !!drama);

  // Playback timer ticker
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen && isPlaying && !isCompleted) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 1 * playbackSpeed;
          if (next >= totalDuration) {
            setIsPlaying(false);
            setIsCompleted(true);
            return totalDuration;
          }
          return next;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isOpen, isPlaying, playbackSpeed, totalDuration, isCompleted]);

  // Synchronized subtitles updater
  useEffect(() => {
    const subIdx = Math.floor((currentTime / 16) % 8);
    setActiveSubtitleIndex(subIdx);
  }, [currentTime]);

  // Save progress on change
  useEffect(() => {
    if (!isOpen || !drama) return;
    const pct = Math.min(100, Math.round((currentTime / totalDuration) * 100));
    onUpdateProgress?.(drama.id, episodeNumber, pct);
  }, [isOpen, drama, episodeNumber, currentTime, totalDuration, onUpdateProgress]);

  // Reset when episode changes
  useEffect(() => {
    setCurrentTime(0);
    setIsPlaying(true);
    setIsCompleted(false);
    setCountdown(null);
    setShowComments(false);
    setShowInfoPanel(false);
    setShowQualityMenu(false);
    setShowSubtitleMenu(false);
    setShowSpeedMenu(false);
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
  }, [episodeNumber, drama?.id]);

  // Auto-play Next Episode Countdown when completed
  useEffect(() => {
    if (isCompleted && drama && episodeNumber < (drama.episodes || 80)) {
      setCountdown(5);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev === null || prev <= 1) {
            if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
            sound.playEpisodeSelect();
            onSelectEpisode(drama, episodeNumber + 1);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setCountdown(null);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    }
    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [isCompleted, drama, episodeNumber, onSelectEpisode]);

  // Fullscreen change listener
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isOpen) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (e.key === "Escape") {
        if (showQualityMenu || showSubtitleMenu || showSpeedMenu) {
          setShowQualityMenu(false);
          setShowSubtitleMenu(false);
          setShowSpeedMenu(false);
          return;
        }
        if (showInfoPanel) {
          setShowInfoPanel(false);
          return;
        }
        if (showComments) {
          setShowComments(false);
          return;
        }
        if (isFullscreen && document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
          return;
        }
        onClose();
      } else if (e.key === " " || e.key.toLowerCase() === "k") {
        e.preventDefault();
        sound.playClick(600);
        if (isCompleted) {
          restartEpisode();
        } else {
          setIsPlaying((p) => !p);
        }
      } else if (e.key.toLowerCase() === "m") {
        e.preventDefault();
        sound.playClick(500);
        setIsMuted((m) => !m);
      } else if (e.key.toLowerCase() === "f") {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key.toLowerCase() === "c") {
        e.preventDefault();
        sound.playClick(700);
        setSubtitleLang((s) => (s === "off" ? "en" : "off"));
      } else if (e.key.toLowerCase() === "i") {
        e.preventDefault();
        sound.playClick(650);
        setShowInfoPanel((v) => !v);
      } else if (e.key === "ArrowRight" || e.key.toLowerCase() === "l") {
        e.preventDefault();
        seekBy(10);
      } else if (e.key === "ArrowLeft" || e.key.toLowerCase() === "j") {
        e.preventDefault();
        seekBy(-10);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setVolume((v) => Math.min(1, Number((v + 0.1).toFixed(1))));
        setIsMuted(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setVolume((v) => Math.max(0, Number((v - 0.1).toFixed(1))));
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [
    isOpen,
    onClose,
    showComments,
    showInfoPanel,
    showQualityMenu,
    showSubtitleMenu,
    showSpeedMenu,
    isFullscreen,
    isCompleted,
  ]);

  // Clean controls timer
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  // Hide controls automatically on inactivity when playing
  const handleUserActivity = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying && !isCompleted) {
      controlsTimeoutRef.current = setTimeout(() => {
        if (
          isPlaying &&
          !showQualityMenu &&
          !showSubtitleMenu &&
          !showSpeedMenu &&
          !showInfoPanel &&
          !showComments
        ) {
          setShowControls(false);
        }
      }, 3500);
    }
  }, [isPlaying, isCompleted, showQualityMenu, showSubtitleMenu, showSpeedMenu, showInfoPanel, showComments]);

  if (!drama) return null;

  const episodes = drama.episodeList || [];
  const currentEp = episodes.find((e) => e.number === episodeNumber) || {
    number: episodeNumber,
    title: `Episode ${episodeNumber}`,
    duration: "4:48",
    thumbnail: drama.cover,
    synopsis: drama.description,
  };

  const nextEp = episodes.find((e) => e.number === episodeNumber + 1);
  const hasNext = episodeNumber < (drama.episodes || 80);
  const hasPrev = episodeNumber > 1;

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const seekBy = (seconds: number) => {
    sound.playClick(seconds > 0 ? 800 : 600);
    setCurrentTime((t) => Math.max(0, Math.min(totalDuration, t + seconds)));
    if (seconds > 0) {
      setDoubleTapSide("right");
      setTimeout(() => setDoubleTapSide(null), 600);
    } else {
      setDoubleTapSide("left");
      setTimeout(() => setDoubleTapSide(null), 600);
    }
    handleUserActivity();
  };

  const handleDoubleTap = (side: "left" | "right") => {
    const now = Date.now();
    const last = lastTapTimeRef.current[side];
    if (now - last < 320) {
      seekBy(side === "right" ? 10 : -10);
      lastTapTimeRef.current[side] = 0;
    } else {
      lastTapTimeRef.current[side] = now;
      handleUserActivity();
    }
  };

  const restartEpisode = () => {
    sound.playClick(750);
    setCurrentTime(0);
    setIsCompleted(false);
    setCountdown(null);
    setIsPlaying(true);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
  };

  const handleNextEp = () => {
    if (!drama || !hasNext) return;
    sound.playEpisodeSelect();
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    setCurrentTime(0);
    onSelectEpisode(drama, episodeNumber + 1);
  };

  const handlePrevEp = () => {
    if (hasPrev) {
      sound.playEpisodeSelect();
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      setCurrentTime(0);
      onSelectEpisode(drama, episodeNumber - 1);
    }
  };

  const cancelCountdown = () => {
    sound.playClick(500);
    setCountdown(null);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
  };

  const toggleFullscreen = () => {
    sound.playClick(700);
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
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
    const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/dramas/${drama.id}`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => {});
    }
  };

  const currentSubtitleText =
    subtitleLang !== "off"
      ? subtitleScripts[subtitleLang][activeSubtitleIndex] || subtitleScripts.en[activeSubtitleIndex]
      : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          ref={playerContainerRef}
          className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center p-1.5 min-[360px]:p-2 sm:p-4 md:p-6 lg:p-8 pt-[max(0.5rem,env(safe-area-inset-top))] sm:pt-4 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:pb-4 overflow-hidden select-none bg-[#070709]"
          role="dialog"
          aria-modal="true"
          aria-label={`${drama.title} - S1 • E${String(episodeNumber).padStart(2, "0")} player`}
          onMouseMove={handleUserActivity}
          onClick={handleUserActivity}
        >
          {/* ==================================================== */}
          {/* 1 & 2. CINEMATIC VIEWING ENVIRONMENT & AMBIENT GLOW  */}
          {/* ==================================================== */}
          {/* Ambient Lighting Halo reflecting drama accent */}
          <div
            className="pointer-events-none fixed inset-0 opacity-30 transition-opacity duration-1000 blur-[100px]"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${drama.accent} 0%, transparent 65%)`,
            }}
          />

          {/* Dark Cinematic Vignette & Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/92 backdrop-blur-2xl"
          />

          {/* ==================================================== */}
          {/* 3 & 15. DESKTOP FLANKING CONTEXTUAL METADATA (LEFT/RIGHT) */}
          {/* ==================================================== */}
          <div className="relative z-10 flex w-full max-w-[1400px] h-full items-start sm:items-center justify-center gap-6 lg:gap-10 sm:my-auto">

            {/* DESKTOP LEFT: Series Context Panel (Visible on xl+ screens) */}
            <div className="hidden xl:flex flex-col justify-center w-[280px] text-white/90 space-y-4 shrink-0 pointer-events-auto">
              <div className="space-y-1.5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e31c3d]/20 border border-[#e31c3d]/40 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#ff6b81]">
                  <Sparkles className="h-3 w-3" /> Now Playing
                </span>
                <h1 className="font-[family-name:var(--font-playfair)] text-2xl font-bold tracking-tight text-white leading-tight">
                  {drama.title}
                </h1>
                <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
                  Season 1 • Episode {String(episodeNumber).padStart(2, "0")}
                </p>
                <p className="text-sm font-medium text-white/90 italic">
                  &ldquo;{currentEp.title}&rdquo;
                </p>
              </div>

              {/* Episode Synopsis */}
              <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5 backdrop-blur-md">
                <p className="text-xs text-white/70 leading-relaxed line-clamp-4">
                  {currentEp.synopsis || drama.description}
                </p>
              </div>

              {/* Quick Specs */}
              <div className="space-y-2 text-xs text-white/60">
                <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-white/50" /> Duration
                  </span>
                  <span className="font-semibold text-white">{currentEp.duration || "4:48"}</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Film className="h-3.5 w-3.5 text-white/50" /> Quality
                  </span>
                  <span className="font-bold text-[#e31c3d]">
                    {quality === "auto" ? "1080p Auto" : quality.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Star className="h-3.5 w-3.5 text-[#f59e0b] fill-[#f59e0b]" /> Rating
                  </span>
                  <span className="font-semibold text-white">{drama.rating}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Languages className="h-3.5 w-3.5 text-white/50" /> Subtitles
                  </span>
                  <span className="font-semibold text-white capitalize">
                    {subtitleLang === "off" ? "Off" : subtitleLang.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Episode List Trigger */}
              <button
                onClick={() => {
                  sound.playClick(600);
                  onOpenEpisodeList(drama);
                }}
                className="flex items-center justify-center gap-2 w-full rounded-full bg-white/10 hover:bg-white/20 border border-white/15 px-4 py-2.5 text-xs font-bold text-white transition active:scale-95"
              >
                <List className="h-3.5 w-3.5" /> All {drama.episodes || 80} Episodes
              </button>
            </div>

            {/* ==================================================== */}
            {/* 1 & 14. CENTERED 9:16 CINEMATIC VIDEO FRAME          */}
            {/* ==================================================== */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 10 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-[min(100%,calc((100dvh-1.25rem)*9/16))] sm:max-w-[420px] aspect-[9/16] max-h-[calc(100dvh-1.25rem)] sm:max-h-[86vh] overflow-hidden rounded-[20px] sm:rounded-[32px] bg-black shadow-[0_30px_100px_rgba(0,0,0,0.98)] border border-white/15 flex flex-col justify-between select-none sm:my-auto shrink-0 group"
            >
              {/* Dynamic Video Scene Layer (Cinema Quality Simulation) */}
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={drama.cover || drama.image}
                  alt=""
                  className={`h-full w-full object-cover transition-transform duration-[6000ms] ease-out ${
                    isPlaying && !isCompleted ? "scale-110 translate-y-[-2%]" : "scale-100"
                  }`}
                />

                {/* Soft Vignette & Cinematic Shadow Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-black/85" />
                <div
                  className="absolute inset-0 opacity-25 mix-blend-overlay pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 50% 45%, ${drama.accent}, transparent 75%)`,
                  }}
                />
              </div>

              {/* Double-Tap Gesture Zones (Left = -10s, Right = +10s) */}
              <div className="absolute inset-0 z-10 grid grid-cols-2">
                <div
                  className="h-full w-full cursor-pointer"
                  onClick={() => handleDoubleTap("left")}
                  aria-label="Double tap to rewind 10 seconds"
                />
                <div
                  className="h-full w-full cursor-pointer"
                  onClick={() => handleDoubleTap("right")}
                  aria-label="Double tap to forward 10 seconds"
                />
              </div>

              {/* Double-Tap Ripple Indicators */}
              <AnimatePresence>
                {doubleTapSide === "left" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="pointer-events-none absolute left-8 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-1 rounded-full bg-black/70 px-4 py-3 text-white backdrop-blur-md border border-white/20 shadow-2xl"
                  >
                    <RotateCcw className="h-6 w-6 text-white" />
                    <span className="text-[10px] font-bold font-mono">-10s</span>
                  </motion.div>
                )}
                {doubleTapSide === "right" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="pointer-events-none absolute right-8 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-1 rounded-full bg-black/70 px-4 py-3 text-white backdrop-blur-md border border-white/20 shadow-2xl"
                  >
                    <RotateCw className="h-6 w-6 text-white" />
                    <span className="text-[10px] font-bold font-mono">+10s</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ==================================================== */}
              {/* 10. PAUSED OVERLAY STATE                             */}
              {/* ==================================================== */}
              <AnimatePresence>
                {!isPlaying && !isCompleted && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] p-6 text-center pointer-events-none"
                  >
                    {/* Big Center Glowing Play Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        sound.playClick(650);
                        setIsPlaying(true);
                      }}
                      className="pointer-events-auto grid h-20 w-20 sm:h-22 sm:w-22 place-items-center rounded-full bg-[#e31c3d] text-white shadow-[0_0_50px_rgba(227,28,61,0.6)] border-2 border-white/30 transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                      aria-label="Resume video"
                    >
                      <Play className="h-9 w-9 sm:h-10 sm:w-10 fill-white ml-1" />
                    </button>

                    {/* Contextual Paused Info */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="mt-5 space-y-1"
                    >
                      <span className="inline-block rounded-full bg-black/60 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/80 border border-white/10">
                        Paused • S1 E{String(episodeNumber).padStart(2, "0")}
                      </span>
                      <h4 className="font-[family-name:var(--font-playfair)] text-lg sm:text-xl font-bold text-white drop-shadow-md">
                        {currentEp.title}
                      </h4>
                      <p className="text-xs text-white/70 line-clamp-2 max-w-[260px] mx-auto">
                        {currentEp.synopsis || drama.description}
                      </p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ==================================================== */}
              {/* 11 & 12. END-OF-EPISODE & NEXT EPISODE OVERLAY       */}
              {/* ==================================================== */}
              <AnimatePresence>
                {isCompleted && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.35 }}
                    className="absolute inset-0 z-40 flex flex-col justify-between bg-black/92 backdrop-blur-md p-5 sm:p-6 text-white"
                  >
                    {/* Top Status */}
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#10b981]/20 border border-[#10b981]/40 px-3 py-1 text-[11px] font-bold text-[#34d399]">
                        <Check className="h-3.5 w-3.5" /> Episode Complete
                      </span>
                      <button
                        onClick={onClose}
                        className="grid h-8 w-8 place-items-center rounded-full bg-white/10 hover:bg-white/20 text-white"
                        aria-label="Close"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Middle Card: Next Episode or Series Finale */}
                    <div className="space-y-4 my-auto text-center">
                      <div className="space-y-1">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-[#e31c3d]">
                          {drama.title}
                        </p>
                        <h3 className="font-[family-name:var(--font-playfair)] text-xl sm:text-2xl font-bold text-white">
                          S1 • E{String(episodeNumber).padStart(2, "0")} Finished
                        </h3>
                      </div>

                      {/* Next Episode Box if available */}
                      {hasNext ? (
                        <div className="rounded-2xl bg-white/10 border border-white/15 p-4 text-left backdrop-blur-md space-y-3 shadow-xl">
                          <div className="flex items-center justify-between text-[11px] font-bold">
                            <span className="text-[#f59e0b] uppercase tracking-wider">
                              Up Next • Episode {episodeNumber + 1}
                            </span>
                            {countdown !== null && (
                              <span className="text-white/70 font-mono">
                                Auto-playing in {countdown}s
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="relative h-14 w-14 rounded-xl overflow-hidden shrink-0 border border-white/20">
                              <img
                                src={nextEp?.thumbnail || drama.cover}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                <Play className="h-4 w-4 fill-white text-white" />
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-xs sm:text-sm text-white truncate">
                                {nextEp?.title || `Episode ${episodeNumber + 1}`}
                              </p>
                              <p className="text-[11px] text-white/60 line-clamp-1 mt-0.5">
                                {nextEp?.synopsis || "Continue the micro-drama story..."}
                              </p>
                            </div>
                          </div>

                          {/* Action Row */}
                          <div className="flex items-center gap-2 pt-1">
                            <button
                              onClick={handleNextEp}
                              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-[#e31c3d] hover:bg-[#c41230] px-4 py-2.5 text-xs font-bold text-white shadow-lg transition active:scale-95"
                            >
                              <Play className="h-3.5 w-3.5 fill-white" /> Play Next Episode
                            </button>
                            {countdown !== null && (
                              <button
                                onClick={cancelCountdown}
                                className="rounded-full bg-white/10 hover:bg-white/20 px-3 py-2.5 text-xs font-bold text-white/80 transition"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-2xl bg-white/10 border border-white/15 p-4 text-center">
                          <p className="text-sm font-bold text-[#f59e0b]">🎉 You completed the Series!</p>
                          <p className="text-xs text-white/70 mt-1">
                            Explore more trending blockbuster micro-dramas.
                          </p>
                        </div>
                      )}

                      {/* Watch Again & Watchlist Buttons */}
                      <div className="flex items-center justify-center gap-2.5 pt-1">
                        <button
                          onClick={restartEpisode}
                          className="inline-flex items-center gap-1.5 rounded-full bg-white/15 hover:bg-white/25 px-4 py-2 text-xs font-bold text-white transition active:scale-95"
                        >
                          <RotateCcw className="h-3.5 w-3.5" /> Watch Again
                        </button>
                        <button
                          onClick={toggleBookmark}
                          className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition active:scale-95 ${
                            isBookmarked
                              ? "bg-[#2e7d32] text-white"
                              : "bg-white/15 hover:bg-white/25 text-white"
                          }`}
                        >
                          <Bookmark className={`h-3.5 w-3.5 ${isBookmarked ? "fill-white" : ""}`} />
                          {isBookmarked ? "Saved" : "Add to My List"}
                        </button>
                      </div>
                    </div>

                    {/* Bottom Metadata */}
                    <div className="text-center text-[10px] text-white/50 pb-1">
                      {drama.genre.join(" • ")} • {drama.releaseYear} • 4K Ultra HDR
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ==================================================== */}
              {/* 5. TOP VIDEO CONTROLS OVERLAY                        */}
              {/* ==================================================== */}
              <div
                className={`relative z-30 p-2 min-[360px]:p-2.5 sm:p-4 transition-opacity duration-300 ${
                  showControls && !isCompleted ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  {/* LEFT: Back Button + Series Title / Episode Badge */}
                  <div className="flex items-center gap-2 min-w-0">
                    <button
                      onClick={() => {
                        sound.playClick(500);
                        onClose();
                      }}
                      className="grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full bg-black/50 backdrop-blur-md text-white border border-white/20 hover:bg-[#e31c3d] hover:border-[#e31c3d] transition active:scale-95 shrink-0"
                      aria-label="Back / Close player"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="rounded-md bg-[#e31c3d] px-1.5 py-0.5 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-white">
                          S1 • E{String(episodeNumber).padStart(2, "0")}
                        </span>
                        <span className="rounded-md bg-white/20 backdrop-blur-md px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-white/90 border border-white/10 hidden min-[380px]:inline-block">
                          {quality.toUpperCase()}
                        </span>
                      </div>
                      <h3 className="font-[family-name:var(--font-playfair)] text-xs sm:text-sm font-bold text-white truncate drop-shadow mt-0.5">
                        {drama.title}
                      </h3>
                    </div>
                  </div>

                  {/* RIGHT: Quick Controls (Subtitles, Quality, Info, Fullscreen, Close) */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Subtitle Toggle */}
                    <button
                      onClick={() => {
                        sound.playClick(650);
                        setShowSubtitleMenu((v) => !v);
                        setShowQualityMenu(false);
                        setShowSpeedMenu(false);
                      }}
                      className={`grid h-8 w-8 place-items-center rounded-full backdrop-blur-md border transition active:scale-95 ${
                        subtitleLang !== "off"
                          ? "bg-[#e31c3d] border-[#e31c3d] text-white"
                          : "bg-black/50 border-white/20 text-white/80 hover:text-white"
                      }`}
                      title="Subtitles (CC)"
                      aria-label="Toggle subtitles"
                    >
                      <Subtitles className="h-4 w-4" />
                    </button>

                    {/* Quality Selector */}
                    <button
                      onClick={() => {
                        sound.playClick(650);
                        setShowQualityMenu((v) => !v);
                        setShowSubtitleMenu(false);
                        setShowSpeedMenu(false);
                      }}
                      className="grid h-8 w-8 place-items-center rounded-full bg-black/50 backdrop-blur-md text-white border border-white/20 hover:bg-black/70 transition active:scale-95"
                      title="Video Quality"
                      aria-label="Select video quality"
                    >
                      <Settings className="h-4 w-4" />
                    </button>

                    {/* Episode Info Panel Toggle */}
                    <button
                      onClick={() => {
                        sound.playClick(650);
                        setShowInfoPanel((v) => !v);
                      }}
                      className={`grid h-8 w-8 place-items-center rounded-full backdrop-blur-md border transition active:scale-95 ${
                        showInfoPanel
                          ? "bg-white text-[#111] border-white"
                          : "bg-black/50 border-white/20 text-white hover:bg-black/70"
                      }`}
                      title="Episode Information"
                      aria-label="Episode details"
                    >
                      <Info className="h-4 w-4" />
                    </button>

                    {/* Fullscreen Toggle */}
                    <button
                      onClick={toggleFullscreen}
                      className="hidden sm:grid h-8 w-8 place-items-center rounded-full bg-black/50 backdrop-blur-md text-white border border-white/20 hover:bg-black/70 transition active:scale-95"
                      title="Toggle Fullscreen (F)"
                      aria-label="Fullscreen"
                    >
                      {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                    </button>

                    {/* Close Player */}
                    <button
                      onClick={() => {
                        sound.playClick(500);
                        onClose();
                      }}
                      className="grid h-8 w-8 place-items-center rounded-full bg-black/50 backdrop-blur-md text-white border border-white/20 hover:bg-[#e31c3d] hover:border-[#e31c3d] transition active:scale-95"
                      aria-label="Close"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* ==================================================== */}
              {/* RIGHT FLOATING SOCIAL ENGAGEMENT DOCK               */}
              {/* ==================================================== */}
              <div className="absolute right-2 min-[360px]:right-2.5 sm:right-3.5 bottom-20 min-[360px]:bottom-24 sm:bottom-28 z-30 flex flex-col items-center gap-2 sm:gap-3 text-white">
                {/* Like Button */}
                <button
                  onClick={toggleLike}
                  className="group flex flex-col items-center gap-0.5 focus-ring"
                >
                  <div
                    className={`grid h-8 w-8 min-[360px]:h-9 min-[360px]:w-9 sm:h-10 sm:w-10 place-items-center rounded-full backdrop-blur-md transition group-hover:scale-110 active:scale-95 ${
                      isLiked
                        ? "bg-[#e31c3d] text-white shadow-[0_0_20px_rgba(227,28,61,0.6)]"
                        : "bg-black/50 text-white border border-white/20"
                    }`}
                  >
                    <Heart
                      className={`h-3.5 w-3.5 min-[360px]:h-4 min-[360px]:w-4 sm:h-4.5 sm:w-4.5 ${
                        isLiked ? "fill-white" : ""
                      }`}
                    />
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-bold text-white drop-shadow">
                    {(likeCount / 1000).toFixed(1)}k
                  </span>
                </button>

                {/* Watchlist Bookmark */}
                <button
                  onClick={toggleBookmark}
                  className="group flex flex-col items-center gap-0.5 focus-ring"
                >
                  <div
                    className={`grid h-8 w-8 min-[360px]:h-9 min-[360px]:w-9 sm:h-10 sm:w-10 place-items-center rounded-full backdrop-blur-md transition group-hover:scale-110 active:scale-95 ${
                      isBookmarked
                        ? "bg-[#2e7d32] text-white shadow-[0_0_20px_rgba(46,125,50,0.6)]"
                        : "bg-black/50 text-white border border-white/20"
                    }`}
                  >
                    <Bookmark
                      className={`h-3.5 w-3.5 min-[360px]:h-4 min-[360px]:w-4 sm:h-4.5 sm:w-4.5 ${
                        isBookmarked ? "fill-white" : ""
                      }`}
                    />
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-bold text-white drop-shadow">
                    Save
                  </span>
                </button>

                {/* Comments */}
                <button
                  onClick={() => {
                    sound.playClick(700);
                    setShowComments(true);
                  }}
                  className="group flex flex-col items-center gap-0.5 focus-ring"
                  aria-label="Open comments"
                >
                  <div className="grid h-8 w-8 min-[360px]:h-9 min-[360px]:w-9 sm:h-10 sm:w-10 place-items-center rounded-full bg-black/50 backdrop-blur-md text-white border border-white/20 transition group-hover:scale-110 active:scale-95">
                    <MessageCircle className="h-3.5 w-3.5 min-[360px]:h-4 min-[360px]:w-4 sm:h-4.5 sm:w-4.5" />
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-bold text-white drop-shadow">
                    2.4k
                  </span>
                </button>

                {/* Share */}
                <button
                  onClick={handleShare}
                  className="group flex flex-col items-center gap-0.5 focus-ring"
                >
                  <div className="grid h-8 w-8 min-[360px]:h-9 min-[360px]:w-9 sm:h-10 sm:w-10 place-items-center rounded-full bg-black/50 backdrop-blur-md text-white border border-white/20 transition group-hover:scale-110 active:scale-95">
                    {copied ? (
                      <Check className="h-3.5 w-3.5 min-[360px]:h-4 min-[360px]:w-4 text-green-400" />
                    ) : (
                      <Share2 className="h-3.5 w-3.5 min-[360px]:h-4 min-[360px]:w-4" />
                    )}
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-bold text-white drop-shadow">
                    {copied ? "Copied" : "Share"}
                  </span>
                </button>
              </div>

              {/* ==================================================== */}
              {/* 8. SYNCHRONIZED DIALOGUE SUBTITLE CAPTIONS           */}
              {/* ==================================================== */}
              <div className="relative z-30 p-2 min-[360px]:p-2.5 sm:p-4 pt-0 pb-[max(0.375rem,env(safe-area-inset-bottom))] sm:pb-3">
                {currentSubtitleText && (
                  <div className="mb-2 px-2 text-center pointer-events-none">
                    <motion.span
                      key={currentSubtitleText}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="inline-block rounded-xl bg-black/85 backdrop-blur-md px-3 py-1.5 text-[11px] sm:text-[13px] font-medium text-white shadow-2xl border border-white/15 leading-snug max-w-[92%]"
                    >
                      &ldquo;{currentSubtitleText}&rdquo;
                    </motion.span>
                  </div>
                )}

                {/* ==================================================== */}
                {/* 4. BOTTOM VIDEO CONTROLS DOCK                        */}
                {/* ==================================================== */}
                <div
                  className={`transition-opacity duration-300 ${
                    showControls && !isCompleted
                      ? "opacity-100"
                      : "opacity-0 pointer-events-none"
                  }`}
                >
                  {/* Interactive Progress Bar with Timestamps */}
                  <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-mono font-bold text-white/90 mb-2">
                    <span className="w-10 text-left">{formatTime(currentTime)}</span>
                    <div
                      className="relative flex-1 h-2 rounded-full bg-white/20 cursor-pointer group/timeline overflow-hidden"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const clickPos = (e.clientX - rect.left) / rect.width;
                        setCurrentTime(Math.round(clickPos * totalDuration));
                      }}
                    >
                      {/* Simulated Buffered Stream Bar */}
                      <div
                        className="absolute inset-y-0 left-0 bg-white/20 rounded-full"
                        style={{
                          width: `${Math.min(100, (currentTime / totalDuration) * 100 + 25)}%`,
                        }}
                      />
                      {/* Played Progress Bar */}
                      <div
                        className="absolute inset-y-0 left-0 bg-[#e31c3d] rounded-full transition-all duration-100"
                        style={{
                          width: `${(currentTime / totalDuration) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="w-10 text-right text-white/70">
                      {formatTime(totalDuration)}
                    </span>
                  </div>

                  {/* Controls Action Dock */}
                  <div className="flex items-center justify-between pt-0.5">
                    {/* Left: Prev, Seek -10s, Play/Pause, Seek +10s, Next */}
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      {/* Previous Episode */}
                      <button
                        disabled={!hasPrev}
                        onClick={handlePrevEp}
                        className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white disabled:opacity-25 hover:bg-white/20 transition active:scale-95"
                        title="Previous Episode"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>

                      {/* Rewind 10s */}
                      <button
                        onClick={() => seekBy(-10)}
                        className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition active:scale-95"
                        title="Rewind 10s (←)"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                      </button>

                      {/* Main Play / Pause Button */}
                      <button
                        onClick={() => {
                          sound.playClick(600);
                          setIsPlaying(!isPlaying);
                        }}
                        className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-full bg-white text-[#111] hover:scale-105 transition active:scale-95 shadow-lg"
                        aria-label={isPlaying ? "Pause" : "Play"}
                      >
                        {isPlaying ? (
                          <Pause className="h-4 w-4 sm:h-5 sm:w-5 fill-[#111]" />
                        ) : (
                          <Play className="h-4 w-4 sm:h-5 sm:w-5 fill-[#111] ml-0.5" />
                        )}
                      </button>

                      {/* Forward 10s */}
                      <button
                        onClick={() => seekBy(10)}
                        className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition active:scale-95"
                        title="Forward 10s (→)"
                      >
                        <RotateCw className="h-3.5 w-3.5" />
                      </button>

                      {/* Next Episode */}
                      <button
                        disabled={!hasNext}
                        onClick={handleNextEp}
                        className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white disabled:opacity-25 hover:bg-white/20 transition active:scale-95"
                        title="Next Episode"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Right: Speed, Volume Mute, Episodes List */}
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      {/* Playback Speed Popover Trigger */}
                      <div className="relative">
                        <button
                          onClick={() => {
                            sound.playClick(750);
                            setShowSpeedMenu((v) => !v);
                            setShowQualityMenu(false);
                            setShowSubtitleMenu(false);
                          }}
                          className="rounded-full bg-white/10 px-2 sm:px-2.5 py-1 text-[10px] sm:text-[11px] font-bold text-white hover:bg-white/25 transition active:scale-95"
                          title="Playback Speed"
                        >
                          {playbackSpeed}x
                        </button>

                        {/* Speed Menu Popover */}
                        <AnimatePresence>
                          {showSpeedMenu && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              className="absolute bottom-10 right-0 z-50 w-28 rounded-2xl bg-[#18181c] border border-white/20 p-1.5 shadow-2xl backdrop-blur-xl"
                            >
                              {[0.75, 1, 1.25, 1.5, 2].map((s) => (
                                <button
                                  key={s}
                                  onClick={() => {
                                    sound.playClick(700);
                                    setPlaybackSpeed(s);
                                    setShowSpeedMenu(false);
                                  }}
                                  className={`flex items-center justify-between w-full px-2.5 py-1.5 rounded-xl text-xs font-bold transition ${
                                    playbackSpeed === s
                                      ? "bg-[#e31c3d] text-white"
                                      : "text-white/80 hover:bg-white/10 hover:text-white"
                                  }`}
                                >
                                  <span>{s}x</span>
                                  {playbackSpeed === s && <Check className="h-3 w-3" />}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Mute Toggle */}
                      <button
                        onClick={() => {
                          sound.playClick(500);
                          setIsMuted(!isMuted);
                        }}
                        className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition active:scale-95"
                        title={isMuted ? "Unmute (M)" : "Mute (M)"}
                      >
                        {isMuted ? (
                          <VolumeX className="h-4 w-4" />
                        ) : volume > 0.5 ? (
                          <Volume2 className="h-4 w-4" />
                        ) : (
                          <Volume1 className="h-4 w-4" />
                        )}
                      </button>

                      {/* Episode Index Drawer Trigger */}
                      <button
                        onClick={() => {
                          sound.playClick(600);
                          onOpenEpisodeList(drama);
                        }}
                        className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition active:scale-95"
                        title="Episodes Directory"
                      >
                        <List className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* ==================================================== */}
              {/* 7. QUALITY SELECTOR POPOVER MODAL                    */}
              {/* ==================================================== */}
              <AnimatePresence>
                {showQualityMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-16 right-3 z-50 w-64 rounded-3xl bg-[#18181c]/95 border border-white/20 p-3 shadow-2xl backdrop-blur-2xl text-white"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-white/70 flex items-center gap-1.5">
                        <Settings className="h-3.5 w-3.5 text-[#e31c3d]" /> Stream Quality
                      </p>
                      <button
                        onClick={() => setShowQualityMenu(false)}
                        className="text-white/60 hover:text-white"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="space-y-1">
                      {qualityOptions.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => {
                            sound.playClick(750);
                            setQuality(opt.id);
                            setShowQualityMenu(false);
                          }}
                          className={`flex items-center justify-between w-full p-2 rounded-2xl text-left transition ${
                            quality === opt.id
                              ? "bg-[#e31c3d] text-white font-bold"
                              : "hover:bg-white/10 text-white/80"
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs">{opt.label}</span>
                              <span className="rounded bg-black/40 px-1 py-0.2 text-[9px] font-bold">
                                {opt.badge}
                              </span>
                            </div>
                            <p className="text-[10px] text-white/60 leading-tight">{opt.desc}</p>
                          </div>
                          {quality === opt.id && <Check className="h-4 w-4 shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ==================================================== */}
              {/* 8. SUBTITLE (CC) SELECTOR POPOVER MODAL              */}
              {/* ==================================================== */}
              <AnimatePresence>
                {showSubtitleMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-16 right-3 z-50 w-56 rounded-3xl bg-[#18181c]/95 border border-white/20 p-3 shadow-2xl backdrop-blur-2xl text-white"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-white/70 flex items-center gap-1.5">
                        <Subtitles className="h-3.5 w-3.5 text-[#e31c3d]" /> Subtitles (CC)
                      </p>
                      <button
                        onClick={() => setShowSubtitleMenu(false)}
                        className="text-white/60 hover:text-white"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="space-y-1">
                      {subtitleOptions.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => {
                            sound.playClick(750);
                            setSubtitleLang(opt.id);
                            setShowSubtitleMenu(false);
                          }}
                          className={`flex items-center justify-between w-full px-3 py-2 rounded-2xl text-left text-xs font-bold transition ${
                            subtitleLang === opt.id
                              ? "bg-[#e31c3d] text-white"
                              : "hover:bg-white/10 text-white/80"
                          }`}
                        >
                          <span>{opt.native}</span>
                          {subtitleLang === opt.id && <Check className="h-4 w-4 shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ==================================================== */}
              {/* 9. COMPLETE EPISODE INFORMATION PANEL (COLLAPSIBLE)  */}
              {/* ==================================================== */}
              <AnimatePresence>
                {showInfoPanel && (
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-x-0 bottom-0 z-50 rounded-t-[28px] bg-[#141418]/98 border-t border-white/20 p-5 shadow-[0_-20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl text-white max-h-[80%] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div>
                        <span className="rounded bg-[#e31c3d] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                          S1 • E{String(episodeNumber).padStart(2, "0")}
                        </span>
                        <h3 className="font-[family-name:var(--font-playfair)] text-base font-bold text-white mt-1">
                          {currentEp.title}
                        </h3>
                      </div>
                      <button
                        onClick={() => setShowInfoPanel(false)}
                        className="grid h-8 w-8 place-items-center rounded-full bg-white/10 hover:bg-white/20 text-white"
                        aria-label="Close panel"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-3.5 space-y-3.5 text-xs">
                      <div>
                        <p className="font-bold text-white/50 uppercase tracking-wider text-[10px]">
                          Episode Synopsis
                        </p>
                        <p className="mt-1 text-white/85 leading-relaxed">
                          {currentEp.synopsis || drama.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5 rounded-2xl bg-white/5 p-3 border border-white/10">
                        <div>
                          <p className="font-bold text-white/50 text-[10px] uppercase">Series</p>
                          <p className="font-semibold text-white truncate">{drama.title}</p>
                        </div>
                        <div>
                          <p className="font-bold text-white/50 text-[10px] uppercase">Director</p>
                          <p className="font-semibold text-white truncate">{drama.director}</p>
                        </div>
                        <div>
                          <p className="font-bold text-white/50 text-[10px] uppercase">Cast</p>
                          <p className="font-semibold text-white truncate">{drama.cast.join(", ")}</p>
                        </div>
                        <div>
                          <p className="font-bold text-white/50 text-[10px] uppercase">Rating</p>
                          <p className="font-semibold text-white">{drama.rating}</p>
                        </div>
                        <div>
                          <p className="font-bold text-white/50 text-[10px] uppercase">Audio</p>
                          <p className="font-semibold text-white">Hindi • Tamil • Telugu</p>
                        </div>
                        <div>
                          <p className="font-bold text-white/50 text-[10px] uppercase">Quality</p>
                          <p className="font-semibold text-[#e31c3d]">4K Ultra HDR • Dolby 5.1</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Episode Comments Drawer */}
              <AnimatePresence>
                {showComments && (
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-x-0 bottom-0 z-50 rounded-t-[28px] bg-white p-4 shadow-[0_-12px_40px_rgba(0,0,0,0.5)] text-[#111]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between border-b border-[#ece6dc] pb-3">
                      <p className="text-sm font-bold text-[#111] flex items-center gap-1.5">
                        <MessageCircle className="h-4 w-4 text-[#e31c3d]" /> Episode Discussion
                      </p>
                      <button
                        onClick={() => setShowComments(false)}
                        className="grid h-8 w-8 place-items-center rounded-full bg-[#f4efe8] text-[#555] hover:bg-[#ece6dc]"
                        aria-label="Close comments"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-3 max-h-[220px] space-y-2.5 overflow-y-auto pr-1">
                      {comments.slice(0, 4).map((c) => (
                        <div key={c.id} className="rounded-2xl bg-[#faf7f3] p-3 border border-[#ece6dc]">
                          <p className="text-xs font-bold text-[#111]">{c.user}</p>
                          <p className="mt-0.5 text-xs leading-relaxed text-[#555]">{c.text}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* DESKTOP RIGHT: Compact Episode Queue / Metadata (Visible on xl+ screens) */}
            <div className="hidden xl:flex flex-col justify-center w-[280px] text-white/90 space-y-4 shrink-0 pointer-events-auto">
              {/* Up Next Preview Box */}
              {hasNext && (
                <div className="rounded-3xl bg-white/5 border border-white/10 p-4 backdrop-blur-md space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#f59e0b]">
                      Up Next • Episode {episodeNumber + 1}
                    </span>
                    <span className="text-[10px] text-white/50">{nextEp?.duration || "4:48"}</span>
                  </div>

                  <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/15 group/next cursor-pointer"
                    onClick={handleNextEp}
                  >
                    <img
                      src={nextEp?.thumbnail || drama.cover}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-300 group-hover/next:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="grid h-10 w-10 place-items-center rounded-full bg-[#e31c3d] text-white shadow-lg group-hover/next:scale-110 transition">
                        <Play className="h-4 w-4 fill-white ml-0.5" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-xs text-white truncate">
                      {nextEp?.title || `Episode ${episodeNumber + 1}`}
                    </h4>
                    <p className="text-[11px] text-white/60 line-clamp-2 mt-1">
                      {nextEp?.synopsis || "Watch the drama unfold in the next exciting chapter."}
                    </p>
                  </div>
                </div>
              )}

              {/* Keyboard Shortcuts Guide */}
              <div className="rounded-3xl bg-white/5 border border-white/10 p-4 backdrop-blur-md space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                  Keyboard Shortcuts
                </p>
                <div className="grid grid-cols-2 gap-y-1.5 text-[11px] text-white/70">
                  <span><kbd className="rounded bg-white/15 px-1.5 py-0.5 font-mono text-[10px] text-white">Space</kbd> Play/Pause</span>
                  <span><kbd className="rounded bg-white/15 px-1.5 py-0.5 font-mono text-[10px] text-white">F</kbd> Fullscreen</span>
                  <span><kbd className="rounded bg-white/15 px-1.5 py-0.5 font-mono text-[10px] text-white">← / →</kbd> Seek 10s</span>
                  <span><kbd className="rounded bg-white/15 px-1.5 py-0.5 font-mono text-[10px] text-white">M</kbd> Mute</span>
                  <span><kbd className="rounded bg-white/15 px-1.5 py-0.5 font-mono text-[10px] text-white">C</kbd> Subtitles</span>
                  <span><kbd className="rounded bg-white/15 px-1.5 py-0.5 font-mono text-[10px] text-white">I</kbd> Info</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
