export const defaultTheme = {
  name: 'Default',
  colors: {
    primary: 'hsl(210, 80%, 50%)',
    background: 'hsl(0, 0%, 100%)',
    surface: 'hsl(0, 0%, 98%)',
    textPrimary: 'hsl(210, 10%, 20%)',
    textSecondary: 'hsl(210, 10%, 40%)',
    border: 'hsl(210, 10%, 85%)',
  },
  typography: {
    fontFamilyHeadings: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontFamilyBody: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: '16px',
    fontWeightLight: '300',
    fontWeightRegular: '400',
    fontWeightBold: '700',
    letterSpacingHeadings: 'normal',
  },
  ui: {
    borderRadius: '8px',
    shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    spacing: '1rem',
  },
};

export const elegantTheme = {
  name: 'Elegant',
  colors: {
    primary: 'hsl(210, 40%, 35%)', // Navy Blue
    background: 'hsl(30, 20%, 96%)', // Ivory
    surface: 'hsl(0, 0%, 100%)',
    textPrimary: 'hsl(210, 20%, 15%)',
    textSecondary: 'hsl(210, 15%, 35%)',
    border: 'hsl(210, 15%, 88%)',
  },
  typography: {
    fontFamilyHeadings: "'Merriweather', serif",
    fontFamilyBody: "'Lato', sans-serif",
    fontSize: '17px',
    fontWeightLight: '300',
    fontWeightRegular: '400',
    fontWeightBold: '700',
    letterSpacingHeadings: '0.025em',
  },
  ui: {
    borderRadius: '4px',
    shadow: '0 2px 4px rgba(0,0,0,0.08)',
    spacing: '1.2rem',
  },
};

export const technoTheme = {
  name: 'Techno',
  colors: {
    primary: 'hsl(180, 100%, 50%)', // Electric Blue/Cyan
    background: 'hsl(220, 25%, 10%)',
    surface: 'hsl(220, 25%, 15%)',
    textPrimary: 'hsl(180, 100%, 95%)',
    textSecondary: 'hsl(180, 20%, 70%)',
    border: 'hsl(220, 25%, 30%)',
  },
  typography: {
    fontFamilyHeadings: "'Poppins', sans-serif",
    fontFamilyBody: "'Inter', sans-serif",
    fontSize: '15px',
    fontWeightLight: '400',
    fontWeightRegular: '500',
    fontWeightBold: '600',
    letterSpacingHeadings: '0.05em',
  },
  ui: {
    borderRadius: '0px',
    shadow: 'none', // Use glows on elements instead
    spacing: '0.9rem',
  },
};

export const midnightTheme = {
  name: 'Midnight',
  colors: {
    primary: 'hsl(270, 50%, 70%)', // Soft Lavender
    background: 'hsl(225, 10%, 8%)', // #121212
    surface: 'hsl(225, 10%, 12%)', // #1E1E1E
    textPrimary: 'hsl(225, 10%, 90%)',
    textSecondary: 'hsl(225, 10%, 60%)',
    border: 'hsl(225, 10%, 22%)',
  },
  typography: {
    fontFamilyHeadings: "'Inter', sans-serif",
    fontFamilyBody: "'Inter', sans-serif",
    fontSize: '16px',
    fontWeightLight: '300',
    fontWeightRegular: '400',
    fontWeightBold: '600',
    letterSpacingHeadings: 'normal',
  },
  ui: {
    borderRadius: '12px',
    shadow: 'none', // Use surface elevation and glows
    spacing: '1rem',
  },
};

export const themes = {
  default: defaultTheme,
  elegant: elegantTheme,
  techno: technoTheme,
  midnight: midnightTheme,
};
