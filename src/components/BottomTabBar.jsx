import React from 'react';
import { Home, Wallet, BarChart3, Target } from 'lucide-react';

const tabs = [
  { key: 'Dashboard', label: 'Dashboard', icon: <Home className="h-5 w-5" /> },
  { key: 'Money', label: 'Money', icon: <Wallet className="h-5 w-5" /> },
  { key: 'Insights', label: 'Insights', icon: <BarChart3 className="h-5 w-5" /> },
  { key: 'Goals', label: 'Goals', icon: <Target className="h-5 w-5" /> },
];

export default function BottomTabBar({ active = 'Dashboard', onChange = () => {} }) {
  return (
    <nav className="bg-surface border-t border-border-default px-4 py-2 flex justify-between">
      {tabs.map((t) => {
        const isActive = t.key === active;
        return (
          <button key={t.key} onClick={() => onChange(t.key)} className={`flex-1 flex flex-col items-center justify-center py-2 ${isActive ? 'text-primary' : 'text-text-secondary'}`}>
            <div className="h-10 w-10 flex items-center justify-center">{t.icon}</div>
            <div className="text-xs mt-1">{t.label}</div>
          </button>
        );
      })}
    </nav>
  );
}
