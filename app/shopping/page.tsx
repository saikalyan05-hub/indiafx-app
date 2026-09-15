"use client";

import { useEffect, useRef, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { products } from "@/lib/data";
import { sound } from "@/lib/soundEffects";
import { ShoppingBag, Check } from "lucide-react";

export default function ShoppingPage() {
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});
  const timersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach((timer) => clearTimeout(timer));
    };
  }, []);

  const handleAddToCart = (id: string) => {
    sound.playClick(800);
    setAddedItems((prev) => ({ ...prev, [id]: true }));
    if (timersRef.current[id]) clearTimeout(timersRef.current[id]);
    timersRef.current[id] = setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [id]: false }));
      delete timersRef.current[id];
    }, 2000);
  };

  return (
    <PageShell
      eyebrow="Official Merchandise"
      title="Wear the Plot Twist"
      subtitle="Exclusive physical scripts, character tees, posters, and curated keepsakes for drama enthusiasts."
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p) => {
          const isAdded = addedItems[p.id];
          return (
            <article
              key={p.id}
              className="group flex flex-col justify-between overflow-hidden rounded-[26px] bg-white p-3 shadow-[0_12px_32px_rgba(0,0,0,0.05)] border border-[#ece6dc] transition hover:-translate-y-1.5 hover:shadow-xl"
            >
              <div className="relative overflow-hidden rounded-[20px] bg-[#f7f4ee]">
                <img
                  src={p.image}
                  alt={p.title}
                  className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#111] shadow-sm">
                  Limited Edition
                </span>
              </div>
              <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="font-[family-name:var(--font-playfair)] text-lg font-bold text-[#111] leading-tight">
                    {p.title}
                  </h3>
                  <p className="mt-1.5 text-sm font-bold text-[#e31c3d]">{p.price}</p>
                </div>
                <button
                  onClick={() => handleAddToCart(p.id)}
                  className={`mt-4 flex w-full items-center justify-center gap-2 rounded-full py-3 text-xs font-bold transition active:scale-95 ${
                    isAdded
                      ? "bg-[#10b981] text-white"
                      : "bg-[#111] text-white hover:bg-[#e31c3d]"
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="h-4 w-4" /> Added to Bag
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-3.5 w-3.5" /> Add to Bag
                    </>
                  )}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </PageShell>
  );
}
