"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function PageShell({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-8 sm:py-10 lg:px-12 xl:px-16 select-none">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="border-b border-[#ece6dc] pb-6"
      >
        {eyebrow ? (
          <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.28em] text-[#e31c3d]">{eyebrow}</p>
        ) : null}
        <h1 className="mt-1 font-[family-name:var(--font-playfair)] text-[28px] min-[360px]:text-[34px] sm:text-[44px] lg:text-[54px] font-black tracking-tight text-[#111] leading-tight">
          {title}
        </h1>
        {subtitle ? <p className="mt-2 max-w-2xl text-xs sm:text-sm md:text-base text-[#666] leading-relaxed">{subtitle}</p> : null}
      </motion.div>
      <motion.div
        className="mt-8"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}
