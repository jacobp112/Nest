import React, { createContext, useMemo, useState, useEffect } from 'react';

// Using require to bridge the CommonJS export from the theme registry so both the
// theme generator script and the React app consume the same source of truth.
// eslint-disable-next-line global-require, import/no-commonjs
const { themes } = require('../theme/themes');

const THEME_STORAGE_KEY = 'nest-finance-theme';

const availableThemes = Object.keys(themes);

const ThemeContext = createContext({
  theme: themes.default,
  themeName: 'default',
  setThemeName: () => {},
  availableThemes,
  themes,
});

const resolveInitialTheme = () => {
  if (typeof window === 'undefined') {
    return 'default';
  }

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  const fallback = stored && themes[stored] ? stored : 'default';
  window.document.documentElement.dataset.theme = fallback;
  return fallback;
};

export const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState(resolveInitialTheme);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.document.documentElement.dataset.theme = themeName;
    window.localStorage.setItem(THEME_STORAGE_KEY, themeName);
  }, [themeName]);

  const value = useMemo(() => {
    const activeTheme = themes[themeName] || themes.default;

    return {
      theme: activeTheme,
      themeName,
      setThemeName,
      availableThemes,
      themes,
    };
  }, [themeName]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export default ThemeContext;