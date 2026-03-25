/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                // Successful login, redirect to admin panel
                router.push('/admin');
                router.refresh(); // Refresh to update middleware state client-side
            } else {
                setError(data.error || 'Login fehlgeschlagen. Bitte versuche es erneut.');
            }
        } catch {
            setError('Netzwerkfehler. Konnte keine Verbindung aufbauen.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f2f2f2] text-[#202324] font-sans flex items-center justify-center p-6 lg:p-12 relative overflow-hidden">

            {/* Ambient Background Logo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.02] pointer-events-none">
                <img src="/assets/p-logo.png" alt="Perle Energie Hintergrund Logo" className="w-full h-full object-contain" />
            </div>

            <div className="w-full max-w-md bg-white rounded-[2.5rem] p-10 md:p-14 shadow-[0_20px_60px_rgba(0,0,0,0.06)] relative z-10 border border-[#202324]/5">

                {/* Logo and Headings */}
                <div className="text-center mb-10 space-y-4">
                    <Link href="/" className="inline-flex items-center justify-center w-14 h-14 bg-[#f9fafb] rounded-2xl mb-2 hover:bg-[#e8ac15] transition-colors duration-300 group border border-[#202324]/5 shadow-sm">
                        <Lock size={24} className="text-[#202324]/40 group-hover:text-white transition-colors" />
                    </Link>
                    <h1 className="text-3xl font-extrabold tracking-tight text-[#202324]">Perle Admin</h1>
                    <p className="text-[#202324]/40 font-medium text-sm">Identifiziere dich, um auf das Dashboard zuzugreifen.</p>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 text-red-600 text-sm font-bold p-4 rounded-xl border border-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[#202324]/70">Admin-Passwort</label>
                        <input
                            required
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="*************"
                            className="w-full bg-[#f9fafb] border border-[#202324]/10 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#e8ac15] transition-shadow font-medium"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#202324] hover:bg-[#e8ac15] text-white hover:text-[#202324] font-bold py-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgb(232,172,21,0.2)] transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <><Loader2 size={20} className="animate-spin" /> Verifizieren...</>
                        ) : (
                            <>Einloggen <ArrowRight size={20} className="transform group-hover:translate-x-1 transition-transform" /></>
                        )}
                    </button>

                    <p className="text-center w-full pt-4">
                        <Link href="/" className="text-xs font-bold text-[#202324]/30 hover:text-[#202324] transition-colors">
                            Zurück zur Startseite
                        </Link>
                    </p>
                </form>

            </div>
        </div>
    );
}
