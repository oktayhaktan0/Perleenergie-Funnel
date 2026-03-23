import { Download } from "lucide-react";

export default function Widerruf() {
    return (
        <div className="py-20 bg-white">
            <div className="container mx-auto px-4 max-w-3xl prose prose-slate">
                <h1 className="text-4xl font-bold text-foreground mb-8">Widerrufsbelehrung</h1>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-primary">Widerrufsrecht</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                        Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.
                        Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                        Um Ihr Widerrufsrecht auszuüben, müssen Sie uns (Perle Energie, Winterhuder Weg 29, 22085 Hamburg, Germany, E-Mail: info@perleenergie.de, Tel: +49 40 650 33 581) mittels einer eindeutigen Erklärung (z.B. ein mit der Post versandter Brief oder E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Sie können dafür das beigefügte Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                        Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-primary">Folgen des Widerrufs</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                        Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                        Haben Sie verlangt, dass die Dienstleistungen (Belieferung mit Strom) während der Widerrufsfrist beginnen sollen, so haben Sie uns einen angemessenen Betrag zu zahlen, der dem Anteil der bis zu dem Zeitpunkt, zu dem Sie uns von der Ausübung des Widerrufsrechts hinsichtlich dieses Vertrags unterrichten, bereits erbrachten Dienstleistungen im Vergleich zum Gesamtumfang der im Vertrag vorgesehenen Dienstleistungen entspricht.
                    </p>
                </section>

                <section className="mb-8 p-6 bg-muted border border-slate-200  mt-12">
                    <h2 className="text-xl font-bold mb-4 text-primary flex items-center gap-2">
                        Muster-Widerrufsformular
                    </h2>
                    <p className="text-muted-foreground mb-4">
                        Wenn Sie den Vertrag widerrufen wollen, können Sie dieses Formular herunterladen, ausfüllen und an uns zurücksenden. Die Nutzung ist jedoch nicht verpflichtend.
                    </p>
                    <button className="flex items-center gap-2 bg-primary text-white px-6 py-3  hover:bg-primary-hover transition-colors shadow-sm cursor-pointer font-bold">
                        <Download size={18} /> Formular herunterladen (PDF)
                    </button>
                </section>
            </div>
        </div>
    );
}
