import React, { useState } from 'react';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';
import { ArrowUpRight, ArrowDownRight, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrubbableChart from './ScrubbableChart';

export default function AssetCard({
    assetName,
    ticker,
    totalValue,
    changePercentage,
    trendData = [], // Array of numbers for sparkline
    primaryMetric = 'price', // 'price' | 'peRatio' | 'yield'
}) {
    const [isRevealed, setIsRevealed] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const { triggerHaptic } = useHapticFeedback();

    const handlePressStart = () => {
        if (!isExpanded) {
            triggerHaptic('light');
            setIsRevealed(true);
        }
    };

    const handlePressEnd = () => {
        setIsRevealed(false);
    };

    const toggleExpand = (e) => {
        e.stopPropagation();
        triggerHaptic('medium');
        setIsExpanded(!isExpanded);
    };

    const isPositive = changePercentage >= 0;
    const showValue = isRevealed || isExpanded;

    return (
        <div
            className="relative mb-3 overflow-hidden rounded-xl bg-gray-900 p-4 text-white shadow-lg transition-all active:scale-[0.99] isolation-isolate"
            onTouchStart={handlePressStart}
            onTouchEnd={handlePressEnd}
            onMouseDown={handlePressStart}
            onMouseUp={handlePressEnd}
            onMouseLeave={handlePressEnd}
        >
            {/* Sparkline Background (Only visible when NOT expanded) */}
            {!isExpanded && (
                <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                    <svg className="h-full w-full" preserveAspectRatio="none">
                        <polyline
                            fill="none"
                            stroke={isPositive ? '#10B981' : '#EF4444'}
                            strokeWidth="2"
                            points={trendData.map((val, i) => `${(i / (trendData.length - 1)) * 100},${100 - ((val - Math.min(...trendData)) / (Math.max(...trendData) - Math.min(...trendData))) * 100}`).join(' ')}
                        />
                    </svg>
                </div>
            )}

            <div className="relative z-10">
                <div className="flex items-center justify-between">
                    {/* Left Side */}
                    <div>
                        <h3 className="text-lg font-bold tracking-tight">{assetName}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                            <span className="font-mono">{ticker}</span>
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                            {showValue ? (
                                <span className="font-mono text-lg font-bold tracking-tight">
                                    ${totalValue.toLocaleString()}
                                </span>
                            ) : (
                                <span className="text-xs text-gray-500">Hold to reveal</span>
                            )}

                            <button
                                onClick={toggleExpand}
                                className="p-1 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors"
                            >
                                {isExpanded ? <Eye size={16} className="text-emerald-400" /> : <EyeOff size={16} className="text-gray-500" />}
                            </button>
                        </div>

                        <div className={`flex items-center justify-end text-sm ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                            {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            <span className="ml-0.5 font-mono font-medium">
                                {Math.abs(changePercentage).toFixed(2)}%
                            </span>
                        </div>
                    </div>
                </div>

                {/* Expanded Chart Area */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="mt-4 border-t border-gray-800 pt-2">
                                <ScrubbableChart data={trendData} color={isPositive ? '#10B981' : '#EF4444'} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
