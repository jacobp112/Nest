import React from 'react';
import { useMobile } from '../hooks/useMobile';
import MobileLayout from './mobile/MobileLayout';

export default function AppShell({ children }) {
    const isMobile = useMobile();

    if (isMobile) {
        return <MobileLayout />;
    }

    return <>{children}</>;
}
