import { NextResponse } from 'next/server';
import { calculateRabotPrice, getAccessToken } from '@/lib/rabot';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log("[Calculate-Price Route] Received body:", JSON.stringify(body));

        if (!body.tariffKey) {
            return NextResponse.json({ isSuccess: false, message: "Missing tariffKey in request body" }, { status: 400 });
        }

        console.log("[Calculate-Price Route] Fetching auth token explicitly...");
        const token = await getAccessToken();
        
        console.log("[Calculate-Price Route] Auth token obtained, calculating for zip:", body.postCode);
        const result = await calculateRabotPrice(body, token);
        
        return NextResponse.json(result);
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : 'Unknown error';
        console.error("[Calculate-Price Route] FATAL ERROR:", msg);
        return NextResponse.json({ isSuccess: false, message: msg }, { status: 500 });
    }
}
