// HealthCore design tokens — single source of truth.
// Consumed by theme/modernTheme.js (MUI theme) and theme/cssVariables.js
// (which mirrors these same values onto :root as CSS custom properties for
// styles/design-system.css). Change a value here, not in either consumer.

// Primary brand scale — professional emerald/forest green, anchored at 500.
export const primary = {
  50: '#EAF6F1',
  100: '#CDEBDF',
  200: '#9DD7C0',
  300: '#6CBC9E',
  400: '#429E80',
  500: '#0E7C5A',
  600: '#0C6B4D',
  700: '#0A5A41',
  800: '#084935',
  900: '#06382A',
};

// Neutral surfaces, text, and borders — white/near-white, slate text.
export const neutral = {
  white: '#FFFFFF',
  surface: '#F7F9F8',
  surfaceAlt: '#EEF2F0',
  border: '#E2E8F0',
  textPrimary: '#1E293B',
  textSecondary: '#475569',
  textDisabled: '#94A3B8',
};

// Reserved exclusively for emergency/critical/destructive states — never decorative.
export const error = {
  light: '#FEE2E2',
  main: '#DC2626',
  dark: '#991B1B',
};

// Muted amber — non-critical caution states only (e.g. "pending"), not a brand color.
export const warning = {
  light: '#FEF3C7',
  main: '#D97706',
  dark: '#B45309',
};

// Small neutral-blue accent for purely informational states.
export const info = {
  light: '#E0F2FE',
  main: '#0284C7',
  dark: '#075985',
};

// Low-elevation, neutral (non-colored) shadow scale.
export const shadow = {
  xs: '0 1px 2px rgba(15, 23, 42, 0.04)',
  sm: '0 2px 6px rgba(15, 23, 42, 0.06)',
  md: '0 4px 12px rgba(15, 23, 42, 0.08)',
  lg: '0 8px 24px rgba(15, 23, 42, 0.10)',
  xl: '0 16px 40px rgba(15, 23, 42, 0.12)',
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  modal: 20,
  full: 9999,
};

// "Liquid glass" surface treatment — used selectively on chrome (buttons,
// sidebar/navbar, modal/dropdown backdrops, toasts), never on dense data
// surfaces like tables/lists (kept solid + soft-elevated for readability
// and scroll performance — backdrop-filter is deliberately not layered
// across large, repeatedly-scrolled areas).
export const glass = {
  surface: 'rgba(255, 255, 255, 0.18)',
  surfaceStrong: 'rgba(255, 255, 255, 0.28)',
  border: 'rgba(255, 255, 255, 0.35)',
  highlight: 'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 60%)',
  blur: 'blur(12px)',
  primaryTint: 'rgba(14, 124, 90, 0.22)',
  primaryTintBorder: 'rgba(14, 124, 90, 0.4)',
  errorTint: 'rgba(220, 38, 38, 0.18)',
  errorTintBorder: 'rgba(220, 38, 38, 0.4)',
};

// 8px-based spacing scale (matches MUI's default theme.spacing(1) = 8px).
export const spacingUnit = 8;

export const typography = {
  fontHeading: "'Outfit', 'Inter', -apple-system, sans-serif",
  fontBody: "'Inter', -apple-system, sans-serif",
};

// All authored (Framer Motion) animation durations stay at or under 300ms.
export const motion = {
  duration: {
    fast: 150,
    base: 200,
    slow: 300,
  },
  easing: [0.4, 0, 0.2, 1],
  easingCss: 'cubic-bezier(0.4, 0, 0.2, 1)',
};

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Shared appointment-status color map (previously hand-duplicated in
// PatientCalendar.js and AppointmentCalendar.js) — one source for both.
export const appointmentStatusColors = {
  REQUESTED: neutral.textDisabled,
  PENDING_APPROVAL: warning.main,
  APPROVED: info.main,
  REJECTED: error.main,
  RESCHEDULED: '#8B5CF6',
  CONFIRMED: primary[500],
  IN_PROGRESS: primary[400],
  COMPLETED: primary[700],
  CANCELLED: error.dark,
  NO_SHOW: neutral.textSecondary,
};
