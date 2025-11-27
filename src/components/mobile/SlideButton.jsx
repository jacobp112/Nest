import React, { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { ChevronRight, Check, Loader2 } from 'lucide-react';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';

export default function SlideButton({ onConfirm, label = "Slide to Confirm", isLoading = false }) {
    const [completed, setCompleted] = useState(false);
    const controls = useAnimation();
    const { triggerHaptic } = useHapticFeedback();

    const handleDragEnd = async (event, info) => {
        const threshold = 200; // Drag distance required

        if (info.offset.x > threshold) {
            setCompleted(true);
            triggerHaptic('success');
            if (onConfirm) onConfirm();
        } else {
            controls.start({ x: 0 }); // Snap back
            if (info.offset.x > 10) triggerHaptic('error'); // Feedback for failed attempt
        }
    };

    const handleDrag = (event, info) => {
        // Haptic tick every 50px
        if (info.offset.x > 0 && Math.floor(info.offset.x) % 50 === 0) {
            triggerHaptic('light');
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-14 w-full items-center justify-center rounded-full bg-gray-800">
                <Loader2 className="animate-spin text-emerald-500" />
            </div>
        );
    }

    if (completed) {
        return (
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex h-14 w-full items-center justify-center rounded-full bg-emerald-500 text-black font-bold"
            >
                <Check className="mr-2" size={20} />
                Executed
            </motion.div>
        );
    }

    return (
        <div className="relative flex h-14 w-full items-center rounded-full bg-gray-800 p-1 shadow-inner overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-500 opacity-50">
                    {label}
                </span>
            </div>

            <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 220 }}
                dragElastic={0.1}
                dragMomentum={false}
                onDrag={handleDrag}
                onDragEnd={handleDragEnd}
                animate={controls}
                className="z-10 flex h-12 w-12 cursor-grab items-center justify-center rounded-full bg-white text-gray-900 shadow-lg active:cursor-grabbing"
            >
                <ChevronRight size={24} />
            </motion.div>
        </div>
    );
}
