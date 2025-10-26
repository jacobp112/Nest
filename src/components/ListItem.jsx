import React from 'react';

export default function ListItem({ leftIcon, title, subtitle, trailingText, trailingComponent, onPress, showChevron = false }) {
  return (
    <div
      onClick={onPress}
      role={onPress ? 'button' : undefined}
      tabIndex={onPress ? 0 : -1}
      className={`flex items-center gap-4 p-3 ${onPress ? 'cursor-pointer hover:bg-background' : ''}`}
    >
      {leftIcon && <div className="w-10 h-10 flex items-center justify-center rounded-md bg-background">{leftIcon}</div>}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-text-primary truncate">{title}</div>
        {subtitle && <div className="text-xs text-text-secondary truncate">{subtitle}</div>}
      </div>
      {trailingText && <div className="text-sm text-text-primary">{trailingText}</div>}
      {trailingComponent}
      {showChevron && <div className="text-text-secondary ml-2">›</div>}
    </div>
  );
}
