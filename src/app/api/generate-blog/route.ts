import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { GoogleGenerativeAI } from '@google/generative-ai';
import slugify from 'slugify';
import { RowDataPacket } from 'mysql2';

// API Keys - `.env.local` ve Hostinger ortam değişkenlerinde olmalı
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const CRON_SECRET = process.env.CRON_SECRET || ''; // Güvenlik için

export async function GET(request: Request) {
    try {
        // Güvenlik Kontrolü
        const { searchParams } = new URL(request.url);
        if (searchParams.get('secret') !== CRON_SECRET) {
            return NextResponse.json({ error: 'Yetkisiz erişim! Geçersiz secret key.' }, { status: 401 });
        }

        // 1. Kullanılmamış Anahtar Kelime Seç
        const [keywordsResult] = await db.query<RowDataPacket[]>(
            "SELECT id, keyword FROM blog_keywords WHERE is_used = false ORDER BY RAND() LIMIT 1"
        );

        if (!keywordsResult || keywordsResult.length === 0) {
            return NextResponse.json({ message: 'Blog yazılacak anahtar kelime bulunamadı.' }, { status: 200 });
        }

        const keywordObj = keywordsResult[0];
        const keyword = keywordObj.keyword;

        // 2. Gemini Yapay Zeka ile İçerik Üret
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const slugs = [
            'dein-solar-sprungbrett-2026-kosten-ersparnis-zukunft',
            'dein-zuhause-dein-sparplan-clever-heizen-mit-smarten-thermostaten',
            'die-eigene-wallbox-installieren-ihr-weg-zu-smarter-e-mobilitaet-mit-perle-energie',
            'dynamische-stromtarife-ein-echter-vorteil-oder-nur-ein-hype-ihr-leitfaden-mit-perle-energie',
            'dynamische-stromtarife-eine-investition-die-sich-auszahlt-oder-ein-riskantes-spiel',
            'dynamische-stromtarife-eine-tiefgehende-analyse-fuer-bewusste-verbraucher-lohnt-sich-der-wechsel',
            'dynamische-stromtarife-revolution-oder-risiko-fuer-ihre-energiekosten',
            'ihre-e-mobilitaet-zuhause-ein-leitfaden-zur-reibungslosen-installation-ihrer-wallbox-fuer-elektrofahrzeuge',
            'ihre-persoenliche-tankstelle-zuhause-die-reibungslose-installation-einer-wallbox-fuer-elektrofahrzeuge',
            'intelligente-waerme-im-winter-wie-smarte-thermostate-ihre-erdgas-und-stromkosten-revolutionieren',
            'mehr-als-nur-strom-die-perfekte-integration-ihrer-wallbox-in-ihr-zuhause-fuer-nachhaltige-e-mobilitaet',
            'mit-intelligenz-durch-den-winter-wie-smarte-thermostate-ihre-gas-und-stromkosten-nachhaltig-senken',
            'nie-wieder-frieren-und-sparen-dein-smarter-winter-mit-uns',
            'photovoltaik-2026-intelligente-investition-klare-amortisation-und-ihre-rolle-in-der-energiewende-mit-perle-energie',
            'photovoltaik-anlagen-kosten-und-amortisationszeit-2026-strategien-fuer-maximale-rendite-und-unabhaengigkeit',
            'sind-dynamische-stromtarife-wirklich-vorteilhaft-ein-tiefer-einblick-fuer-bewusste-verbraucher',
            'smart-durch-den-winter-maximale-einsparungen-bei-gas-und-strom-mit-modernster-thermostat-technologie',
            'solar-2026-was-kostet-deine-energie-freiheit-wirklich',
            'solaranlagen-2026-ein-vorausschau-auf-kosten-amortisationszeit-und-ihre-energieunabhaengigkeit',
            'solarmodul-kosten-und-amortisationszeit-2026-ihr-wegweiser-zur-gruenen-energieunabhaengigkeit',
            'solarmodul-kosten-und-amortisationszeit-2026-ihr-weitblick-fuer-eine-zukunftssichere-investition',
            'wallbox-fuer-ihr-elektroauto-so-gelingt-die-heimladestations-installation-sicher-und-effizient'
        ];

        const randomSlugs = slugs.sort(() => 0.5 - Math.random()).slice(0, 2);
        const prompt = `
Oluşturacağın içeriği doğrudan bir JSON objesi olarak HTML formatında ver.
Anahtar Kelime: "${keyword}"
Makale kuralları:
1. Almanca, akıcı ve kurumsal-samimi dil.
2. Benzersiz içerik, klasik şablon yok.
3. HTML olarak:
   - <h2>, <h3>, <p>, <strong>, <em>, <ul>, <li>, <blockquote>, <table> kullan.
4. Makale içinde "Perle Energie" sadece 1-2 kez doğal şekilde geçsin.
5. Makale içinde aşağıdaki 2 linki rastgele bağla:
   - https://perleenergie.de/blog/${randomSlugs[0]}
   - https://perleenergie.de/blog/${randomSlugs[1]}
6. Görsel arama için 2-3 kelimelik İngilizce spesifik terim ver "image_search_query".
7. 600-800 kelime arası uzunluk.
Cevap JSON formatında olmalı:
{
  "title": "...",
  "excerpt": "...",
  "category": "...",
  "image_search_query": "...",
  "content": "HTML içeriği burada"
}
`;

        const result = await model.generateContent(prompt);
        let responseText = result.response.text();
        responseText = responseText.replace(/^```json/gm, '').replace(/^```/gm, '').trim();

        let blogData;
        try {
            blogData = JSON.parse(responseText);
        } catch (e) {
            console.error("Yapay Zekadan JSON parse edilemedi:", responseText);
            return NextResponse.json({ error: 'Yapay Zeka beklenen formata uygun bir cevap üretmedi.', rawDetail: responseText }, { status: 500 });
        }

        // 3. Unsplash Resim
        let imageUrl = 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=2670&auto=format&fit=crop';
        try {
            if (process.env.UNSPLASH_ACCESS_KEY && blogData.image_search_query) {
                const unsplashSearch = encodeURIComponent(blogData.image_search_query);
                const unsplashRes = await fetch(`https://api.unsplash.com/search/photos?query=${unsplashSearch}&client_id=${process.env.UNSPLASH_ACCESS_KEY}&per_page=15&orientation=landscape&content_filter=high`);
                const unsplashData = await unsplashRes.json();
                if (unsplashData.results && unsplashData.results.length > 0) {
                    const randomIndex = Math.floor(Math.random() * unsplashData.results.length);
                    imageUrl = unsplashData.results[randomIndex].urls.regular;
                }
            }
        } catch (error) {
            console.log("Unsplash resmi çekilemedi, varsayılan resim kullanılıyor.", error);
        }

        // 4. Slug ve Tarih
        const slug = slugify(blogData.title, { lower: true, strict: true, locale: 'de' });
        const dateObj = new Date();
        const dateStr = dateObj.toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' });

        // 5. Okuma süresi
        const wordCount = blogData.content.replace(/<[^>]*>?/gm, '').split(/\s+/).length;
        const readTime = Math.max(1, Math.ceil(wordCount / 200)) + ' Min.';

        // 6. Veritabanına kaydet
        await db.query(
            "INSERT INTO blogs (slug, title, excerpt, content, image, category, author, readTime, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [slug, blogData.title, blogData.excerpt, blogData.content, imageUrl, blogData.category, "Perle Redaktion", readTime, dateStr]
        );

        // 7. Anahtar kelimeyi "kullanıldı" olarak işaretle
        await db.query("UPDATE blog_keywords SET is_used = true WHERE id = ?", [keywordObj.id]);

        return NextResponse.json({
            success: true,
            message: 'Yeni blog yazısı başarıyla oluşturuldu!',
            details: {
                keyword: keyword,
                title: blogData.title,
                slug: slug,
                category: blogData.category,
                image: imageUrl
            }
        });

    } catch (error: any) {
        console.error("Otomatik Blog Yazdırma Hatası:", error);
        return NextResponse.json({ error: 'Sunucu Hatası', details: error.message }, { status: 500 });
    }
}