'use client';

import { useState } from 'react';
import { Star, Send, CheckCircle2 } from 'lucide-react';

export default function ReviewForm() {
    const [name, setName] = useState('');
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [hover, setHover] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, rating, comment }),
            });

            if (res.ok) {
                setIsSuccess(true);
                setName('');
                setComment('');
                setRating(5);
            }
        } catch (error) {
            console.error('Submit review error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="bg-white p-8 rounded-3xl border border-[#202324]/10 shadow-premium text-center flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    <CheckCircle2 size={32} />
                </div>
                <h3 className="text-2xl font-bold text-[#202324]">Vielen Dank!</h3>
                <p className="text-gray-600">Ihre Bewertung wurde erfolgreich übermittelt ve wird nach einer kurzen Prüfung veröffentlicht.</p>
                <button
                    onClick={() => setIsSuccess(false)}
                    className="mt-2 text-primary font-bold hover:underline"
                >
                    Weitere Bewertung abgeben
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-[#202324]/10 shadow-premium space-y-6">
            <h3 className="text-2xl font-bold text-[#202324]">Ihre Meinung zählt</h3>
            <p className="text-gray-600 text-sm">Teilen Sie Ihre Erfahrungen mit Perle Energie.</p>

            <div className="space-y-2">
                <label className="text-sm font-bold text-[#202324]">Bewertung</label>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                            className="transition-all hover:scale-110 active:scale-95"
                        >
                            <Star
                                size={28}
                                className={`${(hover || rating) >= star
                                        ? 'fill-accent text-accent'
                                        : 'text-gray-300'
                                    } transition-colors duration-200`}
                            />
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-bold text-[#202324]">Name</label>
                <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Erika Mustermann"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="comment" className="text-sm font-bold text-[#202324]">Ihr Kommentar</label>
                <textarea
                    id="comment"
                    required
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Wie war Ihr Erlebnis..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all resize-none"
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary-hover shadow-glow transition-all active:scale-[0.98] disabled:opacity-70"
            >
                {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <>
                        <Send size={18} />
                        Bewertung absenden
                    </>
                )}
            </button>
        </form>
    );
}
