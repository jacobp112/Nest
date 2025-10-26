import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Button({ title, onPress, variant = 'primary', size = 'medium', leftIcon, rightIcon, disabled = false, isLoading = false, className = '' }) {
  const sizeClasses = size === 'large' ? 'px-5 py-3 text-base' : size === 'small' ? 'px-3 py-1.5 text-sm' : 'px-4 py-2 text-sm';

  const variantClasses =
    variant === 'primary'
      ? 'bg-primary text-white hover:bg-primary/90'
      : variant === 'secondary'
      ? 'bg-surface text-primary border border-border-default hover:bg-surface/50'
      : 'bg-transparent text-primary hover:underline';

  return (
    <button
      onClick={(e) => !disabled && onPress && onPress(e)}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-md ${sizeClasses} ${variantClasses} ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
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
