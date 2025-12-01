import React, { useRef } from 'react';
import { Download } from 'lucide-react';

export const NestProfilePic = ({ size = 1080, showControls = false }) => {
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
            a.download = 'nest-instagram-profile.png';
            a.href = canvas.toDataURL('image/png');
            a.click();
            URL.revokeObjectURL(url);
        };
        img.src = url;
    };

    // --- CONFIGURATION ---
    const CANVAS_SIZE = 1080;
    const CENTER = CANVAS_SIZE / 2;

    // 1. The Geometry
    // FIX: Radius set to exactly 540 (Half of 1080) so it touches the absolute edge.
    const OUTER_EDGE_RADIUS = 540;
    const RING_STROKE = 50; // Increased slightly to be bold at the edge

    // The ring stroke is drawn on center, so we radius = Edge - (Stroke / 2)
    const RING_RADIUS = OUTER_EDGE_RADIUS - (RING_STROKE / 2);

    // The Inner Circle starts exactly where the Ring stroke ends
    const INNER_RADIUS = OUTER_EDGE_RADIUS - RING_STROKE;

    // 2. The N Icon
    const N_SCALE = 8.5;
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
                        {/* 1. MAIN GRADIENT */}
                        <linearGradient id="innerGradient" x1="0" y1="0" x2={CANVAS_SIZE} y2={CANVAS_SIZE} gradientUnits="userSpaceOnUse">
                            <stop offset="0%" className="stop-a" stopColor="#34d399" />
                            <stop offset="50%" className="stop-b" stopColor="#6366f1" />
                            <stop offset="100%" className="stop-c" stopColor="#8b5cf6" />
                        </linearGradient>

                        {/* 2. RING GRADIENT (Offset Animation) */}
                        <linearGradient id="ringGradient" x1={CANVAS_SIZE} y1="0" x2="0" y2={CANVAS_SIZE} gradientUnits="userSpaceOnUse">
                            <stop offset="0%" className="stop-a-ring" stopColor="#34d399" />
                            <stop offset="50%" className="stop-b-ring" stopColor="#6366f1" />
                            <stop offset="100%" className="stop-c-ring" stopColor="#8b5cf6" />
                        </linearGradient>

                        <style>
                            {`
                                /* Inner Animation */
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

                                /* Ring Animation (Offset by 3 seconds) */
                                .stop-a-ring { animation: auroraShift 6s infinite linear; animation-delay: -3s; }
                                .stop-b-ring { animation: auroraShift 6s infinite linear; animation-delay: -4.5s; }
                                .stop-c-ring { animation: auroraShift 6s infinite linear; animation-delay: -6s; }
                            `}
                        </style>

                        {/* 3. Mask for the Icon */}
                        <mask id="n-cutout-mask">
                            {/* White Circle = Visible Area */}
                            <circle cx={CENTER} cy={CENTER} r={INNER_RADIUS + 2} fill="white" />

                            {/* Black Path = Cutout (Negative Space) */}
                            <g transform={`translate(${N_OFFSET_X}, ${N_OFFSET_Y}) scale(${N_SCALE})`}>
                                <path
                                    d="M28 28V72H38L62 38V72H72V28H62L38 62V28H28Z"
                                    fill="black"
                                />
                            </g>
                        </mask>
                    </defs>

                    {/* BACKGROUND: Dark Slate */}
                    <rect width={CANVAS_SIZE} height={CANVAS_SIZE} fill="#020617" />

                    {/* INNER CIRCLE FILL */}
                    <circle
                        cx={CENTER} cy={CENTER} r={INNER_RADIUS + 1}
                        fill="url(#innerGradient)"
                        mask="url(#n-cutout-mask)"
                    />

                    {/* OUTER RING (BORDER) */}
                    <circle
                        cx={CENTER} cy={CENTER} r={RING_RADIUS}
                        stroke="url(#ringGradient)"
                        strokeWidth={RING_STROKE}
                        fill="none"
                    />

                </svg>
            </div>

            {/* Helper Control */}
            {showControls && (
                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg text-sm font-bold uppercase tracking-widest transition-all"
                >
                    <Download size={16} />
                    Download for Instagram
                </button>
            )}
        </div>
    );
};