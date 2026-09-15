import Link from "next/link";
import { Heart, Sparkles, Shield } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-12 sm:mt-16 border-t border-[#e8e0d5] bg-[#faf8f5]/80 select-none">
      <div className="mx-auto w-full max-w-[1500px] px-4 sm:px-8 lg:px-12 py-6 sm:py-7 pb-24 sm:pb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#78726b]">

          {/* Brand & Copyright */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 sm:gap-3.5">
            <div className="scale-90 origin-left">
              <Logo />
            </div>
            <span className="hidden sm:inline text-[#d8d0c4]">•</span>
            <p className="text-[11px] sm:text-xs text-[#706a63]">
              © {new Date().getFullYear()} IndiaFX Entertainment. All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[12px] font-semibold text-[#555]">
            <Link href="/dramas" className="hover:text-[#e31c3d] transition-colors">
              Dramas
            </Link>
            <Link href="/trending" className="hover:text-[#e31c3d] transition-colors">
              Trending
            </Link>
            <Link href="/genres" className="hover:text-[#e31c3d] transition-colors">
              Genres
            </Link>
            <Link href="/vip" className="hover:text-[#e31c3d] transition-colors flex items-center gap-1 font-bold text-[#e31c3d]">
              <Sparkles className="h-3 w-3" /> VIP Pass
            </Link>
            <Link href="/community" className="hover:text-[#e31c3d] transition-colors">
              Community
            </Link>
          </div>

          {/* Quality & Trust Indicator */}
          <div className="flex items-center gap-3 text-[11px] sm:text-xs text-[#888]">
            <span className="flex items-center gap-1">
              Made with <Heart className="h-3.5 w-3.5 fill-[#e31c3d] text-[#e31c3d]" /> for Drama Lovers
            </span>
            <span className="hidden lg:inline text-[#d8d0c4]">•</span>
            <span className="hidden lg:flex items-center gap-1 text-[#10b981] font-medium">
              <Shield className="h-3.5 w-3.5" /> 4K HDR
            </span>
          </div>

        </div>
      </div>
    </footer>
  );
}
