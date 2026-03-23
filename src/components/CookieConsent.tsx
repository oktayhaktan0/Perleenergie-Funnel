'use client';

import { useState, useEffect } from 'react';
export default function CookieConsent() {
    const [showBanner, setShowBanner] = useState(false);

    const updateConsent = (status: 'granted' | 'denied') => {
        if (typeof window.gtag !== 'undefined') {
            window.gtag('consent', 'update', {
                'ad_storage': status,
                'ad_user_data': status,
                'ad_personalization': status,
                'analytics_storage': status,
            });
        }
    };

    useEffect(() => {
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
            setTimeout(() => setShowBanner(true), 0);
        } else if (consent === 'granted') {
            updateConsent('granted');
        }
    }, []);



    const handleAccept = () => {
        localStorage.setItem('cookieConsent', 'granted');
        updateConsent('granted');
        setShowBanner(false);
    };

    const handleDecline = () => {
        localStorage.setItem('cookieConsent', 'denied');
        updateConsent('denied');
        setShowBanner(false);
    };

    if (!showBanner) return null;

    return (
        <div className="fixed bottom-[calc(6rem+env(safe-area-inset-bottom))] md:bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-4xl z-[10000] p-6 md:p-8 bg-white/95 backdrop-blur-md border border-gray-200 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
                <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                        <h3 className="text-xl font-bold text-primary">Datenschutz & Cookies</h3>
                    </div>
                    <p className="text-sm md:text-base text-gray-600 leading-relaxed max-w-2xl">
                        Wir schätzen Ihre Privatsphäre. Wir verwenden Cookies, um die Funktion unserer Website zu gewährleisten, Inhalte zu personalisieren und unseren Traffic zu analysieren. Mit „Alle akzeptieren“ helfen Sie uns, Ihr Erlebnis stetig zu verbessern.
                        Details finden Sie in unserer <a href="/datenschutz" className="text-accent font-medium hover:underline underline-offset-4">Datenschutzerklärung</a>.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 min-w-fit w-full sm:w-auto">
                    <button
                        onClick={handleDecline}
                        className="flex-1 sm:flex-none px-8 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 active:scale-95"
                    >
                        Nur Notwendige
                    </button>
                    <button
                        onClick={handleAccept}
                        className="flex-1 sm:flex-none px-8 py-3 text-sm font-bold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-[4px_4px_0px_0px_rgba(32,35,36,0.2)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 active:scale-95"
                    >
                        Alle akzeptieren
                    </button>
                </div>
            </div>
        </div>
    );
}
