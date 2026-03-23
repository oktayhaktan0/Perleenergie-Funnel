import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
    try {
        const data = await request.formData();
        const file: File | null = data.get('file') as unknown as File;

        if (!file) {
            return NextResponse.json({ success: false, error: 'No file received.' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Define target directory and ensure it exists
        const uploadDir = path.join(process.cwd(), 'public/uploads');
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (err) {
            console.error('Failed to create upload directory', err);
        }

        const uniqueFilename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
        const filePath = path.join(uploadDir, uniqueFilename);

        await writeFile(filePath, buffer);

        // Return the path that can be used in an `src` attribute (relative to website root)
        const fileUrl = `/uploads/${uniqueFilename}`;

        return NextResponse.json({ success: true, url: fileUrl });
    } catch (error: unknown) {
        console.error('File Upload error:', error);
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}
