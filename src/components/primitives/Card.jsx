import React from 'react';

import { cn } from '../../utils/cn';

const Card = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'group/card relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/40 p-6 text-slate-100 shadow-[0_30px_120px_rgba(2,6,23,0.65)] backdrop-blur-xl transition duration-300 hover:border-white/30 hover:shadow-emerald-900/10',
      className,
    )}
    {...props}
  >
    <div className="pointer-events-none absolute inset-x-6 inset-y-8 rounded-full bg-gradient-to-r from-emerald-500/10 via-cyan-500/5 to-transparent blur-3xl opacity-0 transition duration-500 group-hover/card:opacity-100" />
    <div className="relative">{children}</div>
  </div>
));

Card.displayName = 'Card';

export default Card;
