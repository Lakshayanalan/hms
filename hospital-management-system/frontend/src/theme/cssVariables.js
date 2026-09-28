// Mirrors theme/tokens.js onto :root as CSS custom properties, so
// styles/design-system.css's utility classes and the MUI theme
// (modernTheme.js) always agree — one source of truth, two consumers.
import { primary, neutral, error, warning, info, shadow, radius, motion, glass } from './tokens';

export function applyCssVariables() {
  const root = document.documentElement;
  const set = (name, value) => root.style.setProperty(name, value);

  Object.entries(primary).forEach(([key, value]) => set(`--color-primary-${key}`, value));

  set('--color-white', neutral.white);
  set('--color-surface', neutral.surface);
  set('--color-surface-alt', neutral.surfaceAlt);
  set('--color-border', neutral.border);
  set('--color-text-primary', neutral.textPrimary);
  set('--color-text-secondary', neutral.textSecondary);
  set('--color-text-disabled', neutral.textDisabled);

  set('--color-error-light', error.light);
  set('--color-error-main', error.main);
  set('--color-error-dark', error.dark);

  set('--color-warning-light', warning.light);
  set('--color-warning-main', warning.main);
  set('--color-warning-dark', warning.dark);

  set('--color-info-light', info.light);
  set('--color-info-main', info.main);
  set('--color-info-dark', info.dark);

  set('--shadow-xs', shadow.xs);
  set('--shadow-sm', shadow.sm);
  set('--shadow-md', shadow.md);
  set('--shadow-lg', shadow.lg);
  set('--shadow-xl', shadow.xl);

  set('--radius-sm', `${radius.sm}px`);
  set('--radius-md', `${radius.md}px`);
  set('--radius-lg', `${radius.lg}px`);
  set('--radius-xl', `${radius.xl}px`);
  set('--radius-modal', `${radius.modal}px`);
  set('--radius-full', `${radius.full}px`);

  set('--transition-fast', `${motion.duration.fast}ms ${motion.easingCss}`);
  set('--transition-base', `${motion.duration.base}ms ${motion.easingCss}`);
  set('--transition-slow', `${motion.duration.slow}ms ${motion.easingCss}`);

  set('--glass-surface', glass.surface);
  set('--glass-surface-strong', glass.surfaceStrong);
  set('--glass-border', glass.border);
  set('--glass-highlight', glass.highlight);
  set('--glass-blur', glass.blur);
}
