"use client";

import { ChevronLeft, ChevronRight, Flame } from "lucide-react";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { dramas, type Drama, type Genre } from "@/lib/data";
import { DramaCard } from "./DramaCard";
import { useDragScroll } from "@/hooks/useDragScroll";
import { cn } from "@/lib/utils";
import { sound } from "@/lib/soundEffects";
import { Reveal } from "@/components/Reveal";

const tabs = ["This Week", "Most Popular", "New Releases"] as const;

interface TrendingSectionProps {
  genre: Genre;
  onOpenModal?: (drama: Drama) => void;
  onPlayDirect?: (drama: Drama, episodeNum?: number) => void;
}

export function TrendingSection({ genre, onOpenModal, onPlayDirect }: TrendingSectionProps) {
  const [tab, setTab] = useState<(typeof tabs)[number]>("This Week");
  const ref = useDragScroll<HTMLDivElement>();

  const items = useMemo(() => {
    let list = dramas.filter((d) => genre === "All" || d.genre.includes(genre));
    if (tab === "Most Popular") list = [...list].sort((a, b) => b.episodes - a.episodes);
    if (tab === "New Releases") list = [...list].sort((a, b) => b.rank - a.rank);
    return list;
  }, [genre, tab]);

  const scrollBy = (dir: number) => {
    sound.playClick(600);
    ref.current?.scrollBy({ left: dir * 360, behavior: "smooth" });
  };

  return (
    <section className="mx-auto mt-14 w-full max-w-[1600px] px-4 sm:px-8 lg:px-12 xl:px-16 select-none">
      <Reveal>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#ece6dc] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-[#ffebee] text-[#e31c3d]">
              <Flame className="h-3.5 w-3.5 fill-[#e31c3d]" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#e31c3d]">
              Top Ranked Charts
            </span>
          </div>
          <h2 className="mt-1 font-[family-name:var(--font-playfair)] text-[30px] sm:text-[34px] font-bold tracking-tight text-[#111]">
            Trending Now
          </h2>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 sm:gap-1.5 rounded-full bg-white p-1 shadow-sm ring-1 ring-black/5 border border-[#e8e2d8] overflow-x-auto max-w-full hide-scrollbar">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => {
                sound.playClick(750);
                setTab(t);
              }}
              className={cn(
                "rounded-full px-3 sm:px-4 py-1.5 text-[11px] sm:text-xs font-bold transition whitespace-nowrap",
                tab === t
                  ? "bg-[#111] text-white shadow-sm"
                  : "text-[#666] hover:text-[#111] hover:bg-[#f6f2ec]"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      </Reveal>

      <div className="relative mt-6">
        {/* Navigation Buttons */}
        <button
          onClick={() => scrollBy(-1)}
          className="focus-ring absolute left-0 top-1/2 z-20 -translate-x-3 -translate-y-1/2 hidden h-11 w-11 place-items-center rounded-full bg-white text-[#111] shadow-[0_8px_24px_rgba(0,0,0,0.14)] ring-1 ring-black/10 transition hover:scale-110 active:scale-95 hover:bg-[#111] hover:text-white md:grid"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${tab}-${genre}`}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {items.length === 0 ? (
              <div className="rounded-[24px] bg-white p-10 text-center border border-[#ece6dc]">
                <p className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#111]">
                  No {genre === "All" ? "" : `${genre} `}titles on this chart
                </p>
                <p className="mt-2 text-xs text-[#666]">Try another genre or tab to keep browsing.</p>
              </div>
            ) : (
              <div
                ref={ref}
                className="hide-scrollbar flex cursor-grab gap-4 overflow-x-auto pb-4 pt-1"
              >
                {items.map((d, i) => (
                  <motion.div
                    key={d.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.035 }}
                  >
                    <DramaCard
                      drama={d}
                      onOpenModal={onOpenModal}
                      onPlayDirect={onPlayDirect}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <button
          onClick={() => scrollBy(1)}
          className="focus-ring absolute right-0 top-1/2 z-20 translate-x-3 -translate-y-1/2 hidden h-11 w-11 place-items-center rounded-full bg-white text-[#111] shadow-[0_8px_24px_rgba(0,0,0,0.14)] ring-1 ring-black/10 transition hover:scale-110 active:scale-95 hover:bg-[#111] hover:text-white md:grid"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
