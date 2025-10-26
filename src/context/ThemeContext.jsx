import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const DEFAULT_THEME = 'default';
export const THEME_OPTIONS = ['default', 'elegant', 'techno', 'midnight'];

const ThemeContext = createContext(null);

const ensureValidTheme = (candidate) =>
  THEME_OPTIONS.includes(candidate) ? candidate : DEFAULT_THEME;

const getStoredTheme = () => {
  if (typeof window === 'undefined') {
    return DEFAULT_THEME;
  }

  try {
    const stored = window.localStorage.getItem('theme');
    return ensureValidTheme(stored);
  } catch (_error) {
    return DEFAULT_THEME;
  }
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getStoredTheme);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    document.documentElement.setAttribute('data-theme', theme);

    try {
      window.localStorage.setItem('theme', theme);
    } catch (error) {
      console.warn('Unable to persist theme preference', error);
    }
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      themes: THEME_OPTIONS,
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};
