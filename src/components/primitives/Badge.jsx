import React from 'react';

import { cn } from '../../utils/cn';

const badgeVariants = {
  neutral: 'border-white/10 bg-slate-950/40 text-slate-200',
  emerald: 'border-emerald-400/40 bg-emerald-500/10 text-emerald-100',
  rose: 'border-rose-400/40 bg-rose-500/10 text-rose-100',
};

const Badge = React.forwardRef(({ className, variant = 'neutral', children, ...props }, ref) => {
  const variantClasses = badgeVariants[variant] || badgeVariants.neutral;

  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em]',
        variantClasses,
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';

export default Badge;
