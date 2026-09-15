"use client";

import {
  Briefcase,
  Clapperboard,
  GraduationCap,
  Grid2x2,
  Heart,
  LayoutGrid,
  Smile,
  Sparkles,
  Users,
  VenetianMask,
} from "lucide-react";
import { genres, type Genre } from "@/lib/data";
import { useDragScroll } from "@/hooks/useDragScroll";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { sound } from "@/lib/soundEffects";
import { Reveal } from "@/components/Reveal";

const icons = {
  grid: LayoutGrid,
  heart: Heart,
  mask: VenetianMask,
  clapper: Clapperboard,
  smile: Smile,
  grad: GraduationCap,
  briefcase: Briefcase,
  spark: Sparkles,
  users: Users,
};

export function GenrePills({
  value,
  onChange,
  flush = false,
}: {
  value: Genre;
  onChange: (g: Genre) => void;
  flush?: boolean;
}) {
  const ref = useDragScroll<HTMLDivElement>();

  return (
    <section className={flush ? "select-none" : "mx-auto w-full max-w-[1600px] px-4 sm:px-8 lg:px-12 xl:px-16 select-none"}>
      <Reveal>
      <div className="flex items-center gap-3">
        <div
          ref={ref}
          className="hide-scrollbar flex flex-1 cursor-grab gap-2.5 overflow-x-auto py-1"
        >
          {genres.map((g) => {
            const Icon = icons[g.icon as keyof typeof icons] ?? Grid2x2;
            const active = value === g.id;
            return (
              <button
                key={g.id}
                onClick={() => {
                  sound.playClick(active ? 500 : 700);
                  onChange(g.id);
                }}
                className={cn(
                  "focus-ring group inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-bold shadow-sm ring-1 transition active:scale-95",
                  active
                    ? "bg-[#e31c3d] text-white ring-[#e31c3d] shadow-[0_8px_20px_rgba(227,28,61,0.3)]"
                    : "bg-white text-[#444] ring-black/5 hover:-translate-y-0.5 hover:shadow-md hover:text-[#111] hover:bg-[#faf7f3]"
                )}
              >
                <Icon className={cn("h-3.5 w-3.5 transition group-hover:scale-110", active && "fill-white/20")} />
                {g.label}
              </button>
            );
          })}
        </div>
        <Link
          href="/genres"
          onClick={() => sound.playClick(750)}
          className="hidden shrink-0 items-center gap-1 text-xs font-bold text-[#e31c3d] hover:text-[#111] transition sm:inline-flex"
        >
          <span>All Genres</span>
          <span className="fx-arrow inline-block" aria-hidden>›</span>
        </Link>
      </div>
      </Reveal>
    </section>
  );
}
