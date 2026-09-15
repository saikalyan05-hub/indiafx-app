"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Bookmark, Menu, Search, Sparkles, X, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";
import { sound } from "@/lib/soundEffects";

const SearchModal = dynamic(
  () => import("./SearchModal").then((mod) => mod.SearchModal),
  { ssr: false }
);

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/dramas", label: "Dramas" },
  { href: "/trending", label: "Trending" },
  { href: "/new-releases", label: "New Releases" },
  { href: "/genres", label: "Genres" },
];

const secondaryLinks = [
  { href: "/shopping", label: "Store" },
  { href: "/news", label: "Editorial" },
  { href: "/vip", label: "VIP Pass" },
  { href: "/community", label: "Community" },
];

export function Navbar() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const notesRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMenuOpen(false);
    setNotesOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
        setNotesOpen(false);
        setMenuOpen(false);
      }
      if (e.key === "Escape") {
        setNotesOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!notesOpen && !menuOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (notesOpen && notesRef.current && !notesRef.current.contains(target)) {
        setNotesOpen(false);
      }
      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(target) &&
        !hamburgerRef.current?.contains(target)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [notesOpen, menuOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#f7f5f2]/92 backdrop-blur-xl border-b border-[#ece6dc]/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all">
        <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-2 min-[360px]:gap-3 px-3 min-[360px]:px-4 py-2.5 sm:py-3.5 sm:px-8 lg:px-12 xl:px-16">

          {/* Brand Logo & Desktop Nav */}
          <div className="flex items-center gap-4 lg:gap-12 shrink-0">
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            >
              <Logo />
            </motion.div>

            <nav className="hidden items-center gap-6 md:flex lg:gap-8">
              {navLinks.map((link, i) => {
                const isHome = link.href === "/";
                const isExact = pathname === link.href;
                const isSubpath = link.href !== "/" && pathname.startsWith(link.href);
                const active = (isHome && pathname === "/") || isExact || isSubpath;

                return (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.38, delay: 0.08 + i * 0.045, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => sound.playClick(650)}
                      className={cn(
                        "group relative py-1 text-[14px] lg:text-[15px] font-semibold tracking-wide transition-colors",
                        active
                          ? "text-[#111] font-bold"
                          : "text-[#666] hover:text-[#111]"
                      )}
                    >
                      {link.label}
                      <span
                        className={cn(
                          "pointer-events-none absolute inset-x-0 -bottom-1 h-[2px] origin-left rounded-full bg-[#e31c3d]/40 transition-transform duration-300",
                          active ? "scale-x-0" : "scale-x-0 group-hover:scale-x-100"
                        )}
                      />
                      {active && (
                        <motion.span
                          layoutId="nav-active-indicator"
                          className="absolute inset-x-0 -bottom-1 h-[2.5px] rounded-full bg-[#e31c3d]"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>
          </div>

          {/* Center Search Input Trigger (Mobile & Desktop) */}
          <button
            onClick={() => {
              sound.playClick(700);
              setSearchOpen(true);
            }}
            className="fx-search focus-ring flex h-8 min-[360px]:h-9 sm:h-10 flex-1 max-w-[340px] items-center gap-2 rounded-full bg-white px-2.5 min-[360px]:px-3.5 sm:px-4 text-left text-[11px] min-[360px]:text-xs sm:text-sm text-[#8a857f] shadow-[0_2px_8px_rgba(0,0,0,0.04)] ring-1 ring-black/10 hover:ring-[#e31c3d]/35 mx-1 sm:mx-4"
            aria-label="Search 500+ micro dramas..."
          >
            <Search className="h-3.5 w-3.5 text-[#555] shrink-0" />
            <span className="truncate">Search 500+ micro dramas...</span>
            <kbd className="ml-auto hidden rounded bg-[#f4eee6] px-1.5 py-0.5 text-[10px] font-bold text-[#777] xl:inline-block">
              ⌘K
            </kbd>
          </button>

          {/* Right Utilities: Watchlist, Notifications, VIP, Profile, Menu */}
          <div className="flex items-center gap-1.5 min-[360px]:gap-2 sm:gap-3.5 shrink-0">

            {/* Watchlist Quick Link (Desktop & Tablet) */}
            <Link
              href="/watchlist"
              onClick={() => sound.playClick(600)}
              className={cn(
                "focus-ring hidden sm:grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-full shadow-sm ring-1 transition",
                pathname === "/watchlist"
                  ? "bg-[#e31c3d] text-white ring-[#e31c3d]"
                  : "bg-white text-[#222] ring-black/10 hover:bg-[#fcfaf7] hover:text-[#e31c3d]"
              )}
              title="Your Watchlist"
              aria-label="Watchlist"
            >
              <Bookmark className="h-4 w-4" />
            </Link>

            {/* Notifications Circular Button with Red Badge */}
            <div className="relative" ref={notesRef}>
              <button
                onClick={() => {
                  sound.playClick(650);
                  setNotesOpen((v) => !v);
                }}
                className={cn(
                  "focus-ring relative grid h-8 w-8 min-[360px]:h-9 min-[360px]:w-9 sm:h-10 sm:w-10 place-items-center rounded-full shadow-sm ring-1 transition",
                  pathname === "/notifications"
                    ? "bg-[#e31c3d] text-white ring-[#e31c3d]"
                    : "bg-white text-[#222] ring-black/10 hover:bg-[#fcfaf7]"
                )}
                aria-label="Notifications"
              >
                <Bell className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="fx-notify-dot absolute right-1.5 top-1.5 sm:right-2 sm:top-2 h-2 w-2 rounded-full bg-[#e31c3d] ring-2 ring-white" />
              </button>

              <AnimatePresence>
                {notesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-80 rounded-2xl bg-white p-4 shadow-[0_20px_50px_rgba(0,0,0,0.14)] ring-1 ring-black/10 z-50"
                  >
                    <div className="flex items-center justify-between border-b border-[#f0eae0] pb-2.5">
                      <p className="text-xs font-bold uppercase tracking-wider text-[#e31c3d] flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5" /> What&apos;s New Tonight
                      </p>
                      <Link
                        href="/notifications"
                        onClick={() => setNotesOpen(false)}
                        className="text-[10px] font-bold text-[#e31c3d] hover:underline"
                      >
                        See All
                      </Link>
                    </div>
                    <div className="mt-2.5 space-y-2">
                      <Link
                        href="/new-releases"
                        onClick={() => setNotesOpen(false)}
                        className="block rounded-xl p-2.5 text-xs text-[#222] hover:bg-[#faf7f3] transition border border-transparent hover:border-[#ece6dc]"
                      >
                        <p className="font-bold text-[#111]">A Second Chance • Finale</p>
                        <p className="mt-0.5 text-[#666]">Episode 80 is now live in 4K HDR.</p>
                      </Link>
                      <Link
                        href="/trending"
                        onClick={() => setNotesOpen(false)}
                        className="block rounded-xl p-2.5 text-xs text-[#222] hover:bg-[#faf7f3] transition border border-transparent hover:border-[#ece6dc]"
                      >
                        <p className="font-bold text-[#111]">His Revenge • New Drop</p>
                        <p className="mt-0.5 text-[#666]">Episode 3 just dropped a massive plot twist.</p>
                      </Link>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-[#f0eae0] text-center">
                      <Link
                        href="/notifications"
                        onClick={() => setNotesOpen(false)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#111] hover:text-[#e31c3d] transition"
                      >
                        <span>View Notifications Center</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* VIP Pass Badge / Button */}
            <Link
              href="/vip"
              onClick={() => sound.playClick(800)}
              className={cn(
                "focus-ring hidden md:inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold shadow-sm hover:scale-105 active:scale-95 transition-all",
                pathname === "/vip" || pathname === "/pricing"
                  ? "bg-[#e31c3d] text-white"
                  : "bg-[#111] text-white hover:bg-[#e31c3d]"
              )}
            >
              <Sparkles className="h-3 w-3 text-[#f59e0b]" />
              <span>VIP Pass</span>
            </Link>

            {/* User Profile Avatar */}
            <Link
              href="/profile"
              onClick={() => sound.playClick(600)}
              className={cn(
                "focus-ring hidden sm:block overflow-hidden rounded-full ring-2 transition-all shadow-sm",
                pathname === "/profile"
                  ? "ring-[#e31c3d]"
                  : "ring-[#ffebee] hover:ring-[#e31c3d]"
              )}
              aria-label="Profile"
            >
              <img
                src="/assets/avatar.png"
                alt="Profile"
                className="h-10 w-10 object-cover"
              />
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              ref={hamburgerRef}
              onClick={() => {
                sound.playClick(550);
                setMenuOpen((v) => !v);
              }}
              className="focus-ring grid h-10 w-10 place-items-center rounded-full bg-white text-[#222] shadow-sm ring-1 ring-black/5 md:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              key="menu-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-30 bg-black/20 backdrop-blur-[2px] md:hidden"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, y: -14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-x-0 top-[64px] z-40 mx-4 rounded-3xl bg-white p-5 shadow-[0_24px_60px_rgba(0,0,0,0.15)] ring-1 ring-black/10 sm:mx-auto sm:max-w-lg md:hidden max-h-[85vh] overflow-y-auto"
            >
            <div className="grid gap-1.5">
              <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#888]">
                Navigation
              </p>
              {[
                ...navLinks,
                { href: "/watchlist", label: "My Watchlist" },
                { href: "/notifications", label: "Notifications" },
                { href: "/search", label: "Search Catalog" },
                ...secondaryLinks,
                { href: "/profile", label: "My Profile" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.24, delay: 0.04 + i * 0.03, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={item.href}
                    onClick={() => {
                      sound.playClick(600);
                      setMenuOpen(false);
                    }}
                    className={cn(
                      "block rounded-2xl px-4 py-2.5 text-sm font-semibold transition active:scale-[0.99]",
                      pathname === item.href
                        ? "bg-[#ffebee] text-[#e31c3d] font-bold"
                        : "text-[#222] hover:bg-[#faf7f4] hover:text-[#e31c3d]"
                    )}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <div className="mt-2 pt-2 border-t border-[#f0eae0]">
                <Link
                  href="/vip"
                  onClick={() => {
                    sound.playClick(800);
                    setMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 w-full rounded-full bg-[#e31c3d] px-4 py-3 text-center text-sm font-bold text-white shadow-md"
                >
                  <Sparkles className="h-4 w-4" /> Get IndiaFX VIP Pass
                </Link>
              </div>
            </div>
          </motion.div>
          </>
        )}
      </AnimatePresence>

      {searchOpen && (
        <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      )}
    </>
  );
}
