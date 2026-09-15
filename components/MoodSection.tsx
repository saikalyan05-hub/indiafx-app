"use client";

import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";
import { moods } from "@/lib/data";
import { useDragScroll } from "@/hooks/useDragScroll";
import { motion } from "framer-motion";
import { sound } from "@/lib/soundEffects";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";

const personality = {
  heartbreak: "hover:shadow-[0_20px_45px_rgba(227,28,61,0.35)] hover:-translate-y-1.5",
  comedy: "hover:rotate-1 hover:-translate-y-1.5 hover:shadow-[0_20px_45px_rgba(245,158,11,0.35)]",
  thriller: "hover:shadow-[0_24px_55px_rgba(0,0,0,0.55)] hover:scale-[1.03]",
  heal: "hover:shadow-[0_20px_45px_rgba(56,189,248,0.35)] hover:-translate-y-1.5",
  fantasy: "hover:shadow-[0_20px_45px_rgba(139,92,246,0.35)] hover:-translate-y-1.5",
  gold: "hover:shadow-[0_20px_45px_rgba(217,119,6,0.35)] hover:-translate-y-1.5",
};

export function MoodSection({ flush = false }: { flush?: boolean }) {
  const ref = useDragScroll<HTMLDivElement>();

  return (
    <section className={flush ? "mt-2 select-none" : "mx-auto mt-14 w-full max-w-[1600px] px-4 pb-4 sm:px-8 lg:px-12 xl:px-16 select-none"}>
      <Reveal>
        <div className="flex items-end justify-between border-b border-[#ece6dc] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-[#f2ede4] text-[#8a7228]">
                <Sparkles className="h-3.5 w-3.5" />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#888]">
                Curated Vibes
              </span>
            </div>
            <h2 className="mt-1 font-[family-name:var(--font-playfair)] text-[30px] sm:text-[34px] font-bold tracking-tight text-[#111]">
              Browse by Mood
            </h2>
          </div>
          <Link
            href="/genres"
            onClick={() => sound.playClick(700)}
            className="group text-xs font-bold text-[#e31c3d] hover:text-[#111] transition flex items-center gap-1"
          >
            <span>See All Moods</span>
            <ChevronRight className="fx-arrow h-4 w-4" />
          </Link>
        </div>
      </Reveal>

      <Stagger
        stagger={0.07}
        scrollRef={ref}
        className="hide-scrollbar mt-6 flex cursor-grab gap-4 overflow-x-auto pb-4 pt-1"
      >
        {moods.map((m) => (
          <StaggerItem key={m.id} className="shrink-0">
          <Link
            href={m.href}
            onClick={() => sound.playClick(650)}
            className="block"
          >
            <motion.article
              whileTap={{ scale: 0.97 }}
              className={`group relative h-[155px] w-[215px] sm:w-[245px] overflow-hidden rounded-[22px] bg-[#111] ${
                personality[m.personality]
              } transition-all duration-300 border border-white/10`}
            >
              <img
                src={m.image}
                alt=""
                className="fx-img h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/15" />

              <h3 className="absolute left-4 top-5 whitespace-pre-line font-[family-name:var(--font-playfair)] text-[24px] sm:text-[26px] leading-[1.05] font-bold text-white drop-shadow">
                {m.title}
              </h3>

              <span className="absolute bottom-4 right-4 grid h-8 w-8 place-items-center rounded-full bg-white/20 text-white backdrop-blur-md transition group-hover:bg-[#e31c3d] group-hover:scale-110">
                <ChevronRight className="h-4 w-4" />
              </span>
            </motion.article>
          </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
