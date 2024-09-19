import { NextResponse } from 'next/server';
import { EyePop } from '@eyepop.ai/eyepop';

export async function GET(req: Request) {
    try {
   

        return NextResponse.json({ test:'test' }, { status: 200 });
    } catch (error) {
        console.error('Error processing session:', error);
        return NextResponse.json({ error: 'Failed to process session' + error }, { status: 500 });
    }
}
