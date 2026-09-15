"use client";

import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { sound } from "@/lib/soundEffects";
import { Check, Sparkles, Crown } from "lucide-react";
import Link from "next/link";

const vipTiers = [
  {
    name: "VIP Monthly Pass",
    price: "₹149",
    period: "per month",
    tagline: "Unlimited streaming & ad-free immersion.",
    badge: "Popular Choice",
    perks: [
      "Immediate access to all 500+ micro dramas",
      "100% Ad-Free uninterrupted playback",
      "Full 1080p Ultra HD streaming",
      "Offline downloads on iOS & Android",
      "Weekly Early Access episode drops",
    ],
  },
  {
    name: "VIP Annual Premiere Pass",
    price: "₹1,199",
    period: "per year (Save 33%)",
    tagline: "The definitive collector experience with exclusive benefits.",
    badge: "Best Value",
    perks: [
      "Everything in VIP Monthly Pass",
      "4K HDR Ultra Cinema streaming",
      "5 Simultaneous streams across all family devices",
      "Exclusive Director's Cut episodes & bloopers",
      "15% Off all official merchandise in store",
      "VIP FastPass badge on community forums",
    ],
  },
];

export default function VIPPage() {
  const [selectedTier, setSelectedTier] = useState<string>("VIP Monthly Pass");

  return (
    <PageShell
      eyebrow="Exclusive Membership"
      title="IndiaFX VIP Pass"
      subtitle="Unlock every twist, every finale, and every romance in uncompressed 4K HDR with zero ads."
    >
      {/* VIP Hero Showcase */}
      <div className="mb-10 overflow-hidden rounded-[32px] bg-gradient-to-br from-[#1c1917] via-[#111111] to-[#261014] p-6 sm:p-10 text-white shadow-[0_24px_70px_rgba(227,28,61,0.22)] border border-[#38262b] relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f59e0b] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-black shadow-md">
              <Crown className="h-3.5 w-3.5 fill-black" /> VIP Privilege
            </span>
            <h2 className="mt-4 font-[family-name:var(--font-playfair)] text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Watch The Entire Story Without Waiting
            </h2>
            <p className="mt-3 text-sm sm:text-base text-white/80 leading-relaxed">
              No coin barriers, no cooldown timers, no commercial interruptions. Just pure, binge-worthy 5-minute drama episodes whenever inspiration strikes.
            </p>
          </div>
          <div className="shrink-0 flex flex-col items-center justify-center p-6 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 text-center">
            <span className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl font-black text-[#f59e0b]">
              ₹149
            </span>
            <span className="text-xs font-semibold text-white/70 mt-1">Starting monthly</span>
            <Link
              href="/pricing"
              onClick={() => sound.playClick(850)}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-[#e31c3d] px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-lg hover:bg-[#c41230] transition active:scale-95"
            >
              <Sparkles className="h-4 w-4" /> Get VIP Access
            </Link>
          </div>
        </div>
      </div>

      {/* Tier Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {vipTiers.map((tier) => {
          const isSelected = selectedTier === tier.name;
          return (
            <div
              key={tier.name}
              onClick={() => {
                sound.playClick(650);
                setSelectedTier(tier.name);
              }}
              className={`relative flex flex-col justify-between rounded-[32px] p-6 sm:p-8 transition-all duration-300 cursor-pointer ${
                isSelected
                  ? "bg-[#111] text-white shadow-[0_24px_60px_rgba(0,0,0,0.3)] ring-2 ring-[#e31c3d]"
                  : "bg-white text-[#222] shadow-[0_12px_32px_rgba(0,0,0,0.05)] border border-[#ece6dc] hover:-translate-y-1 hover:shadow-xl"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${
                      isSelected ? "bg-[#e31c3d] text-white" : "bg-[#ffebee] text-[#e31c3d]"
                    }`}
                  >
                    {tier.badge}
                  </span>
                  <Crown className={`h-5 w-5 ${isSelected ? "text-[#f59e0b]" : "text-[#888]"}`} />
                </div>

                <h3 className="mt-4 font-[family-name:var(--font-playfair)] text-2xl font-bold">
                  {tier.name}
                </h3>
                <p className={`mt-1 text-xs ${isSelected ? "text-white/70" : "text-[#777]"}`}>
                  {tier.tagline}
                </p>

                <div className="mt-5 flex items-baseline gap-1.5">
                  <span className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl font-extrabold">
                    {tier.price}
                  </span>
                  <span className={`text-xs font-semibold ${isSelected ? "text-white/60" : "text-[#888]"}`}>
                    {tier.period}
                  </span>
                </div>

                <div className={`mt-6 border-t pt-5 ${isSelected ? "border-white/10" : "border-[#f0eae0]"}`}>
                  <ul className="space-y-3 text-xs font-medium">
                    {tier.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-2.5">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#e31c3d]" />
                        <span className={isSelected ? "text-white/90" : "text-[#444]"}>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Link
                href="/pricing"
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playClick(850);
                }}
                className={`mt-8 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-xs sm:text-sm font-bold transition active:scale-95 ${
                  isSelected
                    ? "bg-[#e31c3d] text-white shadow-[0_12px_28px_rgba(227,28,61,0.4)] hover:bg-[#c91835]"
                    : "bg-[#111] text-white hover:bg-[#e31c3d]"
                }`}
              >
                <Sparkles className="h-4 w-4" /> Activate {tier.name}
              </Link>
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}
