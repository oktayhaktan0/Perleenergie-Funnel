import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import slugify from 'slugify';

// Get all blog posts
export async function GET() {
    try {
        const query = 'SELECT * FROM blog_posts ORDER BY created_at DESC';
        const [rows] = await db.execute(query);
        return NextResponse.json({ success: true, data: rows });
    } catch (error: unknown) {
        console.error('Fetch Blog Posts error:', error);
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}

// Submit a new blog post
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, excerpt, content, image, category, author, read_time } = body;

        if (!title || !content) {
            return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
        }

        const slug = slugify(title, { lower: true, strict: true }) + '-' + Date.now();

        const query = `
            INSERT INTO blog_posts (title, slug, excerpt, content, image, category, author, read_time)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await db.execute(query, [title, slug, excerpt || '', content, image || '', category || 'Allgemein', author || 'Admin', read_time || '5 Min.']);

        return NextResponse.json({ success: true, message: 'Blog post created successfully' });
    } catch (error: unknown) {
        console.error('Submit Blog error:', error);
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}
