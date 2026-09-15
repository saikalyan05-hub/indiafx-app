"use client";

import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { sound } from "@/lib/soundEffects";
import { Check, Crown } from "lucide-react";

const plans = [
  {
    name: "Free Pass",
    price: "₹0",
    period: "forever",
    description: "Start exploring our catalog with essential access.",
    perks: [
      "Access to first 3 episodes of all series",
      "Standard definition streaming (720p)",
      "Ad-supported viewing",
      "Mobile web streaming",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Cinema Plus",
    price: "₹149",
    period: "per month",
    description: "The complete micro drama experience with zero interruptions.",
    perks: [
      "Unlimited access to 500+ micro dramas",
      "1080p Ultra HD streaming",
      "100% Ad-free experience",
      "Offline downloads on iOS & Android",
      "2 simultaneous streams",
      "Exclusive weekly early access drops",
    ],
    cta: "Join Plus",
    popular: true,
  },
  {
    name: "Patron Family",
    price: "₹299",
    period: "per month",
    description: "For true drama collectives and family households.",
    perks: [
      "Everything in Cinema Plus",
      "Up to 5 individual profiles",
      "4K HDR on Smart TVs & Tablets",
      "Director's cuts & commentary tracks",
      "15% discount on Official Merch Store",
      "Priority invites to live drama premiere parties",
    ],
    cta: "Get Patron Plan",
    popular: false,
  },
];

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<string>("Cinema Plus");
  const [activatedPlan, setActivatedPlan] = useState<string | null>(null);

  return (
    <PageShell
      eyebrow="Memberships & Passes"
      title="Watch More. Feel More."
      subtitle="Unlock full binge access on phone, tablet, and big screen with zero interruptions."
    >
      <div className="grid gap-6 md:grid-cols-3 items-stretch">
        {plans.map((p) => {
          const isSelected = selectedPlan === p.name;
          return (
            <article
              key={p.name}
              onClick={() => {
                sound.playClick(600);
                setSelectedPlan(p.name);
              }}
              className={`relative flex flex-col justify-between rounded-[32px] p-7 transition-all duration-300 cursor-pointer ${
                p.popular
                  ? "bg-[#111] text-white shadow-[0_24px_60px_rgba(0,0,0,0.3)] ring-2 ring-[#e31c3d]"
                  : "bg-white text-[#222] shadow-[0_12px_32px_rgba(0,0,0,0.05)] border border-[#ece6dc] hover:-translate-y-1 hover:shadow-xl"
              }`}
            >
              {p.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[#e31c3d] px-4 py-1 text-[11px] font-extrabold uppercase tracking-widest text-white shadow-md">
                  Most Popular
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${
                      p.popular ? "bg-white/10 text-white" : "bg-[#ffebee] text-[#e31c3d]"
                    }`}
                  >
                    {p.name}
                  </span>
                  {p.popular && <Crown className="h-4 w-4 text-[#f59e0b]" />}
                </div>

                <div className="mt-5 flex items-baseline gap-1">
                  <span className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl font-extrabold">
                    {p.price}
                  </span>
                  <span className={`text-xs font-semibold ${p.popular ? "text-white/60" : "text-[#888]"}`}>
                    /{p.period}
                  </span>
                </div>

                <p className={`mt-3 text-xs leading-relaxed ${p.popular ? "text-white/80" : "text-[#666]"}`}>
                  {p.description}
                </p>

                <div className={`mt-6 border-t pt-5 ${p.popular ? "border-white/10" : "border-[#f0eae0]"}`}>
                  <ul className="space-y-3 text-xs font-medium">
                    {p.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-2.5">
                        <Check
                          className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${
                            p.popular ? "text-[#e31c3d]" : "text-[#10b981]"
                          }`}
                        />
                        <span className={p.popular ? "text-white/90" : "text-[#444]"}>
                          {perk}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playClick(850);
                  setSelectedPlan(p.name);
                  setActivatedPlan(p.name);
                }}
                className={`mt-8 w-full rounded-full py-3.5 text-xs font-bold transition active:scale-95 ${
                  activatedPlan === p.name
                    ? "bg-[#10b981] text-white"
                    : p.popular
                    ? "bg-[#e31c3d] text-white shadow-[0_12px_28px_rgba(227,28,61,0.4)] hover:bg-[#c91835]"
                    : "bg-[#111] text-white hover:bg-[#e31c3d]"
                }`}
              >
                {activatedPlan === p.name ? "Plan Selected" : p.cta}
              </button>
            </article>
          );
        })}
      </div>
    </PageShell>
  );
}
