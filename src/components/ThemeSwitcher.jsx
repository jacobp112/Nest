import { useMemo } from 'react';
import { useTheme } from '../context/ThemeContext.jsx';

const THEME_LABELS = {
  default: 'Default',
  elegant: 'Elegant',
  techno: 'Techno',
  midnight: 'Midnight',
};

const THEME_PREVIEW = {
  default: {
    surface: '255 255 255',
    accent: '15 118 110',
  },
  elegant: {
    surface: '253 248 241',
    accent: '146 64 14',
  },
  techno: {
    surface: '13 17 48',
    accent: '14 165 233',
  },
  midnight: {
    surface: '16 24 54',
    accent: '99 102 241',
  },
};

const ThemeSwitcher = () => {
  const { theme, setTheme, themes } = useTheme();

  const orderedThemes = useMemo(() => themes ?? Object.keys(THEME_LABELS), [themes]);

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-semibold text-text-primary">Interface theme</p>
        <p className="text-xs text-text-muted">Preview palettes instantly and persist your choice.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {orderedThemes.map((value) => {
          const isActive = value === theme;
          const preview = THEME_PREVIEW[value] || THEME_PREVIEW.default;

          return (
            <button
              type="button"
              key={value}
              className={`flex flex-col items-start rounded-2xl border px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                isActive
                  ? 'border-primary bg-primary/10 text-text-primary shadow-sm'
                  : 'border-border bg-surface hover:border-primary/60 hover:text-text-primary'
              }`}
              onClick={() => setTheme(value)}
              aria-pressed={isActive}
            >
              <span className="text-sm font-semibold">{THEME_LABELS[value] || value}</span>
              <span className="text-xs text-text-muted capitalize">{value}</span>
              <div className="mt-3 flex gap-1.5">
                <span
                  className="h-4 w-8 rounded-full border border-border/40"
                  style={{ backgroundColor: `rgb(${preview.surface})` }}
                />
                <span
                  className="h-4 w-4 rounded-full border border-border/40"
                  style={{ backgroundColor: `rgb(${preview.accent})` }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ThemeSwitcher;
