/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useCallback } from 'react';
import { UploadCloud, CheckCircle, ArrowLeft, Image as ImageIcon, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminBlogPage() {
    const [title, setTitle] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [author, setAuthor] = useState('Admin');
    const [readTime, setReadTime] = useState('5 Min.');

    // Upload state
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadedImagePath, setUploadedImagePath] = useState<string | null>(null);

    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const router = useRouter();

    const onDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const onDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileSelection(e.dataTransfer.files[0]);
        }
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFileSelection(e.target.files[0]);
        }
    };

    const handleFileSelection = (selectedFile: File) => {
        setFile(selectedFile);
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreviewUrl(objectUrl);
    };

    const handleUploadImage = async () => {
        if (!file) return null;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();

            if (data.success) {
                setUploadedImagePath(data.url);
                return data.url;
            } else {
                throw new Error(data.error || 'Upload failed');
            }
        } catch (error: unknown) {
            console.error('Upload Error:', error);
            setErrorMsg('Bild konnte nicht hochgeladen werden.');
            return null;
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            // First upload image if there's a new one
            let finalImageUrl = uploadedImagePath;
            if (file && !uploadedImagePath) {
                finalImageUrl = await handleUploadImage();
            }

            // Create blog post entry
            const payload = {
                title,
                excerpt,
                content,
                image: finalImageUrl,
                category,
                author,
                read_time: readTime
            };

            const res = await fetch('/api/blog', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();

            if (data.success) {
                setSuccessMsg('Blog-Beitrag erfolgreich erstellt!');
                // Reset form fields
                setTitle(''); setExcerpt(''); setContent(''); setCategory('');
                setFile(null); setPreviewUrl(null); setUploadedImagePath(null);

                // Optional redirect or scroll
                setTimeout(() => router.push('/blog'), 2000);
            } else {
                setErrorMsg(data.error || 'Fehler beim Erstellen.');
            }
        } catch {
            setErrorMsg('Serverfehler aufgetreten.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Helper to run setup DB if table doesn't exist
    const setupDB = async () => {
        const res = await fetch('/api/blog/setup');
        const data = await res.json();
        if (data.success) alert('Datenbanktabelle erfolgreich erstellt!');
        else alert('Fehler: ' + data.error);
    }

    return (
        <div className="min-h-screen bg-[#f2f2f2] text-[#202324] p-8 md:p-12 font-sans">
            <div className="max-w-4xl mx-auto mt-16 md:mt-20 border border-[#202324]/5 bg-white p-6 md:p-12 rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)]">

                <div className="flex items-center justify-between mb-8 pb-6 border-b border-[#202324]/10">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="p-2 bg-[#f2f2f2] text-[#202324] rounded-xl hover:bg-[#e8ac15] transition-colors group">
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        </Link>
                        <h1 className="text-3xl font-extrabold tracking-tight">Neuer Blog-Beitrag</h1>
                    </div>
                </div>

                {successMsg && (
                    <div className="mb-8 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center gap-3 font-semibold">
                        <CheckCircle size={20} className="text-green-500" />
                        {successMsg}
                    </div>
                )}
                {errorMsg && (
                    <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl font-semibold">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Basic Info */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#202324]/70">Titel des Beitrags *</label>
                            <input required type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Gib einen spannenden Titel ein..." className="w-full bg-[#f9fafb] border border-[#202324]/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#e8ac15] transition-shadow placeholder:text-[#202324]/30 font-medium" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#202324]/70">Kurzbeschreibung (Auszug) *</label>
                            <textarea required rows={2} value={excerpt} onChange={e => setExcerpt(e.target.value)} placeholder="Zusammenfassung des Themas..." className="w-full bg-[#f9fafb] border border-[#202324]/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#e8ac15] transition-shadow placeholder:text-[#202324]/30 font-medium resize-none"></textarea>
                        </div>
                    </div>

                    {/* Meta Data Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#202324]/70">Kategorie</label>
                            <input type="text" value={category} onChange={e => setCategory(e.target.value)} placeholder="z.B. Innovation, Tipps..." className="w-full bg-[#f9fafb] border border-[#202324]/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#e8ac15] transition-shadow font-medium" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#202324]/70">Autor</label>
                            <input type="text" value={author} onChange={e => setAuthor(e.target.value)} placeholder="Name des Autors" className="w-full bg-[#f9fafb] border border-[#202324]/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#e8ac15] transition-shadow font-medium" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#202324]/70">Lesezeit</label>
                            <input type="text" value={readTime} onChange={e => setReadTime(e.target.value)} placeholder="z.B. 5 Min." className="w-full bg-[#f9fafb] border border-[#202324]/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#e8ac15] transition-shadow font-medium" />
                        </div>
                    </div>

                    {/* Image Upload Dropzone */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[#202324]/70">Titelbild (Optional)</label>
                        <div
                            onDragOver={onDragOver}
                            onDragLeave={onDragLeave}
                            onDrop={onDrop}
                            className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all duration-300 relative overflow-hidden ${isDragging ? 'border-[#e8ac15] bg-[#e8ac15]/5' : 'border-[#202324]/10 hover:border-[#202324]/20 bg-[#f9fafb]'}`}
                        >
                            {previewUrl ? (
                                <div className="absolute inset-0 w-full h-full p-2">
                                    <img src={previewUrl} alt="Vorschau" className="w-full h-full object-cover rounded-xl" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-xl m-2 rounded-xl backdrop-blur-sm">
                                        <label className="cursor-pointer bg-white text-[#202324] font-bold px-4 py-2 rounded-full text-sm">
                                            Bild ändern
                                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                        </label>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <div className="w-14 h-14 bg-white shadow-sm border border-[#202324]/5 rounded-xl flex items-center justify-center text-[#e8ac15] mx-auto mb-4">
                                        <ImageIcon size={24} />
                                    </div>
                                    <h4 className="font-bold text-[#202324] mb-2">Bild hierher ziehen oder klicken</h4>
                                    <p className="text-xs font-semibold text-[#202324]/40 mb-6">PNG, JPG bis max. 5MB</p>
                                    <label className="cursor-pointer bg-white border border-[#202324]/10 hover:border-[#e8ac15] text-[#202324] font-bold px-6 py-2.5 rounded-full text-sm transition-colors shadow-sm inline-flex items-center gap-2">
                                        <UploadCloud size={16} /> Datei auswählen
                                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Content Editor */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[#202324]/70">Beitragstext *</label>
                        <div className="text-xs text-[#202324]/40 font-semibold mb-2">Unterstützt HTML-Tags wie &lt;h3&gt;, &lt;p&gt;, &lt;strong&gt;, etc.</div>
                        <textarea required rows={12} value={content} onChange={e => setContent(e.target.value)} placeholder="Dein faszinierender Artikel..." className="w-full bg-[#f9fafb] border border-[#202324]/10 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#e8ac15] transition-shadow placeholder:text-[#202324]/30 font-medium resize-y font-mono text-sm leading-relaxed"></textarea>
                    </div>

                    {/* Submit Actions */}
                    <div className="pt-6 border-t border-[#202324]/10 flex flex-col md:flex-row items-center justify-between gap-4">
                        <button type="button" onClick={setupDB} className="text-xs font-bold uppercase tracking-widest text-[#202324]/40 hover:text-[#e8ac15] transition-colors underline decoration-[#202324]/5 underline-offset-4">
                            Tabelle Initialisieren (DB Setup)
                        </button>

                        <button type="submit" disabled={isSubmitting || isUploading} className="w-full md:w-auto bg-[#202324] hover:bg-[#e8ac15] text-white hover:text-[#202324] font-bold py-4 px-10 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgb(232,172,21,0.2)] transition-all duration-300 flex items-center justify-center gap-3 group whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed">
                            {(isSubmitting || isUploading) ? <><Loader2 size={20} className="animate-spin" /> Speichern...</> : 'Beitrag veröffentlichen'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
