import { createTheme } from '@mui/material/styles';
import { primary, neutral, error, warning, info, shadow, radius, typography as typeTokens, motion, glass } from './tokens';

/**
 * HealthCore Design System — MUI Theme
 * Green/white/neutral, red reserved for critical states only.
 */

const modernTheme = createTheme({
  // ===== COLOR PALETTE =====
  palette: {
    mode: 'light',
    primary: {
      // Spreads the full 50-900 scale onto the palette so sx shorthand like
      // `bgcolor: 'primary.100'` resolves anywhere in the app, not just
      // light/main/dark.
      ...primary,
      light: primary[300],
      main: primary[500],
      dark: primary[700],
      contrastText: neutral.white,
    },
    secondary: {
      light: neutral.textSecondary,
      main: neutral.textPrimary,
      dark: primary[900],
      contrastText: neutral.white,
    },
    // Success reuses the primary green scale — green *is* success in this palette.
    success: {
      light: primary[100],
      main: primary[500],
      dark: primary[700],
      contrastText: neutral.white,
    },
    warning: {
      light: warning.light,
      main: warning.main,
      dark: warning.dark,
      contrastText: neutral.white,
    },
    // Reserved for emergency/critical/destructive states only.
    error: {
      light: error.light,
      main: error.main,
      dark: error.dark,
      contrastText: neutral.white,
    },
    info: {
      light: info.light,
      main: info.main,
      dark: info.dark,
      contrastText: neutral.white,
    },
    background: {
      default: neutral.surface,
      paper: neutral.white,
    },
    text: {
      primary: neutral.textPrimary,
      secondary: neutral.textSecondary,
      disabled: neutral.textDisabled,
    },
    divider: neutral.border,
  },

  // ===== TYPOGRAPHY =====
  typography: {
    fontFamily: typeTokens.fontBody,

    h1: {
      fontFamily: typeTokens.fontHeading,
      fontSize: '3rem',
      fontWeight: 700,
      lineHeight: 1.15,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontFamily: typeTokens.fontHeading,
      fontSize: '2.25rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontFamily: typeTokens.fontHeading,
      fontSize: '1.875rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontFamily: typeTokens.fontHeading,
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontFamily: typeTokens.fontHeading,
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontFamily: typeTokens.fontHeading,
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    subtitle1: {
      fontSize: '1.125rem',
      fontWeight: 500,
      lineHeight: 1.65,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.7,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.65,
    },
    button: {
      fontSize: '1rem',
      fontWeight: 600,
      textTransform: 'none',
    },
  },

  // ===== SHAPE =====
  shape: {
    borderRadius: radius.md,
  },

  // ===== SHADOWS (low-elevation, neutral — MUI requires exactly 25 entries) =====
  shadows: [
    'none',
    shadow.xs,
    shadow.xs,
    shadow.sm,
    shadow.sm,
    shadow.md,
    shadow.md,
    shadow.md,
    shadow.lg,
    shadow.lg,
    shadow.lg,
    shadow.lg,
    shadow.xl,
    ...Array(12).fill(shadow.xl),
  ],

  // ===== COMPONENT OVERRIDES =====
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: radius.sm,
          padding: '10px 24px',
          fontSize: '1rem',
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: 'none',
          transition: `all ${motion.duration.base}ms ${motion.easingCss}`,
          '&:hover': {
            transform: 'scale(1.02)',
          },
          '&:active': {
            transform: 'scale(0.98)',
          },
          '&.Mui-disabled': {
            opacity: 0.5,
            cursor: 'not-allowed',
            pointerEvents: 'auto',
          },
          '&.Mui-focusVisible': {
            outline: `2px solid ${primary[500]}`,
            outlineOffset: '2px',
          },
        },
        // "Liquid glass" fill for contained buttons — translucent tint,
        // blurred backdrop, soft top highlight, glass-edge border.
        contained: {
          backdropFilter: glass.blur,
          WebkitBackdropFilter: glass.blur,
          backgroundImage: glass.highlight,
          border: `1px solid ${glass.border}`,
          boxShadow: shadow.sm,
          '&:hover': {
            boxShadow: shadow.md,
            filter: 'brightness(1.05)',
          },
        },
        containedPrimary: {
          backgroundColor: glass.primaryTint,
          border: `1px solid ${glass.primaryTintBorder}`,
          color: primary[800],
          '&:hover': {
            backgroundColor: glass.primaryTint,
          },
        },
        containedError: {
          backgroundColor: glass.errorTint,
          border: `1px solid ${glass.errorTintBorder}`,
          color: error.dark,
          '&:hover': {
            backgroundColor: glass.errorTint,
          },
        },
        sizeSmall: {
          padding: '6px 16px',
          fontSize: '0.75rem',
        },
        sizeLarge: {
          padding: '12px 32px',
          fontSize: '1rem',
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: radius.md,
          border: `1px solid ${neutral.border}`,
          boxShadow: shadow.xs,
          transition: `all ${motion.duration.base}ms ${motion.easingCss}`,
          '&:hover': {
            boxShadow: shadow.md,
            transform: 'translateY(-2px)',
          },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: radius.md,
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: shadow.xs,
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: radius.md,
            transition: `all ${motion.duration.base}ms ${motion.easingCss}`,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: neutral.border,
            },
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: primary[400],
              },
            },
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: primary[500],
                borderWidth: '2px',
              },
            },
          },
        },
      },
    },

    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: radius.md,
          border: `1px solid ${neutral.border}`,
          boxShadow: 'none',
        },
      },
    },

    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: `background-color ${motion.duration.fast}ms ${motion.easingCss}`,
          '&:hover': {
            backgroundColor: primary[50],
          },
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          backgroundColor: neutral.surface,
          color: neutral.textSecondary,
          textTransform: 'uppercase',
          fontSize: '0.75rem',
          letterSpacing: '0.05em',
          borderBottom: `1px solid ${neutral.border}`,
        },
        root: {
          borderBottom: `1px solid ${neutral.border}`,
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: radius.sm,
          fontWeight: 500,
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: radius.modal,
          padding: '8px',
        },
        // Backdrop blur behind the modal, per the glass spec.
        container: {
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: shadow.xs,
          backgroundColor: glass.surfaceStrong,
          backgroundImage: glass.highlight,
          backdropFilter: glass.blur,
          WebkitBackdropFilter: glass.blur,
          borderBottom: `1px solid ${neutral.border}`,
          color: neutral.textPrimary,
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: 0,
          border: 'none',
          backgroundColor: glass.surfaceStrong,
          backdropFilter: glass.blur,
          WebkitBackdropFilter: glass.blur,
          boxShadow: shadow.sm,
        },
      },
    },

    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: radius.md,
          backgroundColor: glass.surfaceStrong,
          backdropFilter: glass.blur,
          WebkitBackdropFilter: glass.blur,
          border: `1px solid ${glass.border}`,
          boxShadow: shadow.md,
        },
      },
    },

    MuiPopover: {
      styleOverrides: {
        paper: {
          backgroundColor: glass.surfaceStrong,
          backdropFilter: glass.blur,
          WebkitBackdropFilter: glass.blur,
          border: `1px solid ${glass.border}`,
        },
      },
    },

    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: radius.md,
          fontWeight: 500,
        },
        standardSuccess: {
          backgroundColor: primary[50],
          color: primary[800],
        },
        standardError: {
          backgroundColor: error.light,
          color: error.dark,
        },
        standardWarning: {
          backgroundColor: warning.light,
          color: warning.dark,
        },
        standardInfo: {
          backgroundColor: info.light,
          color: info.dark,
        },
      },
    },

    MuiBadge: {
      styleOverrides: {
        badge: {
          fontWeight: 600,
          fontSize: '0.75rem',
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: neutral.textPrimary,
          fontSize: '0.8125rem',
          borderRadius: radius.sm,
          padding: '8px 12px',
        },
        arrow: {
          color: neutral.textPrimary,
        },
      },
    },

    MuiSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: neutral.surfaceAlt,
        },
      },
    },
  },

  // ===== BREAKPOINTS =====
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },

  // ===== TRANSITIONS (capped at 300ms) =====
  transitions: {
    duration: {
      shortest: motion.duration.fast,
      shorter: motion.duration.fast,
      short: motion.duration.base,
      standard: motion.duration.base,
      complex: motion.duration.slow,
      enteringScreen: motion.duration.base,
      leavingScreen: motion.duration.fast,
    },
    easing: {
      easeInOut: motion.easingCss,
      easeOut: motion.easingCss,
      easeIn: motion.easingCss,
      sharp: motion.easingCss,
    },
  },

  // ===== Z-INDEX =====
  zIndex: {
    mobileStepper: 1000,
    speedDial: 1050,
    appBar: 1100,
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500,
  },
});

export default modernTheme;
