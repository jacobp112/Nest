// Shared Tailwind utility generators so components can stay declarative.

const cx = (...inputs) => {
  const classes = [];

  const append = (value) => {
    if (!value) return;
    if (typeof value === 'string') {
      classes.push(value);
      return;
    }
    if (Array.isArray(value)) {
      value.forEach(append);
      return;
    }
    if (typeof value === 'object') {
      Object.entries(value).forEach(([key, condition]) => {
        if (condition) {
          classes.push(key);
        }
      });
    }
  };

  inputs.forEach(append);
  return classes.join(' ').replace(/\s+/g, ' ').trim();
};

const BUTTON_BASE =
  'inline-flex items-center justify-center gap-2 font-semibold rounded-pill transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface';

const BUTTON_SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-3 text-base',
};

const BUTTON_VARIANTS = {
  primary:
    'bg-primary text-primary-content border border-transparent hover:bg-primary/90 focus-visible:ring-primary/40',
  secondary:
    'bg-surface text-primary border border-border hover:bg-surface/70 focus-visible:ring-primary/30',
  outline:
    'bg-transparent text-primary border border-border hover:bg-surface-muted/60 focus-visible:ring-primary/30',
  subtle:
    'bg-surface-muted text-text-primary border border-transparent hover:bg-surface focus-visible:ring-primary/20',
  ghost:
    'bg-transparent text-primary border border-transparent hover:bg-surface-muted/50 focus-visible:ring-primary/20',
  link:
    'bg-transparent text-primary border border-transparent underline-offset-4 hover:underline focus-visible:ring-primary/20',
};

export const btn = ({
  variant = 'primary',
  size = 'md',
  block = false,
  disabled = false,
  loading = false,
  className,
} = {}) => {
  const normalizedVariantKey = (() => {
    const key = typeof variant === 'string' ? variant.toLowerCase() : 'primary';
    if (BUTTON_VARIANTS[key]) return key;
    if (key === 'tertiary' || key === 'text') return 'link';
    if (key === 'ghost' || key === 'plain') return 'ghost';
    if (key === 'outline' || key === 'bordered') return 'outline';
    return 'primary';
  })();

  const normalizedSizeKey = (() => {
    const key = typeof size === 'string' ? size.toLowerCase() : 'md';
    if (BUTTON_SIZES[key]) return key;
    if (key === 'small') return 'sm';
    if (key === 'large') return 'lg';
    if (key === 'medium') return 'md';
    return 'md';
  })();

  const resolvedVariant = BUTTON_VARIANTS[normalizedVariantKey] || BUTTON_VARIANTS.primary;
  const resolvedSize = BUTTON_SIZES[normalizedSizeKey] || BUTTON_SIZES.md;

  return cx(
    BUTTON_BASE,
    resolvedSize,
    resolvedVariant,
    block && 'w-full',
    disabled || loading ? 'opacity-60 cursor-not-allowed pointer-events-none' : 'cursor-pointer',
    className,
  );
};

const INPUT_BASE =
  'w-full rounded-box border border-input-border bg-surface-muted px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted shadow-sm transition focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/30 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60';

const INPUT_SIZES = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3 text-base',
};

const INPUT_STATES = {
  default: '',
  success: 'border-success focus:border-success focus:ring-success/20',
  error: 'border-destructive focus:border-destructive focus:ring-destructive/20',
};

export const input = ({ size = 'md', state = 'default', className } = {}) => {
  const normalizedSize = (() => {
    const key = typeof size === 'string' ? size.toLowerCase() : 'md';
    if (INPUT_SIZES[key]) return key;
    if (key === 'small') return 'sm';
    if (key === 'large') return 'lg';
    if (key === 'medium') return 'md';
    return 'md';
  })();

  const normalizedState = (() => {
    const key = typeof state === 'string' ? state.toLowerCase() : 'default';
    if (INPUT_STATES[key]) return key;
    if (key === 'error' || key === 'danger') return 'error';
    if (key === 'success' || key === 'valid') return 'success';
    return 'default';
  })();

  return cx(
    INPUT_BASE,
    INPUT_SIZES[normalizedSize] || INPUT_SIZES.md,
    INPUT_STATES[normalizedState] || INPUT_STATES.default,
    className,
  );
};

const CARD_BASE = 'rounded-box border text-text-primary transition-colors duration-200';

const CARD_VARIANTS = {
  surface: 'bg-surface border-border shadow-soft',
  elevated: 'bg-surface-elevated/95 border-border/60 shadow-soft backdrop-blur',
  muted: 'bg-surface-muted/80 border-border/40 shadow-none',
  glass: 'bg-surface/70 border-border/40 shadow-soft backdrop-blur-lg',
};

const CARD_PADDING = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const card = ({
  variant = 'surface',
  padding = 'md',
  interactive = false,
  className,
} = {}) => {
  const normalizedVariant = (() => {
    const key = typeof variant === 'string' ? variant.toLowerCase() : 'surface';
    if (CARD_VARIANTS[key]) return key;
    if (key === 'elevated' || key === 'raised') return 'elevated';
    if (key === 'muted' || key === 'subtle') return 'muted';
    if (key === 'glass' || key === 'translucent') return 'glass';
    return 'surface';
  })();

  const normalizedPadding = (() => {
    const key = typeof padding === 'string' ? padding.toLowerCase() : 'md';
    if (CARD_PADDING[key]) return key;
    if (key === 'small') return 'sm';
    if (key === 'large') return 'lg';
    if (key === 'none' || key === 'compact') return 'none';
    return 'md';
  })();

  return cx(
    CARD_BASE,
    CARD_VARIANTS[normalizedVariant] || CARD_VARIANTS.surface,
    CARD_PADDING[normalizedPadding] || CARD_PADDING.md,
    interactive && 'transition-transform hover:-translate-y-0.5 hover:shadow-strong',
    className,
  );
};

