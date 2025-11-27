import React, { useRef, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion';

const ROTATION_RANGE = 20; // Degrees
const HALF_ROTATION_RANGE = ROTATION_RANGE / 2;

export default function GoldenTicket({
    text = "Invite Code",
    subtext = "Member Name",
    autoPlay = false
}) {
    const ref = useRef(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const xSpring = useSpring(x, { stiffness: 300, damping: 30 });
    const ySpring = useSpring(y, { stiffness: 300, damping: 30 });

    const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;

    const handleMouseMove = (e) => {
        if (!ref.current || autoPlay) return;

        const rect = ref.current.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;

        const mouseX = (e.clientX - rect.left) * ROTATION_RANGE / width - HALF_ROTATION_RANGE;
        const mouseY = (e.clientY - rect.top) * ROTATION_RANGE / height - HALF_ROTATION_RANGE;

        const rX = (mouseY * -1);
        const rY = mouseX;

        x.set(rX);
        y.set(rY);
    };

    const handleMouseLeave = () => {
        if (autoPlay) return;
        x.set(0);
        y.set(0);
    };

    // Auto-play animation loop
    React.useEffect(() => {
        if (autoPlay) {
            const time = Date.now();
            const loop = () => {
                const now = Date.now();
                const t = (now - time) / 2000; // Speed

                const rX = Math.sin(t) * 10;
                const rY = Math.cos(t) * 10;

                x.set(rX);
                y.set(rY);

                requestAnimationFrame(loop);
            };
            const frameId = requestAnimationFrame(loop);
            return () => cancelAnimationFrame(frameId);
        } else {
            x.set(0);
            y.set(0);
        }
    }, [autoPlay, x, y]);

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                transformStyle: "preserve-3d",
                transform,
            }}
            className="relative h-96 w-64 rounded-xl bg-gradient-to-br from-amber-200 via-yellow-400 to-amber-600 p-[2px]"
        >
            <div
                className="group relative h-full w-full overflow-hidden rounded-xl bg-slate-950"
                style={{ transform: "translateZ(50px)" }}
            >
                {/* Shine/Glare */}
                <div className="absolute inset-0 z-10 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Content */}
                <div className="relative z-20 flex h-full flex-col items-center justify-between p-6 text-center">
                    <div className="mt-8 h-16 w-16 rounded-full bg-gradient-to-br from-amber-300 to-yellow-600 shadow-lg shadow-amber-500/20" />

                    <div className="space-y-2">
                        <h3 className="font-display text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-amber-100 to-amber-400">
                            {text}
                        </h3>
                        <p className="text-xs font-medium uppercase tracking-widest text-amber-500/60">
                            {subtext}
                        </p>
                    </div>

                    <div className="mb-4 w-full border-t border-amber-500/20 pt-4">
                        <div className="flex justify-between text-[10px] text-amber-500/40 uppercase tracking-widest">
                            <span>No. 001</span>
                            <span>Nest Finance</span>
                        </div>
                    </div>
                </div>

                {/* Texture/Noise */}
                <div className="pointer-events-none absolute inset-0 z-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            </div>
        </motion.div>
    );
}
