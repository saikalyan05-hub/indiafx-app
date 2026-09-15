"use client";

import { Heart, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { comments } from "@/lib/data";
import Link from "next/link";
import { sound } from "@/lib/soundEffects";
import { Reveal } from "@/components/Reveal";

export function CommunitySection({ flush = false }: { flush?: boolean }) {
  return (
    <section className={flush ? "mt-2 select-none" : "mx-auto mt-14 w-full max-w-[1600px] px-4 sm:px-8 lg:px-12 xl:px-16 select-none"}>
      <Reveal>
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#ece6dc] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-[#ffebee] text-[#e31c3d]">
              <MessageSquare className="h-3.5 w-3.5 text-[#e31c3d]" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#e31c3d]">
              Live Fan Discussions
            </span>
          </div>
          <h2 className="mt-1 font-[family-name:var(--font-playfair)] text-[30px] sm:text-[34px] font-bold tracking-tight text-[#111]">
            The comments are a whole episode
          </h2>
        </div>
        {!flush && (
          <Link
            href="/community"
            onClick={() => sound.playClick(700)}
            className="text-xs font-bold text-[#e31c3d] hover:text-[#111] transition"
          >
            See all conversations <span className="fx-arrow inline-block" aria-hidden>›</span>
          </Link>
        )}
      </div>
      </Reveal>

      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {comments.map((c, i) => (
          <CommentCard key={c.id} comment={c} delay={i * 0.08} />
        ))}
      </div>
    </section>
  );
}

function CommentCard({
  comment,
  delay,
}: {
  comment: (typeof comments)[number];
  delay: number;
}) {
  const [liked, setLiked] = useState(false);
  const likes = comment.likes + (liked ? 1 : 0);

  const toggleLike = () => {
    sound.playLike();
    setLiked((v) => !v);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay, duration: 0.45 }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.99 }}
      className="rounded-[24px] bg-white p-6 shadow-[0_14px_36px_rgba(20,20,20,0.05)] border border-[#e8e2d8] flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center gap-3">
          <img
            src={comment.avatar}
            alt=""
            className="h-11 w-11 rounded-full object-cover ring-2 ring-[#ece6dc]"
          />
          <div>
            <p className="text-sm font-bold text-[#111]">{comment.user}</p>
            <p className="text-xs font-medium text-[#888]">on <span className="font-semibold text-[#555]">{comment.drama}</span></p>
          </div>
        </div>
        <p className="mt-4 text-[16px] sm:text-[17px] font-semibold tracking-tight text-[#222] leading-snug">
          "{comment.text}"
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-[#f0eae0] flex items-center justify-between">
        <button
          onClick={toggleLike}
          className={`focus-ring inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition ${
            liked ? "bg-[#ffebee] text-[#e31c3d]" : "bg-[#f7f4ee] text-[#666] hover:bg-[#ece6dc] hover:text-[#111]"
          }`}
          aria-label="Like comment"
        >
          <motion.span animate={liked ? { scale: [1, 1.4, 1] } : { scale: 1 }} transition={{ duration: 0.25 }}>
            <Heart className={`h-3.5 w-3.5 ${liked ? "fill-[#e31c3d] text-[#e31c3d]" : ""}`} />
          </motion.span>
          <span>{likes.toLocaleString()}</span>
        </button>

        <span className="text-[11px] font-semibold text-[#aaa]">Verified Viewer</span>
      </div>
    </motion.article>
  );
}
