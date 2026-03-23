"use client";

import { useState } from "react";

import { Plus, Minus, ArrowRight } from "lucide-react";

type FAQItem = {
    question: string;
    answer: string;
};

type FAQCategory = {
    title: string;
    items: FAQItem[];
};

const faqs: FAQCategory[] = [
    {
        title: "Tarif & Preise",
        items: [
            {
                question: "Wie setzt sich der Preis zusammen?",
                answer: "Dein Preis besteht aus einem festen Grundpreis und einem Arbeitspreis pro Kilowattstunde (kWh). Beide Werte sind transparent ausgewiesen. Der Grundpreis deckt die Fixkosten ab, während der Arbeitspreis deinen tatsächlichen Verbrauch berechnet.",
            },
            {
                question: "Gibt es versteckte Kosten?",
                answer: "Nein. Wir verzichten komplett auf versteckte Gebühren, Boni-Tricks oder Klauseln, die sich später als Kostenfallen entpuppen. Was du beim Tarifrechner siehst, ist exakt das, was du zahlst.",
            },
        ]
    },
    {
        title: "Vertrag und Wechsel",
        items: [
            {
                question: "Habe ich eine Mindestlaufzeit?",
                answer: "Nein! Wir verzichten bewusst auf lange Mindestlaufzeiten. Du bleibst immer flexibel und kannst monatlich kündigen. Wir möchten, dass du wegen unseres guten Services bleibst, nicht wegen eines geknebelten Vertrages.",
            },
            {
                question: "Übernimmt Perle Energie die Kündigung bei meinem alten Anbieter?",
                answer: "Ja, zu 100%. Sobald du deinen Vertrag bei uns abschließt, kümmern wir uns im Hintergrund um die fristgerechte Kündigung bei deinem bisherigen Versorger und sorgen für einen nahtlosen Übergang ohne Stromausfall.",
            },
        ]
    },
    {
        title: "Kundenportal",
        items: [
            {
                question: "Wie erhalte ich Zugang zum Portal?",
                answer: "Nach deinem Vertragsabschluss erhältst du eine E-Mail mit deinen persönlichen Zugangsdaten. Damit kannst du dich direkt und sicher einloggen.",
            },
            {
                question: "Was kann ich dort verwalten?",
                answer: "Das Portal ist dein digitales Kontrollzentrum: Du kannst deine monatlichen Abschläge anpassen, Zählerstände bequem per Foto eintragen, Rechnungen einsehen und deine Stammdaten ändern - alles 100% digital und sofort wirksam.",
            }
        ]
    }
];

function FAQAccordion({ item, isOpen, onClick }: { item: FAQItem, isOpen: boolean, onClick: () => void }) {
    return (
        <div
            className={`border-b border-slate-200 last:border-0 transition-all duration-300 ${isOpen ? 'bg-muted' : 'bg-white hover:bg-muted/50'}`}
        >
            <button
                className="flex justify-between items-center w-full py-6 px-6 text-left focus:outline-none group"
                onClick={onClick}
                aria-expanded={isOpen}
            >
                <h3 className={`font-bold text-lg pr-8 transition-colors ${isOpen ? 'text-accent' : 'text-primary group-hover:text-accent'}`}>
                    {item.question}
                </h3>
                <div className={`flex-shrink-0 w-8 h-8  border flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-accent border-accent text-white rotate-180' : 'border-slate-200 text-muted-foreground group-hover:border-accent group-hover:text-accent'}`}>
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                </div>
            </button>
            <div
                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <p className="text-muted-foreground font-bold leading-relaxed">{item.answer}</p>
            </div>
        </div>
    );
}

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<string | null>("0-0");

    const toggleAccordion = (id: string) => {
        setOpenIndex(openIndex === id ? null : id);
    };

    return (
        <div className="py-24 bg-background min-h-screen relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-slate-100 to-transparent pointer-events-none"></div>

            <div className="container mx-auto px-4 max-w-3xl relative z-10">
                <div className="text-center mb-16 animate-fade-in-up">
                    <h1 className="text-4xl md:text-5xl font-bold text-primary  mb-4">Häufige Fragen</h1>
                    <p className="text-lg text-muted-foreground font-bold">Wir mögen es unkompliziert. Hier sind die klaren Antworten auf deine wichtigsten Fragen.</p>
                </div>

                <div className="space-y-12">
                    {faqs.map((category, catIndex) => (
                        <div key={catIndex} className="animate-fade-in-up" style={{ animationDelay: `${catIndex * 150}ms` }}>
                            <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-3">
                                <span className="w-8 h-8  bg-primary text-white flex items-center justify-center text-sm font-bold shadow-md">{catIndex + 1}</span>
                                {category.title}
                            </h2>

                            <div className="bg-white  shadow-sm border border-slate-200 overflow-hidden">
                                {category.items.map((item, itemIndex) => {
                                    const id = `${catIndex}-${itemIndex}`;
                                    return (
                                        <FAQAccordion
                                            key={itemIndex}
                                            item={item}
                                            isOpen={openIndex === id}
                                            onClick={() => toggleAccordion(id)}
                                        />
                                    );
                                })}
                            </div>

                            {/* Interruption CTA Card */}
                            {catIndex === 1 && (
                                <div className="mt-12 mb-12 bg-gradient-to-br from-primary to-slate-800 text-white p-10  text-center shadow-premium border-[3px] border-primary relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20  blur-[60px] pointer-events-none"></div>
                                    <h3 className="text-3xl font-bold mb-4 relative z-10">Klingt fair?</h3>
                                    <p className="text-slate-300 mb-8 max-w-md mx-auto font-bold relative z-10">Wir sind immer für dich erreichbar. Schreibe uns eine E-Mail oder rufe uns an.</p>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                        <a href="mailto:info@perleenergie.de" className="relative z-10 inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-primary px-8 py-4 font-bold uppercase tracking-widest transition-all hover:-translate-y-1">
                                            E-Mail <ArrowRight size={20} />
                                        </a>
                                        <a href="tel:+494065033581" className="relative z-10 inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-4 font-bold uppercase tracking-widest transition-all hover:-translate-y-1">
                                            Anrufen
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
