import React from 'react';
import { useTheme } from '../context/ThemeContext.jsx';
import {
  CircleDollarSign,
  LayoutDashboard,
  Landmark,
  Menu,
  Target,
} from 'lucide-react';

const navItems = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'budgets', label: 'Budgets', icon: CircleDollarSign },
  { key: 'goals', label: 'Goals', icon: Target },
  { key: 'accounts', label: 'Accounts', icon: Landmark },
  { key: 'reports', label: 'More', icon: Menu },
];

const BottomNavigationBar = ({ currentView = 'dashboard', onNavChange = () => {} }) => {
  const { theme } = useTheme();
  const isDark = theme === 'techno' || theme === 'midnight';

  const borderClass = isDark ? 'border-white/10' : 'border-black/10';

  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-50 border-t ${borderClass} bg-transparent`}>
      <div className="mx-auto flex max-w-4xl items-stretch justify-around px-2 py-2 sm:py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.key;
          return (
            <button
              type="button"
              key={item.key}
              onClick={() => onNavChange(item.key)}
              aria-label={item.label}
              className={`flex flex-1 flex-col items-center rounded-2xl px-3 py-1.5 text-[11px] font-semibold transition ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-300'
                  : isDark
                    ? 'text-white hover:text-emerald-200'
                    : 'text-black hover:text-emerald-700'
              }`}
            >
              <Icon
                className={`h-5 w-5 ${
                  isActive ? 'text-emerald-300' : isDark ? 'text-white' : 'text-black'
                }`}
              />
              <span className="mt-1">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigationBar;
