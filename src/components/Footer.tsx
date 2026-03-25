import Image from "next/image";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#111111] text-white pt-24 md:pb-12 pb-[calc(6rem+env(safe-area-inset-bottom))] border-t border-white/5">
            <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">

                    {/* Left Side: Brand & Highlight Text */}
                    <div className="md:col-span-4 space-y-10">
                        <div className="flex flex-col gap-2">
                            <h4 className="text-[#e8ac15] text-sm font-bold uppercase tracking-[0.3em]">Smarter</h4>
                            <h4 className="text-white text-sm font-bold uppercase tracking-[0.3em] flex items-center gap-4">
                                Bevor wir
                                <span className="w-12 h-[2px] bg-[#e8ac15]"></span>
                            </h4>
                        </div>

                        <div className="space-y-4">
                            <Link href="/" className="flex items-center group">
                                <div className="w-7 h-7  text-[#202324] flex items-center justify-center rounded-sm mr-2.5">
                                    <Image src="/assets/p-logo.png" alt="Perle Energie" width={28} height={28} className="w-full h-auto object-contain" />
                                </div>
                                <span className="text-xl font-bold tracking-tighter text-white">perleenergie</span>
                            </Link>
                            <p className="text-white/40 font-medium text-sm leading-relaxed max-w-xs">
                                Ökostrom. Neu gedacht. <br />
                                Fair, digital und zu 100% transparent.
                            </p>
                        </div>
                    </div>

                    {/* Middle: Links */}
                    <div className="md:col-span-2 space-y-6">
                        <h5 className="text-white/20 text-xs font-bold uppercase tracking-widest">Produkte</h5>
                        <ul className="space-y-4">
                            <li><Link href="#technologie" className="text-white/60 hover:text-[#e8ac15] transition-colors text-sm font-medium">Technologie</Link></li>
                            <li><Link href="#vergleich" className="text-white/60 hover:text-[#e8ac15] transition-colors text-sm font-medium">Vergleich</Link></li>
                            <li><Link href="#vorteile" className="text-white/60 hover:text-[#e8ac15] transition-colors text-sm font-medium">Vorteile</Link></li>
                        </ul>
                    </div>

                    <div className="md:col-span-2 space-y-6">
                        <h5 className="text-white/20 text-xs font-bold uppercase tracking-widest">Support</h5>
                        <ul className="space-y-4">
                            <li><Link href="/faq" className="text-white/60 hover:text-[#e8ac15] transition-colors text-sm font-medium">FAQ</Link></li>
                            <li><Link href="/impressum" className="text-white/60 hover:text-[#e8ac15] transition-colors text-sm font-medium">Impressum</Link></li>
                            <li><Link href="/datenschutz" className="text-white/60 hover:text-[#e8ac15] transition-colors text-sm font-medium">Datenschutz</Link></li>
                        </ul>
                    </div>

                    {/* Right: Rechtliches & Kontakt */}
                    <div className="md:col-span-4 space-y-10">
                        <div className="space-y-6">
                            <h5 className="text-white/20 text-xs font-bold uppercase tracking-widest">Kontakt</h5>
                            <div className="space-y-4">
                                <a href="mailto:info@perleenergie.de" className="flex items-center gap-3 text-white/80 hover:text-[#e8ac15] transition-colors text-sm font-medium">
                                    <Mail size={16} className="text-[#e8ac15]" /> info@perleenergie.de
                                </a>
                                <a href="tel:+494065033581" className="flex items-center gap-3 text-white/80 hover:text-[#e8ac15] transition-colors text-sm font-medium">
                                    <Phone size={16} className="text-[#e8ac15]" /> +49 40 650 33 581
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <p className="text-white/20 font-bold text-[10px] uppercase tracking-widest">
                            © {currentYear} Perle Energie. Alle Rechte vorbehalten.
                        </p>
                        {process.env.NEXT_PUBLIC_COMMIT_HASH && (
                            <span className="text-white/10 font-mono text-[9px] uppercase tracking-tighter bg-white/5 px-2 py-0.5 rounded border border-white/5">
                                Build: {process.env.NEXT_PUBLIC_COMMIT_HASH}
                            </span>
                        )}
                    </div>
                    <div className="flex gap-8">
                        <Link href="/agb" className="text-white/20 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest">AGB</Link>
                        <Link href="/widerruf" className="text-white/20 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest">Widerruf</Link>
                        <Link href="/konto-loeschen" className="text-white/20 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest">Konto löschen</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
