import { useCallback } from 'react';

export function useHapticFeedback() {
    const triggerHaptic = useCallback((type = 'light') => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            switch (type) {
                case 'light':
                    navigator.vibrate(10); // Short, light vibration
                    break;
                case 'medium':
                    navigator.vibrate(20); // Medium vibration
                    break;
                case 'heavy':
                    navigator.vibrate(40); // Heavy vibration
                    break;
                case 'success':
                    navigator.vibrate([10, 30, 10]); // Pattern for success
                    break;
                case 'error':
                    navigator.vibrate([50, 30, 50, 30, 50]); // Pattern for error
                    break;
                default:
                    navigator.vibrate(10);
            }
        }
    }, []);

    return { triggerHaptic };
}
