export default function AGB() {
    return (
        <div className="py-20 bg-white">
            <div className="container mx-auto px-4 max-w-3xl prose prose-slate">
                <h1 className="text-4xl font-bold text-foreground mb-8">Allgemeine Geschäftsbedingungen (AGB)</h1>

                <p className="text-muted-foreground leading-relaxed mb-8">
                    Unsere Allgemeinen Geschäftsbedingungen werden durch die Perle Energie bereitgestellt.
                    Hier finden Sie alle rechtlichen Rahmenbedingungen Ihres Vertrags, von der Vertragslaufzeit über Zahlungsbedingungen bis hin zur Kündigung.
                </p>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-primary">Präambel</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                        Die nachfolgenden Allgemeinen Geschäftsbedingungen (AGB) regeln das Vertragsverhältnis zwischen der Perle Energie (nachfolgend „Versorger“) und Ihnen (nachfolgend „Kunde“).
                        Der Vertrag wird direkt mit uns als Ihrem Energie-Partner geschlossen.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-primary">1. Vertragsgegenstand</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                        Gegenstand des Vertrages ist die Belieferung des Kunden mit elektrischer Energie. Der Vertragsschluss erfolgt digital über unsere Plattform.
                        Detaillierte Tarife und Preise entnehmen Sie bitte Ihrem individuellen Angebot bzw. der Vertragsbestätigung.
                    </p>
                </section>

                <section className="mb-8 p-6 bg-muted border border-slate-200 ">
                    <h2 className="text-xl font-bold mb-4 text-primary">Vollständige AGB herunterladen</h2>
                    <p className="text-muted-foreground mb-4">
                        Laden Sie hier die vollständigen, rechtlich bindenden Allgemeinen Geschäftsbedingungen der Perle Energie herunter.
                    </p>
                    <button className="bg-primary text-white px-6 py-3  hover:bg-primary-hover transition-colors shadow-sm cursor-pointer font-bold">
                        AGB als PDF herunterladen
                    </button>
                </section>
            </div>
        </div>
    );
}
