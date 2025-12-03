import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { NestShadowLogo } from './NestShadowLogo.jsx';

const NAV_ITEMS = [
  { id: 'vision', label: 'Our Vision' },
  { id: 'founder', label: "Founder's Message" },
  { id: 'security', label: 'Security' },
  { id: 'pricing', label: 'Pricing', view: 'experience', context: { showWizard: true } },
];

const TopNav = ({ onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleNav = (view, context) => {
    // Add timestamp to force re-render/effect trigger
    const finalContext = context ? { ...context, timestamp: Date.now() } : { timestamp: Date.now() };

    // If navigating to experience, clear the plan param to ensure fresh state
    if (view === 'experience' && typeof window !== 'undefined') {
      const url = new URL(window.location);
      if (url.searchParams.has('plan')) {
        url.searchParams.delete('plan');
        window.history.pushState({}, '', url);
      }
    }
    onNavigate && onNavigate(view, finalContext);
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 md:px-12">
        <button
          onClick={() => handleNav('experience', { showWizard: false })}
          className="flex items-center gap-2 focus:outline-none"
        >
          <div className="scale-75 origin-left">
            <NestShadowLogo />
          </div>
        </button>

        <div className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.view || item.id, item.context)}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors focus:outline-none"
            >
              {item.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsMenuOpen(true)}
          className="md:hidden flex h-11 min-w-[48px] items-center justify-center gap-2 rounded-full bg-slate-900/70 px-3 text-sm font-semibold uppercase tracking-widest text-slate-300 shadow-lg ring-1 ring-white/10 transition-all hover:bg-slate-900/80 active:scale-[0.98]"
        >
          <Menu size={18} />
          <span className="hidden sm:inline">Menu</span>
        </button>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex flex-col bg-slate-950/90 backdrop-blur-3xl"
          >
            <div className="flex items-center justify-between px-6 py-6 md:px-12">
              <div className="flex items-center gap-2">
                <div className="scale-75 origin-left">
                  <NestShadowLogo />
                </div>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/5 text-slate-200 transition-colors hover:bg-white/10 active:scale-[0.98]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 flex flex-col justify-center px-8 space-y-8">
              {NAV_ITEMS.map((item, idx) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.05 }}
                  onClick={() => handleNav(item.view || item.id, item.context)}
                  className="text-left text-4xl font-display font-bold text-white hover:text-emerald-400 transition-colors"
                >
                  {item.label}
                </motion.button>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="pt-8"
              >
                <button
                  onClick={() => handleNav('experience', { showWizard: true })}
                  className="w-full py-4 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-lg uppercase tracking-widest hover:bg-emerald-400 transition-colors shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                >
                  Get Started
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TopNav;
