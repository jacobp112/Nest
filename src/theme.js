// Design system tokens for Nest Finance
export const colors = {
  primary: '#0052FF',
  secondary: '#6B7280',
  background: '#F8F9FA',
  surface: '#FFFFFF',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  semanticSuccess: '#10B981',
  semanticError: '#EF4444',
  semanticWarning: '#F59E0B',
  accent: '#0066FF',
};

export const typography = {
  fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  display: { size: 36, weight: 700 },
  h1: { size: 24, weight: 700 },
  h2: { size: 20, weight: 600 },
  h3: { size: 16, weight: 600 },
  body: { size: 16, weight: 400 },
  caption: { size: 14, weight: 400 },
  label: { size: 12, weight: 500 },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radii = {
  card: 14,
  button: 10,
  pill: 9999,
};

const theme = {
  colors,
  typography,
  spacing,
  radii,
};

export default theme;
