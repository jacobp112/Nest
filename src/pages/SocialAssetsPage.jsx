import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Play, Pause, EyeOff, Type, Layout, Image as ImageIcon, Smartphone, Shield, Box, Sparkles, Grid, Monitor } from 'lucide-react';
import Starfield from '../components/experience/Starfield.jsx';
import GoldenTicket from '../components/experience/GoldenTicket.jsx';
import { DeviceFrame, SafeZone } from '../components/experience/StudioOverlays.jsx';
import { NetWorthCard, SubscriptionCard, NotificationToast } from '../components/experience/MarketingComponents.jsx';
import { ProblemScenarioView } from '../components/experience/ProblemScenarioView.jsx';
import { ArchetypesScenarioView } from '../components/experience/ArchetypesScenarioView.jsx';

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

    // --- Scenario Logic ---
    const runScenario = async (scenarioId) => {
        if (isPlayingScenario) return;
        setIsPlayingScenario(true);
        setCleanMode(true); // Auto-hide UI

        try {
            if (scenarioId === 'compound') {
                // Setup
                setActiveComponent('networth');
                setValue('£10,000');
                setText('Total Net Worth');
                await wait(1000);

                // Action
                const start = 10000;
                const end = 142500;
                const duration = 3000;
                const steps = 60;
                const increment = (end - start) / steps;

                for (let i = 0; i <= steps; i++) {
                    setValue('£' + Math.floor(start + (increment * i)).toLocaleString());
                    await wait(duration / steps);
                }

                // Climax
                setActiveComponent('toast');
                setText('Milestone Reached');
                setSubtext('🎉 Welcome to the £100k Club');
                await wait(3000);
                setActiveComponent('networth');
            }

            if (scenarioId === 'trap') {
                // Setup
                setActiveComponent('subscription');
                setText('Netflix');
                setValue('£15.99');
                await wait(1500);

                // Suspense
                setActiveComponent('toast');
                setText('Price Hike Detected');
                setSubtext('⚠️ Netflix is increasing prices by 12%');
                await wait(2500);

                // Reveal
                setActiveComponent('subscription');
                setValue('£17.99'); // Price jump
                await wait(1000);
            }

            if (scenarioId === 'reveal') {
                // Setup
                setActiveComponent('ticket');
                setAutoPlay(false);
                setText('');
                setSubtext('');
                await wait(1000);

                // Action
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

                // Cycle through dashboards
                for (let i = 0; i < 4; i++) {
                    setScrollIndex(i);
                    await wait(4000); // Hold on each dashboard
                }

                // Reset to start
                setScrollIndex(0);
            }

            // Updated Timing for The Problem Scenario
            if (scenarioId === 'problem') {
                setActiveComponent('problem_visuals');
                setDeviceFrame('none'); // Full screen feel

                // 1. Intro
                setProblemStep('intro');
                await wait(3000);

                // 2. Alone
                setProblemStep('alone');
                await wait(5000);

                // 3. Guilt
                setProblemStep('guilt');
                await wait(5000);

                // 4. Hope
                setProblemStep('hope');
                await wait(4000);

                // 5. Reveal
                setProblemStep('reveal');
                await wait(6000);
            }

            if (scenarioId === 'archetypes_cinematic') {
                setActiveComponent('archetypes_cinematic');
                setDeviceFrame('none');

                // 0:00 - 0:01 Fade in
                setProblemStep('intro');
                await wait(1500);

                // 0:01 - 0:03 Architect
                setProblemStep('architect');
                await wait(3000);

                // 0:03 - 0:06 Steward
                setProblemStep('steward');
                await wait(3000);

                // 0:06 - 0:09 Ascender
                setProblemStep('ascender');
                await wait(3000);

                // 0:09 - 0:12 Collaborator
                setProblemStep('collaborator');
                await wait(3000);

                // 0:12 - 0:15 Grid Snap
                setProblemStep('grid');
                await wait(3000);

                // 0:15 - 0:18 Message Reveal
                setProblemStep('message');
                await wait(3000);

                // 0:18 - 0:20 Outro
                setProblemStep('outro');
                await wait(3000);
            }

        } catch (e) {
            console.error(e);
        } finally {
            setIsPlayingScenario(false);
            setCleanMode(false); // Show UI again
        }
    };

    // --- Component Rendering Helper ---
    const renderComponent = () => {
        switch (activeComponent) {
            case 'ticket':
                return <GoldenTicket text={text} subtext={subtext} autoPlay={autoPlay} />;
            case 'networth':
                return <NetWorthCard value={value} change="+£3,200" />;
            case 'subscription':
                return <SubscriptionCard name={text || "Netflix"} cost={value || "£15.99"} />;
            case 'toast':
                return <NotificationToast title={text || "Budget Alert"} message={subtext || "You exceeded your limit."} />;
            case 'problem_visuals':
                return <ProblemScenarioView step={problemStep} />;
            case 'dashboards':
                const isMobile = deviceFrame === 'iphone';
                // Scale content for mobile to give it more breathing room (render at ~460px, scale to 393px)
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
                            <div className="h-1/4 w-full overflow-hidden relative">
                                <div className="absolute inset-0 overflow-y-auto scrollbar-hide">
                                    <ArchitectView />
                                </div>
                            </div>
                            <div className="h-1/4 w-full overflow-hidden relative">
                                <div className="absolute inset-0 overflow-y-auto scrollbar-hide">
                                    <PropertyTycoonView />
                                </div>
                            </div>
                            <div className="h-1/4 w-full overflow-hidden relative">
                                <div className="absolute inset-0 overflow-y-auto scrollbar-hide">
                                    <DebtDestroyerView />
                                </div>
                            </div>
                            <div className="h-1/4 w-full overflow-hidden relative">
                                <div className="absolute inset-0 overflow-y-auto scrollbar-hide">
                                    <CollaboratorView />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                );
            case 'archetypes_cinematic':
                return <ArchetypesScenarioView step={problemStep} />;
            default:
                return null;
        }
    };

    // --- Main Layout Render ---
    return (
        <div className="relative h-screen w-screen overflow-hidden bg-slate-950 flex items-center justify-center">

            {/* 1. Background Layer */}
            <div className="absolute inset-0 z-0">
                {bgType === 'starfield' && (
                    <Starfield density={1500} speed={0.2} className="opacity-60" />
                )}
                {bgType === 'gradient' && (
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900" />
                )}
                {bgType === 'solid' && (
                    <div className="absolute inset-0 bg-slate-950" />
                )}
            </div>

            {/* 2. The Stage */}
            <motion.div
                layout
                className={`relative z-10 flex items-center justify-center transition-all duration-500 ${layoutMode === 'center' && deviceFrame === 'none' ? 'border border-white/5 shadow-2xl bg-black/20 backdrop-blur-sm' : ''
                    } ${layoutMode === 'showcase' ? 'w-full max-w-6xl px-12 gap-12' : ''
                    }`}
                style={{
                    width: layoutMode === 'center' && deviceFrame === 'none' ? currentRatio.width :
                        deviceFrame === 'window' ? 1024 : 'auto',
                    height: layoutMode === 'center' && deviceFrame === 'none' ? currentRatio.height :
                        deviceFrame === 'window' ? 640 : 'auto',
                    borderColor: cleanMode ? 'transparent' : 'rgba(255,255,255,0.1)',
                    flexDirection: aspectRatio === 'landscape' ? 'row' : 'column'
                }}
            >
                {layoutMode === 'showcase' && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex flex-col justify-center ${aspectRatio === 'landscape' ? 'text-left items-start w-1/2' : 'text-center items-center w-full mb-8'}`}
                    >
                        <h1 className="text-5xl font-bold text-white mb-4 leading-tight tracking-tight drop-shadow-lg">
                            {showcaseTitle}
                        </h1>
                        <p className="text-xl text-slate-300 font-medium max-w-md leading-relaxed drop-shadow-md">
                            {showcaseCaption}
                        </p>
                    </motion.div>
                )}

                <div className={`${layoutMode === 'showcase' ? 'relative' : ''} h-full w-full`}>
                    <DeviceFrame type={deviceFrame}>
                        <div className={`relative flex items-center justify-center h-full w-full ${deviceFrame !== 'none' ? 'bg-slate-950' : ''}`}>
                            <SafeZone platform={safeZone} visible={!cleanMode && layoutMode === 'center'} />
                            {renderComponent()}
                        </div>
                    </DeviceFrame>
                </div>
            </motion.div>

            {/* 3. Control Panel */}
            <AnimatePresence>
                {!cleanMode && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="absolute right-8 top-8 z-50 w-80 max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-slate-900/80 p-6 backdrop-blur-xl shadow-2xl scrollbar-hide"
                    >
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="flex items-center gap-2 text-sm font-bold text-white">
                                <Settings size={16} className="text-indigo-400" />
                                Studio Controls
                            </h2>
                            <button
                                onClick={() => setCleanMode(true)}
                                className="rounded-lg bg-white/5 p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                                title="Enter Clean Mode (Press ESC to exit)"
                            >
                                <EyeOff size={16} />
                            </button>
                        </div>

                        {/* Layout Mode */}
                        <div className="mb-6 space-y-3">
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                <Grid size={12} /> Layout Mode
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.entries(LAYOUTS).map(([key, { label, icon: Icon }]) => (
                                    <button
                                        key={key}
                                        onClick={() => setLayoutMode(key)}
                                        className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-[10px] font-bold transition-all ${layoutMode === key
                                            ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                                            : 'bg-white/5 text-slate-400 hover:bg-white/10'
                                            }`}
                                    >
                                        <Icon size={12} />
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {layoutMode === 'showcase' && (
                            <div className="mb-6 space-y-3">
                                <label className="text-xs font-medium text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                                    <Type size={12} /> Showcase Text
                                </label>
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        value={showcaseTitle}
                                        onChange={(e) => setShowcaseTitle(e.target.value)}
                                        className="w-full rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-2 text-xs text-white placeholder-indigo-300 focus:border-indigo-500 focus:outline-none transition-colors"
                                        placeholder="Main Headline"
                                    />
                                    <textarea
                                        value={showcaseCaption}
                                        onChange={(e) => setShowcaseCaption(e.target.value)}
                                        className="w-full rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-2 text-xs text-white placeholder-indigo-300 focus:border-indigo-500 focus:outline-none transition-colors resize-none"
                                        placeholder="Subtitle / Caption"
                                        rows={3}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="my-6 h-px bg-white/10" />

                        {/* Magic Moments */}
                        <div className="mb-6 space-y-3">
                            <label className="text-xs font-medium text-amber-400 uppercase tracking-wider flex items-center gap-2">
                                <Sparkles size={12} /> Magic Moments
                            </label>
                            <div className="space-y-2">
                                {Object.entries(SCENARIOS).map(([key, { label }]) => (
                                    <button
                                        key={key}
                                        onClick={() => runScenario(key)}
                                        disabled={isPlayingScenario}
                                        className="flex w-full items-center justify-between rounded-lg bg-amber-500/10 px-3 py-2 text-xs font-bold text-amber-200 hover:bg-amber-500/20 disabled:opacity-50 transition-all"
                                    >
                                        {label}
                                        <Play size={10} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="my-6 h-px bg-white/10" />

                        {/* Component Selector */}
                        <div className="mb-6 space-y-3">
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                <Box size={12} /> Component
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.entries(COMPONENTS).map(([key, { label }]) => (
                                    <button
                                        key={key}
                                        onClick={() => setActiveComponent(key)}
                                        className={`rounded-lg px-3 py-2 text-[10px] font-bold transition-all ${activeComponent === key
                                            ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                                            : 'bg-white/5 text-slate-400 hover:bg-white/10'
                                            }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Aspect Ratio */}
                        <div className="mb-6 space-y-3">
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                <Layout size={12} /> Format
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {Object.entries(ASPECT_RATIOS).map(([key, { label }]) => (
                                    <button
                                        key={key}
                                        onClick={() => setAspectRatio(key)}
                                        className={`rounded-lg px-3 py-2 text-[10px] font-bold transition-all ${aspectRatio === key
                                            ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                                            : 'bg-white/5 text-slate-400 hover:bg-white/10'
                                            }`}
                                    >
                                        {key.charAt(0).toUpperCase() + key.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Device Frame */}
                        <div className="mb-6 space-y-3">
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                <Smartphone size={12} /> Device Frame
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {Object.entries(FRAMES).map(([key, { label }]) => (
                                    <button
                                        key={key}
                                        onClick={() => setDeviceFrame(key)}
                                        className={`rounded-lg px-3 py-2 text-[10px] font-bold transition-all ${deviceFrame === key
                                            ? 'bg-indigo-500 text-white'
                                            : 'bg-white/5 text-slate-400 hover:bg-white/10'
                                            }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Safe Zones */}
                        <div className="mb-6 space-y-3">
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                <Shield size={12} /> Safe Zones
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {Object.entries(PLATFORMS).map(([key, { label }]) => (
                                    <button
                                        key={key}
                                        onClick={() => setSafeZone(key)}
                                        className={`rounded-lg px-3 py-2 text-[10px] font-bold transition-all ${safeZone === key
                                            ? 'bg-rose-500 text-white'
                                            : 'bg-white/5 text-slate-400 hover:bg-white/10'
                                            }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="mb-6 space-y-3">
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                <Type size={12} /> Content Mixer
                            </label>
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none transition-colors"
                                    placeholder="Primary Text"
                                />
                                <input
                                    type="text"
                                    value={subtext}
                                    onChange={(e) => setSubtext(e.target.value)}
                                    className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none transition-colors"
                                    placeholder="Secondary Text"
                                />
                                <input
                                    type="text"
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none transition-colors"
                                    placeholder="Value / Cost"
                                />
                            </div>
                        </div>

                        {/* Animation */}
                        <div className="mb-6 space-y-3">
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                <Play size={12} /> Animation
                            </label>
                            <button
                                onClick={() => setAutoPlay(!autoPlay)}
                                className={`flex w-full items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all ${autoPlay
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                                    : 'bg-white/5 text-slate-400 hover:bg-white/10'
                                    }`}
                            >
                                {autoPlay ? <Pause size={14} /> : <Play size={14} />}
                                {autoPlay ? 'Auto-Play Active' : 'Start Animation'}
                            </button>
                        </div>

                        {/* Background */}
                        <div className="space-y-3">
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                <ImageIcon size={12} /> Background
                            </label>
                            <div className="flex gap-2">
                                {['starfield', 'gradient', 'solid'].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setBgType(type)}
                                        className={`flex-1 rounded-lg py-1.5 text-[10px] font-bold uppercase transition-all ${bgType === type
                                            ? 'bg-white/20 text-white'
                                            : 'bg-white/5 text-slate-500 hover:bg-white/10'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>

            {/* 4. Clean Mode Hint */}
            <AnimatePresence>
                {cleanMode && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-[10px] text-slate-400 backdrop-blur-md border border-white/5"
                    >
                        Press ESC to show controls
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
