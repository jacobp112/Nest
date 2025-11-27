import React from 'react';
import { Wifi, Battery, Signal, Heart, MessageCircle, Share2, Bookmark, Music2, User } from 'lucide-react';

export const DeviceFrame = ({ type, children }) => {
    if (type === 'iphone') {
        return (
            <div className="relative z-20">
                {/* Outer Frame (Titanium Finish) */}
                <div className="relative h-[852px] w-[393px] overflow-hidden rounded-[55px] bg-slate-900 shadow-2xl ring-4 ring-slate-800 ring-offset-0">

                    {/* Inner Bezel */}
                    <div className="absolute inset-0 rounded-[51px] border-[6px] border-black pointer-events-none z-50"></div>

                    {/* Dynamic Island Area */}
                    <div className="absolute left-1/2 top-3 z-50 h-[36px] w-[126px] -translate-x-1/2 rounded-full bg-black flex items-center justify-center">
                        {/* Camera Lens Reflection */}
                        <div className="absolute right-3 h-3 w-3 rounded-full bg-[#1c1c1c] shadow-inner" />
                        <div className="absolute right-3 h-1 w-1 rounded-full bg-blue-900/40 blur-[1px]" />
                    </div>

                    {/* Status Bar */}
                    <div className="absolute top-0 left-0 right-0 z-40 flex h-14 w-full items-end justify-between px-7 pb-2 text-white/90">
                        <div className="pl-2 text-[15px] font-semibold tracking-wide">9:41</div>
                        <div className="flex items-center gap-1.5 pr-2">
                            <Signal size={16} fill="currentColor" />
                            <Wifi size={16} strokeWidth={3} />
                            <div className="relative">
                                <Battery size={20} />
                                <div className="absolute inset-0.5 right-1.5 bg-white rounded-[1px]" />
                            </div>
                        </div>
                    </div>

                    {/* Screen Content */}
                    <div className="h-full w-full overflow-hidden bg-slate-950 rounded-[48px]">
                        {children}
                    </div>

                    {/* Home Indicator */}
                    <div className="absolute bottom-2 left-1/2 z-50 h-1.5 w-[140px] -translate-x-1/2 rounded-full bg-white/40 backdrop-blur-md" />

                    {/* Screen Glare/Reflection (Subtle) */}
                    <div className="absolute inset-0 z-40 pointer-events-none bg-gradient-to-tr from-white/5 to-transparent opacity-20 rounded-[55px]" />
                </div>
            </div>
        );
    }

    if (type === 'window') {
        return (
            <div className="relative overflow-hidden rounded-xl border border-white/10 bg-slate-950 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)]">
                {/* Window Header */}
                <div className="flex h-11 items-center gap-2 border-b border-white/5 bg-white/5 px-4 backdrop-blur-md">
                    <div className="flex gap-2 group">
                        <div className="h-3 w-3 rounded-full bg-[#FF5F57] shadow-sm flex items-center justify-center text-[8px] font-bold text-black/50 opacity-100" />
                        <div className="h-3 w-3 rounded-full bg-[#FEBC2E] shadow-sm" />
                        <div className="h-3 w-3 rounded-full bg-[#28C840] shadow-sm" />
                    </div>
                    <div className="flex-1 text-center text-xs font-medium text-slate-400/80 font-sans">Nest Finance Studio</div>
                    <div className="w-10" /> {/* Spacer for centering */}
                </div>
                <div className="relative">
                    {children}
                </div>
            </div>
        );
    }

    // Fallback/None
    return <div className="relative shadow-2xl h-full w-full">{children}</div>;
};

export const SafeZone = ({ platform, visible }) => {
    if (!visible || platform === 'none') return null;

    // TikTok / Reels / Shorts Overlay
    if (platform === 'tiktok' || platform === 'reels') {
        return (
            <div className="absolute inset-0 pointer-events-none z-[40]">
                {/* Right Sidebar (Ghost UI) */}
                <div className="absolute bottom-20 right-2 w-16 flex flex-col items-center justify-end pb-4 gap-6 opacity-40">
                    <div className="flex flex-col items-center gap-1">
                        <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center border border-white/20">
                            <User size={20} className="text-white" />
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <Heart size={28} className="text-white fill-white/20" />
                        <span className="text-[10px] text-white font-bold">Like</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <MessageCircle size={28} className="text-white fill-white/20" />
                        <span className="text-[10px] text-white font-bold">Chat</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <Bookmark size={28} className="text-white fill-white/20" />
                        <span className="text-[10px] text-white font-bold">Save</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <Share2 size={28} className="text-white fill-white/20" />
                        <span className="text-[10px] text-white font-bold">Share</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-800 border-4 border-slate-900 animate-spin-slow opacity-80" />
                </div>

                {/* Bottom Caption Area & Gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-4 pb-8">
                    <div className="w-3/4 space-y-2 opacity-50">
                        <div className="h-4 w-32 rounded bg-white/30" />
                        <div className="h-3 w-48 rounded bg-white/20" />
                        <div className="flex items-center gap-2 mt-2">
                            <Music2 size={12} className="text-white" />
                            <div className="h-2 w-24 rounded bg-white/20" />
                        </div>
                    </div>
                </div>

                {/* Top Header Safe Zone */}
                <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-black/60 to-transparent flex items-center justify-center pt-8 opacity-30">
                    <div className="flex gap-4 text-white font-bold text-sm">
                        <span>Following</span>
                        <span className="opacity-50">For You</span>
                    </div>
                </div>

                {/* Danger Zone Indicator Borders (Subtle) */}
                <div className="absolute inset-x-2 bottom-20 top-24 border-2 border-dashed border-red-500/20 rounded-lg" />
                <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-red-500/20 text-red-200 text-[10px] px-2 py-0.5 rounded opacity-0 hover:opacity-100 transition-opacity">
                    Content Safe Zone
                </div>
            </div>
        );
    }

    // Twitter / generic post Overlay
    if (platform === 'twitter') {
        return (
            <div className="absolute inset-0 pointer-events-none z-[40]">
                <div className="h-full w-full border border-blue-400/30 bg-blue-400/5 relative">
                    <div className="absolute inset-0 flex flex-col justify-between p-4">
                        <div className="w-full h-px bg-blue-400/30 dashed" />
                        <div className="w-full h-px bg-blue-400/30 dashed" />
                    </div>
                    <div className="absolute bottom-2 right-2 text-[10px] text-blue-400 bg-blue-900/50 px-2 rounded">
                        Twitter Preview Crop
                    </div>
                </div>
            </div>
        );
    }

    return null;
};