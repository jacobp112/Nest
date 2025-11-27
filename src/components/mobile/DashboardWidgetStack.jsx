import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';

export default function DashboardWidgetStack({ widgets = [] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { triggerHaptic } = useHapticFeedback();

    const handleDragEnd = (event, info) => {
        if (info.offset.x < -100) {
            // Swipe Left
            nextWidget();
        } else if (info.offset.x > 100) {
            // Swipe Right
            prevWidget();
        }
    };

    const nextWidget = () => {
        triggerHaptic('light');
        setCurrentIndex((prev) => (prev + 1) % widgets.length);
    };

    const prevWidget = () => {
        triggerHaptic('light');
        setCurrentIndex((prev) => (prev - 1 + widgets.length) % widgets.length);
    };

    if (!widgets.length) return null;

    return (
        <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-xl">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.2 }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={handleDragEnd}
                    className="absolute inset-0 flex flex-col justify-between p-6"
                >
                    {widgets[currentIndex]}
                </motion.div>
            </AnimatePresence>

            {/* Indicators */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-1.5">
                {widgets.map((_, idx) => (
                    <div
                        key={idx}
                        className={`h-1.5 rounded-full transition-all ${idx === currentIndex ? 'w-4 bg-white' : 'w-1.5 bg-gray-600'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
