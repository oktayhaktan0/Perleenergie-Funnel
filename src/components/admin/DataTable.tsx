"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Activity, Mail, MapPin, Zap, Clock, ShieldCheck, Phone } from "lucide-react";

type Lead = {
    id: number;
    created_at: string;
    name: string;
    email: string;
    phone?: string;
    plz: string;
    usage_amount: number;
    status: string;
};

export default function DataTable() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeads();
    }, []);

    async function fetchLeads() {
        try {
            const res = await fetch('/api/admin/leads');
            if (!res.ok) throw new Error('API Fehler');
            const json = await res.json();

            setLeads(json.data || []);
        } catch (error) {
            console.error("Error fetching leads:", error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return (
        <div className="flex animate-pulse items-center justify-center p-20 gap-3 text-[#202324]/40 font-bold">
            <Activity className="animate-spin-slow" /> Lade Datenbank...
        </div>
    );

    if (leads.length === 0) return (
        <div className="text-center p-20 text-[#202324]/40 font-bold flex flex-col items-center gap-4">
            <ShieldCheck size={48} className="text-[#202324]/20" />
            Noch keine Einträge vorhanden.
        </div>
    );

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-[#202324]/10 bg-slate-50/50">
                        <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-[#202324]/40 rounded-tl-xl whitespace-nowrap">Datum</th>
                        <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-[#202324]/40 whitespace-nowrap">Kunde</th>
                        <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-[#202324]/40 whitespace-nowrap">Kontakt</th>
                        <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-[#202324]/40 whitespace-nowrap">Telefon</th>
                        <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-[#202324]/40 whitespace-nowrap">Region (PLZ)</th>
                        <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-[#202324]/40 whitespace-nowrap">Verbrauch (kWh)</th>
                        <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-[#202324]/40 rounded-tr-xl whitespace-nowrap text-right">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {leads.map((lead) => (
                        <tr key={lead.id} className="border-b border-[#202324]/5 hover:bg-slate-50 transition-colors group">

                            <td className="py-4 px-6 whitespace-nowrap">
                                <div className="flex items-center gap-2 text-sm text-[#202324]/60 font-medium">
                                    <Clock size={14} className="text-[#202324]/30" />
                                    {format(new Date(lead.created_at), 'dd.MM.yyyy - HH:mm')}
                                </div>
                            </td>

                            <td className="py-4 px-6 font-bold text-[#202324] whitespace-nowrap">
                                {lead.name}
                            </td>

                            <td className="py-4 px-6">
                                <a href={`mailto:${lead.email}`} className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium bg-blue-50 px-3 py-1 rounded-md transition-colors whitespace-nowrap">
                                    <Mail size={14} /> {lead.email}
                                </a>
                            </td>

                            <td className="py-4 px-6">
                                {lead.phone ? (
                                    <a href={`tel:${lead.phone}`} className="inline-flex items-center gap-2 text-sm text-[#202324]/60 hover:text-[#202324] font-medium whitespace-nowrap">
                                        <Phone size={14} className="text-[#202324]/30" /> {lead.phone}
                                    </a>
                                ) : (
                                    <span className="text-[#202324]/30 text-xs">-</span>
                                )}
                            </td>

                            <td className="py-4 px-6 whitespace-nowrap">
                                <div className="flex items-center gap-2 text-sm text-[#202324]/70 font-bold bg-[#f2f2f2] w-max px-3 py-1 rounded-md">
                                    <MapPin size={14} className="text-[#e8ac15]" /> {lead.plz}
                                </div>
                            </td>

                            <td className="py-4 px-6 whitespace-nowrap">
                                <div className="flex items-center gap-2 text-sm font-black text-[#202324]">
                                    <Zap size={16} className={lead.usage_amount > 4000 ? "text-red-500" : "text-green-500"} />
                                    {lead.usage_amount.toLocaleString('de-DE')}
                                </div>
                            </td>

                            <td className="py-4 px-6 text-right whitespace-nowrap">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                    ${lead.status === 'new' ? 'bg-[#e8ac15] text-[#202324]' :
                                        lead.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                                            'bg-green-100 text-green-800'}`}
                                >
                                    {lead.status === 'new' ? 'Neu' : lead.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
