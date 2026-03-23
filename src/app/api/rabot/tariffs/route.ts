import { NextResponse } from 'next/server';
import { getRabotTariffs, getAccessToken } from '@/lib/rabot';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export async function GET() {
    try {
        console.log("[Tariffs Route] Fetching auth token explicitly...");
        const token = await getAccessToken();
        console.log("[Tariffs Route] Auth token obtained, fetching tariffs...");
        const tariffs = await getRabotTariffs(token);
        return NextResponse.json(tariffs);
    } catch (error: unknown) {
        return NextResponse.json({ isSuccess: false, message: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}
