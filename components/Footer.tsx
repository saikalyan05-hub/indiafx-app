"use client";

import Link from "next/link";
import { Logo } from "./Logo";
import { Sparkles, Heart, Shield, Smartphone, Globe, ArrowUpRight, ArrowUp } from "lucide-react";
import { sound } from "@/lib/soundEffects";

export function Footer() {
  const scrollToTop = () => {
    sound.playClick(800);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="mt-16 sm:mt-24 border-t border-[#e6dfd5] bg-[#faf7f2] select-none">
      <div className="mx-auto w-full max-w-[1600px] px-4 pt-12 sm:pt-16 pb-[calc(6rem+env(safe-area-inset-bottom,20px))] lg:pb-16 sm:px-8 lg:px-12 xl:px-16">

        {/* Streamlined 4-Column Luxury Grid with Wide Desktop Gap */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 sm:gap-x-12 lg:gap-x-16 xl:gap-x-24 gap-y-10 sm:gap-y-12">

          {/* Column 1: Brand & Quality Badges */}
          <div className="space-y-4">
            <Logo />
            <p className="text-xs sm:text-sm text-[#555] leading-relaxed max-w-xs font-medium">
              India&apos;s premier luxury micro-drama destination. Five-minute cinema, blockbuster emotions, vertical 4K HDR streaming.
            </p>
            <div className="flex flex-col gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ffebee] px-3 py-1 text-xs font-bold text-[#e31c3d] w-fit">
                <Sparkles className="h-3.5 w-3.5" /> 500+ Original Dramas
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eee7dc] px-3 py-1 text-xs font-semibold text-[#444] w-fit">
                <Globe className="h-3.5 w-3.5 text-[#666]" /> Hindi • Tamil • Telugu • English
              </span>
            </div>
          </div>

          {/* Column 2: Streamlined Catalog Links */}
          <div className="space-y-3.5">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#111]">
              Catalog
            </p>
            <ul className="space-y-2.5 text-xs sm:text-sm font-semibold text-[#444]">
              <li>
                <Link href="/dramas" className="hover:text-[#e31c3d] transition-colors py-0.5 inline-block">
                  All Dramas
                </Link>
              </li>
              <li>
                <Link href="/trending" className="hover:text-[#e31c3d] transition-colors py-0.5 inline-block">
                  Trending Top 10
                </Link>
              </li>
              <li>
                <Link href="/new-releases" className="hover:text-[#e31c3d] transition-colors py-0.5 inline-block">
                  New Releases
                </Link>
              </li>
              <li>
                <Link href="/genres" className="hover:text-[#e31c3d] transition-colors py-0.5 inline-block">
                  Moods &amp; Genres
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Streamlined Experience & VIP */}
          <div className="space-y-3.5">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#111]">
              Experience
            </p>
            <ul className="space-y-2.5 text-xs sm:text-sm font-semibold text-[#444]">
              <li>
                <Link href="/pricing" className="hover:text-[#e31c3d] transition-colors py-0.5 inline-block text-[#e31c3d]">
                  VIP Unlimited Pass ★
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-[#e31c3d] transition-colors py-0.5 inline-block">
                  Editorial Gazette
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-[#e31c3d] transition-colors py-0.5 inline-block">
                  Drama Community
                </Link>
              </li>
              <li>
                <Link href="/shopping" className="hover:text-[#e31c3d] transition-colors py-0.5 inline-block">
                  Exclusive Merch Store
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Streaming Apps & Back to Top */}
          <div className="space-y-4">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#111]">
              Streaming Apps
            </p>
            <p className="text-xs text-[#555] leading-relaxed font-medium">
              Zero lag playback with bespoke native apps on iOS, Android, and Smart TV.
            </p>
            <div className="flex flex-col gap-2.5 pt-1">
              <Link
                href="/pricing"
                className="inline-flex items-center justify-between gap-2 rounded-xl bg-[#111] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#e31c3d] active:scale-[0.98] shadow-sm"
              >
                <span className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" /> Download App
                </span>
                <ArrowUpRight className="h-3.5 w-3.5 opacity-80" />
              </Link>

              {/* Explicit High-Contrast Back to Top Button */}
              <button
                onClick={scrollToTop}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-[#d8d0c2] px-4 py-2 text-xs font-bold text-[#111] transition hover:bg-[#f2ece2] hover:border-[#b8ad9c] active:scale-[0.98] shadow-sm"
                aria-label="Scroll back to top of page"
              >
                <ArrowUp className="h-3.5 w-3.5 text-[#e31c3d]" /> Back to Top
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Security Bar */}
        <div className="mt-10 sm:mt-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 border-t border-[#e6dfd5] pt-6 text-xs text-[#666] font-medium">
          <p>© {new Date().getFullYear()} IndiaFX Entertainment Network. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="flex items-center gap-1 text-[#333]">
              Made with <Heart className="h-3.5 w-3.5 fill-[#e31c3d] text-[#e31c3d]" /> for Drama Lovers
            </span>
            <span className="hidden min-[360px]:inline text-[#bbb]">•</span>
            <span className="flex items-center gap-1 text-[#222]">
              <Shield className="h-3.5 w-3.5 text-[#10b981]" /> 100% Secure Cinema Streaming
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
