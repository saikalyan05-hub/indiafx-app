"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode, RefObject } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { duration, easeOutQuart, viewportOnce } from "@/lib/motion";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  amount?: number;
  immediate?: boolean;
}

export function Reveal({
  children,
  className,
  delay = 0,
  y = 18,
  amount,
  immediate = false,
}: RevealProps) {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  const motionProps: HTMLMotionProps<"div"> = immediate
    ? {
        initial: { opacity: 0, y },
        animate: { opacity: 1, y: 0 },
      }
    : {
        initial: { opacity: 0, y },
        whileInView: { opacity: 1, y: 0 },
        viewport: amount ? { ...viewportOnce, amount } : viewportOnce,
      };

  return (
    <motion.div
      {...motionProps}
      transition={{ duration: duration.cinematic, delay, ease: easeOutQuart }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({
  children,
  className,
  stagger = 0.07,
  delay = 0.02,
  immediate = false,
  scrollRef,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  immediate?: boolean;
  scrollRef?: RefObject<HTMLDivElement | null>;
}) {
  const reduced = usePrefersReducedMotion();
  if (reduced) return <div ref={scrollRef} className={className}>{children}</div>;

  const variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };

  if (immediate) {
    return (
      <motion.div
        ref={scrollRef}
        className={className}
        variants={variants}
        initial="hidden"
        animate="show"
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={scrollRef}
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 16, scale: 0.98 },
        show: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: duration.cinematic, ease: easeOutQuart },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
