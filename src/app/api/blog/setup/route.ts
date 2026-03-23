import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS blog_posts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                slug VARCHAR(255) NOT NULL UNIQUE,
                excerpt TEXT NOT NULL,
                content LONGTEXT NOT NULL,
                image VARCHAR(255),
                category VARCHAR(100),
                author VARCHAR(100),
                read_time VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        await db.execute(query);
        return NextResponse.json({ success: true, message: 'Table blog_posts created successfully.' });
    } catch (error: unknown) {
        console.error('Setup DB error:', error);
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}
