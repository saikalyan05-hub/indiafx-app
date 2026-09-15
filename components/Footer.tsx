import Link from "next/link";
import { Logo } from "./Logo";
import { Sparkles, Heart, Shield, Smartphone, Globe, Film, Award } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 sm:mt-24 lg:mt-32 border-t border-[#e8e0d5] bg-[#faf8f5] select-none">
      <div className="mx-auto w-full max-w-[1600px] px-5 min-[400px]:px-6 sm:px-10 lg:px-14 xl:px-20 pt-12 sm:pt-16 lg:pt-20 pb-28 sm:pb-20 lg:pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.9fr_0.9fr_1.1fr] gap-10 sm:gap-10 lg:gap-12 xl:gap-16">

          {/* Brand Col */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <Logo />
            <p className="text-sm text-[#5f5953] leading-relaxed max-w-sm">
              India&apos;s premier luxury micro-drama destination. Five-minute cinema, blockbuster emotions, vertical 4K HDR streaming.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ffebee] border border-[#ffcdd2]/50 px-3 py-1 text-xs font-bold text-[#e31c3d]">
                <Sparkles className="h-3.5 w-3.5" /> 500+ Original Dramas
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f0eae0] border border-[#e2d8ca] px-3 py-1 text-xs font-semibold text-[#555]">
                <Globe className="h-3.5 w-3.5 text-[#777]" /> 4K Vertical Cinema
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <p className="text-xs font-extrabold uppercase tracking-widest text-[#111] flex items-center gap-1.5">
              <Film className="h-3.5 w-3.5 text-[#e31c3d]" />
              Explore
            </p>
            <ul className="space-y-3 text-sm text-[#666]">
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

          {/* Editorial & VIP */}
          <div className="space-y-4">
            <p className="text-xs font-extrabold uppercase tracking-widest text-[#111] flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5 text-[#f59e0b]" />
              Experience
            </p>
            <ul className="space-y-3 text-sm text-[#666]">
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

          {/* Apps & Quality */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <p className="text-xs font-extrabold uppercase tracking-widest text-[#111]">
              Streaming Apps
            </p>
            <p className="text-xs text-[#706a64] leading-relaxed max-w-sm">
              Bespoke native mobile experience with zero buffering and seamless offline sync.
            </p>
            <div className="pt-1">
              <Link
                href="/vip"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#111] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#e31c3d] shadow-sm active:scale-95"
              >
                <Smartphone className="h-4 w-4" /> Get VIP Mobile App
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Responsive Gap & Borders */}
        <div className="mt-12 sm:mt-16 border-t border-[#e8e0d5] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#807a74] text-center sm:text-left">
          <p>© {new Date().getFullYear()} IndiaFX Entertainment Network. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <span className="flex items-center gap-1.5 font-medium">
              Made with <Heart className="h-3.5 w-3.5 fill-[#e31c3d] text-[#e31c3d]" /> for Drama Lovers
            </span>
            <span className="hidden sm:inline text-[#ccc]">•</span>
            <span className="flex items-center gap-1.5 font-medium">
              <Shield className="h-3.5 w-3.5 text-[#10b981]" /> 100% Secure Cinema Streaming
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}