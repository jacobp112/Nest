import React, { useContext } from 'react';
import ThemeContext from '../contexts/ThemeContext';
import { Sun, Moon, Cog, Bot, ChevronDown } from 'lucide-react';
import { card, input } from '../theme/styles';

const ThemeSwitcher = () => {
  const { themeName, setThemeName, availableThemes } = useContext(ThemeContext);

  const handleThemeChange = (e) => {
    setThemeName(e.target.value);
  };

  const ThemeIcon = () => {
    const iconClass = 'h-4 w-4 text-text-secondary';
    switch (themeName) {
      case 'elegant':
        return <Bot className={iconClass} />;
      case 'techno':
        return <Cog className={iconClass} />;
      case 'midnight':
        return <Moon className={iconClass} />;
      default:
        return <Sun className={iconClass} />;
    }
  };

  const containerClassName = card({
    variant: 'muted',
    padding: 'sm',
    className: 'flex w-full items-center justify-between gap-3',
  });

  const selectClassName = input({
    size: 'sm',
    className:
      'pl-9 pr-9 appearance-none bg-transparent text-sm font-medium text-text-primary focus:ring-primary/30',
  });

  return (
    <div className={containerClassName}>
      <label htmlFor="theme-select" className="text-sm font-medium text-text-secondary">
        Theme
      </label>
      <div className="relative flex flex-1 items-center">
        <span className="pointer-events-none absolute left-3 flex h-4 w-4 items-center justify-center text-text-secondary" aria-hidden="true">
          <ThemeIcon />
        </span>
        <select
          id="theme-select"
          value={themeName}
          onChange={handleThemeChange}
          className={selectClassName}
        >
          {availableThemes.map((themeKey) => (
            <option key={themeKey} value={themeKey} className="text-text-primary bg-surface">
              {themeKey.charAt(0).toUpperCase() + themeKey.slice(1)}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-text-secondary" aria-hidden="true" />
      </div>
    </div>
  );
};

export default ThemeSwitcher;
