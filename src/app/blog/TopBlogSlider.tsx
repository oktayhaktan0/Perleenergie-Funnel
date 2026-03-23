"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MessageSquare } from "lucide-react";

export default function TopBlogSlider({ posts }: { posts: any[] }) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!scrollContainerRef.current) return;

        let interval: NodeJS.Timeout;
        const container = scrollContainerRef.current;

        const handleScroll = () => {
            if (window.innerWidth >= 768) return; // Masaüstünde çalışmasın
            // Anlık olarak hangi slide'da olduğumuzu hesapla
            const index = Math.round(container.scrollLeft / container.clientWidth);
            setCurrentIndex(index);
        };

        container.addEventListener("scroll", handleScroll, { passive: true });

        const startAutoScroll = () => {
            interval = setInterval(() => {
                // Sadece mobilde slider çalışsın
                if (window.innerWidth >= 768) return;

                if (container) {
                    const maxScrollLeft = container.scrollWidth - container.clientWidth;
                    // Eğer en sağa ulaştıysak (veya çok yaklaştıysak)
                    if (container.scrollLeft >= maxScrollLeft - 10) {
                        container.scrollTo({ left: 0, behavior: 'smooth' }); // Başa dön
                    } else {
                        // Bir kart genişliği kadar sağa kaydır
                        container.scrollBy({ left: container.clientWidth, behavior: 'smooth' });
                    }
                }
            }, 3500); // 3.5 saniyede bir değiştir
        };

        startAutoScroll();

        // Kullanıcı dokunduğunda/kaydırdığında intervali sıfırlamak için (daha iyi UX)
        const handleInteraction = () => {
            clearInterval(interval);
            startAutoScroll();
        };

        container.addEventListener("touchstart", handleInteraction, { passive: true });
        container.addEventListener("mousedown", handleInteraction, { passive: true });

        return () => {
            clearInterval(interval);
            if (container) {
                container.removeEventListener("scroll", handleScroll);
                container.removeEventListener("touchstart", handleInteraction);
                container.removeEventListener("mousedown", handleInteraction);
            }
        };
    }, []);

    // Manuel olarak diyan dot'a tıklandığında kaydırma
    const goToSlide = (index: number) => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        container.scrollTo({
            left: index * container.clientWidth,
            behavior: 'smooth'
        });
        setCurrentIndex(index);
    };

    if (!posts || posts.length === 0) return null;

    return (
        <section className="mb-16">
            <h1 className="text-3xl sm:text-[34px] font-bold mb-8 text-[#202324]">
                Meistgelesen
            </h1>

            {/* Slider Container */}
            <div
                ref={scrollContainerRef}
                className="flex md:grid md:grid-cols-2 gap-4 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-4 md:pb-0 scroll-smooth hide-scrollbar transition-all"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {posts.map((post, i) => (
                    <Link
                        key={i}
                        href={`/blog/${post.slug}`}
                        className="snap-center shrink-0 w-[85vw] md:w-auto group flex flex-col rounded-[16px] overflow-hidden bg-[#202324] shadow-md hover:shadow-xl transition-all duration-300"
                    >
                        {/* Text Area (Dark Background) */}
                        <div className="p-6 sm:p-8 flex-1 flex flex-col justify-start text-white">
                            <div className="flex justify-between items-center text-xs font-semibold text-white/70 mb-5 tracking-wide">
                                <div className="flex items-center gap-2">
                                    <Calendar size={14} /> {post.date}
                                </div>
                                <div className="flex items-center gap-2">
                                    <MessageSquare size={14} /> {post.readTime}
                                </div>
                            </div>

                            <h2 className="text-2xl sm:text-[26px] font-bold mb-3 leading-[1.3] group-hover:text-[#e8ac15] transition-colors line-clamp-3">
                                {post.title}
                            </h2>

                            <p className="text-white/80 text-[15px] leading-relaxed mb-2 line-clamp-3">
                                {post.excerpt} <span className="text-white/60 inline-block font-semibold group-hover:text-[#e8ac15] transition-all ml-1 underline decoration-white/30 group-hover:decoration-[#e8ac15] underline-offset-4">Lees verder</span>
                            </p>
                        </div>

                        {/* Image Area */}
                        <div className="h-[220px] sm:h-[280px] w-full overflow-hidden shrink-0 mt-auto relative">
                            <Image
                                src={post.image}
                                alt={post.title}
                                width={600}
                                height={400}
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                    </Link>
                ))}
            </div>

            {/* Pagination Dots (Sadece mobilde görünür) */}
            {posts.length > 1 && (
                <div className="flex justify-center items-center gap-4 mt-6 md:hidden">
                    {posts.map((_, i) => {
                        const isActive = currentIndex === i;
                        return (
                            <button
                                key={i}
                                onClick={() => goToSlide(i)}
                                aria-label={`Go to slide ${i + 1}`}
                                className={`transition-all duration-500 rounded-full ${isActive
                                    ? "w-2.5 h-2.5 bg-[#e8ac15] ring-[5px] ring-[#e8ac15]/20 scale-110"
                                    : "w-2 h-2 bg-[#202324]/20 hover:bg-[#202324]/40"
                                    }`}
                            />
                        );
                    })}
                </div>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}} />
        </section>
    );
}
