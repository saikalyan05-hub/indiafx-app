"use client";

import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { sound } from "@/lib/soundEffects";
import { Bell, Sparkles, CheckCheck, Play, MessageSquare, Flame, Clock } from "lucide-react";
import Link from "next/link";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  category: "release" | "vip" | "community" | "trending";
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

const initialNotifications: NotificationItem[] = [
  {
    id: "n1",
    title: "A Second Chance • Episode 80 Finale Live",
    message: "The climactic season finale has just premiered in 4K HDR. Find out what happens to Dev and Priya.",
    time: "10m ago",
    category: "release",
    read: false,
    actionUrl: "/dramas/a-second-chance",
    actionLabel: "Watch EP 80",
  },
  {
    id: "n2",
    title: "His Revenge • New Plot Twist Drop",
    message: "Episode 3 is breaking the charts with over 150,000 live viewer comments.",
    time: "1h ago",
    category: "trending",
    read: false,
    actionUrl: "/dramas/his-revenge",
    actionLabel: "Watch Now",
  },
  {
    id: "n3",
    title: "VIP Member Perk Unlocked",
    message: "Your account has received 5 complimentary FastPass tokens for next week's exclusive premiere.",
    time: "3h ago",
    category: "vip",
    read: false,
    actionUrl: "/pricing",
    actionLabel: "Claim Tokens",
  },
  {
    id: "n4",
    title: "Trending Community Discussion",
    message: "Your comment on 'The CEO's Deal' reached 1,200 upvotes and 48 replies.",
    time: "Yesterday",
    category: "community",
    read: true,
    actionUrl: "/community",
    actionLabel: "View Thread",
  },
  {
    id: "n5",
    title: "New Series Drop: Destined for More",
    message: "A brand-new fantasy romance series is now available to stream.",
    time: "2 days ago",
    category: "release",
    read: true,
    actionUrl: "/new-releases",
    actionLabel: "Start Series",
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const markAllAsRead = () => {
    sound.playClick(600);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markItemAsRead = (id: string) => {
    sound.playClick(650);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <PageShell
      eyebrow="Activity & Alerts"
      title="Notifications"
      subtitle="Stay up to date with new episode releases, live community reactions, and VIP member perks."
    >
      <div className="flex items-center justify-between border-b border-[#ece6dc] pb-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-[#ffebee] text-[#e31c3d]">
            <Bell className="h-4 w-4" />
          </span>
          <h2 className="font-[family-name:var(--font-playfair)] text-xl sm:text-2xl font-bold text-[#111]">
            Recent Updates {unreadCount > 0 && <span className="text-sm font-bold text-[#e31c3d]">({unreadCount} unread)</span>}
          </h2>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#e31c3d] hover:text-[#b3142e] transition"
          >
            <CheckCheck className="h-4 w-4" /> Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.map((n) => {
          const categoryIcons = {
            release: <Play className="h-4 w-4 text-[#e31c3d] fill-[#e31c3d]" />,
            trending: <Flame className="h-4 w-4 text-[#f59e0b]" />,
            vip: <Sparkles className="h-4 w-4 text-[#f59e0b]" />,
            community: <MessageSquare className="h-4 w-4 text-[#3b82f6]" />,
          };

          return (
            <div
              key={n.id}
              onClick={() => markItemAsRead(n.id)}
              className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-[22px] p-4 sm:p-5 transition-all cursor-pointer border ${
                n.read
                  ? "bg-white/80 border-[#ece6dc] hover:bg-white"
                  : "bg-white border-[#e31c3d]/30 shadow-[0_8px_24px_rgba(227,28,61,0.06)] ring-1 ring-[#e31c3d]/20"
              }`}
            >
              <div className="flex items-start gap-3.5 sm:gap-4 min-w-0">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#faf7f2] border border-[#ece6dc]">
                  {categoryIcons[n.category]}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-[#111] truncate group-hover:text-[#e31c3d] transition">
                      {n.title}
                    </h3>
                    {!n.read && (
                      <span className="h-2 w-2 rounded-full bg-[#e31c3d] shrink-0" />
                    )}
                  </div>
                  <p className="mt-1 text-xs sm:text-sm text-[#666] leading-relaxed">
                    {n.message}
                  </p>
                  <p className="mt-1.5 text-[11px] font-semibold text-[#999] flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {n.time}
                  </p>
                </div>
              </div>

              {n.actionUrl && (
                <div className="shrink-0 sm:pl-4">
                  <Link
                    href={n.actionUrl}
                    onClick={() => sound.playClick(650)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#111] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#e31c3d] active:scale-95"
                  >
                    {n.actionLabel || "View"}
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}
