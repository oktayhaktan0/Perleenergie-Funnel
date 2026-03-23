import ReviewForm from "@/components/ReviewForm";
import ReviewList from "@/components/ReviewList";
import { Star } from "lucide-react";

export default function ReviewsPage() {
    return (
        <div className="min-h-screen bg-[#f2f2f2] text-[#202324] font-sans">
            <main className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Hero Section */}
                    <div className="text-center mb-16 animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent font-bold text-sm mb-6">
                            <Star size={16} className="fill-accent" />
                            <span>4.9 / 5 Kundenbewertungen</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
                            Was unsere Kunden <br />
                            <span className="text-accent italic">über uns sagen.</span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Transparenz und Vertrauen sind uns wichtig. Lesen Sie die Erfahrungen unserer Community oder teilen Sie Ihre eigene.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Reviews List */}
                        <div className="lg:col-span-2 space-y-12">
                            <h2 className="text-3xl font-bold flex items-center gap-3">
                                Neueste Erfahrungen
                                <span className="w-2 h-2 rounded-full bg-green-500 shadow-glow" />
                            </h2>
                            <ReviewList />
                        </div>

                        {/* Submission Form Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-32">
                                <ReviewForm />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
