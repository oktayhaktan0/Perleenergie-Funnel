"use client";

import { useState, useEffect } from "react";
import { User, LogOut, Activity, FileText, Settings, Zap, Shield, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

export default function KundenportalPage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [customer, setCustomer] = useState<any>(null);

    // Sidebar states
    const [activeTab, setActiveTab] = useState("dashboard");

    useEffect(() => {
        // Simple session check (mock for now, should check cookie)
        const checkSession = async () => {
            setLoading(true);
            try {
                // In a real app, this would be an API call to verify the session cookie
                const saved = localStorage.getItem('customer_session');
                if (saved) {
                    setCustomer(JSON.parse(saved));
                    setIsLoggedIn(true);
                }
            } catch (e) {
                console.error("Session check failed");
            } finally {
                setLoading(false);
            }
        };
        checkSession();
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/auth/customer-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData)
            });
            const data = await res.json();
            if (data.success) {
                setIsLoggedIn(true);
                setCustomer(data.customer);
                localStorage.setItem('customer_session', JSON.stringify(data.customer));
                toast.success("Willkommen zurück!");
            } else {
                toast.error(data.error || "Login fehlgeschlagen.");
            }
        } catch (err) {
            toast.error("Ein Fehler ist aufgetreten.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('customer_session');
        setIsLoggedIn(false);
        setCustomer(null);
        toast.info("Abgemeldet.");
    };

    if (loading && !isLoggedIn) {
        return (
            <div className="min-h-screen bg-[#f2f2f2] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#e8ac15] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-[#f2f2f2] flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-xl border border-[#202324]/5">
                    <div className="text-center mb-10">
                        <Link href="/" className="inline-block mb-8">
                            <Image src="/assets/p-logo.png" alt="Perle Energie" width={60} height={60} className="mx-auto" />
                        </Link>
                        <h1 className="text-3xl font-black text-[#202324] mb-2">Müşteri Portalı</h1>
                        <p className="text-[#202324]/40 font-medium">Lütfen bilgilerinizle giriş yapın.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[#202324]/60 uppercase tracking-widest">E-Mail</label>
                            <input 
                                required 
                                type="email" 
                                value={loginData.email}
                                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                                placeholder="mail@example.com"
                                className="w-full bg-[#f2f2f2] border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-[#e8ac15] font-bold" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[#202324]/60 uppercase tracking-widest">Passwort</label>
                            <input 
                                required 
                                type="password" 
                                value={loginData.password}
                                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                                placeholder="••••••••"
                                className="w-full bg-[#f2f2f2] border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-[#e8ac15] font-bold" 
                            />
                        </div>
                        <button 
                            disabled={loading}
                            type="submit" 
                            className="w-full bg-[#e8ac15] text-[#202324] font-black py-4 rounded-xl hover:bg-[#202324] hover:text-white transition-all shadow-lg active:scale-95 disabled:opacity-50"
                        >
                            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-[#202324]/40">Hala bir tarifiniz yok mu? <Link href="/portal" className="text-[#e8ac15] font-bold hover:underline">Tarif Al</Link></p>
                    </div>
                </div>
            </div>
        );
    }

    // DASHBOARD UI
    return (
        <div className="min-h-screen bg-[#f8f8f8] flex">
            {/* Sidebar */}
            <aside className="w-20 md:w-72 bg-[#202324] text-white flex flex-col transition-all duration-300">
                <div className="p-6 md:p-8">
                    <Link href="/" className="flex items-center gap-3">
                         <Image src="/assets/p-logo.png" alt="Logo" width={32} height={32} className="w-8 h-8" />
                         <span className="hidden md:inline font-black text-xl tracking-tighter">perleenergie</span>
                    </Link>
                </div>

                <nav className="flex-grow px-4 md:px-6 space-y-2 mt-8">
                    {[
                        { id: 'dashboard', label: 'Dashboard', icon: Activity },
                        { id: 'contracts', label: 'Verträge', icon: Shield },
                        { id: 'usage', label: 'Verbrauch', icon: Zap },
                        { id: 'invoices', label: 'Rechnungen', icon: FileText },
                        { id: 'profile', label: 'Profil', icon: User }
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center justify-center md:justify-start gap-4 p-4 rounded-xl transition-all ${activeTab === item.id ? 'bg-[#e8ac15] text-[#202324]' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
                        >
                            <item.icon size={20} />
                            <span className="hidden md:inline font-bold text-sm tracking-wide">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-6 md:p-8 mt-auto">
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center md:justify-start gap-4 p-4 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                    >
                        <LogOut size={20} />
                        <span className="hidden md:inline font-bold text-sm">Abmelden</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow p-6 md:p-12 overflow-y-auto">
                <header className="flex items-center justify-between mb-12">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black text-[#202324] mb-2 tracking-tight">Herzlich Willkommen, {customer?.firstName}!</h2>
                        <p className="text-[#202324]/40 font-medium">Dein Energie-Dashboard im Überblick.</p>
                    </div>
                    <div className="hidden md:flex items-center gap-4 bg-white p-2 pr-6 rounded-full shadow-sm border border-[#202324]/5">
                        <div className="w-10 h-10 rounded-full bg-[#f2f2f2] flex items-center justify-center text-[#202324] font-bold">
                            {customer?.firstName?.[0]}{customer?.lastName?.[0]}
                        </div>
                        <span className="font-bold text-sm text-[#202324]">{customer?.firstName} {customer?.lastName}</span>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Status Card */}
                    <div className="bg-white rounded-[2rem] p-8 border border-[#202324]/5 md:col-span-2 relative overflow-hidden group">
                         <div className="absolute top-0 right-0 p-8 text-[#e8ac15]/5 pointer-events-none">
                            <Activity size={120} />
                         </div>
                         <h3 className="text-xs font-bold text-[#202324]/40 uppercase tracking-widest mb-6">Sözleşme Durumu</h3>
                         <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-[#e8ac15]/10 flex items-center justify-center text-[#e8ac15]">
                                <Shield size={32} />
                            </div>
                            <div>
                                <p className="text-xl font-bold text-[#202324]">In Bearbeitung</p>
                                <p className="text-sm text-[#202324]/40 font-medium">Geçiş süreci devam ediyor.</p>
                            </div>
                         </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-[#e8ac15] rounded-[2rem] p-8 text-[#202324]">
                        <h3 className="text-xs font-bold text-[#202324]/60 uppercase tracking-widest mb-6">Maliyet Tahmini</h3>
                        <div className="space-y-1">
                            <span className="text-5xl font-black tracking-tighter">--,--</span>
                            <span className="text-lg font-bold opacity-60 ml-2">€ / Ay</span>
                        </div>
                        <p className="mt-4 text-xs font-bold opacity-60">Sözleşme aktif olduğunda verileriniz görünecek.</p>
                    </div>
                </div>

                {/* Coming Soon Section */}
                <div className="mt-12 bg-white rounded-[2.5rem] p-12 text-center border-2 border-dashed border-[#202324]/5">
                     <div className="w-20 h-20 bg-[#f2f2f2] rounded-full flex items-center justify-center mx-auto mb-6 text-[#202324]/20">
                        <Zap size={40} />
                     </div>
                     <h3 className="text-2xl font-black text-[#202324] mb-2">Verbrauchsanalyse geliyor!</h3>
                     <p className="max-w-md mx-auto text-[#202324]/40 font-medium">Rabot API ile entegrasyon sonrası anlık tüketim grafiklerinizi burada görebileceksiniz.</p>
                     <button className="mt-8 px-8 py-4 bg-[#202324] text-white rounded-full font-bold flex items-center gap-2 mx-auto hover:bg-[#e8ac15] hover:text-[#202324] transition-all">
                        Benim İçin Planla <ArrowRight size={18} />
                     </button>
                </div>
            </main>
        </div>
    );
}
