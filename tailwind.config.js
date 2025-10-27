/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

const withOpacity = (variable) => ({ opacityValue }) => {
  if (opacityValue === undefined) {
    return `rgb(var(${variable}))`;
  }

  return `rgb(var(${variable}) / ${opacityValue})`;
};

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: withOpacity('--color-background-rgb'),
        surface: {
          DEFAULT: withOpacity('--color-surface-rgb'),
          muted: withOpacity('--color-surface-muted-rgb'),
          elevated: withOpacity('--color-surface-elevated-rgb'),
          subtle: withOpacity('--color-surface-subtle-rgb'),
        },
        border: withOpacity('--color-border-rgb'),
        'border-default': withOpacity('--color-border-rgb'),
        'border-muted': withOpacity('--color-border-muted-rgb'),
        'input-border': withOpacity('--color-input-border-rgb'),
        ring: withOpacity('--color-ring-rgb'),
        outline: withOpacity('--color-outline-rgb'),
        primary: {
          DEFAULT: withOpacity('--color-primary-rgb'),
          soft: withOpacity('--color-primary-soft-rgb'),
        },
        'primary-content': withOpacity('--color-primary-content-rgb'),
        'primary-soft-content': withOpacity('--color-primary-soft-content-rgb'),
        secondary: withOpacity('--color-secondary-rgb'),
        'secondary-soft': withOpacity('--color-secondary-soft-rgb'),
        'secondary-content': withOpacity('--color-secondary-content-rgb'),
        'secondary-soft-content': withOpacity('--color-secondary-soft-content-rgb'),
        accent: {
          DEFAULT: withOpacity('--color-accent-rgb'),
          soft: withOpacity('--color-accent-soft-rgb'),
        },
        'accent-content': withOpacity('--color-accent-content-rgb'),
        'accent-soft-content': withOpacity('--color-accent-soft-content-rgb'),
        text: {
          primary: withOpacity('--color-text-primary-rgb'),
          secondary: withOpacity('--color-text-secondary-rgb'),
          muted: withOpacity('--color-text-muted-rgb'),
          onDark: withOpacity('--color-text-on-dark-rgb'),
        },
        success: withOpacity('--color-success-rgb'),
        'success-soft': withOpacity('--color-success-soft-rgb'),
        'success-content': withOpacity('--color-success-content-rgb'),
        'success-soft-content': withOpacity('--color-success-soft-content-rgb'),
        warning: withOpacity('--color-warning-rgb'),
        'warning-soft': withOpacity('--color-warning-soft-rgb'),
        'warning-content': withOpacity('--color-warning-content-rgb'),
        'warning-soft-content': withOpacity('--color-warning-soft-content-rgb'),
        destructive: withOpacity('--color-destructive-rgb'),
        'destructive-soft': withOpacity('--color-destructive-soft-rgb'),
        'destructive-content': withOpacity('--color-destructive-content-rgb'),
        'destructive-soft-content': withOpacity('--color-destructive-soft-content-rgb'),
        overlay: withOpacity('--color-overlay-rgb'),
        accentGradient: withOpacity('--color-hero-bg-accent-rgb'),
      },
      fontFamily: {
        sans: ['var(--font-family-sans)', ...defaultTheme.fontFamily.sans],
        display: ['var(--font-family-display)', ...defaultTheme.fontFamily.sans],
        mono: ['var(--font-family-mono)', ...defaultTheme.fontFamily.mono],
      },
      borderRadius: {
        none: 'var(--border-radius-none)',
        soft: 'var(--border-radius-small)',
        box: 'var(--border-radius-box)',
        pill: 'var(--border-radius-pill)',
        xl: 'var(--border-radius-extra-large)',
      },
      borderWidth: {
        hairline: 'var(--border-width-hairline)',
        thick: 'var(--border-width-thick)',
      },
      ringColor: {
        DEFAULT: withOpacity('--color-ring-rgb'),
      },
      spacing: {
        none: 'var(--space-none)',
        xs: 'var(--space-xs)',
        sm: 'var(--space-sm)',
        md: 'var(--space-md)',
        lg: 'var(--space-lg)',
        xl: 'var(--space-xl)',
        '2xl': 'var(--space-2xl)',
        '3xl': 'var(--space-3xl)',
      },
      fontSize: {
        base: 'var(--font-size-base)',
        sm: 'var(--font-size-sm)',
        lg: 'var(--font-size-lg)',
        h1: 'var(--font-size-h1)',
        h2: 'var(--font-size-h2)',
        h3: 'var(--font-size-h3)',
      },
      lineHeight: {
        base: 'var(--line-height-base)',
        tight: 'var(--line-height-tight)',
        loose: 'var(--line-height-loose)',
        h1: 'var(--line-height-h1)',
      },
      letterSpacing: {
        caps: 'var(--letter-spacing-caps)',
      },
      boxShadow: {
        soft: 'var(--ui-shadow-soft)',
        strong: 'var(--ui-shadow-strong)',
        'glow-primary': 'var(--effect-glow-primary)',
        'glow-secondary': 'var(--effect-glow-secondary)',
      },
      backdropBlur: {
        glass: 'var(--ui-backdrop-blur)',
      },
    },
  },
  plugins: [],
};
