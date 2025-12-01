import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Sparkles, Users, TrendingUp, Eye, Download, Loader2, User, Layers, Lock, LayoutDashboard, ArrowRight, Fingerprint, Ticket, Zap } from 'lucide-react';
import { NestIcon } from '../NestIcon.jsx';

// --- JOURNEY SLIDES DATA ---
const JOURNEY_SLIDES = [
    {
        id: 'hook',
        filename: 'highlight-01-hook',
        title: "Family finance, engineered for humans.",
        subtitle: "One shared operating system for your money, your goals, and your relationships.",
        footer: "Nest Finance",
        icon: Zap,
        theme: 'indigo'
    },
    {
        id: 'soloCfo',
        filename: 'highlight-02-solo-cfo',
        title: "One of you is the ‘CFO’.",
        body: "One partner carries the entire mental load of the finances. The other is left in the dark. Anxiety, bottlenecks, and misalignment follow.",
        footer: "Nest replaces the bottleneck with a shared system of record.",
        icon: User,
        theme: 'rose'
    },
    {
        id: 'fragmentation',
        filename: 'highlight-03-fragmentation',
        title: "Your balance sheet is scattered.",
        body: "Checking, savings, ISAs, pensions, property, liabilities – all split across a dozen logins. You can’t optimise what you can’t see.",
        footer: "Nest pulls your entire balance sheet into one high-fidelity vault.",
        icon: Layers,
        theme: 'amber'
    },
    {
        id: 'archetypes',
        filename: 'highlight-04-archetypes',
        title: "The Behavioural Engine.",
        body: "Nest adapts to how you think, not just what you own. Architect, Steward, Collaborator, Ascender – each with a tailored interface.",
        footer: "Your dashboard reconfigures to match your psychological profile.",
        icon: Fingerprint,
        theme: 'sky'
    },
    {
        id: 'security',
        filename: 'highlight-05-security',
        title: "Security that feels over-engineered.",
        bullets: [
            "AES-256 & TLS 1.3",
            "Read-only, regulated data connections",
            "Granular household permissions"
        ],
        footer: "Designed to feel like a private family office, not a consumer app.",
        icon: ShieldCheck,
        theme: 'emerald'
    },
    {
        id: 'osPreview',
        filename: 'highlight-06-os-preview',
        title: "Your financial OS, not another budgeting app.",
        body: "Visualise assets, liabilities, and net worth. Model scenarios. See the impact of decisions before you make them.",
        footer: "Built for households treating wealth as a long-term project.",
        icon: LayoutDashboard,
        theme: 'violet'
    },
    {
        id: 'waitlist',
        filename: 'highlight-07-waitlist',
        title: "Be early to the operating system for families.",
        body: "Join the waitlist for founding member access and priority onboarding.",
        cta: "nestfinance.app/ Access",
        icon: Ticket,
        theme: 'amber'
    }
];

// --- HELPER: Load html2canvas ---
const loadHtml2Canvas = () =>
    new Promise((resolve, reject) => {
        if (typeof window !== 'undefined' && window.html2canvas) {
            resolve(window.html2canvas);
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://html2canvas.hertzen.com/dist/html2canvas.min.js';
        script.async = true;
        script.onload = () => resolve(window.html2canvas);
        script.onerror = () => reject(new Error('Failed to load html2canvas'));
        document.body.appendChild(script);
    });

// --- THEME CONFIG ---
const THEMES = {
    indigo: { bg: 'from-indigo-950', accent: 'text-indigo-400', border: 'border-indigo-500/30', glow: 'bg-indigo-500/20' },
    rose: { bg: 'from-rose-950', accent: 'text-rose-400', border: 'border-rose-500/30', glow: 'bg-rose-500/20' },
    amber: { bg: 'from-amber-950', accent: 'text-amber-400', border: 'border-amber-500/30', glow: 'bg-amber-500/20' },
    sky: { bg: 'from-sky-950', accent: 'text-sky-400', border: 'border-sky-500/30', glow: 'bg-sky-500/20' },
    emerald: { bg: 'from-emerald-950', accent: 'text-emerald-400', border: 'border-emerald-500/30', glow: 'bg-emerald-500/20' },
    violet: { bg: 'from-violet-950', accent: 'text-violet-400', border: 'border-violet-500/30', glow: 'bg-violet-500/20' },
};

// --- SUB-COMPONENT: Single Slide Renderer ---
const JourneySlide = ({ slide, scale = 1 }) => {
    const theme = THEMES[slide.theme] || THEMES.indigo;

    return (
        <div
            className="relative bg-slate-950 flex flex-col items-center justify-between p-12 text-center overflow-hidden"
            style={{
                width: 1080 * scale,
                height: 1920 * scale,
                transformOrigin: 'top left'
            }}
        >
            {/* Background Effects */}
            <div className={`absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] ${theme.bg} via-slate-950 to-slate-950 opacity-80`} />
            <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

            {/* Top Branding - Subtle */}
            <div className="relative z-10 mt-16 opacity-50">
                <NestIcon size={64 * scale} className="text-white" />
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center gap-10 max-w-[85%] mt-10">
                {/* Visual Cue Area - Enhanced */}
                <div className={`relative mb-4 p-12 rounded-[3rem] ${theme.glow} border ${theme.border} backdrop-blur-sm shadow-2xl`}>
                    <div className={`absolute inset-0 rounded-[3rem] ${theme.glow} blur-xl opacity-50`} />
                    {React.createElement(slide.icon, { size: 140 * scale, className: `relative z-10 ${theme.accent}`, strokeWidth: 1 })}
                </div>

                <h1 className="font-display font-bold text-white leading-[1.1] tracking-tight drop-shadow-lg" style={{ fontSize: `${86 * scale}px` }}>
                    {slide.title}
                </h1>

                {slide.subtitle && (
                    <p className="text-slate-300 font-medium leading-relaxed max-w-[90%]" style={{ fontSize: `${42 * scale}px` }}>
                        {slide.subtitle}
                    </p>
                )}

                {slide.body && (
                    <p className="text-slate-300 font-medium leading-relaxed max-w-[90%]" style={{ fontSize: `${42 * scale}px` }}>
                        {slide.body}
                    </p>
                )}

                {slide.bullets && (
                    <ul className={`text-left space-y-6 ${theme.glow} p-10 rounded-[2rem] border ${theme.border} w-full`}>
                        {slide.bullets.map((bullet, i) => (
                            <li key={i} className="flex items-start gap-6 text-white/90" style={{ fontSize: `${36 * scale}px` }}>
                                <ShieldCheck size={40 * scale} className={`${theme.accent} flex-shrink-0 mt-1`} />
                                <span className="leading-snug">{bullet}</span>
                            </li>
                        ))}
                    </ul>
                )}

                {slide.cta && (
                    <div className="mt-12 px-16 py-8 bg-white text-slate-950 font-bold uppercase tracking-widest rounded-full shadow-[0_0_40px_rgba(255,255,255,0.3)] text-center" style={{ fontSize: `${36 * scale}px` }}>
                        {slide.cta}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="relative z-10 mb-24 max-w-[80%]">
                <div className={`h-1 w-24 mx-auto mb-8 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent`} />
                <p className="text-slate-500 font-medium uppercase tracking-[0.2em]" style={{ fontSize: `${24 * scale}px` }}>
                    {slide.footer || "Nest Finance"}
                </p>
            </div>
        </div>
    );
};

export function HighlightGenerator() {
    const [generatingId, setGeneratingId] = useState(null);
    const previewRefs = useRef({});

    // --- IMAGE GENERATION LOGIC ---
    const generateImage = async (slide) => {
        if (generatingId) return;
        setGeneratingId(slide.id);

        try {
            await loadHtml2Canvas();
            const element = previewRefs.current[slide.id];
            if (!element) throw new Error('Preview element not found');

            // Wait for render
            await new Promise(r => setTimeout(r, 500));

            const canvas = await window.html2canvas(element, {
                scale: 1, // Already at 1080x1920
                width: 1080,
                height: 1920,
                backgroundColor: '#0f172a',
                logging: false,
                useCORS: true
            });

            const dataUrl = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = dataUrl;
            a.download = `${slide.filename}.png`;
            a.click();

            setGeneratingId(null);

        } catch (err) {
            console.error('Generation failed:', err);
            alert('Failed to generate image. Check console.');
            setGeneratingId(null);
        }
    };

    return (
        <div className="w-full h-full overflow-y-auto p-8 bg-slate-950">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Instagram Highlights – Journey Set</h2>
                    <p className="text-slate-400">7-slide narrative: Hook → Pain → Solution → Invite. Download as 1080x1920 PNGs.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-20">
                    {JOURNEY_SLIDES.map((slide) => (
                        <div key={slide.id} className="flex flex-col gap-4">
                            {/* PREVIEW CONTAINER (Scaled Down) */}
                            <div className="relative w-full aspect-[9/16] bg-slate-900 rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
                                <div className="absolute inset-0 origin-top-left transform scale-[0.25] w-[400%] h-[400%] pointer-events-none">
                                    <JourneySlide slide={slide} scale={1} />
                                </div>

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <p className="text-white font-bold">Preview</p>
                                </div>
                            </div>

                            {/* CONTROLS */}
                            <div className="flex flex-col gap-2">
                                <h3 className="text-white font-bold text-sm truncate">{slide.filename}</h3>
                                <button
                                    onClick={() => generateImage(slide)}
                                    disabled={generatingId}
                                    className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all
                                        ${generatingId === slide.id
                                            ? 'bg-slate-800 text-slate-400 cursor-wait'
                                            : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg'
                                        }`}
                                >
                                    {generatingId === slide.id ? (
                                        <Loader2 size={14} className="animate-spin" />
                                    ) : (
                                        <Download size={14} />
                                    )}
                                    Download PNG
                                </button>
                            </div>

                            {/* HIDDEN RENDER TARGET (Full Size) */}
                            <div className="fixed top-0 left-0 pointer-events-none opacity-0 overflow-hidden" style={{ width: 0, height: 0 }}>
                                <div ref={el => previewRefs.current[slide.id] = el}>
                                    <JourneySlide slide={slide} scale={1} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
