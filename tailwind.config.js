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
        // Core semantic colors mapped to CSS variables (use rgb(var(--...) / <alpha-value>) for alpha support)
        background: withOpacity('--color-background-rgb'),
        surface: {
          DEFAULT: withOpacity('--color-surface-rgb'),
          muted: withOpacity('--color-surface-muted-rgb'),
          elevated: withOpacity('--color-surface-elevated-rgb'),
        },
        // border colors
        border: withOpacity('--color-border-rgb'),
        'border-default': withOpacity('--color-border-rgb'),
        ring: withOpacity('--color-ring-rgb'),

        // Primary / Secondary / Accent
        primary: {
          DEFAULT: withOpacity('--color-primary-rgb'),
          soft: withOpacity('--color-primary-soft-rgb'),
        },
        'primary-content': withOpacity('--color-primary-content-rgb'),
        secondary: withOpacity('--color-secondary-rgb'),
        'secondary-content': withOpacity('--color-secondary-content-rgb'),
        accent: {
          DEFAULT: withOpacity('--color-accent-rgb'),
        },
        'accent-content': withOpacity('--color-accent-content-rgb'),

        // Text shades
        text: {
          primary: withOpacity('--color-text-primary-rgb'),
          secondary: withOpacity('--color-text-secondary-rgb'),
          muted: withOpacity('--color-text-muted-rgb'),
        },

        // Semantic statuses
        success: withOpacity('--color-success-rgb'),
        warning: withOpacity('--color-warning-rgb'),
        destructive: withOpacity('--color-destructive-rgb'),
        'destructive-content': withOpacity('--color-destructive-content-rgb'),
      },
      fontFamily: {
        sans: ['var(--font-family-sans)', ...defaultTheme.fontFamily.sans],
        display: ['var(--font-family-display)', ...defaultTheme.fontFamily.sans],
      },
      borderRadius: {
        box: 'var(--border-radius-medium)',
        pill: 'var(--border-radius-pill)',
        soft: 'var(--border-radius-small)',
      },
      ringColor: {
        DEFAULT: withOpacity('--color-ring-rgb'),
      },
    },
  },
  plugins: [],
};
