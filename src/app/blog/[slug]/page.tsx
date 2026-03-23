import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, User, Share2 } from "lucide-react";
import { db } from "@/lib/db";

export const revalidate = 60; // 60 saniyede bir günceller (ISR)

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    try {
        const [rows]: any = await db.query("SELECT title, excerpt, image, category FROM blogs WHERE slug = ? LIMIT 1", [slug]);
        const post = rows[0];

        if (!post) return { title: 'Not Found' };

        return {
            title: post.title,
            description: post.excerpt,
            alternates: {
                canonical: `/blog/${slug}`,
            },
            openGraph: {
                title: post.title,
                description: post.excerpt,
                images: [{ url: post.image }],
                type: 'article',
                section: post.category,
            },
            twitter: {
                card: 'summary_large_image',
                title: post.title,
                description: post.excerpt,
                images: [post.image],
            },
        };
    } catch {
        return {
            title: 'Blog | Perle Energie',
            alternates: {
                canonical: '/blog',
            }
        };
    }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    let post: any = null;
    try {
        const [rows]: any = await db.query("SELECT * FROM blogs WHERE slug = ? LIMIT 1", [slug]);
        post = rows[0];
    } catch (e) {
        console.error("Blog detayı çekilirken hata:", e);
    }

    if (!post) {
        notFound();
    }

    return (
        <div className="flex flex-col min-h-screen bg-white text-[#202324] pt-32 pb-20">
            <main className="flex-grow">
                <article className="max-w-4xl mx-auto px-6 md:px-12">
                    {/* Back Button */}
                    <div className="mb-8">
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 text-[#202324]/60 hover:text-[#e8ac15] font-semibold transition-colors"
                        >
                            <ArrowLeft size={18} /> Zurück zur Übersicht
                        </Link>
                    </div>

                    {/* Article Header */}
                    <header className="mb-12">
                        <span className="text-[#e8ac15] text-[12px] font-bold uppercase tracking-widest mb-4 block">
                            {post.category}
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-8">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-sm font-semibold text-[#202324]/50 border-y border-[#202324]/10 py-4">
                            <div className="flex items-center gap-2">
                                <User size={16} /> {post.author}
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={16} /> {post.date}
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={16} /> {post.readTime}
                            </div>
                            <button className="flex items-center gap-2 ml-auto hover:text-[#e8ac15] transition-colors">
                                <Share2 size={16} /> Teilen
                            </button>
                        </div>
                    </header>

                    {/* Featured Image */}
                    <div className="rounded-[2rem] overflow-hidden mb-12 aspect-[21/9] relative shadow-xl">
                        <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Article Body */}
                    <div className="prose prose-lg max-w-none text-[#202324]/80 prose-headings:text-[#202324] prose-headings:font-bold prose-p:leading-relaxed prose-a:text-[#e8ac15] prose-a:no-underline hover:prose-a:underline">
                        <p className="text-xl font-medium leading-relaxed mb-12 text-[#202324] border-l-4 border-[#e8ac15] pl-6 italic">
                            {post.excerpt}
                        </p>

                        <div 
                            className="blog-content-wrapper"
                            dangerouslySetInnerHTML={{ 
                                __html: (post.content || '')
                                    .replace(/&lt;/g, '<')
                                    .replace(/&gt;/g, '>')
                                    .replace(/&amp;/g, '&')
                                    .replace(/&quot;/g, '"')
                                    .replace(/&#39;/g, "'")
                            }} 
                        />
                    </div>

                </article>
            </main>
        </div>
    );
}
