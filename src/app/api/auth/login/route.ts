import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { password } = body;

        // Define your secure admin password in your remote/local environment variables.
        // Fallback to 'perleadmin2026' for demonstration purposes.
        const validPassword = process.env.ADMIN_PASSWORD;

        if (password === validPassword) {
            // Set http-only cookie
            const cookieStore = await cookies();
            cookieStore.set('admin_session', 'authenticated', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 7 // 1 week
            });

            return NextResponse.json({ success: true, message: 'Erfolgreich eingeloggt' });
        } else {
            return NextResponse.json({ success: false, error: 'Zugriff verweigert. Falsches Passwort.' }, { status: 401 });
        }
    } catch (error: unknown) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}
