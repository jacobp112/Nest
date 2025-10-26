import React from 'react';

export default function Header({ title, rightAction }) {
  return (
    <header className="px-4 py-3 bg-background border-b border-border-default flex items-center justify-between">
      <h1 className="m-0 text-xl font-semibold text-text-primary">{title}</h1>
      <div>
        {rightAction && (
          <button onClick={rightAction.onPress} className="p-2 rounded-md hover:bg-surface/50" aria-label="header-action">
            {rightAction.icon || '⚙️'}
          </button>
        )}
      </div>
    </header>
  );
}
