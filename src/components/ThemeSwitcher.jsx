import React, { useMemo } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { btn } from '../theme/styles';
import { useTheme } from '../contexts/ThemeContext';

const ThemeSwitcher = () => {
  const { themeName, resolvedThemeName, setThemeName } = useTheme();

  const options = useMemo(
    () => [
      { key: 'system', label: 'System', Icon: Monitor },
      { key: 'default', label: 'Day', Icon: Sun },
      { key: 'midnight', label: 'Night', Icon: Moon },
    ],
    [],
  );

  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Theme selection">
      {options.map(({ key, label, Icon }) => {
        const isActive = themeName === key || (key !== 'system' && themeName === 'system' && resolvedThemeName === key);
        const className = btn({
          variant: 'ghost',
          size: 'sm',
          className: `flex items-center gap-2 text-sm ${isActive ? 'bg-surface-muted text-text-primary border border-border' : 'text-text-secondary'}`,
        });
        return (
          <button
            key={key}
            type="button"
            onClick={() => setThemeName(key)}
            aria-pressed={isActive}
            className={className}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ThemeSwitcher;
