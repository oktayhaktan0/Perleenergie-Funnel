import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    try {
        // Blogların kaydedileceği ana tablo
        await db.query(`
            CREATE TABLE IF NOT EXISTS blogs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                slug VARCHAR(255) NOT NULL UNIQUE,
                title VARCHAR(255) NOT NULL,
                excerpt TEXT,
                content LONGTEXT,
                image VARCHAR(1000),
                category VARCHAR(100),
                author VARCHAR(100),
                readTime VARCHAR(50),
                date VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Anahtar kelimelerin havuzda tutulacağı tablo
        await db.query(`
            CREATE TABLE IF NOT EXISTS blog_keywords (
                id INT AUTO_INCREMENT PRIMARY KEY,
                keyword VARCHAR(255) NOT NULL UNIQUE,
                is_used BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Test edebilmeniz için havuza başlangıç için 4 tane kelime atalım
        await db.query(`
            INSERT IGNORE INTO blog_keywords (keyword) VALUES 
            ('Güneş Paneli Maliyetleri ve Geri Dönüş Süresi 2026'),
            ('Elektrikli Araçlar İçin Ev Tipi Şarj İstasyonu (Wallbox) Kurulumu'),
            ('Akıllı Termostatlarla Kışın Doğalgaz ve Elektrik Tasarrufu'),
            ('Dinamik Elektrik Tarifeleri Gerçekten Avantajlı Mı?')
        `);

        return NextResponse.json({
            success: true,
            message: 'Veritabanına blog tabloları başarıyla kuruldu ve içine test için 4 adet SEO anahtar kelimesi atıldı!'
        });
    } catch (error: any) {
        console.error("Tablo oluşturulamadı:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
