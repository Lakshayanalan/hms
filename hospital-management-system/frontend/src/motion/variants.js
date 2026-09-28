// Shared Framer Motion variants — the one place authored animation timing
// lives, so every page/component moves consistently. Durations/easing come
// from theme/tokens.js; everything here respects prefers-reduced-motion.
import { motion as motionTokens, prefersReducedMotion } from '../theme/tokens';

const { duration, easing } = motionTokens;
const reduced = prefersReducedMotion();

const seconds = (ms) => (reduced ? 0 : ms) / 1000;

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: seconds(duration.base), ease: easing } },
};

export const fadeSlideUp = {
  hidden: { opacity: 0, y: reduced ? 0 : 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: seconds(duration.slow), ease: easing },
  },
};

// Wrap a container with this, and each child with `staggerItem`, for a
// staggered entrance (e.g. dashboard stat cards).
export const staggerContainer = (staggerChildren = 0.08, delayChildren = 0) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: reduced ? 0 : staggerChildren,
      delayChildren: reduced ? 0 : delayChildren,
    },
  },
});

export const staggerItem = fadeSlideUp;

// Hover/press feedback for cards, nav items, buttons — pair with
// `whileHover="hover" whileTap="tap" initial="rest" variants={hoverLift}`.
export const hoverLift = {
  rest: { y: 0, scale: 1 },
  hover: {
    y: reduced ? 0 : -4,
    scale: reduced ? 1 : 1.01,
    transition: { duration: seconds(duration.fast), ease: easing },
  },
  tap: { scale: reduced ? 1 : 0.98 },
};

// Page/route transition — used by motion/PageTransition.js.
export const pageTransition = {
  initial: { opacity: 0, y: reduced ? 0 : 8 },
  animate: { opacity: 1, y: 0, transition: { duration: seconds(duration.base), ease: easing } },
  exit: { opacity: 0, transition: { duration: seconds(duration.fast), ease: easing } },
};
