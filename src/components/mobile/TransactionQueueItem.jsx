import React from 'react';
import { Check, X, AlertCircle, Bell, FileText } from 'lucide-react';
import { useHapticFeedback } from '../../hooks/useHapticFeedback';

export default function TransactionQueueItem({
    title,
    subtitle,
    amount,
    type = 'notification', // 'approval' | 'notification' | 'alert'
    date,
    onAction,
}) {
    const { triggerHaptic } = useHapticFeedback();

    const handleAction = (action) => {
        triggerHaptic('medium');
        if (onAction) onAction(action);
    };

    const getIcon = () => {
        switch (type) {
            case 'approval':
                return <FileText className="text-blue-400" size={20} />;
            case 'alert':
                return <AlertCircle className="text-red-400" size={20} />;
            case 'notification':
            default:
                return <Bell className="text-yellow-400" size={20} />;
        }
    };

    return (
        <div className="mb-3 flex items-center justify-between rounded-xl bg-gray-800 p-4 shadow-sm">
            <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700">
                    {getIcon()}
                </div>
                <div>
                    <h4 className="font-semibold text-white">{title}</h4>
                    <p className="text-xs text-gray-400">{subtitle} • {date}</p>
                </div>
            </div>

            {type === 'approval' ? (
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleAction('reject')}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20 text-red-400 transition-colors active:bg-red-500/40"
                    >
                        <X size={16} />
                    </button>
                    <button
                        onClick={() => handleAction('approve')}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 transition-colors active:bg-emerald-500/40"
                    >
                        <Check size={16} />
                    </button>
                </div>
            ) : (
                amount && (
                    <span className="font-mono font-medium text-white">
                        {amount}
                    </span>
                )
            )}
        </div>
    );
}
