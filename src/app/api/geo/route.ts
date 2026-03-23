import { NextResponse } from 'next/server';
import { getGermanLocalities, getGermanStreets } from '@/lib/rabot';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const postcode = searchParams.get('postcode');
    const type = searchParams.get('type'); // 'localities' or 'streets'

    if (!postcode) {
        return NextResponse.json({ error: "Postcode is required" }, { status: 400 });
    }

    try {
        if (type === 'streets') {
            const data = await getGermanStreets(postcode);
            return NextResponse.json(data);
        } else {
            const data = await getGermanLocalities(postcode);
            return NextResponse.json(data);
        }
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch geodata" }, { status: 500 });
    }
}
