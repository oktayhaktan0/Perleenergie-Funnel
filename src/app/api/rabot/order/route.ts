import { NextResponse } from 'next/server';
import { createRabotOrder, getAccessToken } from '@/lib/rabot';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: Request) {
    const body = await request.json();

    try {
        console.log("[Order Route] Fetching auth token explicitly...");
        const token = await getAccessToken();
        console.log("[Order Route] Auth token obtained, creating order...");
        const result = await createRabotOrder(body, token);
        return NextResponse.json(result);
    } catch (error: unknown) {
        return NextResponse.json({ isSuccess: false, message: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}
