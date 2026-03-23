import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Admin: Get all reviews
export async function GET() {
    try {
        const query = 'SELECT * FROM reviews ORDER BY created_at DESC';
        const [rows] = await db.execute(query);
        return NextResponse.json({ success: true, data: rows });
    } catch (error: unknown) {
        console.error('Admin Fetch Reviews error:', error);
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}

// Admin: Update review status (approve/reject)
export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, status } = body;

        if (!id || !status) {
            return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
        }

        const query = 'UPDATE reviews SET status = ? WHERE id = ?';
        await db.execute(query, [status, id]);

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        console.error('Admin Update Review error:', error);
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}

// Admin: Delete a review
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Missing id' }, { status: 400 });
        }

        const query = 'DELETE FROM reviews WHERE id = ?';
        await db.execute(query, [id]);

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        console.error('Admin Delete Review error:', error);
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}
