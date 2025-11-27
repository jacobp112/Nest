import React, { useState } from 'react';
import { useDeviceOrientation } from '../../hooks/useDeviceOrientation';
import DashboardWidgetStack from './DashboardWidgetStack';
import AssetCard from './AssetCard';
import TransactionQueueItem from './TransactionQueueItem';
import SlideButton from './SlideButton';
import { Home, PieChart, Plus, Newspaper, Grid, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useDataStore } from '../../stores/useDataStore';

export default function MobileLayout() {
    const { isLandscape } = useDeviceOrientation();
    const [activeTab, setActiveTab] = useState('overview');
    const [isHubOpen, setIsHubOpen] = useState(false);
    const [isTransactOpen, setIsTransactOpen] = useState(false);

    // Real Data
    const { accounts, transactions, goals } = useDataStore();

    // Derived Data
    const netWorth = accounts.reduce((acc, item) => acc + (Number(item.balance) || 0), 0);
    const recentTransactions = transactions.slice(0, 5);

    // Map Accounts to Asset Cards (enriching with mock market data for now)
    const assetData = accounts.map(acc => ({
        id: acc.id,
        assetName: acc.name,
        ticker: acc.provider || 'CASH', // Fallback
        totalValue: Number(acc.balance),
        changePercentage: (Math.random() * 5 - 2).toFixed(2), // Mock daily change
        trendData: Array.from({ length: 7 }, () => Math.floor(Math.random() * 100)) // Mock trend
    }));

    // Map Transactions
    const queueItems = recentTransactions.map(tx => ({
        id: tx.id,
        title: tx.merchant || tx.category || 'Transaction',
        subtitle: tx.category || 'General',
        amount: tx.amount,
        type: tx.amount < 0 ? 'expense' : 'income',
        date: new Date(tx.date?.seconds * 1000).toLocaleDateString() || 'Today'
    }));

    // Widgets
    const widgets = [
        <div key="networth" className="text-white">
            <h3 className="text-sm font-medium text-gray-400">Net Worth</h3>
            <p className="text-3xl font-bold">£{netWorth.toLocaleString()}</p>
            <p className="text-emerald-400">+1.2% today</p>
        </div>,
        <div key="goals" className="text-white">
            <h3 className="text-sm font-medium text-gray-400">Active Goals</h3>
            <p className="text-xl font-bold">{goals.length} Goals</p>
            <p className="text-gray-300">Top: {goals[0]?.name || 'None'}</p>
        </div>,
    ];

    if (isLandscape) {
        return (
            <div className="flex h-screen w-full flex-col bg-gray-900 text-white">
                <div className="flex items-center justify-between border-b border-gray-800 p-4">
                    <h1 className="font-bold">Spreadsheet Mode</h1>
                    <span className="text-xs text-gray-400">Rotate to exit</span>
                </div>
                <div className="flex-1 overflow-auto p-4">
                    <table className="w-full text-left text-sm">
                        <thead className="text-gray-400">
                            <tr>
                                <th className="p-2">Asset</th>
                                <th className="p-2">Provider</th>
                                <th className="p-2">Value</th>
                                <th className="p-2">Change</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assetData.map((asset) => (
                                <tr key={asset.id} className="border-b border-gray-800">
                                    <td className="p-2 font-medium">{asset.assetName}</td>
                                    <td className="p-2 font-mono text-gray-400">{asset.ticker}</td>
                                    <td className="p-2 font-mono">£{asset.totalValue.toLocaleString()}</td>
                                    <td className={`p-2 font-mono ${asset.changePercentage >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {asset.changePercentage}%
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-[100dvh] w-full flex-col bg-black text-white">
            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto pb-32">
                {/* Header / Widget Stack */}
                <div className="p-4">
                    <div className="mb-4 flex items-center justify-between">
                        <h1 className="text-2xl font-bold">Good Morning</h1>
                        <div className="h-8 w-8 rounded-full bg-gray-700" />
                    </div>
                    <DashboardWidgetStack widgets={widgets} />
                </div>

                {/* Transaction Queue */}
                <div className="px-4 py-2">
                    <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Recent Activity</h2>
                    {queueItems.length > 0 ? (
                        queueItems.map((tx) => (
                            <TransactionQueueItem key={tx.id} {...tx} />
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">No recent transactions</p>
                    )}
                </div>

                {/* Asset List */}
                <div className="px-4 py-2">
                    <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Portfolio</h2>
                    {assetData.map((asset) => (
                        <AssetCard key={asset.id} {...asset} />
                    ))}
                </div>
            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 border-t border-gray-800 bg-black/90 px-6 py-4 backdrop-blur-lg">
                <div className="flex items-center justify-between">
                    <NavButton icon={Home} label="Overview" isActive={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                    <NavButton icon={PieChart} label="Portfolio" isActive={activeTab === 'portfolio'} onClick={() => setActiveTab('portfolio')} />

                    {/* FAB */}
                    <button
                        onClick={() => setIsTransactOpen(true)}
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 transition-transform active:scale-95"
                    >
                        <Plus size={24} />
                    </button>

                    <NavButton icon={Newspaper} label="Intel" isActive={activeTab === 'intel'} onClick={() => setActiveTab('intel')} />
                    <NavButton icon={Grid} label="Hub" isActive={isHubOpen} onClick={() => setIsHubOpen(true)} />
                </div>
            </div>

            {/* Hub Overlay */}
            <AnimatePresence>
                {isHubOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: '100%' }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: '100%' }}
                        className="fixed inset-0 z-50 flex flex-col bg-gray-900"
                    >
                        <div className="flex items-center justify-between border-b border-gray-800 p-4">
                            <div className="flex flex-1 items-center rounded-lg bg-gray-800 px-3 py-2">
                                <Search size={18} className="text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search assets, docs, actions..."
                                    className="ml-2 w-full bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
                                    autoFocus
                                />
                            </div>
                            <button onClick={() => setIsHubOpen(false)} className="ml-4 p-2 text-gray-400">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4">
                            <div className="grid grid-cols-2 gap-4">
                                <HubCard color="bg-blue-500/20" title="Banking" icon={PieChart} />
                                <HubCard color="bg-orange-500/20" title="Investments" icon={PieChart} />
                                <HubCard color="bg-purple-500/20" title="Documents" icon={Newspaper} />
                                <HubCard color="bg-pink-500/20" title="Concierge" icon={Home} />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Transact Overlay */}
            <AnimatePresence>
                {isTransactOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm p-4 pb-24"
                        onClick={() => setIsTransactOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="w-full max-w-sm space-y-3"
                            onClick={e => e.stopPropagation()}
                        >
                            <button className="flex w-full items-center gap-4 rounded-2xl bg-gray-800 p-4 active:bg-gray-700">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500/20 text-rose-400">
                                    <Plus size={20} />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-bold">Add Expense</h3>
                                    <p className="text-xs text-gray-400">Log a new payment</p>
                                </div>
                            </button>
                            <button className="flex w-full items-center gap-4 rounded-2xl bg-gray-800 p-4 active:bg-gray-700">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                                    <Plus size={20} />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-bold">Add Income</h3>
                                    <p className="text-xs text-gray-400">Paycheck or deposit</p>
                                </div>
                            </button>

                            {/* High Value Transfer Section */}
                            <div className="pt-2 border-t border-gray-800">
                                <SlideButton
                                    label="Slide to Transfer"
                                    onConfirm={() => {
                                        console.log("Transfer Executed");
                                        setTimeout(() => setIsTransactOpen(false), 1000);
                                    }}
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function NavButton({ icon: Icon, label, isActive, onClick }) {
    return (
        <button onClick={onClick} className={`flex flex-col items-center space-y-1 ${isActive ? 'text-white' : 'text-gray-500'}`}>
            <Icon size={20} />
            <span className="text-[10px] font-medium">{label}</span>
        </button>
    );
}

function HubCard({ color, title, icon: Icon }) {
    return (
        <div className={`flex aspect-square flex-col items-center justify-center rounded-2xl ${color} p-4`}>
            <Icon size={32} className="mb-2 text-white" />
            <span className="font-medium text-white">{title}</span>
        </div>
    );
}
