import type { Transition, Variants } from "framer-motion";

/** Cinematic ease — editorial, not bouncy */
export const easeOutExpo = [0.16, 1, 0.3, 1] as const;
export const easeOutQuart = [0.22, 1, 0.36, 1] as const;
export const easeInOutSoft = [0.45, 0, 0.2, 1] as const;

export const duration = {
  fast: 0.18,
  ui: 0.32,
  standard: 0.42,
  cinematic: 0.55,
  hero: 0.7,
} as const;

export const springSoft: Transition = {
  type: "spring",
  stiffness: 380,
  damping: 32,
  mass: 0.7,
};

export const springSnappy: Transition = {
  type: "spring",
  stiffness: 520,
  damping: 28,
  mass: 0.55,
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.cinematic, ease: easeOutQuart },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: duration.standard, ease: easeOutQuart },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: duration.cinematic, ease: easeOutExpo },
  },
};

export const staggerContainer = (stagger = 0.07, delay = 0.04): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});

export const heroWord: Variants = {
  hidden: { y: "108%", opacity: 0 },
  show: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.58, ease: easeOutExpo },
  },
};

export const reducedFade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2 } },
};

export const viewportOnce = {
  once: true,
  amount: 0.22,
  margin: "0px 0px -36px 0px",
} as const;
