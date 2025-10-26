import React, { useState } from 'react';

export default function Accordion({ title, totalAmount, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-surface rounded-box shadow-sm mb-4">
      <div className="p-3 flex items-center justify-between cursor-pointer" onClick={() => setOpen((v) => !v)}>
        <div>
          <div className="text-sm font-semibold text-text-primary">{title}</div>
          {typeof totalAmount !== 'undefined' && <div className="text-xs text-text-secondary">{totalAmount}</div>}
        </div>
        <div className={`text-text-secondary transform transition-transform ${open ? 'rotate-90' : ''}`}>›</div>
      </div>
      {open && <div className="p-3 border-t border-border-default">{children}</div>}
    </div>
  );
}
