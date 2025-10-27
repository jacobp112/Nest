const fs = require('fs');
const path = require('path');

const { themes } = require('../src/theme/themes');

const OUTPUT_PATH = path.join(__dirname, '../src/theme/themes.css');
const DEFAULT_THEME_KEY = 'default';

const toKebab = (value) =>
  value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/_/g, '-')
    .toLowerCase();

const toRgbComponents = (value) => {
  if (typeof value !== 'string') {
    return null;
  }

  if (value.startsWith('#')) {
    const hex = value.slice(1);
    const normalized = hex.length === 3 ? hex.split('').map((char) => char + char).join('') : hex;

    if (normalized.length !== 6) {
      return null;
    }

    const r = parseInt(normalized.slice(0, 2), 16);
    const g = parseInt(normalized.slice(2, 4), 16);
    const b = parseInt(normalized.slice(4, 6), 16);

    if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) {
      return null;
    }

    return `${r} ${g} ${b}`;
  }

  if (value.startsWith('rgb(')) {
    const match = value.match(/rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)/i);
    if (!match) {
      return null;
    }
    return `${match[1]} ${match[2]} ${match[3]}`;
  }

  return null;
};

const ensureDefaultTheme = () => {
  if (!themes[DEFAULT_THEME_KEY]) {
    throw new Error(`Missing required '${DEFAULT_THEME_KEY}' theme.`);
  }
};

const emitSection = (lines, theme) => {
  const appendToken = (prefix, key, value) => {
    const entry = `  ${prefix}${key}: ${value};`;
    lines.push(entry);
  };

  Object.entries(theme.colors || {}).forEach(([token, value]) => {
    const kebab = toKebab(token);
    appendToken('--color-', kebab, value);

    const rgbComponents = toRgbComponents(value);
    if (rgbComponents) {
      appendToken('--color-', `${kebab}-rgb`, rgbComponents);
    }
  });

  Object.entries(theme.typography || {}).forEach(([token, value]) => {
    if (token.startsWith('fontFamily')) {
      const suffix = toKebab(token.slice('fontFamily'.length));
      appendToken('--font-family-', suffix, value);
      return;
    }

    if (token.startsWith('fontWeight')) {
      const suffix = toKebab(token.slice('fontWeight'.length));
      appendToken('--font-weight-', suffix, value);
      return;
    }

    if (token === 'baseFontSize') {
      appendToken('--font-size-', 'base', value);
      return;
    }

    if (token.startsWith('fontSize')) {
      const suffix = toKebab(token.slice('fontSize'.length));
      appendToken('--font-size-', suffix, value);
      return;
    }

    if (token.startsWith('lineHeight')) {
      const suffix = toKebab(token.slice('lineHeight'.length));
      appendToken('--line-height-', suffix, value);
      return;
    }

    if (token.startsWith('letterSpacing')) {
      const suffix = toKebab(token.slice('letterSpacing'.length));
      appendToken('--letter-spacing-', suffix, value);
      return;
    }

    appendToken('--typography-', toKebab(token), value);
  });

  Object.entries(theme.ui || {}).forEach(([token, value]) => {
    if (token.startsWith('borderRadius')) {
      const suffix = toKebab(token.slice('borderRadius'.length));
      appendToken('--border-radius-', suffix, value);
      return;
    }

    if (token.startsWith('borderWidth')) {
      const suffix = toKebab(token.slice('borderWidth'.length));
      appendToken('--border-width-', suffix, value);
      return;
    }

    appendToken('--ui-', toKebab(token), value);
  });

  Object.entries(theme.spacing || {}).forEach(([token, value]) => {
    appendToken('--space-', toKebab(token), value);
  });

  Object.entries(theme.effects || {}).forEach(([token, value]) => {
    appendToken('--effect-', toKebab(token), value);
  });
};

const buildCss = () => {
  const lines = [
    '/* This file is auto-generated via scripts/generate-themes.js. Do not edit manually. */',
    '',
  ];

  const defaultTheme = themes[DEFAULT_THEME_KEY];
  lines.push(':root {');
  emitSection(lines, defaultTheme);
  lines.push('}', '');

  Object.entries(themes).forEach(([themeKey, themeConfig]) => {
    lines.push(`[data-theme='${themeKey}'] {`);
    emitSection(lines, themeConfig);
    lines.push('}', '');
  });

  const output = lines.join('\n').replace(/\n{3,}/g, '\n\n');
  return `${output.trim()}\n`;
};

const writeCss = () => {
  ensureDefaultTheme();
  const css = buildCss();
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, css, 'utf8');
  console.log(`Generated ${path.relative(process.cwd(), OUTPUT_PATH)}`);
};

writeCss();
