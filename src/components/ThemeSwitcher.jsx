import React, { useContext } from 'react';
import ThemeContext from '../contexts/ThemeContext';
import { Sun, Moon, Cog, Bot } from 'lucide-react';

const ThemeSwitcher = () => {
  const { themeName, setThemeName, availableThemes } = useContext(ThemeContext);

  const handleThemeChange = (e) => {
    setThemeName(e.target.value);
  };

  const ThemeIcon = () => {
    switch (themeName) {
      case 'elegant':
        return <Bot size={16} className="text-text-secondary" />;
      case 'techno':
        return <Cog size={16} className="text-text-secondary" />;
      case 'midnight':
        return <Moon size={16} className="text-text-secondary" />;
      default:
        return <Sun size={16} className="text-text-secondary" />;
    }
  };

  return (
    <div className="flex w-full items-center justify-between">
      <label htmlFor="theme-select" className="text-sm font-medium text-text-primary">
        Theme
      </label>
      <div className="flex items-center space-x-2 rounded-lg border border-border bg-surface-muted px-3 py-1.5">
        <ThemeIcon />
        <select
          id="theme-select"
          value={themeName}
          onChange={handleThemeChange}
          className="w-full appearance-none border-none bg-transparent text-sm text-text-primary focus:outline-none focus:ring-0"
        >
          {availableThemes.map((themeKey) => (
            <option key={themeKey} value={themeKey} className="text-text-primary bg-surface">
              {themeKey.charAt(0).toUpperCase() + themeKey.slice(1)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ThemeSwitcher;
