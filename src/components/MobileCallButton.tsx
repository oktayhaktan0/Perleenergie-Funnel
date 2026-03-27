"use client";
import { Phone } from "lucide-react";
import { usePathname } from "next/navigation";

export default function MobileCallButton() {
    const pathname = usePathname();
    const isPortal = pathname === "/portal" || pathname === "/kundenportal";
    if (isPortal) return null;

    return (
        <div className="md:hidden">
            <a 
                href="tel:+494065033581"
                className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] left-4 right-4 z-[9999] bg-[#e8ac15] text-[#202324] py-4 px-6 rounded-2xl flex items-center justify-center gap-3 font-bold text-lg max-w-[400px] mx-auto shadow-[0_15px_40px_rgba(232,172,21,0.4)] active:scale-95 transition-all"
            >
                <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#202324]/15">
                     <div className="absolute inset-0 rounded-full animate-ping bg-[#202324] opacity-25"></div>
                     <Phone size={20} className="text-[#202324] relative z-10" />
                </div>
                <span className="tracking-wide">+49 40 650 33 581</span>
            </a>
        </div>
    );
}
