"use client";

import { useState } from 'react'
import DataTable from '@/components/admin/DataTable'
import ReviewsTable from '@/components/admin/ReviewsTable'
import { Users, Star, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<'leads' | 'reviews'>('leads');
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/admin/login');
            router.refresh(); // Refresh middleware state
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <div className="min-h-screen bg-[#f2f2f2] text-[#202324] p-8 md:p-12 font-sans">
            <div className="max-w-7xl mx-auto mt-20">
                <header className="mb-10 flex flex-col md:flex-row justify-between md:items-end gap-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-[-0.03em] mb-4 text-[#202324]">Admin Dashboard</h1>
                        <p className="text-lg text-[#202324]/60 font-medium">Verwalte hier alle eingehenden Lead-Anfragen und Kundenbewertungen.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-[#202324] text-[#e8ac15] px-6 py-3 rounded-xl font-bold text-sm tracking-widest uppercase border border-[#e8ac15]/20 shadow-lg">
                            Perle Energie Intern
                        </div>
                        <button
                            onClick={handleLogout}
                            className="bg-white hover:bg-red-50 text-red-600 px-4 py-3 rounded-xl font-bold text-sm tracking-widest uppercase border border-red-100 shadow-sm transition-colors flex items-center gap-2"
                        >
                            Log out <LogOut size={16} />
                        </button>
                    </div>
                </header>

                <div className="flex gap-4 mb-8 overflow-x-auto pb-4">
                    <button
                        onClick={() => setActiveTab('leads')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === 'leads' ? 'bg-primary text-white shadow-glow' : 'bg-white text-[#202324]/50 hover:bg-white/80 border border-[#202324]/5'}`}
                    >
                        <Users size={18} />
                        Leads
                    </button>
                    <button
                        onClick={() => setActiveTab('reviews')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === 'reviews' ? 'bg-primary text-white shadow-glow' : 'bg-white text-[#202324]/50 hover:bg-white/80 border border-[#202324]/5'}`}
                    >
                        <Star size={18} />
                        Bewertungen
                    </button>
                    <div className="flex-1"></div>
                    <Link
                        href="/admin/blog"
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap bg-[#202324] text-white hover:bg-[#e8ac15] hover:text-[#202324] shadow-sm`}
                    >
                        <span className="hidden md:inline">+ Neuen Blog</span>
                        <span className="md:hidden">+ Blog</span>
                    </Link>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#202324]/10">
                    <div className="mb-8 pb-6 border-b border-[#202324]/5 flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-[#202324]">
                            {activeTab === 'leads' ? 'Letzte Anfragen' : 'Kundenbewertungen'}
                        </h2>
                        <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse"></div>
                    </div>

                    {activeTab === 'leads' ? <DataTable /> : <ReviewsTable />}
                </div>
            </div>
        </div>
    )
}
