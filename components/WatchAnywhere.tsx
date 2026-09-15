"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { Reveal } from "@/components/Reveal";

export function WatchAnywhere() {
  const reduced = usePrefersReducedMotion();

  return (
    <section className="mx-auto mt-14 w-full max-w-[1600px] px-4 pb-6 sm:px-8 lg:px-12 xl:px-16">
      <Reveal>
      <div className="overflow-hidden rounded-[32px] bg-[#111] px-6 py-10 text-white sm:px-10 lg:px-14">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#e8b86d]">
              Watch anywhere
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-playfair)] text-[32px] sm:text-[40px] leading-[1.05] font-semibold">
              Your favorite stories,
              <br />
              always with you.
            </h2>
            <p className="mt-4 max-w-md text-xs sm:text-sm text-white/70">
              iOS, Android, Windows — IndiaFX follows you from the metro to midnight.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold">
              {["iOS", "Android", "Windows"].map((p) => (
                <span key={p} className="rounded-full bg-white/10 px-3 py-1.5">
                  {p}
                </span>
              ))}
            </div>
            <Link
              href="/pricing"
              className="mt-8 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#111] transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(255,255,255,0.18)] active:scale-95 group"
            >
              GET THE APP →
            </Link>
          </div>

          <div className="relative mx-auto h-[220px] sm:h-[280px] w-full max-w-[520px]">
            <Device
              className="absolute left-[8%] top-8 w-[58%] rotate-[-8deg]"
              delay={0}
              reduced={reduced}
              kind="laptop"
            />
            <Device
              className="absolute right-[18%] top-0 w-[28%] rotate-[8deg]"
              delay={0.2}
              reduced={reduced}
              kind="tablet"
            />
            <Device
              className="absolute bottom-2 right-[6%] w-[18%] rotate-[4deg]"
              delay={0.35}
              reduced={reduced}
              kind="phone"
            />
          </div>
        </div>
      </div>
      </Reveal>
    </section>
  );
}

function Device({
  className,
  delay,
  reduced,
  kind,
}: {
  className: string;
  delay: number;
  reduced: boolean;
  kind: "laptop" | "tablet" | "phone";
}) {
  const frame =
    kind === "laptop"
      ? "rounded-[18px] p-2"
      : kind === "tablet"
        ? "rounded-[22px] p-1.5"
        : "rounded-[18px] p-1";

  return (
    <motion.div
      className={`${className} ${frame} bg-[#2a2a2a] shadow-[0_30px_50px_rgba(0,0,0,0.45)]`}
      animate={reduced ? undefined : { y: [0, -10, 0] }}
      transition={reduced ? undefined : { duration: 5 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <div className="overflow-hidden rounded-[12px] bg-[#f7f5f2]">
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-[10px] font-black text-[#111]">
            India<span className="logo-fx">FX</span>
          </span>
          <span className="h-1.5 w-8 rounded-full bg-[#e31c3d]" />
        </div>
        <img
          src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b4?auto=format&fit=crop&w=800&q=80"
          alt=""
          className="aspect-[16/10] w-full object-cover"
        />
      </div>
    </motion.div>
  );
}
