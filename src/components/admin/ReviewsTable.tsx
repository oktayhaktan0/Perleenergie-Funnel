'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Check, X, Trash2, Star, Clock, User } from 'lucide-react';
import { toast } from 'sonner';

type Review = {
    id: number;
    name: string;
    rating: number;
    comment: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
};

export default function ReviewsTable() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchReviews = async () => {
        try {
            const res = await fetch('/api/admin/reviews');
            if (res.ok) {
                const json = await res.json();
                setReviews(json.data || []);
            }
        } catch (error) {
            console.error('Fetch admin reviews error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const updateStatus = async (id: number, status: string) => {
        try {
            const res = await fetch('/api/admin/reviews', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status }),
            });
            if (res.ok) {
                toast.success(`Rezension ${status === 'approved' ? 'freigegeben' : 'abgelehnt'}`);
                fetchReviews();
            }
        } catch {
            toast.error('Fehler beim Aktualisieren');
        }
    };

    const deleteReview = async (id: number) => {
        if (!confirm('Möchten Sie diese Bewertung wirklich löschen?')) return;
        try {
            const res = await fetch(`/api/admin/reviews?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Rezension gelöscht');
                fetchReviews();
            }
        } catch {
            toast.error('Fehler beim Löschen');
        }
    };

    if (loading) return <div className="p-10 text-center animate-pulse">Lade Bewertungen...</div>;

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-[#202324]/10 bg-slate-50/50">
                        <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-[#202324]/40 whitespace-nowrap">Datum</th>
                        <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-[#202324]/40 whitespace-nowrap">Kunde</th>
                        <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-[#202324]/40 whitespace-nowrap">Bewertung</th>
                        <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-[#202324]/40 whitespace-nowrap">Kommentar</th>
                        <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-[#202324]/40 whitespace-nowrap">Status</th>
                        <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-[#202324]/40 text-right whitespace-nowrap">Aktionen</th>
                    </tr>
                </thead>
                <tbody>
                    {reviews.map((review) => (
                        <tr key={review.id} className="border-b border-[#202324]/5 hover:bg-slate-50 transition-colors group">
                            <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                    <Clock size={14} className="opacity-40" />
                                    {format(new Date(review.created_at), 'dd.MM.yyyy')}
                                </div>
                            </td>
                            <td className="py-4 px-6 font-bold text-[#202324] whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                    <User size={16} className="text-accent" />
                                    {review.name}
                                </div>
                            </td>
                            <td className="py-4 px-6">
                                <div className="flex gap-1 text-accent">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star key={i} size={14} className={i < review.rating ? 'fill-accent' : 'text-gray-200'} />
                                    ))}
                                </div>
                            </td>
                            <td className="py-4 px-6 min-w-[300px]">
                                <p className="text-sm text-gray-600 italic">&quot;{review.comment}&quot;</p>
                            </td>
                            <td className="py-4 px-6">
                                <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter
                                    ${review.status === 'approved' ? 'bg-green-100 text-green-700' :
                                        review.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}
                                >
                                    {review.status}
                                </span>
                            </td>
                            <td className="py-4 px-6 text-right whitespace-nowrap">
                                <div className="flex justify-end gap-2">
                                    {review.status !== 'approved' && (
                                        <button
                                            onClick={() => updateStatus(review.id, 'approved')}
                                            className="p-2 hover:bg-green-50 text-green-600 rounded-lg transition-colors border border-green-100"
                                            title="Genehmigen"
                                        >
                                            <Check size={18} />
                                        </button>
                                    )}
                                    {review.status !== 'rejected' && (
                                        <button
                                            onClick={() => updateStatus(review.id, 'rejected')}
                                            className="p-2 hover:bg-amber-50 text-amber-600 rounded-lg transition-colors border border-amber-100"
                                            title="Ablehnen"
                                        >
                                            <X size={18} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteReview(review.id)}
                                        className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors border border-red-100"
                                        title="Löschen"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
