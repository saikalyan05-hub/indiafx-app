import Link from "next/link";
import { Logo } from "./Logo";
import { Sparkles, Heart, Shield, Smartphone, Globe, ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 sm:mt-24 border-t border-[#ece6dc] bg-[#fbf9f6] select-none">
      <div className="mx-auto w-full max-w-[1600px] px-4 pt-10 sm:pt-14 pb-[calc(6rem+env(safe-area-inset-bottom,20px))] lg:pb-14 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-x-4 sm:gap-x-8 gap-y-8 sm:gap-y-10">

          {/* Brand Col */}
          <div className="col-span-2 lg:col-span-2 space-y-3.5 sm:space-y-4">
            <Logo />
            <p className="text-xs sm:text-sm text-[#666] leading-relaxed max-w-sm">
              India&apos;s premier luxury micro-drama destination. Five-minute cinema, blockbuster emotions, vertical 4K HDR streaming.
            </p>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ffebee] px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-bold text-[#e31c3d]">
                <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> 500+ Original Dramas
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f2ede4] px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-semibold text-[#666]">
                <Globe className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> Hindi • Tamil • Telugu • English
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1 space-y-2.5 sm:space-y-3">
            <p className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-[#111]">
              Explore
            </p>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-[#666]">
              <li>
                <Link href="/" className="hover:text-[#e31c3d] transition-colors py-0.5 inline-block">Home</Link>
              </li>
              <li>
                <Link href="/dramas" className="hover:text-[#e31c3d] transition-colors py-0.5 inline-block">All Dramas</Link>
              </li>
              <li>
                <Link href="/trending" className="hover:text-[#e31c3d] transition-colors py-0.5 inline-block">Trending Charts</Link>
              </li>
              <li>
                <Link href="/new-releases" className="hover:text-[#e31c3d] transition-colors py-0.5 inline-block">New Releases</Link>
              </li>
              <li>
                <Link href="/genres" className="hover:text-[#e31c3d] transition-colors py-0.5 inline-block">Moods & Genres</Link>
              </li>
            </ul>
          </div>

          {/* Editorial & Community */}
          <div className="col-span-1 space-y-2.5 sm:space-y-3">
            <p className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-[#111]">
              Experience
            </p>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-[#666]">
              <li>
                <Link href="/pricing" className="hover:text-[#e31c3d] transition-colors py-0.5 inline-block">VIP Pass</Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-[#e31c3d] transition-colors py-0.5 inline-block">Editorial Gazette</Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-[#e31c3d] transition-colors py-0.5 inline-block">Community</Link>
              </li>
              <li>
                <Link href="/shopping" className="hover:text-[#e31c3d] transition-colors py-0.5 inline-block">Merch Store</Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-[#e31c3d] transition-colors py-0.5 inline-block">My Watchlist</Link>
              </li>
            </ul>
          </div>

          {/* Apps & Quality */}
          <div className="col-span-2 md:col-span-2 lg:col-span-1 space-y-3 pt-2 sm:pt-0">
            <p className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-[#111]">
              Streaming Platforms
            </p>
            <p className="text-xs text-[#777] leading-relaxed">
              Experience zero lag with our bespoke native apps on iOS, Android, and Smart TV.
            </p>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2 pt-0.5">
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#111] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#e31c3d] active:scale-[0.98] shadow-sm"
              >
                <Smartphone className="h-4 w-4" /> Download Mobile App
                <ArrowUpRight className="h-3.5 w-3.5 opacity-60 ml-auto sm:ml-0" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 border-t border-[#ece6dc] pt-5 sm:pt-6 text-[11px] sm:text-xs text-[#888]">
          <p>© {new Date().getFullYear()} IndiaFX Entertainment Network. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="flex items-center gap-1">
              Made with <Heart className="h-3.5 w-3.5 fill-[#e31c3d] text-[#e31c3d]" /> for Drama Lovers
            </span>
            <span className="hidden min-[360px]:inline text-[#ccc]">•</span>
            <span className="flex items-center gap-1">
              <Shield className="h-3.5 w-3.5 text-[#10b981]" /> 100% Secure Cinema Streaming
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
