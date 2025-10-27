import React from 'react';
import { Home, Wallet, BarChart3, Target } from 'lucide-react';
import { btn } from '../theme/styles';

const tabs = [
  { key: 'Dashboard', label: 'Dashboard', icon: <Home className="h-5 w-5 text-current" /> },
  { key: 'Money', label: 'Money', icon: <Wallet className="h-5 w-5 text-current" /> },
  { key: 'Insights', label: 'Insights', icon: <BarChart3 className="h-5 w-5 text-current" /> },
  { key: 'Goals', label: 'Goals', icon: <Target className="h-5 w-5 text-current" /> },
];

export default function BottomTabBar({ active = 'Dashboard', onChange = () => {} }) {
  return (
    <nav className="flex items-center justify-between gap-1 border-t border-border bg-surface/95 px-4 py-2 backdrop-blur supports-[backdrop-filter]:backdrop-blur sm:gap-2">
      {tabs.map((tab) => {
        const isActive = tab.key === active;
        const buttonClassName = btn({
          variant: 'ghost',
          size: 'sm',
          className: `flex-1 flex-col gap-1 rounded-2xl px-2 py-2 text-[11px] font-semibold transition sm:px-3 sm:py-2.5 sm:text-xs ${
            isActive
              ? 'bg-primary/15 shadow-soft !text-primary'
              : '!text-text-secondary hover:!text-primary'
          }`,
        });

        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={buttonClassName}
            aria-label={tab.label}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className="flex h-10 w-10 items-center justify-center" aria-hidden="true">
              {tab.icon}
            </span>
            <span className="leading-none">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
