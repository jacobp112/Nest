import React from 'react';
import { Loader2 } from 'lucide-react';
import { btn as buttonStyles } from '../theme/styles';

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  leftIcon,
  rightIcon,
  disabled = false,
  isLoading = false,
  className,
}) {
  const computedClassName = buttonStyles({
    variant,
    size,
    disabled: disabled || isLoading,
    loading: isLoading,
    className,
  });

  return (
    <button
      onClick={(event) => !disabled && !isLoading && onPress && onPress(event)}
      disabled={disabled || isLoading}
      className={computedClassName}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading...</span>
        </span>
      ) : (
        <>
          {leftIcon && <span className="-ml-1">{leftIcon}</span>}
          <span>{title}</span>
          {rightIcon && <span className="-mr-1">{rightIcon}</span>}
        </>
      )}
    </button>
  );
}
