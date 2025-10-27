import React from 'react';
import { btn } from '../theme/styles';

export default function Header({ title, rightAction }) {
  const actionButtonClassName = btn({
    variant: 'ghost',
    size: 'sm',
    className:
      'h-9 w-9 rounded-full p-0 text-text-secondary hover:!text-primary focus-visible:ring-primary/30',
  });

  return (
    <header className="flex items-center justify-between border-b border-border bg-surface px-4 py-3">
      <h1 className="m-0 text-xl font-semibold text-text-primary">{title}</h1>
      <div>
        {rightAction && (
          <button
            type="button"
            onClick={rightAction.onPress}
            className={actionButtonClassName}
            aria-label={rightAction.ariaLabel || 'Header action'}
          >
            {rightAction.icon || '⚙️'}
          </button>
        )}
      </div>
    </header>
  );
}
