/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

const withOpacity = (variable) => `rgb(var(${variable}) / <alpha-value>)`;

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Core semantic colors mapped to CSS variables (use rgb(var(--...) / <alpha-value>) for alpha support)
        background: withOpacity('--color-background'),
        surface: {
          DEFAULT: withOpacity('--color-surface'),
          muted: withOpacity('--color-surface-muted'),
          elevated: withOpacity('--color-surface-elevated'),
        },
        // border colors
        border: withOpacity('--color-border'),
        'border-default': withOpacity('--color-border-default'),
        ring: withOpacity('--color-ring'),

        // Primary / Secondary / Accent
        primary: {
          DEFAULT: withOpacity('--color-primary'),
          soft: withOpacity('--color-primary-soft'),
        },
        'primary-content': withOpacity('--color-primary-content'),
        secondary: withOpacity('--color-secondary'),
        'secondary-content': withOpacity('--color-secondary-content'),
        accent: {
          DEFAULT: withOpacity('--color-accent'),
        },
        'accent-content': withOpacity('--color-accent-content'),

        // Text shades
        text: {
          primary: withOpacity('--color-text-primary'),
          secondary: withOpacity('--color-text-secondary'),
          muted: withOpacity('--color-text-muted'),
        },

        // Semantic statuses
        success: withOpacity('--color-success'),
        warning: withOpacity('--color-warning'),
        destructive: withOpacity('--color-destructive'),
        'destructive-content': withOpacity('--color-destructive-content'),
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
        DEFAULT: withOpacity('--color-ring'),
      },
    },
  },
  plugins: [],
};
