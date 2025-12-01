import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Play, Pause, EyeOff, Type, Layout, Image as ImageIcon, Smartphone, Shield, Box, Sparkles, Grid, Monitor, Download, UserCircle, Video, X } from 'lucide-react';
import Starfield from '../components/experience/Starfield.jsx';
import GoldenTicket from '../components/experience/GoldenTicket.jsx';
import { DeviceFrame, SafeZone } from '../components/experience/StudioOverlays.jsx';
import { NetWorthCard, SubscriptionCard, NotificationToast } from '../components/experience/MarketingComponents.jsx';
import { ProblemScenarioView } from '../components/experience/ProblemScenarioView.jsx';
import { ArchetypesScenarioView } from '../components/experience/ArchetypesScenarioView.jsx';
import { NestIcon } from '../components/NestIcon.jsx';

// Make sure you created this file from the previous step!
import { NestProfilePic } from '../components/NestProfilePic.jsx';
import { NestLinkedInPic } from '../components/NestLinkedInPic.jsx';
import { NestCompanyAssets } from '../components/NestCompanyAssets.jsx';
import { HighlightGenerator } from '../components/experience/HighlightGenerator.jsx';
import { NestHighlightIcons } from '../components/demo/NestHighlightIcons.jsx';

// Dashboard Views
import ArchitectView from './ArchitectView.jsx';
import PropertyTycoonView from './PropertyTycoonView.jsx';
import DebtDestroyerView from './DebtDestroyerView.jsx';
import CollaboratorView from './CollaboratorView.jsx';

const ASPECT_RATIOS = {
    'story': { width: 360, height: 640, label: 'Story (9:16)' },
    'post': { width: 400, height: 500, label: 'Post (4:5)' },
    'landscape': { width: 640, height: 360, label: 'Landscape (16:9)' },
};

const COMPONENTS = {
    'ticket': { label: 'Golden Ticket', icon: Box },
    'networth': { label: 'Net Worth', icon: Box },
    'subscription': { label: 'Sub Killer', icon: Box },
    'toast': { label: 'Notification', icon: Box },
    'dashboards': { label: 'Archetypes', icon: Layout },
    'problem_visuals': { label: 'The Problem', icon: Sparkles },
    'logo': { label: 'Logo (Transparent)', icon: Sparkles },
    'profile_pic': { label: 'Insta Profile', icon: UserCircle },
    'linkedin_pic': { label: 'LinkedIn', icon: UserCircle },
    'linkedin_company': { label: 'Company Page', icon: Layout },
    'highlights': { label: 'Highlight Gen', icon: Video },
};

const FRAMES = {
    'none': { label: 'None' },
    'iphone': { label: 'iPhone 15' },
    'window': { label: 'macOS' },
};

const PLATFORMS = {
    'none': { label: 'None' },
    'tiktok': { label: 'TikTok/Reels' },
    'twitter': { label: 'Twitter' },
};

const SCENARIOS = {
    'compound': { label: 'The Compound Effect', icon: Sparkles },
    'trap': { label: 'Subscription Trap', icon: Sparkles },
    'reveal': { label: 'Golden Reveal', icon: Sparkles },
    'archetypes_scroll': { label: 'Archetype Tour', icon: Sparkles },
    'archetypes_cinematic': { label: 'Archetypes (Cinematic)', icon: Layout },
    'problem': { label: 'The Problem', icon: Sparkles },
};

const LAYOUTS = {
    'center': { label: 'Focus', icon: Monitor },
    'showcase': { label: 'Showcase', icon: Grid },
};

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getFrameWidth = (aspectRatio, deviceFrame) => {
    if (deviceFrame === 'none') return '100%';
    const ratio = ASPECT_RATIOS[aspectRatio];
    return `${ratio.width + 40}px`;
};

const getFrameHeight = (aspectRatio, deviceFrame) => {
    if (deviceFrame === 'none') return '100%';
    const ratio = ASPECT_RATIOS[aspectRatio];
    return `${ratio.height + 40}px`;
};

const getInnerWidth = (aspectRatio, deviceFrame) => {
    if (deviceFrame === 'none') return '100%';
    return `${ASPECT_RATIOS[aspectRatio].width}px`;
};

const getInnerHeight = (aspectRatio, deviceFrame) => {
    if (deviceFrame === 'none') return '100%';
    return `${ASPECT_RATIOS[aspectRatio].height}px`;
};

const getFrameClasses = (deviceFrame) => {
    switch (deviceFrame) {
        case 'iphone': return 'border-[12px] border-slate-800 bg-slate-950 shadow-2xl';
        case 'window': return 'border border-slate-700 bg-slate-900 shadow-xl rounded-lg';
        default: return '';
    }
};

const getSafeZoneClasses = (safeZone, aspectRatio) => {
    if (safeZone === 'none') return 'hidden';
    // Simplified logic for safe zones
    return 'inset-8';
};

export default function SocialAssetsPage() {
    // --- State Management ---
    const [aspectRatio, setAspectRatio] = useState('story');
    const [activeComponent, setActiveComponent] = useState('ticket');
    const [deviceFrame, setDeviceFrame] = useState('none');
    const [safeZone, setSafeZone] = useState('none');
    const [layoutMode, setLayoutMode] = useState('center');

    const [text, setText] = useState('Invite Code');
    const [subtext, setSubtext] = useState('Member Name');
    const [value, setValue] = useState('£142,500');

    const [showcaseTitle, setShowcaseTitle] = useState('Track Your Net Worth');
    const [showcaseCaption, setShowcaseCaption] = useState('Real-time asset tracking across all your accounts.');

    const [autoPlay, setAutoPlay] = useState(false);
    const [cleanMode, setCleanMode] = useState(false);
    const [bgType, setBgType] = useState('starfield');
    const [isPlayingScenario, setIsPlayingScenario] = useState(false);
    const [scrollIndex, setScrollIndex] = useState(0);
    const [problemStep, setProblemStep] = useState('intro');
    const [exportingLogo, setExportingLogo] = useState(false);
    const [exportingGif, setExportingGif] = useState(false);
    const [exportMessage, setExportMessage] = useState(null);
    const [exportGifMessage, setExportGifMessage] = useState(null);
    const logoRef = useRef(null);

    // Toggle clean mode with Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setCleanMode(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const currentRatio = ASPECT_RATIOS[aspectRatio];
    const isTransparentBg = bgType === 'transparent';

    // --- Scenario Logic ---
    const runScenario = async (scenarioId) => {
        if (isPlayingScenario) return;
        setIsPlayingScenario(true);
        setCleanMode(true); // Auto-hide UI

        try {
            if (scenarioId === 'compound') {
                setActiveComponent('networth');
                setValue('£10,000');
                setText('Total Net Worth');
                await wait(1000);

                const start = 10000;
                const end = 142500;
                const duration = 3000;
                const steps = 60;
                const increment = (end - start) / steps;

                for (let i = 0; i <= steps; i++) {
                    setValue('£' + Math.floor(start + (increment * i)).toLocaleString());
                    await wait(duration / steps);
                }

                setActiveComponent('toast');
                setText('Milestone Reached');
                setSubtext('🎉 Welcome to the £100k Club');
                await wait(3000);
                setActiveComponent('networth');
            }

            if (scenarioId === 'trap') {
                setActiveComponent('subscription');
                setText('Netflix');
                setValue('£15.99');
                await wait(1500);

                setActiveComponent('toast');
                setText('Price Hike Detected');
                setSubtext('⚠️ Netflix is increasing prices by 12%');
                await wait(2500);

                setActiveComponent('subscription');
                setValue('£17.99');
                await wait(1000);
            }

            if (scenarioId === 'reveal') {
                setActiveComponent('ticket');
                setAutoPlay(false);
                setText('');
                setSubtext('');
                await wait(1000);

                setAutoPlay(true);
                await wait(2000);
                setText('Welcome to Nest');
                await wait(500);
                setSubtext('Your invite is ready');
                await wait(3000);
            }

            if (scenarioId === 'archetypes_scroll') {
                setActiveComponent('dashboards');
                setDeviceFrame('iphone');
                for (let i = 0; i < 4; i++) {
                    setScrollIndex(i);
                    await wait(4000);
                }
                setScrollIndex(0);
            }

            if (scenarioId === 'problem') {
                setActiveComponent('problem_visuals');
                setDeviceFrame('none');
                setProblemStep('intro'); await wait(3000);
                setProblemStep('alone'); await wait(5000);
                setProblemStep('guilt'); await wait(5000);
                setProblemStep('hope'); await wait(4000);
                setProblemStep('reveal'); await wait(6000);
            }

            if (scenarioId === 'archetypes_cinematic') {
                setActiveComponent('archetypes_cinematic');
                setDeviceFrame('none');
                setProblemStep('intro'); await wait(1500);
                setProblemStep('architect'); await wait(3000);
                setProblemStep('steward'); await wait(3000);
                setProblemStep('ascender'); await wait(3000);
                setProblemStep('collaborator'); await wait(3000);
                setProblemStep('grid'); await wait(3000);
                setProblemStep('message'); await wait(3000);
                setProblemStep('outro'); await wait(3000);
            }

        } catch (e) {
            console.error(e);
        } finally {
            setIsPlayingScenario(false);
            setCleanMode(false);
        }
    };

    // --- FIX: Updated Capture Function for High Res ---
    const captureSvgFrame = async (svg, targetWidth = null, targetHeight = null) => {
        console.log('Starting capture...');

        const clone = svg.cloneNode(true);
        const viewBox = svg.getAttribute('viewBox')?.split(' ').map(Number);
        const originalWidth = viewBox?.[2] || svg.clientWidth || 512;
        const originalHeight = viewBox?.[3] || svg.clientHeight || 512;

        const width = targetWidth || originalWidth;
        const height = targetHeight || originalHeight;
        console.log(`Export dimensions: ${width}x${height}`);

        clone.setAttribute('width', width);
        clone.setAttribute('height', height);
        clone.style.width = `${width}px`;
        clone.style.height = `${height}px`;

        const serializer = new XMLSerializer();
        const source = serializer.serializeToString(clone);
        const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        try {
            const pngDataUrl = await new Promise((resolve, reject) => {
                const image = new Image();
                image.crossOrigin = 'Anonymous';

                image.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.clearRect(0, 0, width, height);
                    ctx.drawImage(image, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/png'));
                };

                image.onerror = (e) => {
                    console.error('Image load failed:', e);
                    reject(new Error('Failed to render SVG to image'));
                };

                image.src = url;
            });

            return { pngDataUrl, width, height };
        } finally {
            URL.revokeObjectURL(url);
        }
    };

    // --- FIX: Updated Export Function to use 1080p ---
    const exportLogoAsPng = async () => {
        if (activeComponent !== 'logo') {
            alert('Error: Active component is not logo.');
            return;
        }
        if (!logoRef.current) {
            alert('Error: Could not find the Logo element on screen. Please refresh and try again.');
            return;
        }

        setExportingLogo(true);
        setExportMessage('Preparing 1080p export...');

        try {
            const svg = logoRef.current.querySelector('svg');
            if (!svg) throw new Error('Missing logo SVG element in DOM. Make sure the logo is visible.');

            // Force 1080x1080 resolution here
            const { pngDataUrl } = await captureSvgFrame(svg, 1080, 1080);

            const link = document.createElement('a');
            link.download = `nest-logo-1080p-${Date.now()}.png`;
            link.href = pngDataUrl;
            link.click();

            setExportMessage('Logo exported as 1080p transparent PNG.');
        } catch (error) {
            console.error('Export Error:', error);
            setExportMessage('Export failed. Check console.');
            alert('Export failed: ' + error.message);
        } finally {
            setExportingLogo(false);
        }
    };

    // Helper for GIF generation
    const loadGifshot = () =>
        new Promise((resolve, reject) => {
            if (typeof window !== 'undefined' && window.gifshot) {
                resolve(window.gifshot);
                return;
            }
            const existing = document.querySelector('script[data-gifshot]');
            if (existing) {
                existing.addEventListener('load', () => resolve(window.gifshot));
                existing.addEventListener('error', () => reject(new Error('gifshot failed to load')));
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/gifshot@0.4.5/build/gifshot.min.js';
            script.async = true;
            script.dataset.gifshot = 'true';
            script.onload = () => {
                if (window.gifshot) {
                    resolve(window.gifshot);
                } else {
                    reject(new Error('gifshot failed to load'));
                }
            };
            script.onerror = () => reject(new Error('gifshot failed to load'));
            document.body.appendChild(script);
        });

    const exportLogoAsGif = async () => {
        if (activeComponent !== 'logo' || !logoRef.current) return;
        setExportingGif(true);
        setExportGifMessage(null);

        try {
            const svg = logoRef.current.querySelector('svg');
            if (!svg) throw new Error('Missing logo SVG element');

            const frames = [];
            let width = 0;
            let height = 0;
            const frameCount = 24;
            const frameDelayMs = 80; // ~12.5 FPS

            for (let i = 0; i < frameCount; i += 1) {
                const frame = await captureSvgFrame(svg);
                frames.push(frame.pngDataUrl);
                width = frame.width;
                height = frame.height;
                await wait(frameDelayMs);
            }

            const gifshotLib = await loadGifshot();

            const gifDataUrl = await new Promise((resolve, reject) => {
                gifshotLib.createGIF(
                    {
                        images: frames,
                        gifWidth: width,
                        gifHeight: height,
                        interval: frameDelayMs / 1000,
                        numFrames: frames.length,
                        crossOrigin: 'Anonymous',
                        sampleInterval: 10,
                        numWorkers: 2,
                    },
                    (obj) => {
                        if (!obj.error) {
                            resolve(obj.image);
                        } else {
                            reject(new Error(obj.error));
                        }
                    },
                );
            });

            const link = document.createElement('a');
            link.download = `nest-logo-animated-${Date.now()}.gif`;
            link.href = gifDataUrl;
            link.click();

            setExportGifMessage('Animated GIF exported!');
        } catch (error) {
            console.error('GIF Export Error:', error);
            setExportGifMessage('GIF export failed. Check console.');
            alert('GIF export failed: ' + error.message);
        } finally {
            setExportingGif(false);
        }
    };

    const renderComponent = () => {
        switch (activeComponent) {
            case 'notification':
                return <NotificationToast title={text || "Budget Alert"} message={subtext || "You exceeded your limit."} />;
            case 'problem_visuals':
                return <ProblemScenarioView step={problemStep} />;
            case 'dashboards':
                const isMobile = deviceFrame === 'iphone';
                const mobileScale = 0.85;
                return (
                    <div className="h-full w-full overflow-hidden relative bg-slate-950">
                        <motion.div
                            animate={{ y: `-${scrollIndex * 100}%` }}
                            transition={{ type: 'spring', stiffness: 40, damping: 20 }}
                            className="h-[400%] w-full flex flex-col"
                            style={{
                                width: isMobile ? `${100 / mobileScale}%` : '100%',
                                height: isMobile ? `${400 / mobileScale}%` : '400%',
                                transform: isMobile ? `scale(${mobileScale})` : 'none',
                                transformOrigin: 'top left'
                            }}
                        >
                            <div className="h-1/4 w-full overflow-hidden relative"><div className="absolute inset-0 overflow-y-auto scrollbar-hide"><ArchitectView /></div></div>
                            <div className="h-1/4 w-full overflow-hidden relative"><div className="absolute inset-0 overflow-y-auto scrollbar-hide"><PropertyTycoonView /></div></div>
                            <div className="h-1/4 w-full overflow-hidden relative"><div className="absolute inset-0 overflow-y-auto scrollbar-hide"><DebtDestroyerView /></div></div>
                            <div className="h-1/4 w-full overflow-hidden relative"><div className="absolute inset-0 overflow-y-auto scrollbar-hide"><CollaboratorView /></div></div>
                        </motion.div>
                    </div>
                );
            case 'archetypes_cinematic':
                return <ArchetypesScenarioView step={problemStep} />;
            case 'highlights':
                return (
                    <div className="w-full h-full bg-slate-950 overflow-y-auto p-8">
                        <div className="max-w-7xl mx-auto space-y-12">
                            {/* Section 1: Instagram Story Journey */}
                            <section>
                                <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                                    <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                                        <Sparkles size={20} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Instagram Story Journey</h2>
                                        <p className="text-sm text-slate-400">7-slide narrative sequence (1080x1920)</p>
                                    </div>
                                </div>
                                <HighlightGenerator />
                            </section>

                            {/* Section 2: Instagram Highlight Covers */}
                            <section>
                                <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                                    <div className="p-2 rounded-lg bg-pink-500/20 text-pink-400">
                                        <Layout size={20} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Instagram Highlight Covers</h2>
                                        <p className="text-sm text-slate-400">7 circular category icons (1080x1080)</p>
                                    </div>
                                </div>
                                <NestHighlightIcons />
                            </section>
                        </div>
                    </div>
                );
            case 'logo':
                return (
                    <div ref={logoRef} className="relative flex items-center justify-center w-full h-full p-6">
                        <NestIcon size={320} showGlow={!isTransparentBg} glowOpacity={isTransparentBg ? 0 : 0.5} />
                    </div>
                );
            case 'profile_pic':
                return (
                    <div className="relative flex items-center justify-center w-full h-full p-6">
                        <NestProfilePic showControls={true} />
                    </div>
                );
            case 'linkedin_pic':
                return (
                    <div className="relative flex items-center justify-center w-full h-full p-6">
                        <NestLinkedInPic showControls={true} />
                    </div>
                );
            case 'linkedin_company':
                return (
                    <div className="flex items-center justify-center w-full h-full bg-slate-900 overflow-y-auto">
                        <NestCompanyAssets />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-slate-950">
            {/* 1. Main Content Area */}
            <div className="relative flex h-full w-full items-center justify-center">
                {/* Background */}
                {bgType === 'starfield' && <Starfield />}
                {bgType === 'gradient' && <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-purple-900 opacity-75" />}
                {bgType === 'solid' && <div className="absolute inset-0 bg-slate-900" />}

                {/* Conditional Rendering for Full Screen vs Device Frame */}
                {(activeComponent === 'highlights' || activeComponent === 'linkedin_company') ? (
                    // Full Screen Mode for Tools
                    <div className="relative w-full h-full overflow-hidden z-10">
                        {renderComponent()}
                    </div>
                ) : (
                    // Device Frame Mode for Previews
                    <div className={`relative flex items-center justify-center ${FRAMES[deviceFrame].className}`}>
                        <div className={`relative flex items-center justify-center overflow-hidden rounded-[inherit] bg-slate-950 ${ASPECT_RATIOS[aspectRatio].className}`}>
                            {/* Safe Zones */}
                            {safeZone !== 'none' && (
                                <div className={`absolute inset-0 flex items-center justify-center border-2 border-dashed border-rose-500/50 ${PLATFORMS[safeZone].className}`}>
                                    <span className="absolute top-2 left-2 text-[8px] font-bold uppercase text-rose-500/70">{PLATFORMS[safeZone].label} Safe Zone</span>
                                </div>
                            )}

                            {/* Render Active Component */}
                            {renderComponent()}
                        </div>
                    </div>
                )}
            </div>

            {/* 2. Showcase Overlay */}
            {layoutMode === 'showcase' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center text-white"
                >
                    <h1 className="text-4xl font-bold">{showcaseTitle}</h1>
                    <p className="text-lg text-slate-400">{showcaseCaption}</p>
                </motion.div>
            )}

            {/* 3. Controls Panel */}
            <AnimatePresence>
                {!cleanMode && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="absolute right-0 top-0 z-20 h-full w-80 overflow-y-auto border-l border-white/10 bg-slate-900/90 p-6 backdrop-blur-lg scrollbar-hide"
                    >
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-white">Nest Studio</h2>
                            <button onClick={() => setCleanMode(true)} className="rounded-full bg-white/5 p-2 text-slate-400 hover:bg-white/10">
                                <X size={16} />
                            </button>
                        </div>

                        {/* Layout Mode */}
                        <div className="mb-6 space-y-3">
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2"><Grid size={12} /> Layout Mode</label>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.entries(LAYOUTS).map(([key, { label, icon: Icon }]) => (
                                    <button key={key} onClick={() => setLayoutMode(key)} className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-[10px] font-bold transition-all ${layoutMode === key ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>{label}</button>
                                ))}
                            </div>
                        </div>

                        {layoutMode === 'showcase' && (
                            <div className="mb-6 space-y-3">
                                <label className="text-xs font-medium text-indigo-400 uppercase tracking-wider flex items-center gap-2"><Type size={12} /> Showcase Text</label>
                                <div className="space-y-2">
                                    <input type="text" value={showcaseTitle} onChange={(e) => setShowcaseTitle(e.target.value)} className="w-full rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-2 text-xs text-white placeholder-indigo-300 focus:border-indigo-500 focus:outline-none transition-colors" placeholder="Main Headline" />
                                    <textarea value={showcaseCaption} onChange={(e) => setShowcaseCaption(e.target.value)} className="w-full rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-2 text-xs text-white placeholder-indigo-300 focus:border-indigo-500 focus:outline-none transition-colors resize-none" placeholder="Subtitle / Caption" rows={3} />
                                </div>
                            </div>
                        )}

                        <div className="my-6 h-px bg-white/10" />

                        {/* Magic Moments */}
                        <div className="mb-6 space-y-3">
                            <label className="text-xs font-medium text-amber-400 uppercase tracking-wider flex items-center gap-2"><Sparkles size={12} /> Magic Moments</label>
                            <div className="space-y-2">
                                {Object.entries(SCENARIOS).map(([key, { label }]) => (
                                    <button key={key} onClick={() => runScenario(key)} disabled={isPlayingScenario} className="flex w-full items-center justify-between rounded-lg bg-amber-500/10 px-3 py-2 text-xs font-bold text-amber-200 hover:bg-amber-500/20 disabled:opacity-50 transition-all">{label} <Play size={10} /></button>
                                ))}
                            </div>
                        </div>

                        <div className="my-6 h-px bg-white/10" />

                        {/* Component Selector */}
                        <div className="mb-6 space-y-3">
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2"><Box size={12} /> Component</label>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.entries(COMPONENTS).map(([key, { label }]) => (
                                    <button key={key} onClick={() => setActiveComponent(key)} className={`rounded-lg px-3 py-2 text-[10px] font-bold transition-all ${activeComponent === key ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>{label}</button>
                                ))}
                            </div>
                        </div>

                        {/* MAIN LOGO EXPORT CONTROLS */}
                        {activeComponent === 'logo' && (
                            <div className="mb-6 space-y-3">
                                <label className="text-xs font-medium text-emerald-400 uppercase tracking-wider flex items-center gap-2"><Download size={12} /> Logo Export</label>
                                <div className="grid grid-cols-1 gap-2">
                                    <button onClick={exportLogoAsPng} disabled={exportingLogo} className={`flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${exportingLogo ? 'bg-white/10 text-slate-500 cursor-wait' : 'bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30 border border-emerald-500/20'}`}>{exportingLogo ? 'Exporting…' : 'Download PNG (1080p)'}</button>
                                    <button onClick={exportLogoAsGif} disabled={exportingGif || exportingLogo} className={`flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${exportingGif ? 'bg-white/10 text-slate-500 cursor-wait' : 'bg-indigo-500/20 text-indigo-100 hover:bg-indigo-500/30 border border-indigo-500/20'}`}>{exportingGif ? 'Building GIF…' : 'Download GIF (Animated)'}</button>
                                </div>
                                {exportMessage && <p className="text-[10px] text-slate-400">{exportMessage}</p>}
                                {exportGifMessage && <p className="text-[10px] text-slate-400">{exportGifMessage}</p>}
                            </div>
                        )}

                        {/* INSTAGRAM PROFILE HINT */}
                        {activeComponent === 'profile_pic' && (
                            <div className="mb-6 p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                                <p className="text-[10px] text-indigo-200 leading-relaxed">
                                    The download button for the Instagram Profile Picture is located directly below the image in the main view.
                                </p>
                            </div>
                        )}

                        {/* Aspect Ratio */}
                        <div className="mb-6 space-y-3">
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2"><Layout size={12} /> Format</label>
                            <div className="grid grid-cols-3 gap-2">
                                {Object.entries(ASPECT_RATIOS).map(([key, { label }]) => (
                                    <button key={key} onClick={() => setAspectRatio(key)} className={`rounded-lg px-3 py-2 text-[10px] font-bold transition-all ${aspectRatio === key ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>{key.charAt(0).toUpperCase() + key.slice(1)}</button>
                                ))}
                            </div>
                        </div>

                        {/* Device Frame */}
                        <div className="mb-6 space-y-3">
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2"><Smartphone size={12} /> Device Frame</label>
                            <div className="grid grid-cols-3 gap-2">
                                {Object.entries(FRAMES).map(([key, { label }]) => (
                                    <button key={key} onClick={() => setDeviceFrame(key)} className={`rounded-lg px-3 py-2 text-[10px] font-bold transition-all ${deviceFrame === key ? 'bg-indigo-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>{label}</button>
                                ))}
                            </div>
                        </div>

                        {/* Safe Zones */}
                        <div className="mb-6 space-y-3">
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2"><Shield size={12} /> Safe Zones</label>
                            <div className="grid grid-cols-3 gap-2">
                                {Object.entries(PLATFORMS).map(([key, { label }]) => (
                                    <button key={key} onClick={() => setSafeZone(key)} className={`rounded-lg px-3 py-2 text-[10px] font-bold transition-all ${safeZone === key ? 'bg-rose-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>{label}</button>
                                ))}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="mb-6 space-y-3">
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2"><Type size={12} /> Content Mixer</label>
                            <div className="space-y-2">
                                <input type="text" value={text} onChange={(e) => setText(e.target.value)} className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none transition-colors" placeholder="Primary Text" />
                                <input type="text" value={subtext} onChange={(e) => setSubtext(e.target.value)} className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none transition-colors" placeholder="Secondary Text" />
                                <input type="text" value={value} onChange={(e) => setValue(e.target.value)} className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none transition-colors" placeholder="Value / Cost" />
                            </div>
                        </div>

                        {/* Animation */}
                        <div className="mb-6 space-y-3">
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2"><Play size={12} /> Animation</label>
                            <button onClick={() => setAutoPlay(!autoPlay)} className={`flex w-full items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all ${autoPlay ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>{autoPlay ? <Pause size={14} /> : <Play size={14} />}{autoPlay ? 'Auto-Play Active' : 'Start Animation'}</button>
                        </div>

                        {/* Background */}
                        <div className="space-y-3">
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2"><ImageIcon size={12} /> Background</label>
                            <div className="flex gap-2">
                                {['starfield', 'gradient', 'solid', 'transparent'].map((type) => (
                                    <button key={type} onClick={() => setBgType(type)} className={`flex-1 rounded-lg py-1.5 text-[10px] font-bold uppercase transition-all ${bgType === type ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}>{type}</button>
                                ))}
                            </div>
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>

            {/* 4. Clean Mode Hint */}
            <AnimatePresence>
                {cleanMode && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-[10px] text-slate-400 backdrop-blur-md border border-white/5">Press ESC to show controls</motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}