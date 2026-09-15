import Link from "next/link";
import { Logo } from "./Logo";
import { Sparkles, Heart, Shield, Smartphone, Globe, Film, Award } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20 sm:mt-28 lg:mt-36 border-t border-[#e6ded2] bg-[#fbf9f6] select-none">
      <div className="mx-auto w-full max-w-[1500px] px-6 min-[400px]:px-8 sm:px-12 md:px-16 lg:px-20 xl:px-24 pt-14 sm:pt-18 lg:pt-20 pb-32 sm:pb-24 lg:pb-16">

        {/* Main 2-Part Side-by-Side Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-14 lg:gap-20 xl:gap-28 items-start">

          {/* Part 1: Brand, Story & VIP App */}
          <div className="space-y-5">
            <Logo />
            <p className="text-[14px] sm:text-[15px] text-[#55504a] leading-relaxed max-w-md">
              India&apos;s premier luxury micro-drama destination. Five-minute cinema, blockbuster emotions, vertical 4K HDR streaming on demand.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ffebee] border border-[#ffcdd2]/60 px-3.5 py-1.5 text-xs font-bold text-[#e31c3d]">
                <Sparkles className="h-3.5 w-3.5" /> 500+ Original Dramas
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f0eae0] border border-[#ded5c6] px-3.5 py-1.5 text-xs font-semibold text-[#555]">
                <Globe className="h-3.5 w-3.5 text-[#777]" /> 4K Vertical Cinema
              </span>
            </div>

            <div className="pt-2">
              <Link
                href="/vip"
                className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-[#111] px-6 py-3.5 text-xs sm:text-sm font-bold text-white transition hover:bg-[#e31c3d] shadow-sm active:scale-95"
              >
                <Smartphone className="h-4 w-4" /> Get VIP Mobile App
              </Link>
            </div>
          </div>

          {/* Part 2: Quick Links & Experience (2 Sub-Columns Side-by-Side) */}
          <div className="grid grid-cols-2 gap-6 sm:gap-10 lg:gap-14">

            {/* Explore Sub-Column */}
            <div className="space-y-4">
              <p className="text-xs font-extrabold uppercase tracking-widest text-[#111] flex items-center gap-1.5">
                <Film className="h-3.5 w-3.5 text-[#e31c3d]" />
                Explore
              </p>
              <ul className="space-y-3 text-xs sm:text-sm text-[#666]">
                <li>
                  <Link href="/" className="hover:text-[#e31c3d] transition-colors duration-200 block py-0.5">
                    Home Premiere
                  </Link>
                </li>
                <li>
                  <Link href="/dramas" className="hover:text-[#e31c3d] transition-colors duration-200 block py-0.5">
                    All Dramas Catalog
                  </Link>
                </li>
                <li>
                  <Link href="/trending" className="hover:text-[#e31c3d] transition-colors duration-200 block py-0.5">
                    Trending Top 10
                  </Link>
                </li>
                <li>
                  <Link href="/genres" className="hover:text-[#e31c3d] transition-colors duration-200 block py-0.5">
                    Moods & Genres
                  </Link>
                </li>
              </ul>
            </div>

            {/* Experience Sub-Column */}
            <div className="space-y-4">
              <p className="text-xs font-extrabold uppercase tracking-widest text-[#111] flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5 text-[#f59e0b]" />
                Experience
              </p>
              <ul className="space-y-3 text-xs sm:text-sm text-[#666]">
                <li>
                  <Link href="/vip" className="hover:text-[#e31c3d] transition-colors duration-200 block py-0.5">
                    VIP Pass & Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/news" className="hover:text-[#e31c3d] transition-colors duration-200 block py-0.5">
                    Editorial Gazette
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="hover:text-[#e31c3d] transition-colors duration-200 block py-0.5">
                    Viewer Community
                  </Link>
                </li>
                <li>
                  <Link href="/profile" className="hover:text-[#e31c3d] transition-colors duration-200 block py-0.5">
                    My Watchlist
                  </Link>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom Bar with Responsive Gap & Borders */}
        <div className="mt-14 sm:mt-18 border-t border-[#e8e0d5] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#807a74] text-center sm:text-left">
          <p>© {new Date().getFullYear()} IndiaFX Entertainment Network. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
            <span className="flex items-center gap-1.5 font-medium">
              Made with <Heart className="h-3.5 w-3.5 fill-[#e31c3d] text-[#e31c3d]" /> for Drama Lovers
            </span>
            <span className="hidden sm:inline text-[#d0c8be]">•</span>
            <span className="flex items-center gap-1.5 font-medium">
              <Shield className="h-3.5 w-3.5 text-[#10b981]" /> 100% Secure Cinema Streaming
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}