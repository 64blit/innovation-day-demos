import { NextResponse } from 'next/server';
import { createCanvas, loadImage } from 'canvas';
import { EyePop } from '@eyepop.ai/eyepop';
import { Render2d } from '@eyepop.ai/eyepop-render-2d';

export async function GET(req: Request) {
    try {

        const endpoint = await EyePop.workerEndpoint({
            popId: process.env.CARGOSHOT_POP_ID,
            auth: { secretKey: process.env.CARGOSHOT_API_KEY as string }
        }).connect();

        const session = await endpoint.session();

        return NextResponse.json({ session }, { status: 200 });
    } catch (error) {
        console.error('Error processing image:', error);
        return NextResponse.json({ error: 'Failed to process image' }, { status: 500 });
    }
}
