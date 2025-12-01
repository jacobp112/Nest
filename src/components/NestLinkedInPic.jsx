import React, { useRef } from 'react';
import { Download } from 'lucide-react';

export const NestLinkedInPic = ({ size = 1080, showControls = false }) => {
    const svgRef = useRef(null);

    const handleExport = async () => {
        if (!svgRef.current) return;

        const svg = svgRef.current;
        const serializer = new XMLSerializer();
        const source = serializer.serializeToString(svg);
        const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, size, size);

            const a = document.createElement('a');
            a.download = 'nest-linkedin-profile.png';
            a.href = canvas.toDataURL('image/png');
            a.click();
            URL.revokeObjectURL(url);
        };
        img.src = url;
    };

    // --- CONFIGURATION ---
    const CANVAS_SIZE = 1080;
    const CENTER = CANVAS_SIZE / 2;

    // Icon Geometry
    // We want the icon large enough to fill the circle crop, but with comfortable padding.
    // 100x100 grid -> Scale 13 = 1300px (Too big)
    // We want the visual weight to be about 60% of the canvas.
    const N_SCALE = 12.5;
    const N_OFFSET_X = CENTER - (50 * N_SCALE);
    const N_OFFSET_Y = CENTER - (50 * N_SCALE);

    return (
        <div className="flex flex-col items-center gap-4">
            <div
                className="relative shadow-2xl rounded-full overflow-hidden"
                style={{ width: size > 300 ? 300 : size, height: size > 300 ? 300 : size }}
            >
                <svg
                    ref={svgRef}
                    width="100%"
                    height="100%"
                    viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`}
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        {/* THE AURORA GRADIENT (For the Icon) */}
                        <linearGradient id="linkedinGradient" x1="0" y1="0" x2={CANVAS_SIZE} y2={CANVAS_SIZE} gradientUnits="userSpaceOnUse">
                            <stop offset="0%" className="stop-a" stopColor="#34d399" />
                            <stop offset="50%" className="stop-b" stopColor="#6366f1" />
                            <stop offset="100%" className="stop-c" stopColor="#8b5cf6" />
                        </linearGradient>

                        <style>
                            {`
                                @keyframes auroraShift {
                                    0% { stop-color: #34d399; }
                                    25% { stop-color: #3b82f6; }
                                    50% { stop-color: #8b5cf6; }
                                    75% { stop-color: #3b82f6; }
                                    100% { stop-color: #34d399; }
                                }
                                .stop-a { animation: auroraShift 6s infinite linear; }
                                .stop-b { animation: auroraShift 6s infinite linear; animation-delay: -1.5s; }
                                .stop-c { animation: auroraShift 6s infinite linear; animation-delay: -3s; }
                            `}
                        </style>

                        {/* Subtle Glow behind the logo to make it lift off the dark bg */}
                        <filter id="logoGlow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="35" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* 1. BACKGROUND: Solid Corporate Dark Slate */}
                    <rect width={CANVAS_SIZE} height={CANVAS_SIZE} fill="#020617" />

                    {/* Optional: Very subtle gradient mesh in background to prevent it looking "flat" */}
                    <rect width={CANVAS_SIZE} height={CANVAS_SIZE} fill="url(#linkedinGradient)" fillOpacity="0.03" />

                    {/* 2. THE ICON: Gradient Filled with Glow */}
                    <g transform={`translate(${N_OFFSET_X}, ${N_OFFSET_Y}) scale(${N_SCALE})`}>

                        {/* The Glow Layer (Behind) */}
                        <path
                            d="M28 28V72H38L62 38V72H72V28H62L38 62V28H28Z"
                            fill="url(#linkedinGradient)"
                            fillOpacity="0.4"
                            filter="url(#logoGlow)"
                        />

                        {/* The Main Logo Layer */}
                        <path
                            d="M28 28V72H38L62 38V72H72V28H62L38 62V28H28Z"
                            fill="url(#linkedinGradient)"
                        />

                        {/* High-Gloss Bevel (Top Left) */}
                        <path
                            d="M28 28V72H38L62 38V72H72V28H62L38 62V28H28Z"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeOpacity="0.15"
                            fill="none"
                        />
                    </g>
                </svg>
            </div>

            {/* Helper Control */}
            {showControls && (
                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 rounded-lg text-sm font-bold uppercase tracking-widest transition-all"
                >
                    <Download size={16} />
                    Download for LinkedIn
                </button>
            )}
        </div>
    );
};