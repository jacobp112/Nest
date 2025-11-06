import React, { createContext, useMemo, useState, useEffect, useContext, useCallback } from 'react';

// Using require to bridge the CommonJS export from the theme registry so both the
// theme generator script and the React app consume the same source of truth.
// eslint-disable-next-line global-require, import/no-commonjs
const { themes } = require('../theme/themes');

const THEME_STORAGE_KEY = 'nest-finance-theme';

// Supported theme selections. "system" follows the OS preference.
const availableThemes = ['default', 'midnight', 'system'];

export const THEME_OPTIONS = availableThemes;

const ThemeContext = createContext({
  theme: themes.default,
  themeName: 'default',
  resolvedThemeName: 'default',
  setThemeName: () => {},
  availableThemes,
  themes,
  themeTokens: themes.default,
  themeColors: themes.default.colors,
  setTheme: () => {},
});

const getSystemThemeName = () => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return 'default';
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'midnight' : 'default';
  } catch (_) {
    return 'default';
  }
};

const resolveInitialTheme = () => {
  if (typeof window === 'undefined') {
    return 'default';
  }

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);

  // Default to following system if nothing stored or stored value invalid
  const preferred = availableThemes.includes(stored) ? stored : 'system';

  const toApply = preferred === 'system' ? getSystemThemeName() : preferred;
  window.document.documentElement.dataset.theme = toApply;
  return preferred;
};

export const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState(resolveInitialTheme);
  const [prefersDark, setPrefersDark] = useState(() => (typeof window !== 'undefined' ? getSystemThemeName() === 'midnight' : false));

  const setThemeSafely = useCallback(
    (nextTheme) => {
      setThemeName(availableThemes.includes(nextTheme) ? nextTheme : 'default');
    },
    [setThemeName],
  );

  // Keep track of OS theme preference and react to changes when in "system" mode
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event) => setPrefersDark(Boolean(event.matches));
    // Some browsers use addEventListener, some use addListener
    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', handleChange);
    } else if (typeof media.addListener === 'function') {
      media.addListener(handleChange);
    }
    return () => {
      if (typeof media.removeEventListener === 'function') {
        media.removeEventListener('change', handleChange);
      } else if (typeof media.removeListener === 'function') {
        media.removeListener(handleChange);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const normalized = availableThemes.includes(themeName) ? themeName : 'system';
    const resolved = normalized === 'system' ? (prefersDark ? 'midnight' : 'default') : normalized;

    window.document.documentElement.dataset.theme = resolved;
    window.localStorage.setItem(THEME_STORAGE_KEY, normalized);
  }, [themeName, prefersDark]);

  const value = useMemo(() => {
    const normalizedThemeName = availableThemes.includes(themeName) ? themeName : 'system';
    const resolvedThemeName = normalizedThemeName === 'system' ? (prefersDark ? 'midnight' : 'default') : normalizedThemeName;
    const activeTheme = themes[resolvedThemeName] || themes.default;

    return {
      theme: activeTheme,
      themeName: normalizedThemeName,
      resolvedThemeName,
      setThemeName: setThemeSafely,
      availableThemes,
      themes,
      themeTokens: activeTheme,
      themeColors: activeTheme.colors || themes.default.colors,
      setTheme: setThemeSafely,
    };
  }, [themeName, prefersDark, setThemeSafely]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};

export default ThemeContext;
