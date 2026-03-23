"use client";

import { useEffect } from 'react';

export default function ClientErrorHandler() {
    useEffect(() => {
        const handleError = (e: ErrorEvent) => {
            if (e.message?.includes('ChunkLoadError')) {
                console.warn("[Perle] ChunkLoadError detected, reloading...");
                window.location.reload();
            }
        };
        window.addEventListener('error', handleError);
        
        // Also handle unhandled promise rejections which often happen with chunk load failures
        const handleRejection = (e: PromiseRejectionEvent) => {
            if (e.reason?.message?.includes('ChunkLoadError')) {
                console.warn("[Perle] ChunkLoadError rejection detected, reloading...");
                window.location.reload();
            }
        };
        window.addEventListener('unhandledrejection', handleRejection);

        return () => {
            window.removeEventListener('error', handleError);
            window.removeEventListener('unhandledrejection', handleRejection);
        };
    }, []);

    return null;
}
