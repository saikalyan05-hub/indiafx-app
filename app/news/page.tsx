"use client";

import { useEffect, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { news } from "@/lib/data";
import { sound } from "@/lib/soundEffects";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { ArrowRight, X } from "lucide-react";

export default function NewsPage() {
  const [openArticle, setOpenArticle] = useState<(typeof news)[number] | null>(null);
  useBodyScrollLock(!!openArticle);

  useEffect(() => {
    if (!openArticle) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenArticle(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openArticle]);

  return (
    <PageShell
      eyebrow="Editorial Gazette"
      title="Stories Behind the Stories"
      subtitle="Exclusive drops, director diaries, cast interviews, and the culture of five-minute cinema."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {news.map((n) => (
          <article
            key={n.id}
            className="group flex flex-col justify-between overflow-hidden rounded-[26px] bg-white shadow-[0_12px_32px_rgba(0,0,0,0.05)] border border-[#ece6dc] transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="overflow-hidden">
              <img
                src={n.image}
                alt={n.title}
                className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-6 flex flex-col flex-1 justify-between">
              <div>
                <span className="rounded-full bg-[#ffebee] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#e31c3d]">
                  {n.category}
                </span>
                <h3 className="mt-3 font-[family-name:var(--font-playfair)] text-xl font-bold text-[#111] leading-snug group-hover:text-[#e31c3d] transition">
                  {n.title}
                </h3>
                <p className="mt-2 text-sm text-[#666] leading-relaxed line-clamp-3">
                  {n.excerpt}
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-[#f0eae0] flex items-center justify-between">
                <span className="text-xs font-semibold text-[#888]">5 min read</span>
                <button
                  onClick={() => {
                    sound.playClick(650);
                    setOpenArticle(n);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#e31c3d] group-hover:translate-x-0.5 transition"
                >
                  Read Article <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {openArticle ? (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={openArticle.title}
        >
          <button
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            aria-label="Close article"
            onClick={() => setOpenArticle(null)}
          />
          <article className="relative z-10 w-full max-w-xl overflow-hidden rounded-[28px] bg-white shadow-[0_24px_70px_rgba(0,0,0,0.2)]">
            <img src={openArticle.image} alt="" className="aspect-[16/8] w-full object-cover" />
            <button
              onClick={() => setOpenArticle(null)}
              className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white text-[#111] shadow-md"
              aria-label="Close article"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="p-6">
              <span className="rounded-full bg-[#ffebee] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#e31c3d]">
                {openArticle.category}
              </span>
              <h3 className="mt-3 font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#111]">
                {openArticle.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#555]">{openArticle.excerpt}</p>
              <p className="mt-4 text-sm leading-relaxed text-[#666]">
                IndiaFX editorial continues the story behind the series — the craft, the cast, and the five-minute cinema culture that made this drop land.
              </p>
            </div>
          </article>
        </div>
      ) : null}
    </PageShell>
  );
}
