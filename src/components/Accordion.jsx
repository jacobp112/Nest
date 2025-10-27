import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { card } from '../theme/styles';

export default function Accordion({ title, totalAmount, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const containerClassName = card({ variant: 'surface', padding: 'none', className: 'mb-4 overflow-hidden' });

  return (
    <div className={containerClassName}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-surface-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        aria-expanded={open}
      >
        <div>
          <div className="text-sm font-semibold text-text-primary">{title}</div>
          {typeof totalAmount !== 'undefined' && <div className="text-xs text-text-secondary">{totalAmount}</div>}
        </div>
        <ChevronRight
          className={`h-4 w-4 text-text-secondary transition-transform ${open ? 'rotate-90' : ''}`}
          aria-hidden="true"
        />
      </button>
      {open && <div className="border-t border-border px-4 py-3 text-sm text-text-secondary">{children}</div>}
    </div>
  );
}
