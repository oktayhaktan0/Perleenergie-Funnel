import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PerleFunnel from "@/components/PerleFunnel";
import { ArrowRight, Smartphone, Zap, Leaf, Shield } from "lucide-react";
import Image from "next/image";

export default function TariffsPage() {
    return (
        <div className="flex flex-col min-h-screen bg-[#f2f2f2] text-[#202324] selection:bg-[#e8ac15] selection:text-[#202324] pt-32 md:pt-44">
            <Header />
            
            <section className="px-6 md:px-12 pb-20 md:pb-32 text-center animate-fade-in-up">
                 <div className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#202324]/5 bg-white/60 backdrop-blur-xl text-xs font-bold tracking-[0.1em] uppercase text-[#202324] mb-10 shadow-sm">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e8ac15] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#e8ac15]"></span>
                    </span>
                    Individuelle Tarifberechnung
                </div>
                
                <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] text-[#202324] max-w-4xl mx-auto mb-10">
                    Einfach <span className="text-[#e8ac15]">wechseln.</span><br />
                    Fair profitieren.
                </h1>
                <p className="text-lg md:text-2xl text-[#202324]/50 font-medium max-w-2xl mx-auto leading-relaxed mb-20">
                    Wir berechnen dir den optimalen Tarif basierend auf deinem Standort und deinem tatsächlichen Verbrauch. Ohne Bonusfallen, ohne Stress.
                </p>

                <PerleFunnel />
            </section>

            <section className="bg-[#111111] py-20 px-6 md:px-12 text-white overflow-hidden relative border-t border-white/5">
                <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
                
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10 text-center">
                    <div className="space-y-6 group">
                        <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl mx-auto flex items-center justify-center text-[#e8ac15] group-hover:scale-110 transition-transform">
                            <Leaf size={24} />
                        </div>
                        <h3 className="text-xl font-bold">100% Ökostrom</h3>
                        <p className="text-white/40 font-medium">Durch zertifizierte Herkunftsnachweise garantieren wir die Nachhaltigkeit jeder Kilowattstunde.</p>
                    </div>
                    <div className="space-y-6 group">
                        <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl mx-auto flex items-center justify-center text-[#e8ac15] group-hover:scale-110 transition-transform">
                            <Zap size={24} />
                        </div>
                        <h3 className="text-xl font-bold">Dynamische Preise</h3>
                        <p className="text-white/40 font-medium">Profitiere direkt von günstigen Marktpreisen – wir geben sie ohne Aufschlag an dich weiter.</p>
                    </div>
                    <div className="space-y-6 group">
                        <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl mx-auto flex items-center justify-center text-[#e8ac15] group-hover:scale-110 transition-transform">
                            <Smartphone size={24} />
                        </div>
                        <h3 className="text-xl font-bold">Alles per App</h3>
                        <p className="text-white/40 font-medium">Behalte vollen Einblick in deinen Verbrauch und verwalte deinen Vertrag rund um die Uhr digital.</p>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
