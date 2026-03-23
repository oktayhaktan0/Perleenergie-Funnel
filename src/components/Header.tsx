"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isHome = pathname === "/";

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 py-4 md:py-6 px-4 md:px-12`}
        >
            <div
                className={`mx-auto max-w-7xl transition-all duration-500 rounded-2xl flex items-center justify-between px-4 md:px-6 py-3 md:py-4 ${scrolled
                    ? "bg-white border border-[#202324]/10 shadow-[0_10px_40px_rgba(0,0,0,0.06)]"
                    : "bg-transparent border border-transparent shadow-none"
                    }`}
            >

                {/* Logo */}
                <Link href="/" className="flex items-center group" onClick={() => setIsOpen(false)}>
                    <Image src="/assets/logo.png" alt="Perle Energie" width={96} height={51} className="w-24 h-auto" priority />
                </Link>

                {/* Desktop Nav (Internal Links) */}
                <nav className="hidden lg:flex items-center gap-10 font-bold text-[13px] uppercase tracking-widest">
                    <Link href={isHome ? "#technologie" : "/#technologie"} className="text-[#202324]/40 hover:text-[#202324] transition-colors duration-300">
                        Technologie
                    </Link>
                    <Link href={isHome ? "#vergleich" : "/#vergleich"} className="text-[#202324]/40 hover:text-[#202324] transition-colors duration-300">
                        Vergleich
                    </Link>
                    <Link href={isHome ? "#vorteile" : "/#vorteile"} className="text-[#202324]/40 hover:text-[#202324] transition-colors duration-300">
                        Das Fundament
                    </Link>
                    <Link href={isHome ? "#faq" : "/#faq"} className="text-[#202324]/40 hover:text-[#202324] transition-colors duration-300">
                        FAQ
                    </Link>
                    <Link href="/blog" className="text-[#202324]/40 hover:text-[#202324] transition-colors duration-300">
                        Blog
                    </Link>
                    <Link href="/bewertungen" className="text-[#202324]/40 hover:text-[#202324] transition-colors duration-300">
                        Bewertungen
                    </Link>
                </nav>

                {/* CTA Right */}
                <div className="hidden lg:flex items-center gap-4">
                    <Link
                        href="https://shiggy-kundenportal.rabot.energy/login?pt=842dacfb-611b-4f57-a77c-e7a893bc1d5f"
                        target="_blank"
                        className="text-[#202324] hover:text-[#e8ac15] font-bold py-3 px-4 transition-all duration-300 text-[13px] uppercase tracking-widest"
                    >
                        Kundenportal
                    </Link>
                    <Link href="/tariffs" className="bg-[#202324] hover:bg-[#e8ac15] text-white hover:text-[#202324] font-bold py-3 px-8 rounded-full shadow-sm transition-all duration-300 text-sm">
                        Tarif berechnen
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="lg:hidden p-2 text-[#202324] hover:bg-[#202324]/5 rounded-xl transition-colors"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Nav Overlay */}
            {isOpen && (
                <div className="lg:hidden absolute top-[90px] left-4 right-4 bg-white border border-[#202324]/10 shadow-2xl py-2 px-4 rounded-3xl animate-fade-in-up origin-top">
                    <div className="flex flex-col">
                        <Link
                            href={isHome ? "#technologie" : "/#technologie"}
                            className="font-bold text-[#202324] p-4 border-b border-[#202324]/5 hover:bg-[#202324]/5 transition-colors rounded-xl"
                            onClick={() => setIsOpen(false)}
                        >
                            Technologie
                        </Link>
                        <Link
                            href={isHome ? "#vergleich" : "/#vergleich"}
                            className="font-bold text-[#202324] p-4 border-b border-[#202324]/5 hover:bg-[#202324]/5 transition-colors rounded-xl"
                            onClick={() => setIsOpen(false)}
                        >
                            Vergleich
                        </Link>
                        <Link
                            href={isHome ? "#vorteile" : "/#vorteile"}
                            className="font-bold text-[#202324] p-4 border-b border-[#202324]/5 hover:bg-[#202324]/5 transition-colors rounded-xl"
                            onClick={() => setIsOpen(false)}
                        >
                            Das Fundament
                        </Link>
                        <Link
                            href={isHome ? "#faq" : "/#faq"}
                            className="font-bold text-[#202324] p-4 border-b border-[#202324]/5 hover:bg-[#202324]/5 transition-colors rounded-xl"
                            onClick={() => setIsOpen(false)}
                        >
                            FAQ
                        </Link>
                        <Link
                            href="/blog"
                            className="font-bold text-[#202324] p-4 border-b border-[#202324]/5 hover:bg-[#202324]/5 transition-colors rounded-xl"
                            onClick={() => setIsOpen(false)}
                        >
                            Blog
                        </Link>
                        <Link
                            href="/bewertungen"
                            className="font-bold text-[#202324] p-4 border-b border-[#202324]/5 hover:bg-[#202324]/5 transition-colors rounded-xl"
                            onClick={() => setIsOpen(false)}
                        >
                            Bewertungen
                        </Link>
                        <div className="pt-4 pb-2 flex flex-col gap-3">
                            <Link
                                href="https://shiggy-kundenportal.rabot.energy/login?pt=842dacfb-611b-4f57-a77c-e7a893bc1d5f"
                                target="_blank"
                                className="w-full border-2 border-[#202324] text-[#202324] font-bold py-4 rounded-full shadow-sm hover:bg-[#202324] hover:text-white transition-colors flex items-center justify-center gap-2"
                                onClick={() => setIsOpen(false)}
                            >
                                Kundenportal
                            </Link>
                            <Link href="/tariffs" className="w-full bg-[#202324] text-white font-bold py-4 rounded-full shadow-sm hover:bg-[#e8ac15] hover:text-[#202324] transition-colors flex items-center justify-center gap-2" onClick={() => setIsOpen(false)}>
                                Tarif berechnen
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
