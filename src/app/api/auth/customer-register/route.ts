import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const { email, password, firstName, lastName, phone, orderExternalId } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if customer already exists
        const [existing] = await db.query('SELECT id FROM customers WHERE email = ?', [email]);
        if ((existing as any[]).length > 0) {
            // Update existing customer info if they ordered again
            await db.query(
                'UPDATE customers SET password = ?, first_name = ?, last_name = ?, phone = ?, order_external_id = ? WHERE email = ?',
                [hashedPassword, firstName, lastName, phone, orderExternalId, email]
            );
            return NextResponse.json({ success: true, message: 'Customer info updated.' });
        }

        await db.query(
            'INSERT INTO customers (email, password, first_name, last_name, phone, order_external_id) VALUES (?, ?, ?, ?, ?, ?)',
            [email, hashedPassword, firstName, lastName, phone, orderExternalId]
        );

        return NextResponse.json({ success: true, message: 'Customer registered successfully.' });
    } catch (error: any) {
        console.error('Registration Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
