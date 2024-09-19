import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    
    try {
        console.log('Request received:', req.method);
    
        return NextResponse.json({ test: 'test' }, { status: 200 });

    } catch (error) {
        console.error('Error processing image:', error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }

}
