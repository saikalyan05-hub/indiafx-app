"use client";

import { Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { searchDramas } from "@/lib/data";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

export function SearchModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [q, setQ] = useState("");
  const router = useRouter();
  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) setQ("");
  }, [open]);

  const results = useMemo(() => {
    const query = q.trim();
    if (!query) return searchDramas("").slice(0, 6);
    return searchDramas(query);
  }, [q]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-start justify-center bg-black/30 px-4 pt-24 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Search dramas"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 16, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            className="w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-[0_30px_80px_rgba(0,0,0,0.18)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-[#eee] px-5 py-4">
              <Search className="h-5 w-5 text-[#888]" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && q.trim()) {
                    e.preventDefault();
                    onClose();
                    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
                  }
                }}
                placeholder="Search dramas, actors, genres..."
                className="w-full bg-transparent text-[15px] outline-none"
              />
              <button
                onClick={onClose}
                className="focus-ring rounded-full p-1 text-[#888] hover:bg-[#f4f4f4]"
                aria-label="Close search"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[360px] overflow-y-auto p-3">
              {results.length === 0 ? (
                <p className="px-3 py-8 text-center text-sm text-[#888]">No matching dramas.</p>
              ) : (
                results.map((d) => (
                  <Link
                    key={d.id}
                    href={`/dramas/${d.id}`}
                    onClick={onClose}
                    className="flex items-center gap-3 rounded-2xl px-3 py-2.5 hover:bg-[#faf7f4] transition-transform duration-200 active:scale-[0.99]"
                  >
                    <img
                      src={d.image}
                      alt=""
                      className="h-12 w-12 rounded-xl object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div>
                      <p className="text-sm font-semibold">{d.title}</p>
                      <p className="text-xs text-[#888]">{d.genre.join(" · ")}</p>
                    </div>
                  </Link>
                ))
              )}
              {q.trim() && results.length > 0 ? (
                <Link
                  href={`/search?q=${encodeURIComponent(q.trim())}`}
                  onClick={onClose}
                  className="mt-1 flex items-center justify-center rounded-2xl px-3 py-2.5 text-xs font-bold text-[#e31c3d] hover:bg-[#faf7f4]"
                >
                  See all results for “{q.trim()}”
                </Link>
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
