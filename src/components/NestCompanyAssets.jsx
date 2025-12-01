import React, { useRef } from 'react';
import { Download, Layout, Image as ImageIcon } from 'lucide-react';

export const NestCompanyAssets = () => {
    const logoRef = useRef(null);
    const bannerRef = useRef(null);

    // --- SHARED EXPORT FUNCTION ---
    const handleExport = (ref, filename, width, height) => {
        if (!ref.current) return;

        const svg = ref.current;
        const serializer = new XMLSerializer();
        const source = serializer.serializeToString(svg);
        const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            const a = document.createElement('a');
            a.download = filename;
            a.href = canvas.toDataURL('image/png');
            a.click();
            URL.revokeObjectURL(url);
        };
        img.src = url;
    };

    // --- CONFIGURATION ---
    // 1. Logo (Square)
    const LOGO_SIZE = 1080;
    const LOGO_N_SCALE = 14;
    const LOGO_OFFSET = (LOGO_SIZE / 2) - (50 * LOGO_N_SCALE);

    // 2. Banner (Landscape - High Res for Retina)
    const BANNER_W = 2256;
    const BANNER_H = 382;

    return (
        <div className="flex flex-col items-center gap-12 p-8 w-full max-w-4xl bg-slate-900/50 rounded-3xl border border-white/5">

            {/* ==============================================
                1. THE SQUARE LOGO (Icon + Gradient Background)
               ============================================== */}
            <div className="flex flex-col items-center gap-4 w-full">
                <div className="flex items-center gap-2 text-white font-bold uppercase tracking-widest text-sm">
                    <ImageIcon size={16} className="text-emerald-400"/> Company Logo (Square)
                </div>

                <div className="relative shadow-2xl rounded-xl overflow-hidden" style={{ width: 300, height: 300 }}>
                    <svg
                        ref={logoRef}
                        width="100%"
                        height="100%"
                        viewBox={`0 0 ${LOGO_SIZE} ${LOGO_SIZE}`}
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            <linearGradient id="companyBrandGradient" x1="0" y1="0" x2={LOGO_SIZE} y2={LOGO_SIZE} gradientUnits="userSpaceOnUse">
                                <stop offset="0%" className="stop-a" stopColor="#34d399" />
                                <stop offset="50%" className="stop-b" stopColor="#6366f1" />
                                <stop offset="100%" className="stop-c" stopColor="#8b5cf6" />
                            </linearGradient>

                            <style>
                                {`
                                    @keyframes auroraFlow {
                                        0% { stop-color: #34d399; }
                                        25% { stop-color: #3b82f6; }
                                        50% { stop-color: #8b5cf6; }
                                        75% { stop-color: #3b82f6; }
                                        100% { stop-color: #34d399; }
                                    }
                                    .stop-a { animation: auroraFlow 6s infinite linear; }
                                    .stop-b { animation: auroraFlow 6s infinite linear; animation-delay: -1.5s; }
                                    .stop-c { animation: auroraFlow 6s infinite linear; animation-delay: -3s; }
                                `}
                            </style>

                            <mask id="company-logo-mask">
                                <rect width={LOGO_SIZE} height={LOGO_SIZE} fill="white" />
                                <g transform={`translate(${LOGO_OFFSET}, ${LOGO_OFFSET}) scale(${LOGO_N_SCALE})`}>
                                    <path d="M28 28V72H38L62 38V72H72V28H62L38 62V28H28Z" fill="black" />
                                </g>
                            </mask>
                        </defs>

                        {/* Background & Masked Gradient */}
                        <rect width={LOGO_SIZE} height={LOGO_SIZE} fill="#020617" />
                        <rect width={LOGO_SIZE} height={LOGO_SIZE} fill="url(#companyBrandGradient)" mask="url(#company-logo-mask)" />
                    </svg>
                </div>

                <button
                    onClick={() => handleExport(logoRef, 'nest-linkedin-logo.png', LOGO_SIZE, LOGO_SIZE)}
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
                >
                    <Download size={14} /> Download Logo
                </button>
            </div>

            <div className="w-full h-px bg-white/10" />

            {/* ==============================================
                2. THE COLLABORATIVE FINANCE BANNER (Landscape)
               ============================================== */}
            <div className="flex flex-col items-center gap-4 w-full">
                <div className="flex items-center gap-2 text-white font-bold uppercase tracking-widest text-sm">
                    <Layout size={16} className="text-indigo-400"/> LinkedIn Cover
                </div>

                <div className="relative shadow-2xl rounded-xl overflow-hidden w-full aspect-[4/1] border border-white/5">
                    <svg
                        ref={bannerRef}
                        width="100%"
                        height="100%"
                        viewBox={`0 0 ${BANNER_W} ${BANNER_H}`}
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        preserveAspectRatio="xMidYMid slice"
                    >
                        <defs>
                            {/* Gradients for the two "partners" (streams) */}
                            <linearGradient id="streamA" x1="0" y1="0" x2={BANNER_W} y2="0" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="#34d399" stopOpacity="0" />
                                <stop offset="50%" stopColor="#34d399" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
                            </linearGradient>

                            <linearGradient id="streamB" x1="0" y1="0" x2={BANNER_W} y2="0" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
                                <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                            </linearGradient>

                            {/* Mask to fade the grid out at the edges */}
                            <linearGradient id="gridFade" x1="0" y1="0" x2="100%" y2="0">
                                <stop offset="0%" stopColor="black" />
                                <stop offset="20%" stopColor="white" />
                                <stop offset="80%" stopColor="white" />
                                <stop offset="100%" stopColor="black" />
                            </linearGradient>
                            <mask id="gridMask">
                                <rect width={BANNER_W} height={BANNER_H} fill="url(#gridFade)" />
                            </mask>

                            <filter id="glow">
                                <feGaussianBlur stdDeviation="8" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* 1. Background */}
                        <rect width={BANNER_W} height={BANNER_H} fill="#020617" />

                        {/* 2. Technical Grid (Faded at edges) */}
                        <g mask="url(#gridMask)" opacity="0.3">
                            <pattern id="techGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.1"/>
                                <circle cx="0" cy="0" r="1" fill="white" fillOpacity="0.3" />
                            </pattern>
                            <rect width={BANNER_W} height={BANNER_H} fill="url(#techGrid)" />
                        </g>

                        {/* 3. The "Collaborative" Streams (Intertwining Lines) */}
                        <g filter="url(#glow)">
                            {/* Stream 1: The "Architect" (Structure/Emerald) */}
                            <path
                                d={`M0 ${BANNER_H*0.7} C ${BANNER_W*0.3} ${BANNER_H*0.9}, ${BANNER_W*0.6} ${BANNER_H*0.1}, ${BANNER_W} ${BANNER_H*0.3}`}
                                stroke="url(#streamA)"
                                strokeWidth="3"
                                fill="none"
                            />
                            {/* Stream 2: The "Collaborator" (Flow/Indigo) - Crossing over Stream 1 */}
                            <path
                                d={`M0 ${BANNER_H*0.3} C ${BANNER_W*0.3} ${BANNER_H*0.1}, ${BANNER_W*0.6} ${BANNER_H*0.9}, ${BANNER_W} ${BANNER_H*0.7}`}
                                stroke="url(#streamB)"
                                strokeWidth="3"
                                fill="none"
                            />
                        </g>

                        {/* 4. The "Pulse" (Financial Health/Activity) */}
                        {/* A sharp, jagged line running through the center representing data/finance */}
                        <path
                            d={`
                                M 0 ${BANNER_H/2}
                                L ${BANNER_W*0.2} ${BANNER_H/2}
                                L ${BANNER_W*0.25} ${BANNER_H*0.4}
                                L ${BANNER_W*0.28} ${BANNER_H*0.6}
                                L ${BANNER_W*0.35} ${BANNER_H*0.3}
                                L ${BANNER_W*0.4} ${BANNER_H*0.5}
                                L ${BANNER_W*0.5} ${BANNER_H*0.5}
                                L ${BANNER_W*0.55} ${BANNER_H*0.45}
                                L ${BANNER_W*0.6} ${BANNER_H*0.55}
                                L ${BANNER_W*0.7} ${BANNER_H/2}
                                L ${BANNER_W} ${BANNER_H/2}
                            `}
                            stroke="white"
                            strokeWidth="1.5"
                            strokeOpacity="0.15"
                            fill="none"
                        />

                        {/* 5. Center Connection Node (Where profiles usually sit, visual anchor) */}
                        {/* A subtle glowing orb in the middle to imply connection */}
                        <circle cx={BANNER_W/2} cy={BANNER_H/2} r="80" fill="url(#streamA)" fillOpacity="0.05" filter="url(#glow)" />

                    </svg>
                </div>

                <button
                    onClick={() => handleExport(bannerRef, 'nest-linkedin-cover.png', BANNER_W, BANNER_H)}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
                >
                    <Download size={14} /> Download Banner
                </button>
            </div>
        </div>
    );
};