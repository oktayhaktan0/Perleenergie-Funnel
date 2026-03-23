export default function Datenschutz() {
    return (
        <div className="py-20 bg-white">
            <div className="container mx-auto px-4 max-w-3xl prose prose-slate">
                <h1 className="text-4xl font-bold text-foreground mb-8">Datenschutzerklärung</h1>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-primary">1. Datenschutz auf einen Blick</h2>
                    <h3 className="text-xl font-bold mt-6 mb-2">Allgemeine Hinweise</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                        Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen.
                    </p>
                    <h3 className="text-xl font-bold mt-6 mb-2">Datenerfassung auf dieser Website</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                        Wir erfassen Ihre Daten, wenn Sie diese an uns übermitteln (z.B. per Kontaktformular). Ebenso werden Daten beim Besuch der Website durch Cookies oder Drittanbieter-Integrationen erhoben, die in dieser Erklärung weiter erläutert werden.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-primary">2. Hosting, Cookies & Tracking</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                        Wir nutzen Vercel für das Hosting dieser Website. Wir minimieren den Einsatz von Tracking, erklären ihn jedoch transparent, wenn Sie einwilligen. Im Vorfeld (vor Ihrer Zustimmung) weden keine Tracking-Skripte geladen (Opt-in).
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-primary">3. Ihre Rechte (Art. 15–22 DSGVO)</h2>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                        <li><strong>Recht auf Auskunft</strong> über Ihre bei uns gespeicherten personenbezogenen Daten.</li>
                        <li><strong>Recht auf Berichtigung</strong> unrichtiger oder unvollständiger Daten.</li>
                        <li><strong>Recht auf Löschung</strong> (&quot;Recht auf Vergessenwerden&quot;).</li>
                        <li><strong>Recht auf Einschränkung der Verarbeitung</strong>.</li>
                        <li><strong>Recht auf Datenübertragbarkeit</strong>.</li>
                        <li><strong>Recht auf Widerruf</strong> erteilter Einwilligungen.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-primary">4. Kontakt für Datenschutzanfragen</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                        Bei Fragen zur Erhebung, Verarbeitung oder Nutzung Ihrer personenbezogenen Daten sowie bei Auskünften, Rechten oder Löschung wenden Sie sich bitte an:
                    </p>
                    <p className="text-muted-foreground leading-relaxed font-bold bg-muted p-4 border ">
                        E-Mail: <a href="mailto:info@perleenergie.de" className="text-accent hover:text-accent-hover transition-colors">info@perleenergie.de</a>
                    </p>
                </section>
            </div>
        </div>
    );
}
