import React from 'react';
import { motion } from 'framer-motion';

export const DashboardCard = ({ children, title, className = '', delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] }}
        className={`group relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-900/60 p-5 md:p-8 backdrop-blur-xl shadow-2xl transition-all duration-500 hover:shadow-emerald-900/20 hover:border-white/15 active:scale-[0.98] ${className}`}
    >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.07] to-transparent opacity-100" />
        <div className="relative z-10 h-full flex flex-col">
            {title && (
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-white">{title}</h3>
                </div>
            )}
            {children}
        </div>
    </motion.div>
);

export default DashboardCard;

export const DashboardHeroNumber = ({ children, className = '' }) => (
    <span className={`font-display font-bold text-white text-4xl md:text-5xl tracking-tight ${className}`}>
        {children}
    </span>
);
