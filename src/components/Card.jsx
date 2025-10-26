import React from 'react';

export default function Card({ title, subtitle, children, onPress, className = '' }) {
  const clickableProps = onPress
    ? { role: 'button', tabIndex: 0, onKeyDown: (e) => (e.key === 'Enter' || e.key === ' ') && onPress(), onClick: onPress }
    : {};

  return (
    <div
      {...clickableProps}
      className={`bg-surface border border-border-default rounded-box shadow-sm p-4 ${onPress ? 'hover:scale-[0.995] active:scale-95 transition-transform cursor-pointer' : ''} ${className}`}
    >
      {(title || subtitle) && (
        <div className="mb-3">
          {title && <div className="text-lg font-semibold text-text-primary">{title}</div>}
          {subtitle && <div className="text-sm text-text-secondary">{subtitle}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}
