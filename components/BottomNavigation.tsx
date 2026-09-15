"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clapperboard, Compass, Home, MessageCircle, UserRound } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dramas", label: "Dramas", icon: Clapperboard },
  { href: "/genres", label: "Genres", icon: Compass },
  { href: "/community", label: "Community", icon: MessageCircle },
  { href: "/profile", label: "Profile", icon: UserRound },
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-black/5 bg-white/92 px-2 py-2 backdrop-blur-xl lg:hidden pb-[max(0.5rem,env(safe-area-inset-bottom,0px))]">
      <ul className="mx-auto flex max-w-lg items-center justify-around">
        {items.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "relative flex min-w-[64px] flex-col items-center gap-1 rounded-2xl px-3 py-1.5 text-[11px] font-medium transition-transform active:scale-95",
                  active ? "text-[#e31c3d]" : "text-[#8a8680]",
                )}
              >
                {active ? (
                  <motion.span
                    layoutId="bottom-pill"
                    className="absolute inset-0 rounded-2xl bg-[#fff1f3]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                ) : null}
                <span className="relative z-10">
                  <Icon className={cn("h-[18px] w-[18px]", active && "scale-110")} />
                </span>
                <span className="relative z-10">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
