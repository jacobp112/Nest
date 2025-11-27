import { useState, useEffect } from 'react';

export function useDeviceOrientation() {
    const [orientation, setOrientation] = useState('portrait');

    useEffect(() => {
        const handleOrientationChange = () => {
            // Check if window.orientation is available (deprecated but useful fallback)
            // or use screen.orientation
            let type = 'portrait';

            if (window.screen && window.screen.orientation) {
                type = window.screen.orientation.type.includes('landscape') ? 'landscape' : 'portrait';
            } else if (typeof window.orientation !== 'undefined') {
                type = Math.abs(window.orientation) === 90 ? 'landscape' : 'portrait';
            } else {
                // Fallback to aspect ratio
                type = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
            }

            setOrientation(type);
        };

        // Initial check
        handleOrientationChange();

        // Listen for orientation changes
        window.addEventListener('orientationchange', handleOrientationChange);
        window.addEventListener('resize', handleOrientationChange);

        return () => {
            window.removeEventListener('orientationchange', handleOrientationChange);
            window.removeEventListener('resize', handleOrientationChange);
        };
    }, []);

    return {
        orientation,
        isLandscape: orientation === 'landscape',
        isPortrait: orientation === 'portrait'
    };
}
