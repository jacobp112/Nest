import React from 'react';
import { motion } from 'framer-motion';
import { Building2, TrendingUp, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { DashboardCard } from '../../DashboardCard.jsx';

export default function PropertyTycoonView({ onInteract }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-20">

            {/* HERO: Equity Tower */}
            <div className="col-span-12 md:col-span-8">
                <DashboardCard className="relative overflow-hidden min-h-[350px] p-8">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-slate-900 to-slate-900" />

                    <div className="relative z-10 flex flex-col md:flex-row gap-12 h-full">
                        <div className="flex-1 space-y-6">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4">
                                    <Building2 size={12} /> Portfolio Value
                                </div>
                                <h2 className="text-4xl font-display font-bold text-white">£1,250,000</h2>
                                <p className="text-emerald-400 flex items-center gap-1 mt-2 font-medium">
                                    <TrendingUp size={16} /> +£12,450 (1.2%) this month
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                    <p className="text-xs text-slate-500 uppercase">Total Equity</p>
                                    <p className="text-xl font-bold text-white">£850,000</p>
                                </div>
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                    <p className="text-xs text-slate-500 uppercase">Total Debt</p>
                                    <p className="text-xl font-bold text-slate-300">£400,000</p>
                                </div>
                            </div>
                        </div>

                        {/* Visual Tower */}
                        <div className="flex items-end gap-4 h-[250px] flex-1 justify-end px-8">
                            {['Main Home', 'Rental 1', 'Rental 2'].map((label, i) => (
                                <div key={i} className="flex flex-col items-center gap-2 w-16 group cursor-pointer">
                                    <div className="w-full bg-slate-800 rounded-t-lg overflow-hidden relative flex flex-col-reverse h-[200px]">
                                        {/* Debt Block */}
                                        <div className="w-full bg-slate-700/50 border-t border-white/5" style={{ height: '40%' }} />
                                        {/* Equity Block */}
                                        <div className="w-full bg-emerald-500/80 group-hover:bg-emerald-400 transition-colors" style={{ height: '60%' }} />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase text-slate-500">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </DashboardCard>
            </div>

            {/* LTV MONITOR */}
            <div className="col-span-12 md:col-span-4">
                <DashboardCard title="Risk Monitor (LTV)" className="h-full">
                    <div className="flex flex-col items-center justify-center h-full py-6">
                        <div className="relative h-32 w-64 overflow-hidden mb-4">
                            <div className="absolute inset-0 bg-slate-800 rounded-t-full" />
                            <div className="absolute inset-4 bg-slate-900 rounded-t-full z-10" />
                            {/* Gauge Needle (Static for demo) */}
                            <div className="absolute bottom-0 left-1/2 w-1 h-24 bg-white origin-bottom -rotate-45 z-20 shadow-lg" />

                            {/* Zones */}
                            <div className="absolute inset-0 rounded-t-full border-[20px] border-transparent border-l-emerald-500 border-t-amber-500 border-r-rose-500 opacity-30" />
                        </div>

                        <div className="text-center">
                            <h3 className="text-3xl font-bold text-white">32%</h3>
                            <p className="text-sm text-emerald-400 font-medium">Safe Zone (&lt;60%)</p>
                        </div>

                        <div className="mt-6 w-full p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
                            <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
                            <p className="text-xs text-amber-200">
                                <strong>Remortgage Alert:</strong> Your LTV on "Rental 1" has dropped below 60%. You could unlock £25k at a lower rate.
                            </p>
                        </div>
                    </div>
                </DashboardCard>
            </div>

            {/* YIELD ANALYZER */}
            <div className="col-span-12">
                <DashboardCard title="Yield Analyzer">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="text-slate-500 border-b border-white/10">
                                    <th className="pb-3 pl-4 font-medium">Property</th>
                                    <th className="pb-3 font-medium">Value</th>
                                    <th className="pb-3 font-medium">Monthly Rent</th>
                                    <th className="pb-3 font-medium">Expenses</th>
                                    <th className="pb-3 font-medium text-right pr-4">Net Yield</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {[
                                    { name: '12 Oak Street', value: 450000, rent: 2200, exp: 850, yield: '3.6%' },
                                    { name: '88 High Road', value: 280000, rent: 1400, exp: 400, yield: '4.2%' },
                                    { name: 'The Marina Apt', value: 320000, rent: 1100, exp: 600, yield: '1.8%', alert: true },
                                ].map((prop, i) => (
                                    <tr key={i} className="group hover:bg-white/5 transition-colors">
                                        <td className="py-4 pl-4 font-medium text-white">{prop.name}</td>
                                        <td className="py-4 text-slate-300">£{prop.value.toLocaleString()}</td>
                                        <td className="py-4 text-slate-300">£{prop.rent}</td>
                                        <td className="py-4 text-slate-300">£{prop.exp}</td>
                                        <td className="py-4 pr-4 text-right">
                                            <span className={`px-2 py-1 rounded-lg font-bold ${prop.alert ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'
                                                }`}>
                                                {prop.yield}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </DashboardCard>
            </div>
        </div>
    );
}
