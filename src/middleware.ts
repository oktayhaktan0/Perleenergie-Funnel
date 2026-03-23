import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Admin login sayfasının kendisini veya oradan gelen istekleri döngüye sokma
    if (path === '/admin/login' || path === '/admin/login/') {
        return NextResponse.next();
    }

    // Protect all /admin routes except the login page
    if (path.startsWith('/admin')) {
        const sessionCookie = request.cookies.get('admin_session');

        // Check if the cookie exists and is valid
        if (!sessionCookie || sessionCookie.value !== 'authenticated') {
            const loginUrl = new URL('/admin/login', request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
}
