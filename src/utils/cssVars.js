// Small utility to read CSS variables from the current document root.
// Returns the raw string value (e.g., '#0f766e' or 'rgb(15 118 110)')
export const getCssVar = (name, element = typeof document !== 'undefined' ? document.documentElement : null) => {
  if (!element || typeof getComputedStyle !== 'function') return '';
  const value = getComputedStyle(element).getPropertyValue(name);
  return typeof value === 'string' ? value.trim() : '';
};

// Convenience helpers for commonly used tokens
export const themeColor = (token) => getCssVar(`--color-${token}`);
export const themeRgb = (token) => getCssVar(`--color-${token}-rgb`);

