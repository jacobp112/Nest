import React, { useState, useRef, useMemo } from 'react';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';

export default function ScrubbableChart({
    data = [],
    color = '#10B981' // Emerald-500
}) {
    const [activeIndex, setActiveIndex] = useState(null);
    const containerRef = useRef(null);
    const { triggerHaptic } = useHapticFeedback();

    // Normalize data for the SVG viewbox (0-100)
    const { min, max, range, points } = useMemo(() => {
        if (!data.length) return { min: 0, max: 0, range: 0, points: '' };
        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min || 1;

        const pts = data.map((val, i) => {
            const x = (i / (data.length - 1)) * 100;
            const y = 100 - ((val - min) / range) * 100;
            return `${x},${y}`;
        }).join(' ');

        return { min, max, range, points: pts };
    }, [data]);

    const handleTouch = (e) => {
        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const relativeX = clientX - rect.left;

        // Calculate index based on touch position
        const index = Math.min(
            Math.max(0, Math.floor((relativeX / rect.width) * data.length)),
            data.length - 1
        );

        // HAPTIC LOGIC: Trigger when index changes
        if (activeIndex !== index) {
            triggerHaptic('light'); // Tick feeling
            setActiveIndex(index);
        }
    };

    const handleEnd = () => setActiveIndex(null);

    return (
        <div
            ref={containerRef}
            className="relative h-32 w-full touch-none select-none py-4"
            onTouchStart={handleTouch}
            onTouchMove={handleTouch}
            onTouchEnd={handleEnd}
            onMouseDown={handleTouch} // Desktop testing support
            onMouseMove={(e) => e.buttons === 1 && handleTouch(e)}
            onMouseUp={handleEnd}
        >
            {/* HEADS UP DISPLAY (HUD) - Floating above finger */}
            {activeIndex !== null && (
                <div className="absolute -top-6 left-0 right-0 flex justify-center z-20">
                    <div className="rounded-full bg-gray-800 border border-gray-700 px-3 py-1 text-xs font-mono text-white shadow-lg flex items-center gap-2">
                        <span className="text-gray-400">VAL:</span>
                        <span className="font-bold text-emerald-400">${data[activeIndex].toLocaleString()}</span>
                    </div>
                </div>
            )}

            <svg className="h-full w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                {/* Main Trend Line */}
                <polyline
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    points={points}
                    vectorEffect="non-scaling-stroke"
                />

                {/* Scrubber Crosshair */}
                {activeIndex !== null && (
                    <g>
                        <line
                            x1={(activeIndex / (data.length - 1)) * 100}
                            y1="0"
                            x2={(activeIndex / (data.length - 1)) * 100}
                            y2="100"
                            stroke="rgba(255,255,255,0.5)"
                            strokeWidth="0.5"
                            vectorEffect="non-scaling-stroke"
                        />
                        <circle
                            cx={(activeIndex / (data.length - 1)) * 100}
                            cy={100 - ((data[activeIndex] - min) / range) * 100}
                            r="3"
                            fill="white"
                            stroke={color}
                            strokeWidth="2"
                        />
                    </g>
                )}
            </svg>
        </div>
    );
}
