// Duration tokens (seconds)
export const duration = {
  fast: 0.25,
  normal: 0.4,
  slow: 0.7,
  slower: 0.9,
  slowest: 1.1,
} as const;

// Custom easing matching the HTML mockups' cubic-bezier(.16,1,.3,1)
export const easing = {
  smooth: [0.16, 1, 0.3, 1] as const,
  spring: [0.34, 1.56, 0.64, 1] as const,
  out: [0.0, 0.0, 0.2, 1] as const,
  in: [0.4, 0.0, 1, 0.5] as const,
} as const;

// Default transition
export const smoothTransition = {
  duration: duration.slow,
  ease: easing.smooth,
};

// ═══ ANIMATION VARIANTS ═══

export const slideUpBlur = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: easing.smooth },
  },
};

export const heroFade = {
  hidden: { opacity: 0, y: 50, filter: "blur(12px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: easing.smooth },
  },
};

export const cardPop = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.6, ease: easing.smooth },
  },
};

export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easing.smooth },
  },
};

export const rowIn = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: easing.smooth },
  },
};

export const modalIn = {
  hidden: { opacity: 0, scale: 0.95, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: easing.smooth },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 8,
    transition: { duration: 0.2, ease: easing.in },
  },
};

export const phonePop = {
  hidden: {
    opacity: 0,
    rotateY: -15,
    x: 40,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    rotateY: 0,
    x: 0,
    scale: 1,
    transition: { duration: 1.1, delay: 0.5, ease: easing.smooth },
  },
};

export const resultIn = {
  hidden: { opacity: 0, y: 12, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: easing.smooth },
  },
};

// Stagger containers
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0,
    },
  },
};

export function stagger(delayOffset = 0, staggerDelay = 0.06) {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delayOffset,
      },
    },
  };
}

// Sidebar
export const sidebarVariants = {
  expanded: { width: 240 },
  collapsed: { width: 72 },
};

// Page-level section stagger
export const pageStagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

// Overlay backdrop
export const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

// ═══ LANDING PAGE VARIANTS ═══

export const fadeUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: easing.smooth, delay },
  }),
};

export const fadeScaleVariants = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: easing.smooth, delay },
  }),
};

export const VIEWPORT_ONCE = { once: true, margin: "0px 0px -50px 0px" } as const;

// ═══ ONBOARDING STEP VARIANTS ═══

// SVG path draw-on animation
export const drawOn = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 1.2, ease: easing.smooth },
  },
};

// SVG arc/segment scale-in
export const arcIn = {
  hidden: { scale: 0, opacity: 0 },
  visible: (delay: number = 0) => ({
    scale: 1,
    opacity: 1,
    transition: { duration: 0.6, ease: easing.smooth, delay },
  }),
};

export const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0,
    scale: 0.97,
    filter: "blur(6px)",
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: easing.smooth },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -50 : 50,
    opacity: 0,
    scale: 0.97,
    filter: "blur(6px)",
    transition: { duration: 0.4, ease: easing.in },
  }),
};
