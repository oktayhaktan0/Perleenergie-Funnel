"use client";

import { ArrowRight } from "lucide-react";

export default function LeadForm() {
    return (
        <form className="space-y-6 max-w-2xl mx-auto border-t border-[#202324]/5 pt-10" onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const data = Object.fromEntries(fd.entries());

            try {
                const res = await fetch('/api/leads', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                if (res.ok) {
                    alert('Anfrage erfolgreich gesendet! Wir melden uns bei dir.');
                    (e.target as HTMLFormElement).reset();
                } else {
                    alert('Fehler beim Senden. Bitte Server-Verbindung prüfen.');
                }
            } catch (error) {
                console.error(error);
                alert('Es gab ein Problem. Bitte versuche es später noch einmal.');
            }
        }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-bold text-[#202324]/70">Name</label>
                    <input required type="text" name="name" id="name" placeholder="Max Mustermann" className="w-full bg-[#f2f2f2] border border-[#202324]/10 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#e8ac15] transition-shadow placeholder:text-[#202324]/30 font-medium" />
                </div>
                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-bold text-[#202324]/70">E-Mail</label>
                    <input required type="email" name="email" id="email" placeholder="mail@perleenergie.de" className="w-full bg-[#f2f2f2] border border-[#202324]/10 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#e8ac15] transition-shadow placeholder:text-[#202324]/30 font-medium" />
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-bold text-[#202324]/70">Telefonnummer</label>
                <input required type="tel" name="phone" id="phone" placeholder="+49 151 1234567" className="w-full bg-[#f2f2f2] border border-[#202324]/10 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#e8ac15] transition-shadow placeholder:text-[#202324]/30 font-medium" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="plz" className="text-sm font-bold text-[#202324]/70">Postleitzahl</label>
                    <input required type="text" name="plz" id="plz" placeholder="z.B. 10115" className="w-full bg-[#f2f2f2] border border-[#202324]/10 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#e8ac15] transition-shadow placeholder:text-[#202324]/30 font-medium" />
                </div>
                <div className="space-y-2">
                    <label htmlFor="usage" className="text-sm font-bold text-[#202324]/70">Stromverbrauch (kWh/Jahr)</label>
                    <input required type="number" name="usage" id="usage" placeholder="z.B. 2500" className="w-full bg-[#f2f2f2] border border-[#202324]/10 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#e8ac15] transition-shadow placeholder:text-[#202324]/30 font-medium" />
                </div>
            </div>

            <div className="pt-6">
                <button type="submit" className="w-full bg-[#202324] hover:bg-[#e8ac15] text-white hover:text-[#202324] font-bold py-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgb(232,172,21,0.2)] transition-all duration-300 flex items-center justify-center gap-2 group">
                    Anfrage absenden <ArrowRight size={20} className="transform group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="text-center text-xs text-[#202324]/40 font-medium mt-4">Deine Daten werden sicher übertragen und nicht an Dritte weitergegeben.</p>
            </div>
        </form>
    )
}
