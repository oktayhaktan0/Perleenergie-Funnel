import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
        }

        const [rows] = await db.query('SELECT * FROM customers WHERE email = ?', [email]);
        const customers = rows as any[];

        if (customers.length === 0) {
            return NextResponse.json({ error: 'Falsche E-Mail oder Passwort.' }, { status: 401 });
        }

        const customer = customers[0];
        const isPasswordMatch = await bcrypt.compare(password, customer.password);

        if (!isPasswordMatch) {
            return NextResponse.json({ error: 'Falsche E-Mail veya Passwort.' }, { status: 401 });
        }

        // Simulating session or token setting
        // In a real app, you'd set a cookie with a JWT here.
        const response = NextResponse.json({
            success: true,
            message: 'Login erfolgreich.',
            customer: {
                id: customer.id,
                email: customer.email,
                firstName: customer.first_name,
                lastName: customer.last_name,
                rabotCustomerId: customer.rabot_customer_id
            }
        });

        // Set a cookie for the kundenportal session
        response.cookies.set('customer_session', customer.email, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7 // 1 week
        });

        return response;
    } catch (error: any) {
        console.error('Login Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
