// src/app/portal/page.tsx
import PerleFunnel from "@/components/PerleFunnel";

export const metadata = {
    title: "Perle Energie Portal | Tarif Berechnen",
    description: "Berechnen Sie Ihren individuellen Stromtarif in wenigen Schritten.",
};

export default function PortalPage() {
    return (
        <div className="min-h-screen bg-[#f2f2f2] flex items-center justify-center p-4 md:p-8">
            <div className="w-full max-w-5xl">
                {/* Portal Header */}
                <div className="text-center mb-12 animate-fade-in">
                    <h1 className="text-3xl md:text-5xl font-black text-[#202324] mb-4">
                        Willkommen beim <span className="text-[#e8ac15]">Perle Energie</span> Portal.
                    </h1>
                    <p className="text-[#202324]/50 font-medium">
                        Sicher, schnell und 100% digital zu Ihrem neuen Stromtarif.
                    </p>
                </div>

                {/* The Funnel */}
                <div className="relative z-10">
                    <PerleFunnel />
                </div>

                {/* Security / Trust Badges */}
                <div className="mt-12 flex flex-wrap justify-center gap-8 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-500">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#202324]">
                        <span>✓ 100% Ökostrom</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#202324]">
                        <span>✓ TÜV Zertifiziert</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#202324]">
                        <span>✓ SSL Verschlüsselt</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
