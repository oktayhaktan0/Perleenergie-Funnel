import { AlertCircle, Mail } from "lucide-react";

export default function KontoLoeschen() {
    return (
        <div className="py-20 bg-white">
            <div className="container mx-auto px-4 max-w-3xl prose prose-slate">
                <h1 className="text-4xl font-bold text-foreground mb-8">Konto und Daten löschen</h1>

                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                    Sie möchten Ihr Kundenkonto schließen und Ihre persönlichen Daten bei uns löschen lassen?
                    Wir machen Ihnen den Prozess so einfach und transparent wie möglich.
                </p>

                <div className="bg-amber-50 border-l-4 border-amber-500 p-6  mb-10 flex gap-4 items-start">
                    <AlertCircle className="text-amber-600 mt-1 flex-shrink-0" />
                    <div>
                        <h3 className="text-amber-800 font-bold mb-2 m-0 text-lg">Wichtiger Hinweis</h3>
                        <p className="text-amber-700 m-0 leading-relaxed text-sm">
                            Eine vollständige Löschung Ihres Kontos und Ihrer Daten ist erst nach Beendigung Ihres Stromliefervertrags möglich.
                            Solange ein aktiver Vertrag besteht, benötigen wir Ihre Daten zur Vertragsabwicklung.
                            Zudem müssen wir gesetzliche Aufbewahrungsfristen (z.B. für Rechnungen aus steuerlichen Gründen) einhalten.
                        </p>
                    </div>
                </div>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-primary">So können Sie Ihr Konto löschen</h2>

                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="w-8 h-8  bg-primary text-white flex items-center justify-center font-bold flex-shrink-0">1</div>
                            <div>
                                <h3 className="font-bold text-foreground text-lg mb-2">Per E-Mail beauftragen</h3>
                                <p className="text-muted-foreground text-sm">
                                    Senden Sie uns eine E-Mail mit der Bitte um Kontolöschung von der E-Mail-Adresse, die in Ihrem Kundenkonto hinterlegt ist.
                                </p>
                                <a href="mailto:info@perleenergie.de?subject=Antrag%20auf%20Kontol%C3%B6schung" className="inline-flex items-center gap-2 mt-3 text-accent font-bold hover:text-accent-hover transition-colors">
                                    <Mail size={16} /> E-Mail an info@perleenergie.de
                                </a>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-8 h-8  bg-primary/10 text-primary flex items-center justify-center font-bold flex-shrink-0">2</div>
                            <div>
                                <h3 className="font-bold text-foreground text-lg mb-2">Prüfung und Bearbeitung</h3>
                                <p className="text-muted-foreground text-sm">
                                    Wir prüfen, ob dem Löschwunsch gesetzliche oder vertragliche Gründe entgegenstehen (z.B. ausstehende Zahlungen oder gesetzliche Aufbewahrungsfristen von Rechnungen).
                                    Wir melden uns in der Regel innerhalb von 3-5 Werktagen.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-8 h-8  bg-primary/10 text-primary flex items-center justify-center font-bold flex-shrink-0">3</div>
                            <div>
                                <h3 className="font-bold text-foreground text-lg mb-2">Bestätigung & Löschung</h3>
                                <p className="text-muted-foreground text-sm">
                                    Sobald alle gesetzlichen Aufbewahrungsfristen abgelaufen und der Vertrag vollständig abgewickelt ist, löschen wir alle Ihre Daten unwiderruflich und senden Ihnen eine Bestätigung.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
