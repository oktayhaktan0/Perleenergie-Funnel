'use client';

import { useEffect, useState } from 'react';
import { Star, Quote, User } from 'lucide-react';

type Review = {
    id: number;
    name: string;
    rating: number;
    comment: string;
    created_at: string;
};

export default function ReviewList() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch('/api/reviews');
                if (res.ok) {
                    const json = await res.json();
                    setReviews(json.data || []);
                }
            } catch (error) {
                console.error('Fetch reviews error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white/50 h-64 rounded-3xl" />
                ))}
            </div>
        );
    }

    if (reviews.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-300">
                <p className="text-gray-400 font-medium font-sans">Noch keine Bewertungen vorhanden.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review) => (
                <div
                    key={review.id}
                    className="bg-white p-8 rounded-[2.5rem] border border-[#202324]/10 shadow-[0_10px_40px_rgba(0,0,0,0.03)] flex flex-col gap-4 relative group hover:translate-y-[-4px] transition-all duration-300"
                >
                    <Quote className="absolute top-6 right-8 text-accent/10 w-12 h-12" />

                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                                key={s}
                                size={16}
                                className={`${s <= review.rating ? 'fill-accent text-accent' : 'text-gray-200'}`}
                            />
                        ))}
                    </div>

                    <p className="text-gray-700 leading-relaxed font-medium line-clamp-4 italic">
                        &quot;{review.comment}&quot;
                    </p>

                    <div className="mt-auto pt-6 border-t border-gray-50 flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                            <User size={20} />
                        </div>
                        <div>
                            <p className="font-bold text-[#202324]">{review.name}</p>
                            <p className="text-xs text-gray-400">Verifizierter Kunde</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
