"use client";

import { ChevronLeft, ChevronRight, Play, BookOpen } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { heroSlides, type Drama } from "@/lib/data";
import { MagazineBook3D } from "@/components/MagazineBook3D";
import { sound } from "@/lib/soundEffects";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { duration, easeOutExpo, easeOutQuart, heroWord, staggerContainer } from "@/lib/motion";

interface HeroSectionProps {
  onOpenBook?: (drama: Drama) => void;
  onPlayDirect?: (drama: Drama, episodeNum?: number) => void;
}

const headlineWords = [
  { word: "The", br: true },
  { word: "Next", br: true },
  { word: "Big", br: true, accent: true },
  { word: "Story", br: true },
  { word: "Is Here.", br: false },
];

export function HeroSection({ onOpenBook, onPlayDirect }: HeroSectionProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const slide = heroSlides[index];
  const lastNavRef = useRef(0);
  const reduced = usePrefersReducedMotion();

  const go = (nextDir: number) => {
    const now = Date.now();
    if (now - lastNavRef.current < 280) return;
    lastNavRef.current = now;
    sound.playPageFlip();
    setDirection(nextDir);
    setIndex((i) => (i + nextDir + heroSlides.length) % heroSlides.length);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement | null)?.isContentEditable) return;
      if (document.querySelector('[aria-modal="true"]')) return;
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleSelectIndex = (newIndex: number, explicitDir?: number) => {
    if (newIndex === index) return;
    const now = Date.now();
    if (now - lastNavRef.current < 280) return;
    lastNavRef.current = now;
    const dir = explicitDir !== undefined ? explicitDir : newIndex >= index ? 1 : -1;
    setDirection(dir);
    setIndex(newIndex);
  };

  const handleOpenModal = (dramaToOpen: Drama) => {
    sound.playBookOpen();
    if (onOpenBook) {
      onOpenBook(dramaToOpen);
    }
  };

  const handlePlay = (dramaToPlay: Drama, epNum?: number) => {
    sound.playPageFlip();
    if (onPlayDirect) {
      onPlayDirect(dramaToPlay, epNum || dramaToPlay.lastEpisodeWatched || 1);
    }
  };

  return (
    <section className="relative mx-auto w-full max-w-[1600px] px-3.5 pb-2 pt-1 sm:pt-3 sm:px-8 sm:pb-8 lg:px-12 xl:px-16 select-none">
      <div className="grid items-center gap-4 sm:gap-6 lg:gap-8 xl:gap-12 lg:grid-cols-[1.05fr_1.65fr_1fr] xl:grid-cols-[1.1fr_1.7fr_1.05fr] min-h-0 lg:min-h-[720px] xl:min-h-[760px]">

        {/* LEFT COLUMN: Editorial Headline & Brand Identity */}
        <div className="relative z-10 max-w-xl text-left">
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 8, letterSpacing: "0.42em" }}
            animate={{ opacity: 1, y: 0, letterSpacing: "0.32em" }}
            transition={{ duration: duration.standard, delay: 0.08, ease: easeOutQuart }}
            className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.32em] text-[#666]"
          >
            M I C R O &nbsp; D R A M A S
          </motion.p>

          <h1 className="mt-1 sm:mt-2 font-[family-name:var(--font-playfair)] text-[32px] min-[360px]:text-[38px] sm:text-[54px] lg:text-[86px] xl:text-[98px] leading-[0.98] lg:leading-[0.88] font-black tracking-tight text-[#111]">
            {reduced ? (
              <>
                The<br className="hidden lg:inline" /> Next<br className="hidden lg:inline" />{" "}
                <span className="text-[#e31c3d]">Big</span><br className="hidden lg:inline" /> Story<br className="hidden lg:inline" /> Is Here.
              </>
            ) : (
              <motion.span
                className="inline"
                variants={staggerContainer(0.085, 0.16)}
                initial="hidden"
                animate="show"
              >
                {headlineWords.map((item, i) => (
                  <span key={`${item.word}-${i}`}>
                    <span className="inline-block overflow-hidden align-bottom">
                      <motion.span
                        variants={heroWord}
                        className={`inline-block ${item.accent ? "text-[#e31c3d]" : ""}`}
                      >
                        {item.word}
                      </motion.span>
                    </span>
                    {item.br ? <br className="hidden lg:inline" /> : null}
                    {item.br ? " " : null}
                  </span>
                ))}
              </motion.span>
            )}
          </h1>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.cinematic, delay: 0.62, ease: easeOutQuart }}
            className="mt-2 sm:mt-4 text-xs min-[360px]:text-sm sm:text-base lg:text-[20px] xl:text-[22px] leading-snug text-[#333] font-medium"
          >
            Short Dramas.<br className="hidden lg:inline" /> Bigger Feelings.<br className="hidden lg:inline" /> New Stories Everyday.
          </motion.p>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.standard, delay: 0.74, ease: easeOutQuart }}
            className="mt-2.5 sm:mt-5 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#777] hidden min-[360px]:block"
          >
            One Platform. A Brighter You.
          </motion.p>

          {/* Mobile Cursive Note */}
          <motion.div
            initial={reduced ? false : { opacity: 0, rotate: -6, y: 8 }}
            animate={{ opacity: 1, rotate: -2, y: 0 }}
            transition={{ duration: duration.cinematic, delay: 0.86, ease: easeOutExpo }}
            className="mt-3 lg:hidden"
          >
            <p className="font-[family-name:var(--font-caveat)] text-xl min-[360px]:text-2xl text-[#222] rotate-[-2deg]">
              More Than Entertainment A Brighter You <span className="text-[#e31c3d] font-sans">♡</span>
            </p>
          </motion.div>
        </div>

        {/* CENTER COLUMN: 3D Magazine Carousel Stack + Bottom Controls Bar */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 22, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: duration.hero, delay: 0.28, ease: easeOutExpo }}
          className="relative flex flex-col items-center justify-center py-2 sm:py-4 lg:py-6 w-full overflow-visible"
        >

          {/* 3D Physical Magazine Stack */}
          <div className="relative flex w-full items-center justify-center overflow-visible">
            <MagazineBook3D
              dramas={heroSlides}
              activeIndex={index}
              direction={direction}
              onSelectIndex={handleSelectIndex}
              onOpenBook={handleOpenModal}
              onPlayDirect={handlePlay}
            />
          </div>

          {/* DOWN SIDE CONTROLS: Left Arrow + Watch EP Button + Right Arrow */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.cinematic, delay: 0.7, ease: easeOutQuart }}
            className="mt-4 sm:mt-6 flex items-center justify-center gap-2.5 sm:gap-4 w-full max-w-md z-30"
          >
            {/* Left Moving Arrow Button */}
            <button
              onClick={() => go(-1)}
              className="focus-ring grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-full bg-white text-[#111] shadow-[0_4px_16px_rgba(0,0,0,0.08)] ring-1 ring-black/10 hover:bg-[#111] hover:text-white transition-all duration-200 hover:scale-110 active:scale-95 shrink-0"
              aria-label="Previous drama"
              title="Previous drama"
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            {/* Main Watch EP Button */}
            <motion.button
              onClick={() => handlePlay(slide, slide.lastEpisodeWatched || 1)}
              initial={reduced ? false : { scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={reduced ? undefined : { scale: 1.045 }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: duration.ui, ease: easeOutQuart }}
              className="focus-ring flex-1 max-w-[260px] inline-flex items-center justify-center gap-2 rounded-full bg-[#111] px-5 sm:px-8 py-3 sm:py-3.5 text-xs sm:text-sm font-bold text-white shadow-[0_12px_28px_rgba(0,0,0,0.22)] transition-colors duration-200 hover:bg-[#e31c3d] group"
            >
              <Play className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-white transition-transform duration-200 group-hover:translate-x-0.5" />
              <span>Watch EP {slide.lastEpisodeWatched || 1}</span>
            </motion.button>

            {/* Quick Dossier / Add Action Button */}
            <button
              onClick={() => handleOpenModal(slide)}
              className="focus-ring grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-full bg-white text-[#111] shadow-[0_4px_16px_rgba(0,0,0,0.08)] ring-1 ring-black/10 hover:bg-[#111] hover:text-white transition-all duration-200 hover:scale-110 active:scale-95 shrink-0"
              title="View Episodes Dossier"
              aria-label="View Episodes Dossier"
            >
              <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>

            {/* Right Moving Arrow Button */}
            <button
              onClick={() => go(1)}
              className="focus-ring grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-full bg-white text-[#111] shadow-[0_4px_16px_rgba(0,0,0,0.08)] ring-1 ring-black/10 hover:bg-[#111] hover:text-white transition-all duration-200 hover:scale-110 active:scale-95 shrink-0"
              aria-label="Next drama"
              title="Next drama"
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </motion.div>

          {/* Carousel Indicator Dots */}
          <div className="mt-3 sm:mt-4 flex items-center justify-center gap-1.5 sm:gap-2">
            {heroSlides.map((s, i) => (
              <button
                key={s.id}
                aria-label={`Go to ${s.title}`}
                onClick={() => {
                  sound.playClick(700);
                  handleSelectIndex(i);
                }}
                className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-6 sm:w-8 bg-[#e31c3d]" : "w-2 sm:w-2.5 bg-[#d8d2c9] hover:bg-[#b0a89d]"
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* RIGHT COLUMN: Featured This Week List + Script Quote (Desktop) */}
        <div className="hidden lg:flex flex-col justify-between pl-4 space-y-5">
          <div>
            <motion.h2
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: duration.standard, delay: 0.38, ease: easeOutQuart }}
              className="font-[family-name:var(--font-playfair)] text-2xl xl:text-[28px] font-bold text-[#111]"
            >
              Featured This Week
            </motion.h2>

            <motion.div
              variants={staggerContainer(0.07, 0.46)}
              initial={reduced ? false : "hidden"}
              animate="show"
              className="mt-4 space-y-2.5"
            >
              {heroSlides.map((item, idx) => {
                const isSelected = idx === index;
                const formattedNum = `0${idx + 1}`;

                return (
                  <motion.button
                    type="button"
                    key={item.id}
                    variants={{
                      hidden: { opacity: 0, x: 16, scale: 0.98 },
                      show: {
                        opacity: 1,
                        x: 0,
                        scale: 1,
                        transition: { duration: duration.cinematic, ease: easeOutExpo },
                      },
                    }}
                    whileHover={reduced ? undefined : { x: 2 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => {
                      sound.playClick(650);
                      handleSelectIndex(idx);
                    }}
                    className={`group flex w-full items-center gap-3.5 rounded-2xl p-2.5 text-left transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? "bg-white shadow-[0_8px_24px_rgba(0,0,0,0.06)] ring-1 ring-[#e31c3d]/40"
                        : "hover:bg-white/70"
                    }`}
                  >
                    {/* Thumbnail Image */}
                    <img
                      src={item.cover || item.image}
                      alt={item.title}
                      className="h-16 w-16 xl:h-18 xl:w-18 rounded-xl object-cover shadow-sm shrink-0 transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Number and Title */}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-black text-[#e31c3d]">
                        {formattedNum}
                      </p>
                      <p
                        className={`text-sm xl:text-[16px] font-bold truncate transition-colors ${
                          isSelected ? "text-[#e31c3d]" : "text-[#111] group-hover:text-[#e31c3d]"
                        }`}
                      >
                        {item.title}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          </div>

          {/* Cursive Handwriting Quote from Reference Image */}
          <motion.div
            initial={reduced ? false : { opacity: 0, rotate: -8, y: 10 }}
            animate={{ opacity: 1, rotate: -4, y: 0 }}
            transition={{ duration: duration.hero, delay: 0.92, ease: easeOutExpo }}
            className="pt-2 pl-2"
          >
            <p className="font-[family-name:var(--font-caveat)] text-2xl xl:text-[30px] leading-[1.1] text-[#222] rotate-[-4deg]">
              More Than
              <br />
              Entertainment
              <br />
              A Brighter You <span className="text-[#e31c3d] inline-block font-sans">♡</span>
            </p>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
