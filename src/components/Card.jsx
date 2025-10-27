import React from 'react';
import { card as cardStyles } from '../theme/styles';

export default function Card({
  title,
  subtitle,
  children,
  onPress,
  variant = 'surface',
  padding = 'md',
  interactive = false,
  className,
  ...rest
}) {
  const isInteractive = Boolean(onPress) || interactive;
  const cardClassName = cardStyles({
    variant,
    padding,
    interactive: isInteractive,
    className,
  });

  const clickableProps = onPress
    ? {
        role: 'button',
        tabIndex: 0,
        onKeyDown: (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onPress(event);
          }
        },
        onClick: onPress,
      }
    : {};

  return (
    <div {...rest} {...clickableProps} className={cardClassName}>
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
