import React, { useRef, useState, forwardRef } from 'react';
import { Download, Loader2 } from 'lucide-react';

const HIGHLIGHT_CONFIG = [
    { key: 'nestFinance', titleLines: ['NEST', 'FINANCE'], fileName: 'nest-highlight-nest-finance.png' },
    { key: 'theProblem', titleLines: ['THE', 'PROBLEM'], fileName: 'nest-highlight-the-problem.png' },
    { key: 'fragmented', titleLines: ['FRAGMENTED'], fileName: 'nest-highlight-fragmented.png' },
    { key: 'archetypes', titleLines: ['ARCHETYPES'], fileName: 'nest-highlight-archetypes.png' },
    { key: 'security', titleLines: ['SECURITY'], fileName: 'nest-highlight-security.png' },
    { key: 'yourNest', titleLines: ['YOUR', 'NEST'], fileName: 'nest-highlight-your-nest.png' },
    { key: 'earlyAccess', titleLines: ['EARLY', 'ACCESS'], fileName: 'nest-highlight-early-access.png' },
];

const HighlightCircle = forwardRef(({ config, size = 1080, scale = 1, id }, ref) => {
    // Gradient Definitions
    const gradientId = `grad-${config.key}-${id}`;
    const shadowId = `shadow-${config.key}-${id}`;

    return (
        <svg
            ref={ref}
            width={size * scale}
            height={size * scale}
            viewBox="0 0 1080 1080"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ overflow: 'visible' }}
        >
            <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="1080" y2="1080" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#3b82f6" /> {/* Blue-500 */}
                    <stop offset="50%" stopColor="#6366f1" /> {/* Indigo-500 */}
                    <stop offset="100%" stopColor="#8b5cf6" /> {/* Violet-500 */}
                </linearGradient>

                <filter id={shadowId} x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000000" floodOpacity="0.4" />
                </filter>
            </defs>

            {/* Main Circle - Full Bleed Centered */}
            <circle
                cx="540"
                cy="540"
                r="520"
                fill={`url(#${gradientId})`}
            />

            {/* Inner Border Ring for Premium Feel */}
            <circle
                cx="540"
                cy="540"
                r="480"
                stroke="white"
                strokeWidth="2"
                opacity="0.1"
            />

            {/* Text Content */}
            <text
                x="540"
                y="540"
                textAnchor="middle"
                dominantBaseline="middle"
                fontFamily="Inter, system-ui, sans-serif"
                fontWeight="900"
                fill="white"
                style={{
                    letterSpacing: '0.12em',
                    filter: `url(#${shadowId})`,
                    textShadow: '0px 4px 12px rgba(0,0,0,0.3)'
                }}
            >
                {config.titleLines.length === 1 ? (
                    <tspan fontSize="120" y="560">{config.titleLines[0]}</tspan>
                ) : (
                    <>
                        <tspan x="540" dy="-70" fontSize="120">{config.titleLines[0]}</tspan>
                        <tspan x="540" dy="150" fontSize="120">{config.titleLines[1]}</tspan>
                    </>
                )}
            </text>
        </svg>
    );
});

export function NestHighlightIcons() {
    const [generatingKey, setGeneratingKey] = useState(null);
    const svgRefs = useRef({});

    const downloadPng = async (config) => {
        if (generatingKey) return;
        setGeneratingKey(config.key);

        try {
            const svgElement = svgRefs.current[config.key];
            if (!svgElement) throw new Error('SVG not found');

            // Serialize SVG
            const serializer = new XMLSerializer();
            let svgString = serializer.serializeToString(svgElement);

            // Fix dimensions for the exported file to be 1080x1080
            svgString = svgString
                .replace(/width="[^"]*"/, 'width="1080"')
                .replace(/height="[^"]*"/, 'height="1080"');

            const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(svgBlob);

            // Load into Image
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = 1080;
                canvas.height = 1080;
                const ctx = canvas.getContext('2d');

                // Ensure transparency
                ctx.clearRect(0, 0, 1080, 1080);

                ctx.drawImage(img, 0, 0, 1080, 1080);

                const pngUrl = canvas.toDataURL('image/png');
                const a = document.createElement('a');
                a.href = pngUrl;
                a.download = config.fileName;
                a.click();

                URL.revokeObjectURL(url);
                setGeneratingKey(null);
            };
            img.src = url;

        } catch (err) {
            console.error('Export failed:', err);
            alert('Failed to export PNG.');
            setGeneratingKey(null);
        }
    };

    return (
        <div className="w-full p-8 rounded-xl bg-slate-900/50 border border-white/10">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Instagram Highlight Covers</h2>
                    <p className="text-slate-400">Circular icons with transparent backgrounds. 1080x1080 PNGs.</p>
                </header>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8">
                    {HIGHLIGHT_CONFIG.map((config) => (
                        <div key={config.key} className="flex flex-col items-center gap-4">
                            {/* Preview (Scaled SVG) */}
                            <div className="relative w-32 h-32 md:w-40 md:h-40 bg-slate-950 rounded-full flex items-center justify-center border border-white/10 overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300">
                                <HighlightCircle
                                    ref={el => svgRefs.current[config.key] = el}
                                    config={config}
                                    id="preview"
                                    scale={0.15}
                                />
                            </div>

                            <button
                                onClick={() => downloadPng(config)}
                                disabled={generatingKey}
                                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-wider transition-all w-full
                                    ${generatingKey === config.key
                                        ? 'bg-slate-800 text-slate-400 cursor-wait'
                                        : 'bg-white/10 text-white hover:bg-white/20'
                                    }`}
                            >
                                {generatingKey === config.key ? (
                                    <Loader2 size={12} className="animate-spin" />
                                ) : (
                                    <Download size={12} />
                                )}
                                PNG
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
