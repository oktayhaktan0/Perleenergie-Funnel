import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import TopBlogSlider from "./TopBlogSlider";
import { db } from "@/lib/db";

export const metadata = {
    title: 'Blog',
    description: 'Aktuelle Nachrichten, Tipps zum Energiesparen und Einblicke in die Welt der erneuerbaren Energien.',
    alternates: {
        canonical: '/blog',
    }
};

export const dynamic = 'force-dynamic';

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
    // URL'deki ?page=X değerini al
    const resolvedSearchParams = await searchParams;
    const currentPage = parseInt(resolvedSearchParams?.page || "1", 10);
    const ITEMS_PER_PAGE = 8; // Sayfa başına blog sayısı (İlk sayfada: 2 manşet + 6 liste vs)

    let blogPosts: any[] = [];
    let totalPosts = 0;
    let totalPages = 1;

    try {
        // 1. Veritabanındaki TOPLAM blog sayısını bul
        const [countResult]: any = await db.query("SELECT COUNT(*) as total FROM blogs");
        totalPosts = countResult[0].total;

        // 2. Toplam sayfa sayısını hesapla
        totalPages = Math.max(1, Math.ceil(totalPosts / ITEMS_PER_PAGE));

        // 3. Bulunduğumuz sayfaya göre (OFFSET) ve limit (LIMIT) ile verileri çek
        const offset = (currentPage - 1) * ITEMS_PER_PAGE;
        const [rows]: any = await db.query("SELECT * FROM blogs ORDER BY id DESC LIMIT ? OFFSET ?", [ITEMS_PER_PAGE, offset]);
        blogPosts = rows;
    } catch (e) {
        console.error("Blogları çekerken hata:", e);
    }

    // Sadece 1. sayfadaysak en baştaki 2 taneyi "Öne Çıkan (Meistgelesen)" yap
    const isFirstPage = currentPage === 1;
    const topPosts = isFirstPage ? blogPosts.slice(0, 2) : [];
    const otherPosts = isFirstPage ? blogPosts.slice(2) : blogPosts;

    // --- Sayfalama (Pagination) Numaralarını Otomatik Oluşturma Mantığı ---
    const getPagination = (current: number, total: number) => {
        const pages = [];
        if (total <= 5) {
            for (let i = 1; i <= total; i++) pages.push(i);
        } else {
            if (current <= 3) {
                pages.push(1, 2, 3, 4, '...', total);
            } else if (current >= total - 2) {
                pages.push(1, '...', total - 3, total - 2, total - 1, total);
            } else {
                pages.push(1, '...', current - 1, current, current + 1, '...', total);
            }
        }
        return pages;
    };

    const paginationItems = getPagination(currentPage, totalPages);

    return (
        <div className="flex flex-col min-h-screen bg-[#f2f2f2] text-[#202324] pt-32 pb-20 font-sans">
            <div className="max-w-[1240px] mx-auto w-full px-4 lg:px-8 text-left">

                {blogPosts.length === 0 ? (
                    <div className="text-center text-xl text-gray-500 py-32 bg-white rounded-3xl border border-gray-200 shadow-sm">
                        Henüz hiç blog yazısı bulunmuyor. Yeni yazı eklendiğinde burada görünecek.
                    </div>
                ) : (
                    <>
                        {/* --- TOP Grid (Meistgelesen) --- */}
                        {topPosts.length > 0 && <TopBlogSlider posts={topPosts} />}

                        {/* --- LIST Grid (Das neuste aus der Branche) --- */}
                        {otherPosts.length > 0 && (
                            <section className="mb-16">
                                <h2 className="text-[28px] sm:text-[32px] font-bold mb-8 text-[#202324]">
                                    {isFirstPage ? "Das neuste aus der Branche" : "Weitere Artikel"}
                                </h2>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                    {otherPosts.map((post, i) => (
                                        <Link key={i} href={`/blog/${post.slug}`} className="group flex flex-row items-center bg-white rounded-[16px] p-4 sm:p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 gap-4 sm:gap-6">

                                            {/* Text Area */}
                                            <div className="flex-1 flex flex-col justify-center">
                                                <div className="flex justify-between items-center text-[12px] font-medium text-gray-500 mb-2.5">
                                                    <div className="flex items-center gap-1.5 text-[#e8ac15]">
                                                        <Calendar size={14} /> <span className="text-gray-500">{post.date}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-[#e8ac15]">
                                                        <MessageSquare size={14} /> <span className="text-gray-500">{post.readTime}</span>
                                                    </div>
                                                </div>

                                                <h3 className="text-[16px] sm:text-[18px] font-bold leading-snug text-[#202324] group-hover:text-[#e8ac15] transition-colors line-clamp-3">
                                                    {post.title}
                                                </h3>
                                            </div>

                                            {/* Image Area */}
                                            <div className="w-[100px] h-[80px] sm:w-[140px] sm:h-[100px] overflow-hidden shrink-0 rounded-lg">
                                                <Image
                                                    src={post.image}
                                                    alt={post.title}
                                                    width={300}
                                                    height={200}
                                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* --- PAGINATION --- */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-12 pb-12">
                                {paginationItems.map((item, idx) => {
                                    if (item === '...') {
                                        return (
                                            <span key={`dots-${idx}`} className="w-10 h-10 flex items-center justify-center text-sm font-bold text-gray-400">
                                                ...
                                            </span>
                                        );
                                    }

                                    const isCurrent = item === currentPage;

                                    if (isCurrent) {
                                        return (
                                            <span
                                                key={item}
                                                className="w-10 h-10 flex items-center justify-center bg-[#202324] text-white font-bold rounded-lg text-sm shadow-md"
                                            >
                                                {item}
                                            </span>
                                        );
                                    }

                                    return (
                                        <Link
                                            key={item}
                                            href={`/blog?page=${item}`}
                                            className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 text-[#202324] font-bold rounded-lg hover:bg-gray-50 transition-colors text-sm"
                                        >
                                            {item}
                                        </Link>
                                    );
                                })}
                            </div>
                        )}


                    </>
                )}

            </div>
        </div>
    );
}
