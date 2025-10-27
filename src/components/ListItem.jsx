import React from 'react';
import { ChevronRight } from 'lucide-react';
import { card } from '../theme/styles';

export default function ListItem({
  leftIcon,
  title,
  subtitle,
  trailingText,
  trailingComponent,
  onPress,
  showChevron = false,
}) {
  const isInteractive = typeof onPress === 'function';

  const containerClassName = card({
    variant: 'muted',
    padding: 'none',
    className: `flex w-full items-center gap-4 px-4 py-3 text-left transition-colors ${
      isInteractive
        ? 'cursor-pointer hover:bg-surface-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30'
        : ''
    }`,
  });

  const content = (
    <>
      {leftIcon && (
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-muted text-primary" aria-hidden="true">
          {leftIcon}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-text-primary">{title}</span>
        {subtitle && <span className="mt-0.5 block truncate text-xs text-text-secondary">{subtitle}</span>}
      </span>
      {trailingText && <span className="text-sm font-medium text-text-primary">{trailingText}</span>}
      {trailingComponent}
      {showChevron && <ChevronRight className="ml-2 h-4 w-4 text-text-secondary" aria-hidden="true" />}
    </>
  );

  if (isInteractive) {
    return (
      <button type="button" onClick={onPress} className={containerClassName}>
        {content}
      </button>
    );
  }

  return <div className={containerClassName}>{content}</div>;
}
