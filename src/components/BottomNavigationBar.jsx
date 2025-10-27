import React from 'react';
import {
  CircleDollarSign,
  LayoutDashboard,
  Landmark,
  Menu,
  Target,
} from 'lucide-react';
import { btn } from '../theme/styles';

const navItems = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'budgets', label: 'Budgets', icon: CircleDollarSign },
  { key: 'goals', label: 'Goals', icon: Target },
  { key: 'accounts', label: 'Accounts', icon: Landmark },
  { key: 'reports', label: 'More', icon: Menu },
];

const BottomNavigationBar = ({ currentView = 'dashboard', onNavChange = () => {} }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-surface/90 backdrop-blur supports-[backdrop-filter]:backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-stretch gap-1 px-2 py-2 sm:gap-2 sm:py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.key;
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
              type="button"
              key={item.key}
              onClick={() => onNavChange(item.key)}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              className={buttonClassName}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span className="leading-none">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigationBar;
