import Link from "next/link";
import { Logo } from "./Logo";
import { Sparkles, Heart, Shield, Smartphone, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-[#ece6dc] bg-[#fbf9f6] select-none">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-14 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Logo />
            <p className="text-sm text-[#666] leading-relaxed max-w-sm">
              India&apos;s premier luxury micro-drama destination. Five-minute cinema, blockbuster emotions, vertical 4K HDR streaming.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ffebee] px-3 py-1 text-xs font-bold text-[#e31c3d]">
                <Sparkles className="h-3.5 w-3.5" /> 500+ Original Dramas
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f2ede4] px-3 py-1 text-xs font-semibold text-[#666]">
                <Globe className="h-3.5 w-3.5" /> Hindi • Tamil • Telugu • English
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <p className="text-xs font-extrabold uppercase tracking-widest text-[#111]">
              Explore
            </p>
            <ul className="space-y-2 text-sm text-[#666]">
              <li>
                <Link href="/" className="hover:text-[#e31c3d] transition-colors duration-200">Home</Link>
              </li>
              <li>
                <Link href="/dramas" className="hover:text-[#e31c3d] transition">All Dramas Catalog</Link>
              </li>
              <li>
                <Link href="/trending" className="hover:text-[#e31c3d] transition">Trending Charts</Link>
              </li>
              <li>
                <Link href="/new-releases" className="hover:text-[#e31c3d] transition">New Releases</Link>
              </li>
              <li>
                <Link href="/genres" className="hover:text-[#e31c3d] transition">Moods & Genres</Link>
              </li>
            </ul>
          </div>

          {/* Editorial & Community */}
          <div className="space-y-3">
            <p className="text-xs font-extrabold uppercase tracking-widest text-[#111]">
              Experience
            </p>
            <ul className="space-y-2 text-sm text-[#666]">
              <li>
                <Link href="/pricing" className="hover:text-[#e31c3d] transition">VIP Pass & Pricing</Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-[#e31c3d] transition">Editorial Gazette</Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-[#e31c3d] transition">Viewer Discussions</Link>
              </li>
              <li>
                <Link href="/shopping" className="hover:text-[#e31c3d] transition">Official Merch Store</Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-[#e31c3d] transition">My Profile & Watchlist</Link>
              </li>
            </ul>
          </div>

          {/* Apps & Quality */}
          <div className="space-y-3">
            <p className="text-xs font-extrabold uppercase tracking-widest text-[#111]">
              Streaming Platforms
            </p>
            <p className="text-xs text-[#777] leading-relaxed">
              Experience zero lag with our bespoke native apps on iOS, Android, and Smart TV.
            </p>
            <div className="flex flex-col gap-2 pt-1">
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#111] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#e31c3d]"
              >
                <Smartphone className="h-4 w-4" /> Download Mobile App
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-[#ece6dc] pt-6 text-xs text-[#888]">
          <p>© {new Date().getFullYear()} IndiaFX Entertainment Network. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Made with <Heart className="h-3.5 w-3.5 fill-[#e31c3d] text-[#e31c3d]" /> for Drama Lovers
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Shield className="h-3.5 w-3.5 text-[#10b981]" /> 100% Secure Cinema Streaming
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
