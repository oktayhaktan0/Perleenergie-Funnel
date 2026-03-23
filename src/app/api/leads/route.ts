import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, phone, plz, usage } = body;

        // MySQL Insert
        const query = `
      INSERT INTO leads (name, email, phone, plz, usage_kwh, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

        const [result] = await db.execute(query, [
            name,
            email,
            phone || null,
            plz,
            parseInt(usage, 10),
            'new'
        ]);

        return NextResponse.json({ success: true, result });
    } catch (error: unknown) {
        console.error('MySQL Add Lead error:', error);
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to process request' }, { status: 500 });
    }
}
