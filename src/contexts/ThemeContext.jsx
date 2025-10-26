import React, { createContext, useState, useMemo, useEffect } from 'react';
import { themes } from '../theme/theme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState('default');

  const theme = useMemo(() => themes[themeName] || themes.default, [themeName]);

  useEffect(() => {
    const root = window.document.documentElement;

    const selectedTheme = themes[themeName] || themes.default;

    // Apply colors
    Object.entries(selectedTheme.colors).forEach(([key, value]) => {
      const cssVarName = `--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(cssVarName, value);
    });

    // Apply typography
    Object.entries(selectedTheme.typography).forEach(([key, value]) => {
        const cssVarName = `--font-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        root.style.setProperty(cssVarName, value);
    });

    // Apply UI properties
    Object.entries(selectedTheme.ui).forEach(([key, value]) => {
        const cssVarName = `--ui-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        root.style.setProperty(cssVarName, value);
    });

  }, [themeName]);

  const value = {
    theme,
    themeName,
    setThemeName,
    availableThemes: Object.keys(themes),
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;