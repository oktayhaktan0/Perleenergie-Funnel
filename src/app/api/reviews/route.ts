import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Public: Get only approved reviews
export async function GET() {
    try {
        const query = 'SELECT * FROM reviews WHERE status = "approved" ORDER BY created_at DESC';
        const [rows] = await db.execute(query);
        return NextResponse.json({ success: true, data: rows });
    } catch (error: unknown) {
        console.error('Fetch Reviews error:', error);
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}

// Public: Submit a new review
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, rating, comment } = body;

        console.log('Attempting to save review for:', name);

        if (!name || !rating || !comment) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const query = `
            INSERT INTO reviews (name, rating, comment, status)
            VALUES (?, ?, ?, ?)
        `;

        const [result] = await db.execute(query, [name, rating, comment, 'pending']);
        console.log('Review saved successfully:', result);

        return NextResponse.json({ success: true, message: 'Review submitted for approval' });
    } catch (error: any) {
        console.error('DATABASE ERROR (Submit Review):', error);

        // Hostinger üzerinde hatayı tarayıcıda görebilmek için hata detayını gönderiyoruz
        return NextResponse.json({
            success: false,
            error: error.message || 'Unknown database error',
            code: error.code || 'NO_CODE'
        }, { status: 500 });
    }
}
